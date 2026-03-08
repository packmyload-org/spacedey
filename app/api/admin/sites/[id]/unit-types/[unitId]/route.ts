import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import UnitType from '@/lib/db/entities/UnitType';
import { requireAdmin } from '@/lib/auth/admin';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, unitId: string }> }
) {
    const { unitId } = await params;
    const adminCheck = await requireAdmin(request);

    if (!adminCheck.authorized) {
        return NextResponse.json(
            { ok: false, error: adminCheck.error },
            { status: adminCheck.status }
        );
    }

    try {
        const body = await request.json();
        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(UnitType);

        const unit = await repo.findOne({ where: { id: unitId } });

        if (!unit) {
            return NextResponse.json({ ok: false, error: 'Unit type not found' }, { status: 404 });
        }

        // Update fields if provided
        if (body.name) unit.name = body.name;
        if (body.width !== undefined) unit.width = body.width;
        if (body.depth !== undefined) unit.depth = body.depth;
        if (body.unit) unit.unit = body.unit;
        if (body.priceAmount !== undefined) unit.priceAmount = body.priceAmount;
        if (body.priceCurrency) unit.priceCurrency = body.priceCurrency;
        if (body.priceOriginalAmount !== undefined) unit.priceOriginalAmount = body.priceOriginalAmount;
        if (body.description !== undefined) unit.description = body.description;
        if (body.availableCount !== undefined) unit.availableCount = body.availableCount;

        await repo.save(unit);

        return NextResponse.json({ ok: true, unitType: unit });
    } catch (error) {
        console.error('Update unit type error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, unitId: string }> }
) {
    const { unitId } = await params;
    const adminCheck = await requireAdmin(request);

    if (!adminCheck.authorized) {
        return NextResponse.json(
            { ok: false, error: adminCheck.error },
            { status: adminCheck.status }
        );
    }

    try {
        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(UnitType);

        const unit = await repo.findOne({ where: { id: unitId } });

        if (!unit) {
            return NextResponse.json({ ok: false, error: 'Unit type not found' }, { status: 404 });
        }

        await repo.remove(unit);

        return NextResponse.json({ ok: true, message: 'Unit type deleted successfully' });
    } catch (error) {
        console.error('Delete unit type error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
