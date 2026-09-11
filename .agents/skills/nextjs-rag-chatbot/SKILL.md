---
name: nextjs-rag-chatbot
description: >
  Scaffold or maintain a production-ready RAG (Retrieval-Augmented Generation)
  chatbot on a Next.js website. Triggers on requests like "add a chatbot",
  "AI chat widget", "RAG chatbot", "website assistant", "floating chat",
  "chat with my content", "OpenAI chatbot", "embed a chatbot".
---

# Next.js RAG Chatbot Skill

This skill helps you add a **production-ready, streaming RAG chatbot** to a Next.js (App Router) website. The reference implementation lives in the `examples/` and `resources/` directories next to this file.

## Architecture Overview

```
Browser
  └─ ChatWidget (floating FAB → panel)
       ├─ POST /api/chat/session  (Turnstile verify → HMAC cookie)
       └─ POST /api/chat          (streaming text/plain)

/api/chat
  ├─ Rate limit check (in-memory sliding window)
  ├─ HMAC session cookie check
  ├─ rewriteQuery()    → standalone query + optional German paraphrase
  ├─ retrieveChunks()  → cosine similarity over ChatChunk table
  ├─ buildSystemPrompt() → grounded context block injected into system message
  └─ streamText() with tool: erfasseKontakt (CRM lead capture)

Index Builder (npm run chat:index)
  └─ collectAllSources() → splitText() → embedTexts() → ChatChunk upsert
```

## Required Dependencies

```bash
npm install ai @ai-sdk/openai zod
# Already present in a typical Next.js project:
# next, react, react-dom, @prisma/client
```

## Required Environment Variables

See `references/env-vars.md` for the full list. The minimum set:

```env
OPENAI_API_KEY=sk-...
SESSION_SECRET=<48-char random base64url string>
DATABASE_URL=postgresql://...
```

## Database Models

Add these two models to your Prisma schema. See `examples/prisma-chat-models.prisma`:

- **`ChatChunk`** — stores embedded text passages (sourceId, sourceHash, locale, title, url, content, embedding Float[])
- **`KnowledgeBase`** — admin-managed Q&A entries indexed into the chatbot

Then run:
```bash
npx prisma migrate dev --name add-chat-models
npx prisma generate
```

## Step-by-Step Scaffold

### 1. Copy and adapt the RAG pipeline

Copy all files from `resources/rag/` into `src/lib/rag/`:

| File | Purpose |
|---|---|
| `config.ts` | Tunable constants (chunk size, top-k, model names) |
| `chunk.ts` | Dependency-free recursive text splitter |
| `embed.ts` | OpenAI embedding helpers (single + batch) |
| `retrieve.ts` | In-memory cosine retrieval over ChatChunk rows |
| `rewrite.ts` | LLM-powered query rewriting for multi-turn + cross-lingual |
| `prompt.ts` | Builds the grounded system prompt from retrieved chunks |
| `index-builder.ts` | Incremental upsert: hash-check → split → embed → write |
| `sources.ts` | **Customize this heavily** — defines what content to index |
| `schedule-reindex.ts` | `next/server after()` helper for post-mutation reindexing |

**TODO(customize) in `prompt.ts`:** Replace the system prompt persona with your client's business.
**TODO(customize) in `sources.ts`:** Replace or extend the source collectors with your content model.

### 2. Copy and adapt the security helpers

Copy from `resources/`:

| File | Destination |
|---|---|
| `chat-session.ts` | `src/lib/chat-session.ts` |
| `turnstile.ts` | `src/lib/turnstile.ts` |
| `rate-limit.ts` | `src/lib/rate-limit.ts` |
| `chat-leads-store.ts` | `src/lib/chat-leads-store.ts` |

These are largely project-agnostic. Only `chat-session.ts` has a cookie name constant to rename (e.g. `cityton_chat` → `yourproject_chat`).

### 3. Copy and adapt the API routes

Copy `examples/api-chat-route.ts` → `src/app/api/chat/route.ts`
Copy `examples/api-chat-session-route.ts` → `src/app/api/chat/session/route.ts`

**TODO(customize):** Update the error messages from German to the project's language if needed.

### 4. Copy and adapt the frontend widget

Copy `examples/chat-widget.tsx` → `src/components/ChatWidget.tsx`
Copy `examples/chat-widget.module.css` → `src/components/ChatWidget.module.css`

**TODO(customize):**
- Remove `next-intl` imports if the project doesn't use i18n; replace `useTranslations("chat")` with inline strings.
- Replace `<Corners />` and `blueprint` class with your design system's card wrapper.
- Adjust color tokens in the CSS to match your palette.
- Change `AUTO_OPEN_KEY` constant to a project-specific localStorage key.
- Update suggestion prompts to match the client's business domain.
- Update the contact hint link (`/kontakt`) to the project's contact page path.

### 5. Add the index builder script

Copy `scripts/build-chat-index.ts` → `scripts/build-chat-index.ts`

Add to `package.json`:
```json
{
  "scripts": {
    "chat:index": "tsx scripts/build-chat-index.ts"
  }
}
```

Install `tsx` if not present:
```bash
npm install -D tsx dotenv
```

### 6. Build the index

```bash
npm run chat:index
```

This reads all your sources, splits them into chunks, embeds them with OpenAI, and writes the results to the `ChatChunk` table. **Run this whenever content changes significantly.** For real-time updates after admin edits, call `scheduleReindex(sourceId)` from your mutation routes.

### 7. Mount the widget

In your root layout or `SiteChrome` component:
```tsx
import ChatWidget from "@/components/ChatWidget";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
```

## Security Checklist

- [ ] `SESSION_SECRET` is set (long random string) and not committed to git
- [ ] `OPENAI_API_KEY` is not exposed client-side
- [ ] Cloudflare Turnstile keys configured (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`), or left blank to skip during development
- [ ] Rate limiter constants reviewed (`CHAT_MAX_HITS`, `CHAT_WINDOW_MS` in `rate-limit.ts`)
- [ ] `MAX_TURNS` and `MAX_INPUT_CHARS` reviewed in `config.ts`
- [ ] Cookie is `httpOnly: true, secure: true` in production (already correct in template)

## Customization Points Summary

| What to change | Where |
|---|---|
| Business persona / instructions | `src/lib/rag/prompt.ts` — `buildSystemPrompt()` |
| Content to index | `src/lib/rag/sources.ts` — `collectAllSources()` |
| Chat model + embedding model | `.env` `CHAT_MODEL` / `EMBEDDING_MODEL`, or `src/lib/rag/config.ts` defaults |
| Chunk size / retrieval quality | `src/lib/rag/config.ts` constants |
| Widget colors + design | `src/components/ChatWidget.module.css` |
| Widget copy / suggestions | ChatWidget.tsx inline strings or i18n messages |
| Lead capture fields | `src/app/api/chat/route.ts` — `erfasseKontakt` tool schema |
| CRM storage | `src/lib/chat-leads-store.ts` — replace Prisma calls with your backend |
| Cookie name | `src/lib/chat-session.ts` — `CHAT_SESSION_COOKIE` constant |
| Auto-open delay | `ChatWidget.tsx` — `AUTO_OPEN_MS` constant (default 7000ms) |

## References

- `references/architecture.md` — deep-dive into every layer
- `references/customization-guide.md` — decision tree for adapting to a new project
- `references/env-vars.md` — all environment variables with descriptions
- `examples/` — copy-ready source files
- `resources/rag/` — the full RAG pipeline (production-tested in city-ton)
