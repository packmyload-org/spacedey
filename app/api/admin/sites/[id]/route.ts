import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(
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
        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(Site);

        const site = await repo.findOne({
            where: { id },
            relations: ['unitTypes', 'units', 'units.unitType']
        });

        if (!site) {
            return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
        }

        return NextResponse.json({ ok: true, site });
    } catch (error) {
        console.error('Get admin site error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function PATCH(
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
        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(Site);

        const site = await repo.findOne({ where: { id } });

        if (!site) {
            return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
        }

        // Update fields if provided
        if (body.name !== undefined) site.name = body.name;
        if (body.code !== undefined) site.code = body.code;
        if (body.address !== undefined) site.address = body.address;
        if (body.contactPhone !== undefined) site.contactPhone = body.contactPhone;
        if (body.contactEmail !== undefined) site.contactEmail = body.contactEmail;
        if (body.lat !== undefined) site.lat = body.lat;
        if (body.lng !== undefined) site.lng = body.lng;
        if (body.measuringUnit !== undefined) site.measuringUnit = body.measuringUnit;
        if (body.image !== undefined) site.image = body.image;
        if (body.about !== undefined) site.about = body.about;
        if (body.siteMapUrl !== undefined) site.siteMapUrl = body.siteMapUrl;

        await repo.save(site);

        return NextResponse.json({ ok: true, site });
    } catch (error) {
        console.error('Update site error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function DELETE(
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
        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(Site);

        const site = await repo.findOne({ where: { id } });

        if (!site) {
            return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
        }

        await repo.remove(site);

        return NextResponse.json({ ok: true, message: 'Site deleted successfully' });
    } catch (error) {
        console.error('Delete site error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
