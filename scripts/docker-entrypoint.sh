#!/usr/bin/env bash
# Container start: apply migrations, seed once if empty, then run the server.
set -e

echo "[entrypoint] Applying database migrations…"
npx prisma migrate deploy

echo "[entrypoint] Checking whether to seed…"
COUNT="$(npx tsx scripts/db-count.ts 2>/dev/null || echo error)"
if [ "$COUNT" = "0" ]; then
  echo "[entrypoint] Empty database — seeding from src/content/series.ts…"
  npx prisma db seed
elif [ "$COUNT" = "error" ]; then
  echo "[entrypoint] WARNING: could not read product count; skipping seed."
else
  echo "[entrypoint] Database already has $COUNT products — skipping seed."
fi

echo "[entrypoint] Starting Next.js on port ${PORT:-3000}…"
exec npm run start -- -p "${PORT:-3000}" -H 0.0.0.0
