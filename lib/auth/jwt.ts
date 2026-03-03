import jwt from 'jsonwebtoken';
import { env } from '@/config';

const JWT_EXPIRE = '7d';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.jwt.secret, { expiresIn: JWT_EXPIRE });
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
