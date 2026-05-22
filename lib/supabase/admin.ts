import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import type { Database } from '@/lib/supabase/database.types';

let adminClient: SupabaseClient<Database> | null = null;

export function createAdminClient(): SupabaseClient<Database> {
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Configure Supabase env vars before starting the app.'
    );
  }

  if (!adminClient) {
    adminClient = createClient<Database>(env.supabase.url, env.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
