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
import { calculateCheckoutPricing } from '@/lib/pricing/storagePricing';
import { PaymentBillingType } from '@/lib/db/entities/Payment';
import { expireStalePendingBookings } from '@/lib/services/bookingLifecycle';
import {
    DEFAULT_RECURRING_DURATION_MONTHS,
    getRecurringEndDate,
    normalizeRecurringDurationMonths,
} from '@/lib/billing/config';

interface AuthTokenPayload extends JwtPayload {
    userId: string;
}

function normalizeBillingType(value: unknown) {
    return value === PaymentBillingType.RECURRING
        ? PaymentBillingType.RECURRING
        : PaymentBillingType.ONE_TIME;
}

function addMonths(date: Date, months: number) {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + months);
    return nextDate;
}

export async function POST(req: Request) {
    try {
        const {
            siteId,
            unitTypeId,
            storageUnitId,
            startDate,
            paymentMode,
            billingType: rawBillingType,
            recurringDurationMonths: rawRecurringDurationMonths,
        } = await req.json();
        const billingType = normalizeBillingType(rawBillingType ?? (paymentMode === 'monthly' ? PaymentBillingType.RECURRING : PaymentBillingType.ONE_TIME));
        const recurringDurationMonths = billingType === PaymentBillingType.RECURRING
            ? normalizeRecurringDurationMonths(rawRecurringDurationMonths) ?? DEFAULT_RECURRING_DURATION_MONTHS
            : null;

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
        await expireStalePendingBookings(dataSource);

        // 2. Fetch dependencies
        const site = await siteRepo.findOne({ where: { id: siteId } });
        const unit = await unitRepo.findOne({ where: { id: unitTypeId } });

        if (!site || !unit) {
            return NextResponse.json({ ok: false, message: 'Site or Unit Type not found' }, { status: 404 });
        }

        let storageUnit = null;
        let requestedSpecificUnit = false;

        if (storageUnitId) {
            requestedSpecificUnit = true;
            storageUnit = await storageUnitRepo.findOne({
                where: { id: storageUnitId },
                relations: ['site', 'unitType'],
            });

            if (!storageUnit || storageUnit.site.id !== site.id || storageUnit.unitType.id !== unit.id) {
                return NextResponse.json({ ok: false, message: 'Storage unit not found for this site and unit type' }, { status: 404 });
            }
        }

        if (!storageUnit || storageUnit.status !== StorageUnitStatus.AVAILABLE) {
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
        const pricing = calculateCheckoutPricing({
            width: Number(unit.width),
            depth: Number(unit.depth),
            unit: unit.unit,
        });
        const monthlyRate = pricing.monthlyRate;
        const bookingStartDate = new Date(startDate || Date.now());
        const totalAmount = monthlyRate;
        const endDate = billingType === PaymentBillingType.RECURRING
            ? getRecurringEndDate(bookingStartDate, recurringDurationMonths ?? DEFAULT_RECURRING_DURATION_MONTHS)
            : addMonths(bookingStartDate, 1);

        // 4. Create Booking
        const booking = bookingRepo.create({
            user: { id: userId } as { id: string },
            site,
            unitType: unit,
            storageUnit,
            status: BookingStatus.PENDING,
            startDate: bookingStartDate,
            endDate,
            monthlyRate,
            registrationFee: 0,
            annualDues: 0,
            totalAmount,
            amountPaid: 0,
            currency: 'NGN',
            billingMetadata: {
                billingType,
                billingInterval: 'monthly',
                recurringDurationMonths: recurringDurationMonths ?? undefined,
                recurringEndDate: endDate.toISOString(),
            },
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
            requestedSpecificUnit,
            assignedFallbackUnit: requestedSpecificUnit && storageUnit.id !== storageUnitId,
            breakdown: {
                monthlyRate,
                totalAmount,
                billingType,
                recurringDurationMonths,
                endDate: endDate.toISOString(),
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
        await expireStalePendingBookings(dataSource);

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
