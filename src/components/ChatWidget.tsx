"use client";

/**
 * Floating RAG chat widget. Streams plain text from /api/chat (no @ai-sdk/react
 * — that package's React peer range excludes our pinned 19.1.0).
 */

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import Corners from "@/components/Corners";
import TurnstileWidget from "@/components/TurnstileWidget";
import { Link } from "@/i18n/navigation";
import styles from "./ChatWidget.module.css";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; content: string };

const AUTO_OPEN_MS = 7000;
const AUTO_OPEN_KEY = "cityton-chat-autoopened";

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Strip locale prefix so next-intl Link can add the correct one. */
function hrefForLink(raw: string): string {
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const u = new URL(raw);
      return u.pathname + u.search + u.hash;
    }
  } catch {
    // fall through
  }
  if (raw === "/en") return "/";
  if (raw.startsWith("/en/")) return raw.slice(3);
  return raw.startsWith("/") ? raw : `/${raw}`;
}

let mdKey = 0;
function nextKey(): string {
  return `md-${mdKey++}`;
}

/**
 * Inline Markdown: links, **bold**, *italic*. Order matters — links first so
 * brackets inside links are not mis-parsed as emphasis.
 */
function renderInline(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  // Split on links first, then emphasise each plain segment.
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  const pushEmphasis = (chunk: string) => {
    if (!chunk) return;
    const emphRe = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3/g;
    let i = 0;
    let m: RegExpExecArray | null;
    while ((m = emphRe.exec(chunk)) !== null) {
      if (m.index > i) tokens.push(chunk.slice(i, m.index));
      if (m[1]) {
        tokens.push(<strong key={nextKey()}>{m[2]}</strong>);
      } else {
        tokens.push(<em key={nextKey()}>{m[4]}</em>);
      }
      i = m.index + m[0].length;
    }
    if (i < chunk.length) tokens.push(chunk.slice(i));
  };

  while ((match = linkRe.exec(text)) !== null) {
    pushEmphasis(text.slice(last, match.index));
    const label = match[1];
    const href = hrefForLink(match[2]);
    const display =
      label === match[2] || label.startsWith("/")
        ? label.replace(/^\/en\/?/, "").replace(/^\//, "") || "link"
        : label;
    tokens.push(
      <Link key={nextKey()} href={href} className={styles.msgLink}>
        {display}
      </Link>,
    );
    last = match.index + match[0].length;
  }
  pushEmphasis(text.slice(last));
  return tokens;
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (!para.length) return;
    blocks.push({ type: "p", text: para.join(" ").trim() });
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push({ type: list.kind, items: list.items });
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const ul = line.match(/^[-*•]\s+(.+)$/);
    const ol = line.match(/^\d+[.)]\s+(.+)$/);
    if (ul) {
      flushPara();
      if (!list || list.kind !== "ul") {
        flushList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }
    if (ol) {
      flushPara();
      if (!list || list.kind !== "ol") {
        flushList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks;
}

/** Lightweight Markdown body for assistant replies (lists, bold, italic, links). */
function ChatMessageBody({ text }: { text: string }) {
  mdKey = 0;
  const blocks = parseBlocks(text);
  return (
    <div className={styles.md}>
      {blocks.map((block) => {
        if (block.type === "ul") {
          return (
            <ul key={nextKey()} className={styles.mdList}>
              {block.items.map((item) => (
                <li key={nextKey()}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={nextKey()} className={styles.mdList}>
              {block.items.map((item) => (
                <li key={nextKey()}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={nextKey()} className={styles.mdP}>
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale() === "en" ? "en" : "de";
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const sessionStarted = useRef(false);
  const userOpenedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, busy, scrollToBottom]);

  // Auto-open once per browser tab session after 7s, unless the visitor already
  // opened or dismissed the chat.
  useEffect(() => {
    let already = false;
    try {
      already = sessionStorage.getItem(AUTO_OPEN_KEY) === "1";
    } catch {
      // Private mode / blocked storage: still auto-open once this mount.
    }
    if (already) return;

    const timer = window.setTimeout(() => {
      if (userOpenedRef.current) return;
      setOpen(true);
      try {
        sessionStorage.setItem(AUTO_OPEN_KEY, "1");
      } catch {
        // ignore
      }
    }, AUTO_OPEN_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const setOpenTracked = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setOpen((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (value) {
        userOpenedRef.current = true;
        try {
          sessionStorage.setItem(AUTO_OPEN_KEY, "1");
        } catch {
          // ignore
        }
      }
      return value;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenTracked(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpenTracked]);

  useEffect(() => {
    if (!open) return;
    // Focus trap: keep Tab inside the panel.
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = () =>
      panel.querySelectorAll<HTMLElement>(
        'button, [href], textarea, input, [tabindex]:not([tabindex="-1"])',
      );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = [...focusables()].filter((n) => !n.hasAttribute("disabled"));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const ensureSession = useCallback(
    async (token: string | null) => {
      if (sessionReady || sessionStarted.current) return sessionReady;
      sessionStarted.current = true;
      try {
        const res = await fetch("/api/chat/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ turnstileToken: token }),
        });
        if (!res.ok) {
          setError(t("sessionError"));
          sessionStarted.current = false;
          return false;
        }
        setSessionReady(true);
        setError(null);
        return true;
      } catch {
        setError(t("sessionError"));
        sessionStarted.current = false;
        return false;
      }
    },
    [sessionReady, t],
  );

  useEffect(() => {
    if (!open || sessionReady) return;
    // No Turnstile key → verifyTurnstile skips; still need a session cookie.
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      void ensureSession(null);
      return;
    }
    if (turnstileToken) void ensureSession(turnstileToken);
  }, [open, sessionReady, turnstileToken, ensureSession]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const ready = sessionReady || (await ensureSession(turnstileToken));
    if (!ready) return;

    const userMsg: Msg = { id: newId(), role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setBusy(true);
    setError(null);

    const assistantId = newId();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || t("error"));
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)),
        );
      }
      if (!acc.trim()) {
        const emptyMsg = t("emptyStream");
        setError(emptyMsg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: emptyMsg } : m,
          ),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error");
      setError(msg);
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: msg } : m)),
      );
    } finally {
      setBusy(false);
    }
  };

  const suggestions = [
    t("suggestions.heat"),
    t("suggestions.safety"),
    t("suggestions.process"),
  ];

  return (
    <div className={styles.root}>
      {open && (
        <div
          ref={panelRef}
          className={`blueprint ${styles.panel}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <Corners />
          <header className={styles.header}>
            <div>
              <h2 id={titleId} className={styles.title}>
                {t("title")}
              </h2>
              <p className={styles.subtitle}>{t("subtitle")}</p>
            </div>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setOpenTracked(false)}
              aria-label={t("closeLabel")}
            >
              ×
            </button>
          </header>

          <div ref={listRef} className={styles.messages} aria-live="polite">
            {messages.length === 0 && (
              <div className={styles.welcome}>
                <p>{t("welcome")}</p>
                <ul className={styles.suggestions}>
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button type="button" className={styles.suggestion} onClick={() => void send(s)}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className={styles.contactHint}>
                  <Link href="/kontakt">{t("contactCta")}</Link>
                </p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? styles.bubbleUser : styles.bubbleAssistant}
              >
                {m.role === "assistant" && m.content ? (
                  <ChatMessageBody text={m.content} />
                ) : (
                  m.content || (busy && m.role === "assistant" ? t("thinking") : "")
                )}
              </div>
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <form
            className={styles.composer}
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <TurnstileWidget onToken={setTurnstileToken} />
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={busy}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}>
              {t("send")}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={`btn btn-primary ${styles.fab}`}
        onClick={() => setOpenTracked((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("closeLabel") : t("openLabel")}
      >
        {open ? (
          <svg
            className={styles.fabIcon}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            className={styles.fabIcon}
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4.5 5.25h15A1.75 1.75 0 0 1 21.25 7v8.25A1.75 1.75 0 0 1 19.5 17H10.2L6.4 20.1a.4.4 0 0 1-.65-.31V17H4.5A1.75 1.75 0 0 1 2.75 15.25V7A1.75 1.75 0 0 1 4.5 5.25z" />
            <circle cx="8.25" cy="11.1" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="11.1" r="1" fill="currentColor" stroke="none" />
            <circle cx="15.75" cy="11.1" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>
    </div>
  );
}
