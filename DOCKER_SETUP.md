# Spacedey - Docker & MongoDB Setup Guide

## Overview

This application has been migrated from the Storeganise integration to a custom MongoDB-backed backend using Next.js API routes and Mongoose ORM.

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

The application will be available at `http://localhost:3000` and MongoDB at `localhost:27017`.

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# MongoDB
MONGODB_URI=mongodb://admin:password@mongodb:27017/spacedey?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_DB_NAME=spacedey

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

1. **Install MongoDB locally** or run MongoDB in Docker:
   ```bash
   docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0
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
   - MongoDB: localhost:27017
   - Credentials: admin / password

## Database Models

### User
- `email` (unique, lowercase)
- `password` (hashed with bcryptjs)
- `firstName`
- `lastName`
- `phone` (optional)
- `isAdmin` (default: false)
- `createdAt`, `updatedAt` (timestamps)

### Site
- `name` (required)
- `code` (unique)
- `image` (optional)
- `address` (required)
- `contact` { phone, email }
- `coordinates` { lat, lng }
- `unitTypes` (references to UnitType documents)
- `measuringUnit` (default: 'ft')

### UnitType
- `name` (required)
- `dimensions` { width, depth, unit }
- `price` { amount, currency, originalAmount }
- `description` (optional)
- `availableCount`

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
2. **Change MongoDB Credentials:** Update `MONGO_USERNAME` and `MONGO_PASSWORD`
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
docker-compose logs -f mongodb
```

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongosh -u admin -p password
```

## Deployment

### Docker Image
```bash
# Build image
docker build -t spacedey:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=<your-mongodb-uri> \
  -e JWT_SECRET=<your-jwt-secret> \
  spacedey:latest
```

### Environment Setup for Production
Ensure these are set as environment variables:
- `MONGODB_URI` - External MongoDB connection string
- `JWT_SECRET` - Secure random string
- `NODE_ENV=production`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

## Removed Dependencies

The following Storeganise integration code has been removed:
- Storeganise API integration (`/lib/integration/storeganise.ts`)
- Storeganise type definitions (`/lib/types/storeganise.ts`)
- Storeganise utility functions (`/lib/utils/storeganise.ts`)
- Storeganise image hosting configuration

## Migration Notes

- All authentication now uses JWT tokens instead of Storeganise tokens
- User data is stored in MongoDB with bcrypt password hashing
- Site and UnitType data must be manually migrated from Storeganise or added through admin tools
- Password reset endpoints need to be configured with email service

## Support

For local development issues, check:
1. MongoDB is running: `docker ps`
2. Environment variables are set correctly
3. Ports 3000 and 27017 are not in use
4. Node version is 18+

