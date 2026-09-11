# Architecture Deep-Dive — Next.js RAG Chatbot

## Data Flow (per user message)

```
1. User types message → ChatWidget.tsx
2. ChatWidget calls POST /api/chat/session (first time only)
   └─ Server verifies Turnstile token
   └─ Server creates HMAC-signed session token, sets httpOnly cookie
3. ChatWidget calls POST /api/chat { locale, messages[] }
4. /api/chat route:
   a. Rate limit check (in-memory sliding window per IP)
   b. HMAC session cookie verification (4-hour TTL)
   c. Parse + sanitize message history (max 16 turns, 2000 chars/msg)
   d. rewriteQuery(messages, locale)
      └─ LLM call: produce standalone query + optional German paraphrase
      └─ Single-turn German messages skip this (optimization)
   e. retrieveChunks([standalone, german])
      └─ Load ChatChunk rows from Postgres into in-process cache
      └─ embedQuery() each query string with OpenAI
      └─ Cosine similarity scan, filter < MIN_SIMILARITY (0.25)
      └─ Merge + dedupe by chunk ID, locale-prefer, top-K (8) results
   f. buildSystemPrompt(locale, chunks)
      └─ Assembles: persona + rules + CONTEXT block (cited chunks)
   g. streamText(model, system, messages, tools)
      └─ Tool: erfasseKontakt (saves CRM lead mid-conversation)
      └─ Peek first chunk to detect auth/model errors before streaming
   h. Stream text/plain back to browser (TextEncoderStream)
5. ChatWidget reads ReadableStream, accumulates text, re-renders message
6. Inline markdown parser (ChatMessageBody) renders p/ul/ol/bold/italic/links
```

## Index Build Flow (npm run chat:index)

```
collectAllSources()
  ├─ collectMessages(de) + collectMessages(en)  — i18n JSON prose
  ├─ collectContactFacts()                       — phone, address, hours
  ├─ collectCertificates()                       — product certificates
  ├─ collectTermTooltips()                       — glossary terms
  ├─ collectProducts()                           — Prisma Product rows
  ├─ collectCategories()                         — Prisma Category rows
  ├─ collectPosts()                              — Prisma Post (blog) rows
  ├─ collectGallery()                            — Prisma GalleryItem rows
  └─ collectKnowledgeBase()                      — Prisma KnowledgeBase rows

For each SourceDoc:
  ├─ Hash: SHA-256(locale + title + url + content)
  ├─ If hash matches stored ChatChunk.sourceHash → skip (unchanged)
  ├─ Else: delete old chunks for sourceId
  ├─ splitText(content, { chunkSize: 1000, chunkOverlap: 150 })
  ├─ embedTexts(chunks) → OpenAI text-embedding-3-large
  └─ chatChunk.createMany(...)

After all docs: prune orphaned sourceIds from DB
invalidateRetrievalCache() → next request reloads from Postgres
```

## Component Breakdown

### ChatWidget.tsx (frontend, ~530 lines)

**State:**
- `open` / `messages[]` / `input` / `busy` / `error`
- `sessionReady` — has the `/api/chat/session` call succeeded?
- `turnstileToken` — Cloudflare challenge result

**Key behaviors:**
- **Auto-open**: after 7 s if the user hasn't interacted; tracked via `sessionStorage` to prevent repeat
- **Streaming**: manual `ReadableStream` + `TextDecoder` (no `@ai-sdk/react` due to React 19 peer constraint)
- **Inline markdown**: custom `parseBlocks()` + `renderInline()` — supports `**bold**`, `*italic*`, `[link](url)`, `- list`, `1. list`
- **Accessibility**: `role="dialog"`, `aria-modal`, `aria-live="polite"`, focus trap, `Escape` closes, keyboard submit (Enter without Shift)
- **i18n**: all strings via `next-intl` `useTranslations("chat")`

### /api/chat/route.ts (backend, ~236 lines)

**Tools registered with `streamText`:**
- `erfasseKontakt` — Zod schema: `{ name?, phone?, email?, message? }`. Calls `saveChatLead()` + `notifyChatLead()`. Stores a 6-message transcript snippet.

**Error handling:**
- Empty stream (API key or model errors) → JSON 502 instead of empty 200
- OpenAI error messages are human-readable and locale-aware

### RAG Pipeline (src/lib/rag/)

