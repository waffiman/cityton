# Environment Variables Reference

All variables for the RAG chatbot feature. The chatbot is disabled if `OPENAI_API_KEY` is missing or `CHAT_ENABLED=false`.

## Required

| Variable | Description | Example |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key for embeddings and chat completions | `sk-proj-...` |
| `SESSION_SECRET` | Long random string for HMAC-signing session cookies. Must stay secret. | `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `DATABASE_URL` | Postgres connection string (Prisma datasource) | `postgresql://user:pass@localhost:5432/mydb` |

## Chatbot-Specific (Optional)

| Variable | Default | Description |
|---|---|---|
| `CHAT_ENABLED` | `true` | Set `false` to kill-switch the chatbot without removing the API key |
| `CHAT_MODEL` | `gpt-4o-mini` | The OpenAI model used for chat completions and query rewriting |
| `EMBEDDING_MODEL` | `text-embedding-3-large` | The OpenAI embedding model |
| `EMBEDDING_DIMENSIONS` | `1536` | Embedding vector dimensions. Must match `ChatChunk` rows already indexed. Changing requires a full re-index. |

## Bot Protection (Optional but recommended for production)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile public site key. Inlined at **build time** — must be a Docker build arg or set before `next build`. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key for server-side verification |

> If both Turnstile keys are unset, bot verification is **skipped** and the widget does not render the challenge. This is the expected behavior in local development.

## Notifications (Optional)

| Variable | Default | Description |
|---|---|---|
| `SMTP_HOST` | — | SMTP hostname. If unset, email notifications are silently skipped. |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | — | SMTP username |
| `SMTP_PASSWORD` | — | SMTP password |
| `SMTP_SECURE` | — | Force TLS (`true` / `false`). Inferred from port if blank. |
| `MAIL_FROM` | — | Envelope sender address |
| `MAIL_TO` | — | Destination address for lead notifications |

## Notes

- `NEXT_PUBLIC_*` variables are **baked into the client bundle at build time**. Changing them requires a rebuild.
- `SESSION_SECRET` must be identical across all instances in a multi-instance deployment (e.g. load balancer), otherwise sessions signed by one instance will be rejected by another.
- The `DATABASE_URL` used by Prisma at runtime comes from `prisma.config.ts` (which loads `.env` via dotenv). In Docker, inject it as a container environment variable.
