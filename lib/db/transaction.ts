import { Pool, type PoolClient } from 'pg';
import { env } from '@/config/env';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!env.postgres.url) {
    throw new Error(
      'Missing POSTGRES_URL or DIRECT_POSTGRES_URL. Configure database env vars before using transactions.'
    );
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.postgres.url,
      ssl: env.postgres.ssl
        ? { rejectUnauthorized: env.postgres.sslRejectUnauthorized }
        : false,
      max: env.postgres.poolMax,
    });
  }

  return pool;
}

export async function withPgTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function runPgQuery<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const client = await getPool().connect();

  try {
    const result = await client.query<T>(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}
