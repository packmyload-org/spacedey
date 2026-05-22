import { createAdminClient } from '@/lib/supabase/admin';
import Invoice from '@/lib/db/entities/Invoice';
import { resolveInvoiceLinkedUser } from '@/lib/services/invoiceUsers';
import { INVOICE_RELATION_SELECT, mapInvoice, mapPayment } from '@/lib/db/mappers';

export interface AdminInvoiceSummary {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  booking: {
    id: string;
    status: string;
    amountPaid: number;
    totalAmount: number;
    billingMetadata: Record<string, unknown> | null;
    site: {
      id: string;
      name: string;
    } | null;
    unitType: {
      id: string;
      name: string;
    } | null;
  } | null;
  payment: {
    id: string;
    provider: string;
    providerReference: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  } | null;
}

export interface AdminInvoiceDetail extends AdminInvoiceSummary {
  items: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
  paymentHistory: Array<{
    id: string;
    provider: string;
    providerReference: string;
    amount: number;
    currency: string;
    status: string;
    billingType: string | null;
    paymentMode: string | null;
    createdAt: string;
  }>;
  relatedInvoices: Array<{
    id: string;
    invoiceNumber: string;
    total: number;
    currency: string;
    status: string;
    dueDate: string;
    paidAt: string | null;
    createdAt: string;
  }>;
}

function serializeInvoice(invoice: Invoice): AdminInvoiceSummary {
  const user = resolveInvoiceLinkedUser(invoice.user);

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    subtotal: Number(invoice.subtotal),
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    currency: invoice.currency,
    status: invoice.status,
    dueDate: invoice.dueDate.toISOString(),
    paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    booking: invoice.booking
      ? {
          id: invoice.booking.id,
          status: invoice.booking.status,
          amountPaid: Number(invoice.booking.amountPaid),
          totalAmount: Number(invoice.booking.totalAmount),
          billingMetadata: invoice.booking.billingMetadata as Record<string, unknown> | null,
          site: invoice.booking.site
            ? {
                id: invoice.booking.site.id,
                name: invoice.booking.site.name,
              }
            : null,
          unitType: invoice.booking.unitType
            ? {
                id: invoice.booking.unitType.id,
                name: invoice.booking.unitType.name,
              }
            : null,
        }
      : null,
    payment: invoice.payment
      ? {
          id: invoice.payment.id,
          provider: invoice.payment.provider,
          providerReference: invoice.payment.providerReference,
          amount: Number(invoice.payment.amount),
          currency: invoice.payment.currency,
          status: invoice.payment.status,
          createdAt: invoice.payment.createdAt.toISOString(),
        }
      : null,
  };
}

export async function listAdminInvoices(): Promise<AdminInvoiceSummary[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('invoices')
    .select(INVOICE_RELATION_SELECT)
    .order('createdAt', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => serializeInvoice(mapInvoice(row)));
}

export async function getAdminInvoiceDetail(invoiceId: string): Promise<AdminInvoiceDetail | null> {
  const supabase = createAdminClient();

  const { data: invoiceRow, error: invoiceError } = await supabase
    .from('invoices')
    .select(INVOICE_RELATION_SELECT)
    .eq('id', invoiceId)
    .maybeSingle();

  if (invoiceError) {
    throw invoiceError;
  }

  if (!invoiceRow) {
    return null;
  }

  const invoice = mapInvoice(invoiceRow);
  const bookingId = invoice.booking?.id;

  const [{ data: paymentHistoryRows }, { data: relatedInvoiceRows }] = await Promise.all([
    bookingId
      ? supabase
          .from('payments')
          .select('*')
          .eq('bookingId', bookingId)
          .order('createdAt', { ascending: false })
      : Promise.resolve({ data: [] }),
    bookingId
      ? supabase
          .from('invoices')
          .select('*')
          .eq('bookingId', bookingId)
          .order('createdAt', { ascending: false })
      : Promise.resolve({ data: [invoiceRow] }),
  ]);

  const paymentHistory = (paymentHistoryRows ?? []).map((row) => mapPayment(row));
  const timelinePayments = [...paymentHistory];

  if (invoice.payment && !timelinePayments.some((payment) => payment.id === invoice.payment?.id)) {
    timelinePayments.unshift(invoice.payment);
  }

  return {
    ...serializeInvoice(invoice),
    items: (invoice.items || []).map((item) => ({
      description: item.description,
      qty: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
    paymentHistory: timelinePayments.map((payment) => ({
      id: payment.id,
      provider: payment.provider,
      providerReference: payment.providerReference,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      billingType:
        payment.metadata && typeof payment.metadata.billingType === 'string'
          ? payment.metadata.billingType
          : null,
      paymentMode:
        payment.metadata && typeof payment.metadata.paymentMode === 'string'
          ? payment.metadata.paymentMode
          : null,
      createdAt: payment.createdAt.toISOString(),
    })),
    relatedInvoices: (relatedInvoiceRows ?? []).map((relatedInvoice) => ({
      id: relatedInvoice.id,
      invoiceNumber: relatedInvoice.invoiceNumber,
      total: Number(relatedInvoice.total),
      currency: relatedInvoice.currency,
      status: relatedInvoice.status,
      dueDate: relatedInvoice.dueDate,
      paidAt: relatedInvoice.paidAt,
      createdAt: relatedInvoice.createdAt,
    })),
  };
}
