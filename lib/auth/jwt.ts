import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '@/config';

const DEFAULT_JWT_EXPIRE: SignOptions['expiresIn'] = '7d';

export function generateToken(
  userId: string,
  expiresIn: SignOptions['expiresIn'] = DEFAULT_JWT_EXPIRE
): string {
  return jwt.sign({ userId }, env.jwt.secret, { expiresIn });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, env.jwt.secret) as { userId: string };
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
