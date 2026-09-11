import { after } from "next/server";
import { streamText, tool, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { notifyChatLead, saveChatLead } from "@/lib/chat-leads-store";
import { CHAT_SESSION_COOKIE, verifyChatSessionToken } from "@/lib/chat-session";
import { prisma } from "@/lib/db";
import {
  chatModel,
  isChatEnabled,
  MAX_INPUT_CHARS,
  MAX_TURNS,
} from "@/lib/rag/config";
import { buildSystemPrompt } from "@/lib/rag/prompt";
import { retrieveChunks } from "@/lib/rag/retrieve";
import { rewriteQuery, type ChatTurn } from "@/lib/rag/rewrite";
import { allowChatRequest, clientIp, tooManyRequests } from "@/lib/rate-limit";

type Body = {
  messages?: unknown;
  locale?: unknown;
};

function parseMessages(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    out.push({ role, content: content.slice(0, MAX_INPUT_CHARS) });
  }
  return out;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function openaiErrorMessage(error: unknown, locale: "de" | "en"): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/invalid.?api.?key|incorrect api key|401/i.test(msg)) {
    return locale === "en"
      ? "OpenAI rejected the API key. Check OPENAI_API_KEY in .env and restart the server."
      : "OpenAI hat den API-Key abgelehnt. OPENAI_API_KEY in .env prüfen und den Server neu starten.";
  }
  if (/model/i.test(msg) && /not found|does not exist|invalid/i.test(msg)) {
    return locale === "en"
      ? `Model unavailable (${chatModel()}). Set CHAT_MODEL in .env to a model your account can use.`
      : `Modell nicht verfügbar (${chatModel()}). CHAT_MODEL in .env auf ein verfügbares Modell setzen.`;
  }
  return locale === "en"
    ? "The assistant could not answer. Please try again."
    : "Der Assistent konnte nicht antworten. Bitte erneut versuchen.";
}

/**
 * POST /api/chat — grounded streaming answer over the site corpus.
 */
export async function POST(request: Request) {
  if (!isChatEnabled()) {
    return Response.json({ ok: false, error: "Chat disabled." }, { status: 503 });
  }

  const ip = clientIp(request);
  if (!allowChatRequest(ip)) return tooManyRequests();

  const session = readCookie(request, CHAT_SESSION_COOKIE);
  if (!(await verifyChatSessionToken(session))) {
    return Response.json(
      { ok: false, error: "Chat-Session ungültig. Bitte Widget neu öffnen." },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const locale = body.locale === "en" ? "en" : "de";
  const messages = parseMessages(body.messages);
  if (!messages?.length) {
    return Response.json({ ok: false, error: "Nachrichten fehlen." }, { status: 400 });
  }
  if (messages.length > MAX_TURNS) {
    return Response.json(
      { ok: false, error: "Unterhaltung zu lang. Bitte starten Sie neu." },
      { status: 400 },
    );
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content.trim()) {
    return Response.json({ ok: false, error: "Leere Nachricht." }, { status: 400 });
  }

  const chunkCount = await prisma.chatChunk.count();
  if (chunkCount === 0) {
    return Response.json(
      {
        ok: false,
        error:
          locale === "en"
            ? "Chat index is empty. Run: npm run chat:index"
            : "Chat-Index ist leer. Bitte ausführen: npm run chat:index",
      },
      { status: 503 },
    );
  }

  let chunks;
  try {
    const rewrite = await rewriteQuery(messages, locale);
    const queries = [rewrite.standalone, rewrite.german].filter(
      (q): q is string => Boolean(q?.trim()),
    );
    chunks = await retrieveChunks(queries, { locale });
  } catch (err) {
    console.error("[chat] retrieve/rewrite failed:", err);
    return Response.json(
      { ok: false, error: openaiErrorMessage(err, locale) },
      { status: 502 },
    );
  }

  const system = buildSystemPrompt(locale, chunks);

  const transcript = messages
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Besucher" : "Bot"}: ${m.content}`)
    .join("\n");

  try {
    const result = streamText({
      model: openai(chatModel()),
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stopWhen: stepCountIs(3),
      tools: {
        erfasseKontakt: tool({
          description:
            "Speichert Name/Telefon/E-Mail des Besuchers als CRM-Lead (source=chatbot), " +
            "wenn der Besucher ausdrücklich kontaktiert werden möchte und Kontaktdaten genannt hat.",
          inputSchema: z.object({
            name: z.string().optional().describe("Name des Besuchers"),
            phone: z.string().optional().describe("Telefonnummer"),
            email: z.string().optional().describe("E-Mail-Adresse"),
            message: z.string().optional().describe("Kurze Notiz / Anliegen"),
          }),
          execute: async (input) => {
            const saved = await saveChatLead({
              name: input.name,
              phone: input.phone,
              email: input.email,
              message: input.message,
              transcript,
            });
            if (saved.status === "created") {
              after(() => notifyChatLead(input));
            }
            if (saved.status === "error") {
              return { ok: false as const, error: saved.error };
            }
            return {
              ok: true as const,
              duplicate: saved.status === "duplicate",
              id: saved.id,
            };
          },
        }),
      },
      onError({ error }) {
        console.error("[chat] stream error:", error);
      },
    });

    // Peek the first chunk so auth/model errors become JSON 502 instead of an empty 200 stream.
    const iterator = result.textStream[Symbol.asyncIterator]();
    const first = await iterator.next();
    if (first.done && first.value == null) {
      return Response.json(
        {
          ok: false,
          error: openaiErrorMessage(
            new Error("empty stream — check API key and CHAT_MODEL"),
            locale,
          ),
        },
        { status: 502 },
      );
    }

    const stream = new ReadableStream<string>({
      async start(controller) {
        try {
          if (typeof first.value === "string" && first.value) {
            controller.enqueue(first.value);
          }
          while (true) {
            const next = await iterator.next();
            if (next.done) break;
            if (typeof next.value === "string") controller.enqueue(next.value);
          }
          controller.close();
        } catch (err) {
          console.error("[chat] stream pump failed:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("[chat] streamText failed:", err);
    return Response.json(
      { ok: false, error: openaiErrorMessage(err, locale) },
      { status: 502 },
    );
  }
}
