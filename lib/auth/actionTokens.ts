import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '@/config';

export type ActionTokenPurpose = 'email_verification' | 'password_reset';

interface ActionTokenPayload {
  userId: string;
  email: string;
  purpose: ActionTokenPurpose;
}

export function generateActionToken(
  payload: ActionTokenPayload,
  expiresIn: SignOptions['expiresIn']
) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn });
}

export function verifyActionToken(token: string, expectedPurpose: ActionTokenPurpose) {
  try {
    const decoded = jwt.verify(token, env.jwt.secret) as Partial<ActionTokenPayload>;

    if (
      decoded.purpose !== expectedPurpose
      || typeof decoded.userId !== 'string'
      || typeof decoded.email !== 'string'
    ) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email.toLowerCase(),
      purpose: decoded.purpose,
    } satisfies ActionTokenPayload;
  } catch (error) {
    console.error(`Action token verification failed for ${expectedPurpose}:`, error);
    return null;
  }
}
