# Customization Guide

Use this decision tree when adapting the chatbot to a new project.

---

## Step 1: What content should the chatbot know about?

Edit `src/lib/rag/sources.ts` — `collectAllSources()`. This is the **most important customization**.

### Does the project have a Prisma-backed CMS?
- **Yes** → Add a `collectXxx()` async function that queries your models, formats the text, and returns `SourceDoc[]`. See `collectProducts()` or `collectPosts()` in the reference implementation for the pattern.
- **No** → Use static `doc()` calls with inline content strings, or read from JSON/markdown files.

### Does the project use `next-intl` for i18n?
- **Yes** → Keep `collectMessages(locale, root)` and the `MESSAGE_NAMESPACES` list. Update the namespace names to match your i18n message structure.
- **No** → Remove `collectMessages()` and replace with direct content calls.

### Does the project have FAQ content?
- **Yes** → Index FAQ items as individual Q&A chunks (better retrieval than one large FAQ block). See `faqItems` handling in `collectMessages()`.
- **No** → Remove that section.

### What URL paths should cited chunks link to?
- Update `messageUrl()` in `sources.ts` to map content namespaces → your actual routes.
- Set `url` in `doc()` calls to the canonical page for each content type.

---

## Step 2: What should the bot's persona be?

Edit `src/lib/rag/prompt.ts` — `buildSystemPrompt()`.

```typescript
// Replace this line:
`You are the website assistant for City-Ton Austria (Vienna) — Sonnenschutz-, UV-, Energiespar- und Sicherheitsfolien by LLumar and Armolan.`

// With something like:
`You are the website assistant for Acme Bakery — artisan sourdough bread and pastries in Vienna.`
```

Also update or remove the business-specific rules:
- "Never invent prices" → keep if prices aren't published
- Metric specs mention → replace with domain-relevant advice
- Contact form path → update to your `/contact` or equivalent

---

## Step 3: What language(s) should the bot speak?

### Single language (e.g. English only)
1. Remove the `german` paraphrase logic from `rewriteQuery()`.
2. In `buildSystemPrompt()`, remove the locale parameter and hardcode the language.
3. In the widget, remove `useLocale()` and hardcode `locale = "en"`.

### Multilingual (e.g. DE + EN like city-ton)
- Keep `rewrite.ts` as-is — it automatically generates a German paraphrase when the user writes English, improving retrieval over a German-only corpus.
- Keep `localePath()` in `prompt.ts`.

---

## Step 4: Does the project use `next-intl`?

### Yes — keep i18n strings
- Keep `useTranslations("chat")` in `ChatWidget.tsx`.
- Add a `chat` namespace to your message files (DE/EN). Required keys:
  ```json
  {
    "chat": {
      "title": "...",
      "subtitle": "...",
      "welcome": "...",
      "placeholder": "...",
      "send": "Send",
      "thinking": "Thinking…",
      "error": "Something went wrong.",
      "emptyStream": "No response received.",
      "sessionError": "Could not start chat session.",
      "openLabel": "Open chat",
      "closeLabel": "Close chat",
      "contactCta": "Prefer to write directly? Contact us.",
      "suggestions": {
        "one": "First suggestion",
        "two": "Second suggestion",
        "three": "Third suggestion"
      }
    }
  }
  ```

### No i18n — remove the dependency
1. Remove `import { useTranslations, useLocale } from "next-intl"` from `ChatWidget.tsx`.
2. Replace `const t = useTranslations("chat")` with an inline object: `const t = (key: string) => strings[key]`.
3. Remove the `Link` import from `@/i18n/navigation`; replace with `<a href="...">`.
4. Remove `hrefForLink()` and `localePath()` utilities (they strip locale prefixes).
5. In the API route, hardcode `locale = "en"` (or make it a query param).

---

## Step 5: Does the project capture leads into a CRM?

### Uses Prisma `Inquiry` model (like city-ton)
- Keep `chat-leads-store.ts` as-is. Make sure the `Inquiry` model exists in your schema with the `source`, `dedupeKeys`, `name`, `email`, `phone`, `message` fields.

### Uses a different backend
- Replace the `prisma.inquiry.*` calls in `chat-leads-store.ts` with your own storage (REST API, Airtable, HubSpot, etc.).
- Keep the `saveChatLead()` / `notifyChatLead()` interface so the API route doesn't need to change.

### No lead capture needed
- Remove the `erfasseKontakt` tool from `src/app/api/chat/route.ts`.
- Remove the last sentence from the system prompt (the one instructing the bot to call the tool).
- Delete `chat-leads-store.ts`.

---

## Step 6: Design system adaptation

### ChatWidget.module.css — key tokens to replace

| Token used | Replace with |
|---|---|
| `var(--color-accent)` | Your primary brand color |
| `var(--color-accent-100)` | Very light tint of brand color |
| `var(--color-accent-200)` | Light tint of brand color |
| `var(--color-accent-700)` | Dark link color |
| `var(--color-accent-800)` | Subtitle text color |
| `var(--color-accent-900)` | Darkest text / border color |
| `var(--space-1..8)` | Your spacing scale |

If your project uses Tailwind instead of CSS modules, convert the CSS module to Tailwind utility classes on the JSX elements.

### The `blueprint` class and `<Corners />` component
These are city-ton design-system specific. Remove them and replace with your own card/panel styles.

---

## Step 7: RAG quality tuning

After the first index build, test retrieval quality:

1. Ask the chatbot questions that should be answerable from your content.
2. If answers are poor, try adjusting in `config.ts`:
   - Increase `TOP_K` (more context, higher cost)
   - Decrease `MIN_SIMILARITY` (more results, more noise)
   - Decrease `CHUNK_SIZE` (finer granularity, more precise retrieval)
3. If the bot hallucinates, tighten the system prompt rules in `prompt.ts`.
4. Check the index: `npx prisma studio` → ChatChunk table — are sources being indexed?

---

## Common Pitfalls

| Problem | Fix |
|---|---|
| Chat widget renders but stream never arrives | Check `SESSION_SECRET` is set and `npm run chat:index` has been run |
| "Chat index is empty" error | Run `npm run chat:index` |
| Bot answers in wrong language | Check `locale` is passed correctly from widget to API |
| Bot invents information | Tighten system prompt; add "Answer ONLY from the CONTEXT" instruction |
| Turnstile challenge always fails | Verify `TURNSTILE_SECRET_KEY` matches the secret key in Cloudflare dashboard |
| Cookie rejected on mobile Safari | Ensure `sameSite: "lax"` (not `"strict"`) and `secure: true` in production |
| Index build crashes with out-of-memory | Reduce `maxParallelCalls` in `embed.ts` `embedMany()` call |
