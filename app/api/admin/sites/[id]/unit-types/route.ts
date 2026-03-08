import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import UnitType from '@/lib/db/entities/UnitType';
import { requireAdmin } from '@/lib/auth/admin';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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
            width,
            depth,
            unit,
            priceAmount,
            priceCurrency,
            priceOriginalAmount,
            description,
            availableCount
        } = body;

        if (!name || width === undefined || depth === undefined || priceAmount === undefined) {
            return NextResponse.json(
                { ok: false, error: 'Name, width, depth, and price are required.' },
                { status: 400 }
            );
        }

        const appDataSource = await connectTypeORM();
        const siteRepo = appDataSource.getRepository(Site);
        const unitRepo = appDataSource.getRepository(UnitType);

        const site = await siteRepo.findOne({ where: { id } });
        if (!site) {
            return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
        }

        const newUnit = unitRepo.create({
            name,
            width,
            depth,
            unit: unit || 'ft',
            priceAmount,
            priceCurrency: priceCurrency || 'NGN',
            priceOriginalAmount,
            description,
            availableCount: availableCount || 0,
            site
        });

        await unitRepo.save(newUnit);

        return NextResponse.json(
            { ok: true, unitType: newUnit },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create unit type error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
