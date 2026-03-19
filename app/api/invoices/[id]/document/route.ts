import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import {
  generateInvoicePdf,
  getInvoiceDocumentFilename,
  getInvoiceDocumentForAdmin,
  getInvoiceDocumentForUser,
} from '@/lib/services/invoiceDocuments';
import { UserRole } from '@/lib/types/roles';

type InvoiceTokenPayload = jwt.JwtPayload & {
  userId?: string;
  role?: string;
};

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, env.jwt.secret) as InvoiceTokenPayload;

    if (!decoded.userId) {
      return NextResponse.json(
        { ok: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const dataSource = await connectTypeORM();
    const userRepo = dataSource.getRepository(User);
    const currentUser = await userRepo.findOne({
      where: { id: decoded.userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { ok: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const document =
      currentUser.role === UserRole.ADMIN
        ? await getInvoiceDocumentForAdmin(id)
        : await getInvoiceDocumentForUser(decoded.userId, id);

    if (!document) {
      return NextResponse.json(
        { ok: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    const pdf = await generateInvoicePdf(document);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${getInvoiceDocumentFilename(document.invoiceNumber)}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Invoice document error:', error);
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
