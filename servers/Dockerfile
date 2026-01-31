
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/database db:generate
RUN pnpm --filter servers build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/servers/dist ./dist
COPY --from=builder /app/servers/package.json .
COPY --from=builder /app/node_modules ./node_modules

# We need Prisma Client runtime in the runner
# NOTE: In a monorepo, node_modules structure can be complex. 
# A safer bet for production runner is to copy the pruned node_modules or just use the root ones.
# For simplicity in this `base` runner, we are copying root node_modules. 
# Optimized approach would use `pnpm deploy` but that requires more setup.

EXPOSE 8000
CMD ["node", "dist/index.js"]
