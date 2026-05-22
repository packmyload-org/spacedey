/**
 * Environment variable configuration and validation
 * Centralized environment setup for the application
 */

import { resolveSiteUrl } from "@/lib/siteUrl";

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';
const isProduction = nodeEnv === 'production';
const isBuildProcess = process.env.npm_lifecycle_event === 'build'
  || process.env.NEXT_PHASE === 'phase-production-build';
const resolvedSiteUrl = resolveSiteUrl();

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
}

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isLocalConnectionString(connectionString: string): boolean {
  return /localhost|127\.0\.0\.1/.test(connectionString);
}

const pooledDatabaseUrl = process.env.POSTGRES_URL;

const directDatabaseUrl = process.env.DIRECT_POSTGRES_URL;

const useDirectUrl = process.env.DB_USE_DIRECT_URL === 'true';
const selectedDatabaseUrl = useDirectUrl ? directDatabaseUrl || pooledDatabaseUrl
  : pooledDatabaseUrl || directDatabaseUrl;

const defaultSsl = selectedDatabaseUrl
  ? !isLocalConnectionString(selectedDatabaseUrl)
  : false;

export const env = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  },

  // Supabase (Data API + Auth session helpers)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      || '',
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY
      || process.env.SUPABASE_SECRET_KEY
      || '',
  },

  // Postgres pooler (transaction helper only — use Supabase client for queries)
  postgres: {
    url: selectedDatabaseUrl,
    pooledUrl: pooledDatabaseUrl,
    directUrl: directDatabaseUrl,
    useDirectUrl,
    poolMax: readNumber(process.env.DB_POOL_MAX, isProduction ? 2 : 10),
    connectionTimeoutMillis: readNumber(
      process.env.DB_CONNECTION_TIMEOUT_MS,
      isBuildProcess ? 15_000 : 30_000,
    ),
    ssl: readBoolean(process.env.DB_SSL, defaultSsl),
    sslRejectUnauthorized: readBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false),
  },

  // Map Configuration
  maps: {
    enabled: readBoolean(process.env.NEXT_PUBLIC_MAPS_ENABLED, true),
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },

  // Third-party Integrations
  integrations: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      folderPrefix: process.env.CLOUDINARY_FOLDER_PREFIX || 'spacedey',
    },
    analytics: {
      googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
      vercelInsightsEnabled: readBoolean(process.env.ENABLE_VERCEL_INSIGHTS, false),
    },
  },

  // Security
  security: {
    passwordSalt: process.env.PASSWORD_SALT || 'spacedey-salt',
    tokenSecret: process.env.TOKEN_SECRET || 'spacedey-secret',
  },

  // Application Configuration
  app: {
    nodeEnv,
    port: readNumber(process.env.PORT, 3000),
    isDevelopment,
    isBuildProcess,
    isProduction,
    url: resolvedSiteUrl,
  },
};

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  const required = ['JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
