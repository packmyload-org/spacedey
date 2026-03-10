# Supabase DB-Only Setup

This project can run against Supabase as a managed PostgreSQL database without changing the application architecture.

## Recommended approach

- Use `DATABASE_URL` for the pooled/runtime connection.
- Use `DIRECT_DATABASE_URL` for seeding, schema work, or long-running scripts.
- Keep `DB_USE_DIRECT_URL=false` for the app runtime.
- Set `DB_USE_DIRECT_URL=true` only when running scripts that should bypass the pooler.

## Example environment variables

```env
DATABASE_URL=postgresql://postgres.xxx:[password]@aws-0-region.pooler.supabase.com:6543/postgres
DIRECT_DATABASE_URL=postgresql://postgres.xxx:[password]@db.xxx.supabase.co:5432/postgres
DB_USE_DIRECT_URL=false
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
DB_SYNCHRONIZE=false
DB_LOGGING=false
```

You can also keep using the older `POSTGRES_HOST` / `POSTGRES_PORT` style variables, but URL-based config is the simplest path for Supabase and Vercel.

## Local development

1. Create a Supabase project.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_DATABASE_URL`.
4. Run the app with `pnpm dev`.

## Seeding against Supabase

Run migrations before seeding:

```bash
pnpm db:migrate
```

Use the direct connection for seeding when you want to bypass a pooler:

```bash
DB_USE_DIRECT_URL=true pnpm run seed:data
```

## Vercel

Add these env vars to your Vercel project:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `DB_SSL=true`
- `DB_SSL_REJECT_UNAUTHORIZED=false`
- `DB_SYNCHRONIZE=false`
- `DB_LOGGING=false`
- `JWT_SECRET`
- `PASSWORD_SALT`
- `TOKEN_SECRET`

For most deployments:

- runtime routes should use `DATABASE_URL`
- manual seeds and admin scripts should use `DIRECT_DATABASE_URL`

## Important note

This repo now expects TypeORM migrations to manage schema changes. Keep `DB_SYNCHRONIZE=false` in both production and normal development work. If you already have an existing database that was created via `synchronize`, run `pnpm db:baseline` once before using `pnpm db:migrate`.
