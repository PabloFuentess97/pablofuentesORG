#!/bin/sh
set -e

echo "▶ pablofuentes.org — boot $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [ -z "$DATABASE_URL" ]; then
  echo "✖ DATABASE_URL is not set. Refusing to start."
  exit 1
fi

# Apply database schema.
# Prefer versioned migrations if present; fall back to `db push` for first boot.
if [ -d prisma/migrations ] && [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "▶ Applying migrations with prisma migrate deploy..."
  node ./node_modules/prisma/build/index.js migrate deploy
else
  echo "▶ No migrations found — syncing schema with prisma db push..."
  node ./node_modules/prisma/build/index.js db push --accept-data-loss
fi

echo "▶ Starting Next.js on ${HOSTNAME}:${PORT}"
exec "$@"
