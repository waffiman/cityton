# City-Ton Austria — Next.js 16 app image.
# Single-stage: full node_modules kept so migrations/seed (prisma CLI + tsx)
# run at container start. Build needs no database (public DB pages are
# force-dynamic, rendered at request time).

FROM node:22-bookworm-slim

# OpenSSL is required by Prisma; ca-certificates for TLS to the DB/S3.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies first (better layer caching). postinstall runs
# `prisma generate`, which needs the schema + prisma.config.ts present.
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# App source, then production build.
COPY . .

# NEXT_PUBLIC_* is inlined into the client bundle during `next build`, so the
# Turnstile site key has to be present here — a runtime-only env var would
# leave the widget undefined in the browser.
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_SITE_URL=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN chmod +x scripts/docker-entrypoint.sh
CMD ["scripts/docker-entrypoint.sh"]
