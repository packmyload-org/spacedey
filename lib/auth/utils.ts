import crypto from 'crypto';
import { User, UserResponse } from '@/lib/types/local';

/**
 * Hash a password using a simple approach (in production, use bcrypt or similar)
 * For now using crypto for basic hashing
 */
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + process.env.PASSWORD_SALT || 'spacedey-salt')
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
  const data = `${userId}:${timestamp}:${process.env.TOKEN_SECRET || 'spacedey-secret'}`;
  return Buffer.from(data).toString('base64');
}

/**
 * Convert User to UserResponse (excludes sensitive data)
 */
export function userToResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  };
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
