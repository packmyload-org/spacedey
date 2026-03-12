/**
 * Environment variable configuration and validation
 * Centralized environment setup for the application
 */

import type { LoggerOptions } from "typeorm";

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

const pooledDatabaseUrl = process.env.DATABASE_URL;

const directDatabaseUrl = process.env.DIRECT_DATABASE_URL;

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
    ssl: readBoolean(process.env.DB_SSL, defaultSsl),
    sslRejectUnauthorized: readBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false),
    synchronize: readBoolean(process.env.DB_SYNCHRONIZE, false),
    logging: readBoolean(process.env.DB_LOGGING, isDevelopment) as LoggerOptions,
  },

  // Google Maps Configuration
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    enabled: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
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
