import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM, AppDataSource } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { verifyToken } from '@/lib/auth/jwt';
import { UserRole } from '@/lib/types/roles';

export async function requireAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        error: 'Missing or invalid authorization header',
        status: 401,
      };
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        authorized: false,
        error: 'Invalid or expired token',
        status: 401,
      };
    }

    await connectTypeORM();
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return {
        authorized: false,
        error: 'User not found',
        status: 404,
      };
    }

    if (user.role !== UserRole.ADMIN) {
      return {
        authorized: false,
        error: 'Insufficient permissions. Admin access required.',
        status: 403,
        user,
      };
    }

    return {
      authorized: true,
      user,
      userId: decoded.userId,
    };
  } catch (error) {
    console.error('Admin middleware error:', error);
    return {
      authorized: false,
      error: 'Internal server error',
      status: 500,
    };
  }
}

export function unauthorizedResponse(message: string, status: number = 401) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
