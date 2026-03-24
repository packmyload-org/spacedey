import { connectTypeORM } from '@/lib/db';
import Invoice from '@/lib/db/entities/Invoice';
import Payment from '@/lib/db/entities/Payment';
import { resolveInvoiceLinkedUser } from '@/lib/services/invoiceUsers';

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
  const dataSource = await connectTypeORM();
  const invoiceRepo = dataSource.getRepository(Invoice);
  const invoices = await invoiceRepo
    .createQueryBuilder('invoice')
    .withDeleted()
    .leftJoinAndSelect('invoice.user', 'user')
    .leftJoinAndSelect('invoice.booking', 'booking')
    .leftJoinAndSelect('booking.site', 'site')
    .leftJoinAndSelect('booking.unitType', 'unitType')
    .leftJoinAndSelect('invoice.payment', 'payment')
    .orderBy('invoice.createdAt', 'DESC')
    .getMany();

  return invoices.map((invoice) => serializeInvoice(invoice));
}

export async function getAdminInvoiceDetail(invoiceId: string): Promise<AdminInvoiceDetail | null> {
  const dataSource = await connectTypeORM();
  const invoiceRepo = dataSource.getRepository(Invoice);
  const paymentRepo = dataSource.getRepository(Payment);

  const invoice = await invoiceRepo
    .createQueryBuilder('invoice')
    .withDeleted()
    .leftJoinAndSelect('invoice.user', 'user')
    .leftJoinAndSelect('invoice.booking', 'booking')
    .leftJoinAndSelect('booking.site', 'site')
    .leftJoinAndSelect('booking.unitType', 'unitType')
    .leftJoinAndSelect('invoice.payment', 'payment')
    .where('invoice.id = :invoiceId', { invoiceId })
    .getOne();

  if (!invoice) {
    return null;
  }

  const bookingId = invoice.booking?.id;
  const [paymentHistory, relatedInvoices] = await Promise.all([
    bookingId
      ? paymentRepo.find({
          where: {
            booking: { id: bookingId },
          },
          order: {
            createdAt: 'DESC',
          },
        })
      : [],
    bookingId
      ? invoiceRepo
          .createQueryBuilder('invoice')
          .withDeleted()
          .leftJoin('invoice.booking', 'booking')
          .where('booking.id = :bookingId', { bookingId })
          .orderBy('invoice.createdAt', 'DESC')
          .getMany()
      : [invoice],
  ]);
  const timelinePayments = [...paymentHistory];

  if (invoice.payment && !timelinePayments.some((payment) => payment.id === invoice.payment.id)) {
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
    relatedInvoices: relatedInvoices.map((relatedInvoice) => ({
      id: relatedInvoice.id,
      invoiceNumber: relatedInvoice.invoiceNumber,
      total: Number(relatedInvoice.total),
      currency: relatedInvoice.currency,
      status: relatedInvoice.status,
      dueDate: relatedInvoice.dueDate.toISOString(),
      paidAt: relatedInvoice.paidAt ? relatedInvoice.paidAt.toISOString() : null,
      createdAt: relatedInvoice.createdAt.toISOString(),
    })),
  };
}
