# Database Workflow

This project now separates schema management from starter data:

- `migrations/` defines the database structure
- `pnpm db:migrate` applies schema changes
- `pnpm run seed:data` inserts baseline records such as users, sites, unit types, and storage inventory

## Normal flow

For a fresh database:

```bash
pnpm db:migrate
pnpm run seed:data
```

Or use the shortcut:

```bash
pnpm db:setup
```

## Existing databases

If your current database was originally created with TypeORM `synchronize`, do this once before switching to migrations:

```bash
pnpm db:baseline
```

That marks the initial schema migration as already applied without recreating the tables.

## Day-to-day rules

- Use migrations for schema changes
- Use seeds only for baseline business data
- Do not reseed for normal UI or styling work
- Keep `DB_SYNCHRONIZE=false` unless you are doing short-lived local experimentation

## Migration commands

```bash
pnpm db:migrate
pnpm db:migrate:revert
pnpm db:migrate:show
```

## Creating a new migration

Use the TypeORM CLI entrypoint in this repo:

```bash
pnpm typeorm migration:create migrations/AddSomething
```

If you want to generate from entity changes:

```bash
pnpm typeorm migration:generate migrations/AddSomething
```

Review generated SQL before applying it, especially for production databases.
