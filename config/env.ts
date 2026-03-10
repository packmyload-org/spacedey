/**
 * Environment variable configuration and validation
 * Centralized environment setup for the application
 */

import { DataSourceOptions } from "typeorm/browser/data-source/index.js";

export const env = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  },

  // Postgres / MySQL Configuration (for TypeORM)
  postgres: {
    host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || process.env.DB_NAME || 'spacedey',
    ssl: process.env.DB_SSL === 'true' || false,
    type: process.env.DB_TYPE as DataSourceOptions['type'],
  },

  // Google Maps Configuration
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    enabled: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS === 'true',
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
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
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
