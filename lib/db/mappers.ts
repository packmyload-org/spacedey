import { parseDate, parseRequiredDate, toNumber } from '@/lib/db/row';
import User from '@/lib/db/entities/User';
import Site from '@/lib/db/entities/Site';
import UnitType from '@/lib/db/entities/UnitType';
import StorageUnit from '@/lib/db/entities/StorageUnit';
import Booking, { type BookingBillingMetadata } from '@/lib/db/entities/Booking';
import Payment, { type PaymentMetadata } from '@/lib/db/entities/Payment';
import Invoice, { type InvoiceLineItem } from '@/lib/db/entities/Invoice';
import BlogPost from '@/lib/db/entities/BlogPost';
import type { Database } from '@/lib/supabase/database.types';

type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

function assign<T extends object>(target: T, source: object): T {
  return Object.assign(target, source) as T;
}

export function mapUser(row: Row<'users'> & { password?: string }): User {
  return assign(new User(), {
    ...row,
    emailVerifiedAt: parseDate(row.emailVerifiedAt),
    deletedAt: parseDate(row.deletedAt),
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });
}

export function mapSite(row: Row<'sites'> & { unit_types?: Row<'unit_types'>[]; storage_units?: Row<'storage_units'>[] }): Site {
  const site = assign(new Site(), {
    ...row,
    registrationFee: toNumber(row.registrationFee),
    annualDues: toNumber(row.annualDues),
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });

  if (row.unit_types) {
    site.unitTypes = row.unit_types.map(mapUnitType);
  }

  if (row.storage_units) {
    site.units = row.storage_units.map(mapStorageUnit);
  }

  return site;
}

export function mapUnitType(row: Row<'unit_types'> & { site?: Row<'sites'>; storage_units?: Row<'storage_units'>[] }): UnitType {
  const unitType = assign(new UnitType(), {
    ...row,
    priceOriginalAmount: row.priceOriginalAmount ?? undefined,
    description: row.description ?? undefined,
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });

  if (row.site) {
    unitType.site = mapSite(row.site);
  }

  if (row.storage_units) {
    unitType.units = row.storage_units.map(mapStorageUnit);
  }

  return unitType;
}

export function mapStorageUnit(row: Row<'storage_units'> & { site?: Row<'sites'>; unit_type?: Row<'unit_types'>; unit_types?: Row<'unit_types'> }): StorageUnit {
  const unit = assign(new StorageUnit(), {
    ...row,
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });

  if (row.site) {
    unit.site = mapSite(row.site);
  }

  const unitTypeRow = row.unit_type ?? row.unit_types;
  if (unitTypeRow && !Array.isArray(unitTypeRow)) {
    unit.unitType = mapUnitType(unitTypeRow);
  }

  return unit;
}

export function mapBooking(
  row: Row<'bookings'> & {
    user?: Row<'users'>;
    users?: Row<'users'>;
    site?: Row<'sites'>;
    sites?: Row<'sites'>;
    unit_type?: Row<'unit_types'>;
    unit_types?: Row<'unit_types'>;
    storage_unit?: Row<'storage_units'> | null;
    storage_units?: Row<'storage_units'> | null;
  }
): Booking {
  const booking = assign(new Booking(), {
    ...row,
    monthlyRate: toNumber(row.monthlyRate),
    registrationFee: toNumber(row.registrationFee),
    annualDues: toNumber(row.annualDues),
    amountPaid: toNumber(row.amountPaid),
    totalAmount: toNumber(row.totalAmount),
    billingMetadata: (row.billingMetadata ?? null) as BookingBillingMetadata | null,
    startDate: parseRequiredDate(row.startDate),
    endDate: parseDate(row.endDate),
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });

  const userRow = row.user ?? row.users;
  if (userRow) {
    booking.user = mapUser(userRow);
  }

  const siteRow = row.site ?? row.sites;
  if (siteRow) {
    booking.site = mapSite(siteRow);
  }

  const unitTypeRow = row.unit_type ?? row.unit_types;
  if (unitTypeRow && !Array.isArray(unitTypeRow)) {
    booking.unitType = mapUnitType(unitTypeRow);
  }

  const storageUnitRow = row.storage_unit ?? row.storage_units;
  if (storageUnitRow && !Array.isArray(storageUnitRow)) {
    booking.storageUnit = mapStorageUnit(storageUnitRow);
  }

  return booking;
}

export function mapPayment(
  row: Row<'payments'> & {
    booking?: Row<'bookings'> & Record<string, unknown>;
    bookings?: Row<'bookings'> & Record<string, unknown>;
    user?: Row<'users'>;
    users?: Row<'users'>;
  }
): Payment {
  const payment = assign(new Payment(), {
    ...row,
    amount: toNumber(row.amount),
    metadata: (row.metadata ?? null) as PaymentMetadata | null,
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });

  const bookingRow = row.booking ?? row.bookings;
  if (bookingRow) {
    payment.booking = mapBooking(bookingRow);
  }

  const userRow = row.user ?? row.users;
  if (userRow) {
    payment.user = mapUser(userRow);
  }

  return payment;
}

export function mapInvoice(
  row: Row<'invoices'> & {
    booking?: Row<'bookings'> & Record<string, unknown>;
    bookings?: Row<'bookings'> & Record<string, unknown>;
    user?: Row<'users'>;
    users?: Row<'users'>;
    payment?: Row<'payments'> & Record<string, unknown>;
    payments?: Row<'payments'> & Record<string, unknown>;
  }
): Invoice {
  const invoice = assign(new Invoice(), {
    ...row,
    items: row.items as unknown as InvoiceLineItem[],
    subtotal: toNumber(row.subtotal),
    tax: toNumber(row.tax),
    total: toNumber(row.total),
    dueDate: parseRequiredDate(row.dueDate),
    paidAt: parseDate(row.paidAt),
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });

  const bookingRow = row.booking ?? row.bookings;
  if (bookingRow) {
    invoice.booking = mapBooking(bookingRow);
  }

  const userRow = row.user ?? row.users;
  if (userRow) {
    invoice.user = mapUser(userRow);
  }

  const paymentRow = row.payment ?? row.payments;
  if (paymentRow) {
    invoice.payment = mapPayment(paymentRow);
  }

  return invoice;
}

export function mapBlogPost(row: Row<'blog_posts'>): BlogPost {
  return assign(new BlogPost(), {
    ...row,
    publishedAt: parseDate(row.publishedAt),
    createdAt: parseRequiredDate(row.createdAt),
    updatedAt: parseRequiredDate(row.updatedAt),
  });
}

export const BOOKING_RELATION_SELECT = '*, user:users(*), site:sites(*), unit_type:unit_types(*), storage_unit:storage_units(*)';
export const PAYMENT_RELATION_SELECT = `*, booking:bookings(${BOOKING_RELATION_SELECT}), user:users(*)`;
export const INVOICE_RELATION_SELECT = `*, booking:bookings(${BOOKING_RELATION_SELECT}), user:users(*), payment:payments(*)`;
