/**
 * Environment variable configuration and validation
 * Centralized environment setup for the application
 */

import type { DataSourceOptions, LoggerOptions } from "typeorm";

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';
const isProduction = nodeEnv === 'production';

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

const pooledDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

const directDatabaseUrl =
  process.env.DIRECT_DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const useDirectUrl = process.env.DB_USE_DIRECT_URL === 'true';
const selectedDatabaseUrl = useDirectUrl
  ? directDatabaseUrl || pooledDatabaseUrl
  : pooledDatabaseUrl || directDatabaseUrl;

const defaultSsl = selectedDatabaseUrl
  ? !isLocalConnectionString(selectedDatabaseUrl)
  : false;

export const env = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  },

  // Postgres / MySQL Configuration (for TypeORM)
  postgres: {
    url: selectedDatabaseUrl,
    pooledUrl: pooledDatabaseUrl,
    directUrl: directDatabaseUrl,
    useDirectUrl,
    host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
    port: readNumber(process.env.POSTGRES_PORT || process.env.DB_PORT, 5432),
    username: process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || process.env.DB_NAME || 'spacedey',
    ssl: readBoolean(process.env.DB_SSL, defaultSsl),
    sslRejectUnauthorized: readBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false),
    synchronize: readBoolean(process.env.DB_SYNCHRONIZE, isDevelopment),
    logging: readBoolean(process.env.DB_LOGGING, isDevelopment) as LoggerOptions,
    type: process.env.DB_TYPE as DataSourceOptions['type'],
  },

  // Google Maps Configuration
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    enabled:
      process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS === 'true' &&
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_BILLING_ENABLED === 'true' &&
      Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
  },

  // Third-party Integrations
  integrations: {
    zendesk: {
      key: process.env.NEXT_PUBLIC_ZENDESK_KEY,
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
    isProduction,
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
