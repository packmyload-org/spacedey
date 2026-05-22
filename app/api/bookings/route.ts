import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { BookingStatus } from '@/lib/db/entities/Booking';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { env } from '@/config/env';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';
import { calculateCheckoutPricing } from '@/lib/pricing/storagePricing';
import { PaymentBillingType } from '@/lib/db/entities/Payment';
import { expireStalePendingBookings } from '@/lib/services/bookingLifecycle';
import { BOOKING_RELATION_SELECT, mapBooking, mapSite, mapStorageUnit, mapUnitType } from '@/lib/db/mappers';
import type { StorageUnitRow } from '@/lib/supabase/database.types';
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

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, env.jwt.secret) as AuthTokenPayload;
    const userId = decoded.userId;
    const supabase = createAdminClient();

    await expireStalePendingBookings();

    const [{ data: siteRow }, { data: unitRow }] = await Promise.all([
      supabase.from('sites').select('*').eq('id', siteId).maybeSingle(),
      supabase.from('unit_types').select('*').eq('id', unitTypeId).maybeSingle(),
    ]);

    const site = siteRow ? mapSite(siteRow) : null;
    const unit = unitRow ? mapUnitType(unitRow) : null;

    if (!site || !unit) {
      return NextResponse.json({ ok: false, message: 'Site or Unit Type not found' }, { status: 404 });
    }

    let storageUnitRow: StorageUnitRow | null = null;
    let requestedSpecificUnit = false;

    if (storageUnitId) {
      requestedSpecificUnit = true;
      const { data } = await supabase
        .from('storage_units')
        .select('*, site:sites(*), unit_type:unit_types(*)')
        .eq('id', storageUnitId)
        .maybeSingle();

      storageUnitRow = data as StorageUnitRow | null;

      if (!storageUnitRow || storageUnitRow.siteId !== site.id || storageUnitRow.unitTypeId !== unit.id) {
        return NextResponse.json({ ok: false, message: 'Storage unit not found for this site and unit type' }, { status: 404 });
      }
    }

    let storageUnit = storageUnitRow ? mapStorageUnit(storageUnitRow) : null;

    if (!storageUnit || storageUnit.status !== StorageUnitStatus.AVAILABLE) {
      const { data } = await supabase
        .from('storage_units')
        .select('*, site:sites(*), unit_type:unit_types(*)')
        .eq('siteId', site.id)
        .eq('unitTypeId', unit.id)
        .eq('status', StorageUnitStatus.AVAILABLE)
        .order('unitNumber', { ascending: true })
        .limit(1)
        .maybeSingle();

      storageUnit = data ? mapStorageUnit(data) : null;
    }

    if (!storageUnit) {
      return NextResponse.json({ ok: false, message: 'No available storage unit found for this unit type' }, { status: 409 });
    }

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

    await supabase
      .from('storage_units')
      .update({ status: StorageUnitStatus.RESERVED })
      .eq('id', storageUnit.id);

    const { data: bookingRow, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        userId,
        siteId: site.id,
        unitTypeId: unit.id,
        storageUnitId: storageUnit.id,
        status: BookingStatus.PENDING,
        startDate: bookingStartDate.toISOString(),
        endDate: endDate.toISOString(),
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
      })
      .select('*')
      .single();

    if (bookingError) {
      throw bookingError;
    }

    await syncUnitTypeAvailability(unit.id);

    return NextResponse.json({
      ok: true,
      bookingId: bookingRow.id,
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
      },
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
    const supabase = createAdminClient();

    await expireStalePendingBookings();

    const { data, error } = await supabase
      .from('bookings')
      .select(BOOKING_RELATION_SELECT)
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    const bookings = (data ?? []).map((row) => mapBooking(row));

    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
