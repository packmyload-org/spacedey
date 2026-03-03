/**
 * Centralized configuration exports
 * Single entry point for environment configuration (safe for client and server)
 * 
 * For database imports, use: import { connectToDatabase } from '@/config/database'
 */

export { env, validateEnvironment } from './env';
