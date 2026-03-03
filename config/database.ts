/**
 * Database configuration
 * Centralized database connection setup for MongoDB using Mongoose
 * 
 * This module must ONLY be imported server-side. It uses Node.js APIs not available in browsers.
 */

import mongoose, { Mongoose, Connection } from 'mongoose';
import { env } from './env';

interface CachedConnection {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Mongoose> | null;
  };
}

if (!env.mongodb.uri) {
  throw new Error('Please add your MONGODB_URI to .env');
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB using Mongoose
 */
export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(env.mongodb.uri, opts)
      .then((mongooseInstance: Mongoose) => {
        console.log('✓ Connected to MongoDB');
        return mongooseInstance;
      })
      .catch((error: Error) => {
        console.error('✗ Failed to connect to MongoDB:', error);
        throw error;
      });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn as Connection;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
  }
}

export default { connectToDatabase, disconnectFromDatabase };
