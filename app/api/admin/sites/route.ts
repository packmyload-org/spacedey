import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
<<<<<<< HEAD
=======
import UnitType from '@/lib/db/entities/UnitType';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
>>>>>>> feat/custom-integration
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
            relations: ['unitTypes', 'units'],
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
<<<<<<< HEAD
=======
            city,
            state,
>>>>>>> feat/custom-integration
            address,
            contactPhone,
            contactEmail,
            lat,
            lng,
            measuringUnit,
            image,
            about,
<<<<<<< HEAD
            siteMapUrl
        } = body;

        if (!name || !code || !address || !contactPhone || !contactEmail || lat === undefined || lng === undefined) {
            return NextResponse.json(
                { ok: false, error: 'Name, code, address, contact phone/email, and coordinates are required.' },
=======
            siteMapUrl,
            registrationFee,
            annualDues,
            unitTypes = []
        } = body;

        if (!name || !code || !city || !state || !address || !contactPhone || !contactEmail || lat === undefined || lng === undefined) {
            return NextResponse.json(
                { ok: false, error: 'Name, code, city, state, address, contact phone/email, and coordinates are required.' },
>>>>>>> feat/custom-integration
                { status: 400 }
            );
        }

        const appDataSource = await connectTypeORM();
        const repo = appDataSource.getRepository(Site);
<<<<<<< HEAD
=======
        const unitTypeRepo = appDataSource.getRepository(UnitType);
        const storageUnitRepo = appDataSource.getRepository(StorageUnit);
>>>>>>> feat/custom-integration

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
<<<<<<< HEAD
=======
            city,
            state,
>>>>>>> feat/custom-integration
            address,
            contactPhone,
            contactEmail,
            lat,
            lng,
<<<<<<< HEAD
            measuringUnit: measuringUnit || 'ft',
            image,
            about,
            siteMapUrl
=======
            latitude: lat,
            longitude: lng,
            measuringUnit: measuringUnit || 'ft',
            image,
            about,
            siteMapUrl,
            registrationFee,
            annualDues,
>>>>>>> feat/custom-integration
        });

        await repo.save(newSite);

<<<<<<< HEAD
=======
        if (Array.isArray(unitTypes) && unitTypes.length > 0) {
            const sitePrefix = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'UNIT';

            for (const [index, unitType] of unitTypes.entries()) {
                if (!unitType?.name || unitType.width === undefined || unitType.depth === undefined || unitType.priceAmount === undefined) {
                    continue;
                }

                const savedUnitType = await unitTypeRepo.save(unitTypeRepo.create({
                    name: unitType.name,
                    width: unitType.width,
                    depth: unitType.depth,
                    unit: unitType.unit || 'ft',
                    priceAmount: unitType.priceAmount,
                    priceCurrency: unitType.priceCurrency || 'NGN',
                    priceOriginalAmount: unitType.priceOriginalAmount,
                    description: unitType.description,
                    availableCount: unitType.availableCount || 0,
                    site: newSite,
                }));

                const blockStart = index * 100 + 1;
                const storageUnits = Array.from({ length: unitType.availableCount || 0 }, (_, unitIndex) => (
                    storageUnitRepo.create({
                        unitNumber: `${sitePrefix}${String(blockStart + unitIndex).padStart(3, '0')}`,
                        status: StorageUnitStatus.AVAILABLE,
                        site: newSite,
                        unitType: savedUnitType,
                    })
                ));

                if (storageUnits.length > 0) {
                    await storageUnitRepo.save(storageUnits);
                }
            }
        }

>>>>>>> feat/custom-integration
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
