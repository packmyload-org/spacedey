import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Invoice from '@/lib/db/entities/Invoice';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as any;
        const userId = decoded.userId;
        const userRole = decoded.role;

        const dataSource = await connectTypeORM();
        const invoiceRepo = dataSource.getRepository(Invoice);

        // If admin, show all. If user, show only theirs.
        const query: any = {
            relations: ['user', 'booking', 'booking.site'],
            order: { createdAt: 'DESC' }
        };

        if (userRole !== 'admin') {
            query.where = { user: { id: userId } };
        }

        const invoices = await invoiceRepo.find(query);

        return NextResponse.json({ ok: true, invoices });
    } catch (error) {
        console.error('Fetch invoices error:', error);
        return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
    }
}
