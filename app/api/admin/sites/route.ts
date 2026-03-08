import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
    const adminCheck = await requireAdmin(request);

    if (!adminCheck.authorized) {
        return NextResponse.json(
            { ok: false, error: adminCheck.error },
            { status: adminCheck.status }
        );
    }

    try {
        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(Site);

        // Fetch sites with unitTypes and some basic stats
        const sites = await repo.find({
            relations: ['unitTypes'],
            order: { createdAt: 'DESC' }
        });

        return NextResponse.json({
            ok: true,
            sites
        });
    } catch (error) {
        console.error('Get admin sites error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin(request);

    if (!adminCheck.authorized) {
        return NextResponse.json(
            { ok: false, error: adminCheck.error },
            { status: adminCheck.status }
        );
    }

    try {
        const body = await request.json();
        const {
            name,
            code,
            address,
            contactPhone,
            contactEmail,
            lat,
            lng,
            measuringUnit,
            image,
            siteMapUrl
        } = body;

        if (!name || !code || !address || !contactPhone || !contactEmail || lat === undefined || lng === undefined) {
            return NextResponse.json(
                { ok: false, error: 'Name, code, address, contact phone/email, and coordinates are required.' },
                { status: 400 }
            );
        }

        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(Site);

        // Check if code exists
        const existing = await repo.findOne({ where: { code } });
        if (existing) {
            return NextResponse.json(
                { ok: false, error: 'Site with this unique code already exists.' },
                { status: 409 }
            );
        }

        const newSite = repo.create({
            name,
            code,
            address,
            contactPhone,
            contactEmail,
            lat,
            lng,
            measuringUnit: measuringUnit || 'ft',
            image,
            siteMapUrl
        });

        await repo.save(newSite);

        return NextResponse.json(
            { ok: true, site: newSite },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create site error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
