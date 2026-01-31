# Deployment Guide

## Prerequisites

- Docker Engine & Docker Compose
- Node.js 18+ (for local development)
- PNPM (if building locally)

## Quick Start (Production Mode)

1. **Clone configuration**:

   ```bash
   cp servers/.env.example servers/.env
   cp apps/mvp/.env.example apps/mvp/.env
   ```

2. **Start Services**:

   ```bash
   docker compose up --build -d
   ```

3. **Access**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000/health](http://localhost:8000/health)

## Architecture

The system is deployed as a set of Docker containers:

- **Frontend (`frontend`)**: Next.js app in standalone mode.
- **Backend (`backend`)**: Express server running the modular core.
- **Database (`db`)**: PostgreSQL 15.
- **Queue (`redis`)**: Redis 7 for BullMQ and caching.

## Environment Variables

Ensure you set `JWT_SECRET` and `AUTH_SECRET` to secure random strings in production.

## Database Migrations

The container does NOT auto-migrate on startup for safety. To apply migrations:

```bash
# Run migration inside the running backend container
docker compose exec backend pnpm --filter @workspace/database db:deploy
```
