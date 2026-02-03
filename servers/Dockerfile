
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/database db:generate
RUN pnpm --filter @workspace/database build
RUN pnpm --filter servers build

# Create an isolated production environment
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to install production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/servers/package.json ./servers/
COPY --from=builder /app/packages/database/package.json ./packages/database/

# Install only production dependencies
# This handles the workspace layout correctly for pnpm
RUN pnpm install --prod --frozen-lockfile

# Copy built files
COPY --from=builder /app/servers/dist ./servers/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

WORKDIR /app/servers

EXPOSE 8000
CMD ["node", "dist/index.js"]
