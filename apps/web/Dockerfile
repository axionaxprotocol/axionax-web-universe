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

# Production image using standalone output  
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build 
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Install only production deps with npm (no symlinks)
RUN npm install next@14.2.33 react@18.3.1 react-dom@18.3.1 --omit=dev --no-save

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