**`config.ts`** — single source of truth for all tunable constants:
```typescript
CHUNK_SIZE = 1000        // characters per chunk
CHUNK_OVERLAP = 150      // characters of overlap between chunks
TOP_K = 8                // chunks returned per retrieval
MIN_SIMILARITY = 0.25    // minimum cosine similarity to include
MAX_INPUT_CHARS = 2000   // max chars per user message
MAX_TURNS = 16           // max conversation history length
MAX_CONTEXT_CHARS = 12000 // char budget for the assembled context block
```

**`chunk.ts`** — recursive character splitter (LangChain-style). Tries separators `\n\n → \n → . → ; → , → space → char` until pieces fit within `chunkSize`. Overlaps neighbours by `chunkOverlap` chars.

**`embed.ts`** — thin wrappers over Vercel AI SDK `embed()` / `embedMany()` with OpenAI model and dimension config.

**`retrieve.ts`** — in-process cache of all ChatChunk rows. At ~few thousand chunks, a sequential cosine scan is single-digit milliseconds. Cache is invalidated after index builds. For larger corpora (>50k chunks), migrate to pgvector.

**`rewrite.ts`** — uses `generateObject()` with a Zod schema to turn the last user message + conversation history into a self-contained retrieval query. If the user is English-speaking, also generates a German paraphrase (the technical corpus is German-only).

**`prompt.ts`** — assembles the system prompt: persona + hard rules (never invent prices, link format, language) + CONTEXT block of retrieved chunks. Keeps context under `MAX_CONTEXT_CHARS`.

**`index-builder.ts`** — `buildChatIndex()` for full rebuild; `reindexSource(sourceId)` for incremental admin mutations.

**`sources.ts`** — **the most project-specific file**. Defines every data source, its `sourceId` prefix, locale, title, URL, and text content. Uses SHA-256 hashes for incremental skip logic.

## Security Model

### Session Cookie
- One-time Turnstile challenge gates access to `/api/chat/session`
- Session endpoint issues an HMAC-signed cookie (4-hour TTL)
- Every `/api/chat` request must present a valid cookie
- Cookie is `httpOnly`, `secure`, `sameSite: lax` — not readable by JS
- HMAC uses `SESSION_SECRET` from env; same secret also signs admin sessions

### Turnstile Bot Protection
- Widget uses `appearance: "interaction-only"` — invisible until Cloudflare flags a suspicious visitor
- Server-side verification at `/api/chat/session`; failure → 400
- If `TURNSTILE_SECRET_KEY` is unset, verification is skipped (dev-friendly)

### Rate Limiting
- Two in-memory maps: `chatHits` (LLM calls), `hits` (session endpoint)
- Sliding 10-minute window; 15 chat calls / 12 session calls per IP
- Max 10,000 tracked IPs; stale entries pruned automatically
- 429 response on breach

### Input Validation
- Messages truncated to `MAX_INPUT_CHARS` (2000 chars)
- History capped at `MAX_TURNS` (16 turns)
- Only `role: "user" | "assistant"` accepted; anything else → 400
- Empty last user message → 400

## Database Schema

Two chat-specific models added to the existing Prisma schema:

**ChatChunk** (the vector store):
```prisma
model ChatChunk {
  id         String   @id @default(cuid())
  sourceId   String   // e.g. "product:folie-r20", "faq:de.3"
  sourceHash String   // SHA-256 of content; used for incremental skip
  locale     String   // "de" | "en"
  title      String
  url        String?  // deep link the LLM can cite in answers
  content    String   // the actual text chunk
  embedding  Float[]  // OpenAI embedding vector
  createdAt  DateTime @default(now())

  @@index([sourceId])
  @@index([locale])
}
```

**KnowledgeBase** (admin-managed Q&A, indexed but not published):
```prisma
model KnowledgeBase {
  id        String   @id @default(cuid())
  question  String
  answer    String   // markdown supported
  category  String?
  keywords  String[]
  locale    String   @default("de")
  visible   Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([locale, visible])
  @@index([category])
}
```

> **Note on pgvector**: This implementation stores embeddings as `Float[]` in Postgres and does cosine similarity in Node.js (using the `cosineSimilarity` utility from the `ai` package). This is fast enough for up to ~10,000 chunks. For larger corpora, migrate to pgvector with an `ivfflat` index and perform similarity search in SQL.
