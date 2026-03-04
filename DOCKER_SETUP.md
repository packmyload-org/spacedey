# Spacedey - Docker & Postgres Setup Guide

## Overview

This application uses a Postgres database with TypeORM for server-side data access. The repo includes a TypeORM DataSource and entity definitions; for local development we provide a Postgres service in `docker-compose.yml`.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- pnpm package manager

## Docker Setup

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository>
   cd spacedey
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:3000` and Postgres at `localhost:5432`.

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=spacedey
DB_TYPE=postgres
DB_SSL=false

# JWT
JWT_SECRET=your-secure-secret-key

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# Development
SKIP_RECAPTCHA_VERIFICATION=false
```

## Local Development

### Without Docker

1. **Install Postgres locally** or run Postgres in Docker:
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=spacedey postgres:15
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run development server:**
   ```bash
   pnpm dev
   ```

### With Docker Compose

1. **Start services:**
   ```bash
   docker-compose up
   ```

2. **Access the app:**
   - Application: http://localhost:3000
   - Postgres: localhost:5432
   - Credentials: admin / password

## Database Models (overview)

The project defines TypeORM entities for `User`, `Site`, and `UnitType` with columns and relations that map the previous MongoDB schema.

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/forgot-password` - Request password reset

### Storage Locations
- `GET /api/sites` - Get all storage sites with unit types

## Security Considerations

1. **Change JWT Secret:** Update `JWT_SECRET` in production
2. **Change DB Credentials:** Update `POSTGRES_USER` and `POSTGRES_PASSWORD`
3. **Enable reCAPTCHA:** Configure proper reCAPTCHA keys
4. **Use HTTPS:** Deploy with HTTPS in production
5. **Environment Variables:** Never commit `.env.local` to version control

## Docker Commands

### Build
```bash
docker-compose build
```

### Start
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f app
docker-compose logs -f postgres
```

### Access Postgres Shell
```bash
docker-compose exec postgres psql -U admin -d spacedey
```

## Deployment

### Docker Image
```bash
# Build image
docker build -t spacedey:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e POSTGRES_HOST=<your-postgres-host> \
  -e POSTGRES_PORT=<your-postgres-port> \
  -e POSTGRES_USER=<your-postgres-user> \
  -e POSTGRES_PASSWORD=<your-postgres-password> \
  -e POSTGRES_DB=<your-postgres-db> \
  -e JWT_SECRET=<your-jwt-secret> \
  spacedey:latest
```

### Environment Setup for Production
Ensure these are set as environment variables:
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `JWT_SECRET` - Secure random string
- `NODE_ENV=production`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

## Migration Notes

- TypeORM `synchronize` is enabled for development; generate migrations for production and set `synchronize=false`.

## Support

For local development issues, check:
1. Postgres is running: `docker ps`
2. Environment variables are set correctly
3. Ports 3000 and 5432 are not in use
4. Node version is 18+

