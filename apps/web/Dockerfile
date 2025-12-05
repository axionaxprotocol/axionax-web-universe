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
# Copy real node_modules to fix pnpm symlinks in standalone
RUN rm -rf /app/apps/web/.next/standalone/node_modules && \
    mkdir -p /app/apps/web/.next/standalone/node_modules && \
    NEXT_DIR=$(find /app/node_modules/.pnpm -type d -name "next" | grep "node_modules/next$" | head -1) && \
    REACT_DIR=$(find /app/node_modules/.pnpm -type d -name "react" | grep "node_modules/react$" | head -1) && \
    REACT_DOM_DIR=$(find /app/node_modules/.pnpm -type d -name "react-dom" | grep "node_modules/react-dom$" | head -1) && \
    cp -rL "$NEXT_DIR" /app/apps/web/.next/standalone/node_modules/ && \
    cp -rL "$REACT_DIR" /app/apps/web/.next/standalone/node_modules/ && \
    cp -rL "$REACT_DOM_DIR" /app/apps/web/.next/standalone/node_modules/

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
