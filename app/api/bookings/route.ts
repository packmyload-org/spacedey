import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import UnitType from '@/lib/db/entities/UnitType';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { env } from '@/config/env';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';

interface AuthTokenPayload extends JwtPayload {
    userId: string;
}

export async function POST(req: Request) {
    try {
        const { siteId, unitTypeId, storageUnitId, startDate } = await req.json();

        // 1. Auth check
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as AuthTokenPayload;
        const userId = decoded.userId;

        const dataSource = await connectTypeORM();
        const siteRepo = dataSource.getRepository(Site);
        const unitRepo = dataSource.getRepository(UnitType);
        const storageUnitRepo = dataSource.getRepository(StorageUnit);
        const bookingRepo = dataSource.getRepository(Booking);

        // 2. Fetch dependencies
        const site = await siteRepo.findOne({ where: { id: siteId } });
        const unit = await unitRepo.findOne({ where: { id: unitTypeId } });

        if (!site || !unit) {
            return NextResponse.json({ ok: false, message: 'Site or Unit Type not found' }, { status: 404 });
        }

        let storageUnit = null;

        if (storageUnitId) {
            storageUnit = await storageUnitRepo.findOne({
                where: { id: storageUnitId },
                relations: ['site', 'unitType'],
            });

            if (!storageUnit || storageUnit.site.id !== site.id || storageUnit.unitType.id !== unit.id) {
                return NextResponse.json({ ok: false, message: 'Storage unit not found for this site and unit type' }, { status: 404 });
            }

            if (storageUnit.status !== StorageUnitStatus.AVAILABLE) {
                return NextResponse.json({ ok: false, message: 'Selected storage unit is no longer available' }, { status: 409 });
            }
        } else {
            storageUnit = await storageUnitRepo.findOne({
                where: {
                    site: { id: site.id },
                    unitType: { id: unit.id },
                    status: StorageUnitStatus.AVAILABLE,
                },
                relations: ['site', 'unitType'],
                order: { unitNumber: 'ASC' },
            });
        }

        if (!storageUnit) {
            return NextResponse.json({ ok: false, message: 'No available storage unit found for this unit type' }, { status: 409 });
        }

        // 3. Booking amount calculations
        const monthlyRate = Number(unit.priceAmount);
        const registrationFee = Number(site.registrationFee || 30000);
        const annualDues = Number(site.annualDues || 35000);

        // Total initial due includes joining fee + 1st month + annual dues
        const totalAmount = registrationFee + monthlyRate + annualDues;

        // 4. Create Booking
        const booking = bookingRepo.create({
            user: { id: userId } as { id: string },
            site,
            unitType: unit,
            storageUnit,
            status: BookingStatus.PENDING,
            startDate: new Date(startDate || Date.now()),
            monthlyRate,
            registrationFee,
            annualDues,
            totalAmount,
            amountPaid: 0,
            currency: 'NGN'
        });

        storageUnit.status = StorageUnitStatus.RESERVED;
        await storageUnitRepo.save(storageUnit);
        await bookingRepo.save(booking);
        await syncUnitTypeAvailability(dataSource, unit.id);

        return NextResponse.json({
            ok: true,
            bookingId: booking.id,
            storageUnitId: storageUnit.id,
            unitNumber: storageUnit.unitNumber,
            breakdown: {
                registrationFee,
                monthlyRate,
                annualDues,
                totalAmount
            }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ ok: false, message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as AuthTokenPayload;
        const userId = decoded.userId;

        const dataSource = await connectTypeORM();
        const bookingRepo = dataSource.getRepository(Booking);

        const bookings = await bookingRepo.find({
            where: { user: { id: userId } },
            relations: ['site', 'unitType', 'storageUnit'],
            order: { createdAt: 'DESC' }
        });

        return NextResponse.json({ ok: true, bookings });
    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
    }
}
