import crypto from 'crypto';
import { env } from '@/config';
import { UserResponse } from '@/lib/types/local';
import type User from '@/lib/db/entities/User';

/**
 * Hash a password using a simple approach (in production, use bcrypt or similar)
 * For now using crypto for basic hashing
 */
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + env.security.passwordSalt)
    .digest('hex');
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Generate a simple access token
 * In production, use JWT or similar
 */
export function generateAccessToken(userId: string): string {
  const timestamp = Date.now();
  const data = `${userId}:${timestamp}:${env.security.tokenSecret}`;
  return Buffer.from(data).toString('base64');
}

/**
 * Convert User to UserResponse (excludes sensitive data)
 */
export function userToResponse(user: any): UserResponse {
  return {
    id: user.id?.toString?.() || String(user.id),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
  };
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
