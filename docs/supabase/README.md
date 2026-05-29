# Supabase database

The app uses `@supabase/supabase-js` with the **service role** on the server (`lib/supabase/admin.ts`) and `pg` only for multi-statement transactions (`lib/db/transaction.ts`).

## Schema

Historical TypeORM migrations live in `migrations/` at the repo root. For a new Supabase project:

1. Link the project: `npx supabase link --project-ref <ref>`
2. Apply existing SQL from your production database, or convert `migrations/*.ts` to SQL and run via the Supabase SQL editor or `supabase db push`.
3. Enable **RLS** on tables exposed to the Data API; server routes use the service role and bypass RLS.

## Environment

Copy `.env.example` and set `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, and `POSTGRES_URL` (Session pooler, port 6543, `?pgbouncer=true`).
