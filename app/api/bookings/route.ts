import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import UnitType from '@/lib/db/entities/UnitType';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export async function POST(req: Request) {
    try {
        const { siteId, unitTypeId, startDate } = await req.json();

        // 1. Auth check
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as any;
        const userId = decoded.userId;

        const dataSource = await connectTypeORM();
        const siteRepo = dataSource.getRepository(Site);
        const unitRepo = dataSource.getRepository(UnitType);
        const bookingRepo = dataSource.getRepository(Booking);

        // 2. Fetch dependencies
        const site = await siteRepo.findOne({ where: { id: siteId } });
        const unit = await unitRepo.findOne({ where: { id: unitTypeId } });

        if (!site || !unit) {
            return NextResponse.json({ ok: false, message: 'Site or Unit Type not found' }, { status: 404 });
        }

        // 3. iFitness Model Calculations
        const monthlyRate = Number(unit.priceAmount);
        const registrationFee = Number(site.registrationFee || 30000);
        const annualDues = Number(site.annualDues || 35000);

        // Total initial due includes joining fee + 1st month + annual dues
        const totalAmount = registrationFee + monthlyRate + annualDues;

        // 4. Create Booking
        const booking = bookingRepo.create({
            user: { id: userId } as any,
            site,
            unitType: unit,
            status: BookingStatus.PENDING,
            startDate: new Date(startDate || Date.now()),
            monthlyRate,
            registrationFee,
            annualDues,
            totalAmount,
            amountPaid: 0,
            currency: 'NGN'
        });

        await bookingRepo.save(booking);

        return NextResponse.json({
            ok: true,
            bookingId: booking.id,
            breakdown: {
                registrationFee,
                monthlyRate,
                annualDues,
                totalAmount
            }
        });

    } catch (error: any) {
        console.error('Create booking error:', error);
        return NextResponse.json({ ok: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as any;
        const userId = decoded.userId;

        const dataSource = await connectTypeORM();
        const bookingRepo = dataSource.getRepository(Booking);

        const bookings = await bookingRepo.find({
            where: { user: { id: userId } },
            relations: ['site', 'unitType'],
            order: { createdAt: 'DESC' }
        });

        return NextResponse.json({ ok: true, bookings });
    } catch (error: any) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
    }
}
