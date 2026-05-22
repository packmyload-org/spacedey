import type { SupabaseClient } from '@supabase/supabase-js';
import Invoice, { InvoiceStatus } from '../db/entities/Invoice';
import Payment from '../db/entities/Payment';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/database.types';
import { BOOKING_RELATION_SELECT, mapBooking, mapInvoice } from '@/lib/db/mappers';

interface InvoiceGenerationOptions {
  bookingId?: string;
  amount?: number;
}

export async function generateInvoice(
  supabase: SupabaseClient<Database> = createAdminClient(),
  payment: Payment,
  options: InvoiceGenerationOptions = {}
): Promise<Invoice> {
  const targetBookingId = options.bookingId || payment.booking?.id;
  const paymentAmount = Number(options.amount ?? payment.amount);

  if (!targetBookingId) {
    throw new Error('Booking not found for invoice generation');
  }

  const { data: bookingRow, error: bookingError } = await supabase
    .from('bookings')
    .select(BOOKING_RELATION_SELECT)
    .eq('id', targetBookingId)
    .maybeSingle();

  if (bookingError) {
    throw bookingError;
  }

  if (!bookingRow) {
    throw new Error('Booking not found for invoice generation');
  }

  const booking = mapBooking(bookingRow);
  const issuedAt = new Date();
  const invoiceNumber = [
    'INV',
    issuedAt.getFullYear(),
    issuedAt.getTime(),
    Math.random().toString(36).slice(2, 6).toUpperCase(),
  ].join('-');

  const items = [
    {
      description: `Payment Installment for Storage Unit: ${booking.unitType?.name} at ${booking.site?.name}`,
      qty: 1,
      unitPrice: paymentAmount,
      total: paymentAmount,
    },
  ];

  const { data: invoiceRow, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      invoiceNumber,
      bookingId: booking.id,
      userId: booking.user?.id ?? booking.userId,
      paymentId: payment.id,
      items,
      subtotal: paymentAmount,
      tax: 0,
      total: paymentAmount,
      currency: payment.currency,
      status: InvoiceStatus.PAID,
      dueDate: issuedAt.toISOString(),
      paidAt: issuedAt.toISOString(),
    })
    .select('*')
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  const bookingRelation = bookingRow as Parameters<typeof mapBooking>[0];

  return mapInvoice({
    ...invoiceRow,
    booking: bookingRelation,
    user: bookingRelation.user ?? bookingRelation.users,
    payment: {
      id: payment.id,
      provider: payment.provider,
      providerReference: payment.providerReference,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      metadata: payment.metadata as Database['public']['Tables']['payments']['Row']['metadata'],
      bookingId: payment.bookingId ?? payment.booking?.id ?? null,
      userId: payment.userId ?? payment.user?.id ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    },
  });
}
