FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts
# Build only the web app (standalone mode for API routes)
RUN pnpm --filter @axionax/web build
# Copy node_modules from workspace root to fix pnpm symlinks in standalone
RUN mkdir -p /app/apps/web/.next/standalone/node_modules && \
    cp -rL /app/node_modules/.pnpm/next@*/node_modules/next /app/apps/web/.next/standalone/node_modules/ && \
    cp -rL /app/node_modules/.pnpm/react@*/node_modules/react /app/apps/web/.next/standalone/node_modules/ && \
    cp -rL /app/node_modules/.pnpm/react-dom@*/node_modules/react-dom /app/apps/web/.next/standalone/node_modules/

# Production image using standalone output
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build (with resolved symlinks)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
