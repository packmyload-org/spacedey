/**
 * Environment variable configuration and validation
 * Centralized environment setup for the application
 */

export const env = {
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/spacedey',
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME || 'spacedey',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  },

  // Google Maps Configuration
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
