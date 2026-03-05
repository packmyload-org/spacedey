import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { env } from '@/config';
import { UserResponse } from '@/lib/types/local';
import type User from '@/lib/db/entities/User';

/**
 * Hash a password using a secure password hashing algorithm.
 * Uses bcrypt with a reasonable cost factor.
 */
export function hashPassword(password: string): string {
  const saltRounds = 12;
  return bcrypt.hashSync(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
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
