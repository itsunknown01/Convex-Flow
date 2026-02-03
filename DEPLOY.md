# Deployment Guide

## Prerequisites

- Docker Engine & Docker Compose
- Node.js 18+ (for local development)
- PNPM (if building locally)

## Server-Only Deployment (Backend + Infrastructure)

If you only want to deploy the backend server and its required services (Postgres, Redis):

1. **Configure Environment**:

   ```bash
   cp servers/.env.example servers/.env
   ```

2. **Start Backend Stack**:

   ```bash
   docker compose -f docker-compose.server.yml up --build -d
   ```

3. **Access**:
   - Backend: [http://localhost:8000/health](http://localhost:8000/health)

## Deploying to Render (Blueprint)

This project includes a `render.yaml` file for easy deployment using [Render Blueprints](https://render.com/docs/blueprints).

1. **Push your code** to a GitHub/GitLab repository.
2. **Connect to Render**: In the Render dashboard, click **"New +"** and select **"Blueprint"**.
3. **Connect Repository**: Select this repository.
4. **Deploy**: Render will automatically detect `render.yaml` and provision:
   - **PostgreSQL Service**
   - **Redis Service**
   - **Web Service** (Modular Backend)
5. **Set Secrets**: After deployment starts, go to the Web Service settings and add your `OPENAI_API_KEY` and updated `FRONTEND_URL`.

## Full Stack Deployment (Production Mode)

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
