FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts
# Build only the web app (skip contracts/SDK for frontend-only build)
RUN pnpm --filter @axionax/website build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install serve to run the static export
RUN npm install -g serve

# Copy the build output from the builder stage
# Adjust path if output is different (e.g. dist) but Next.js export usually uses 'out'
COPY --from=builder /app/apps/web/out ./out

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["serve", "-s", "out", "-l", "3000"]
