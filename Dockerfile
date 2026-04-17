# syntax=docker/dockerfile:1.7

################################################################################
# 1. Base — shared by all stages
################################################################################
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
ENV NEXT_TELEMETRY_DISABLED=1

################################################################################
# 2. Dependencies — install all deps (including dev) for the build
################################################################################
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# --ignore-scripts skips the postinstall hook (prisma generate) because
# the schema isn't copied yet at this stage. We run `prisma generate`
# explicitly in the builder stage below.
RUN npm ci --no-audit --no-fund --ignore-scripts

################################################################################
# 3. Builder — compile Prisma client and build Next.js in standalone mode
################################################################################
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma needs at least a placeholder DATABASE_URL at `prisma generate` time
ARG DATABASE_URL=postgresql://user:pass@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate
RUN npm run build

################################################################################
# 4. Runner — minimal production image
################################################################################
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone output (only the code actually used, + a minimal runtime)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma — schema + CLI + engine, needed to run `migrate deploy` on boot
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Transitive deps used by prisma.config.ts loader
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/c12 ./node_modules/c12

# Entrypoint that runs migrations before starting the server
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
