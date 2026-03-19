'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Loader,
  Mail,
  MapPin,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface InvoiceDetailsPageProps {
  invoiceId: string;
}

interface AdminInvoiceDetail {
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
  items: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
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
    billingMetadata: {
      billingType?: 'one_time' | 'recurring';
      billingInterval?: string;
      recurringDurationMonths?: number;
    } | null;
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

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return 'Not recorded';
  }

  return new Date(value).toLocaleString();
}

export default function InvoiceDetailsPage({ invoiceId }: Readonly<InvoiceDetailsPageProps>) {
  const authStore = useAuthStore();
  const router = useRouter();
  const [invoice, setInvoice] = useState<AdminInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const fetchInvoice = useCallback(async () => {
    if (!authStore.accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to load invoice.');
      }

      setInvoice(data.invoice);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load invoice.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [authStore.accessToken, invoiceId]);

  useEffect(() => {
    void fetchInvoice();
  }, [fetchInvoice]);

  const billingLabel = useMemo(() => {
    if (!invoice?.booking?.billingMetadata?.billingType) {
      return 'One-time';
    }

    return invoice.booking.billingMetadata.billingType === 'recurring' ? 'Recurring' : 'One-time';
  }, [invoice?.booking?.billingMetadata?.billingType]);

  const handleResend = async () => {
    if (!authStore.accessToken || !invoice || resending) {
      return;
    }

    try {
      setResending(true);

      const response = await fetch(`/api/admin/invoices/${invoice.id}/resend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Invoice email could not be resent.');
      }

      toast.success('Invoice email resent successfully.');
    } catch (resendError) {
      const message = resendError instanceof Error ? resendError.message : 'Invoice email could not be resent.';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push('/admin/invoices')}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </button>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Invoice not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => router.push('/admin/invoices')}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to invoices
          </button>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Invoice detail
            </p>
            <h1 className="mt-2 text-3xl font-black text-gray-900">
              {invoice.invoiceNumber}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Review billing context, resend the invoice email, and inspect the payment timeline attached to this booking.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/api/invoices/${invoice.id}/document`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9D7FF] bg-white px-5 py-3 text-sm font-bold text-[#1642F0] transition hover:border-[#AFC4FF] hover:bg-[#F5F8FF]"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1642F0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1238D4] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {resending ? <Loader className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Resend invoice email
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Total</p>
          <p className="mt-3 text-2xl font-black text-gray-900">
            {formatCurrency(invoice.total, invoice.currency)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Subtotal {formatCurrency(invoice.subtotal, invoice.currency)}{invoice.tax > 0 ? ` plus ${formatCurrency(invoice.tax, invoice.currency)} tax` : ''}
          </p>
        </div>

        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Status</p>
          <div className="mt-3 flex items-center gap-2">
            <CheckCircle2 className={`h-5 w-5 ${invoice.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`} />
            <p className="text-2xl font-black capitalize text-gray-900">{invoice.status}</p>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Paid at {invoice.paidAt ? formatDateTime(invoice.paidAt) : 'not yet recorded'}
          </p>
        </div>

        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Customer</p>
          <p className="mt-3 text-lg font-black text-gray-900">
            {invoice.user.firstName} {invoice.user.lastName}
          </p>
          <p className="mt-2 text-sm text-gray-500">{invoice.user.email}</p>
        </div>

        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Booking</p>
          <p className="mt-3 text-lg font-black text-gray-900">{billingLabel}</p>
          <p className="mt-2 text-sm text-gray-500">
            {invoice.booking?.site?.name || 'No site attached'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDF3FF] text-[#1642F0]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Line items</p>
                <h2 className="text-xl font-black text-gray-900">Invoice breakdown</h2>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-black uppercase tracking-[0.24em] text-gray-400">
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3">Unit price</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((item, index) => (
                    <tr key={`${item.description}-${index}`}>
                      <td className="py-4 pr-4 text-sm text-gray-700">{item.description}</td>
                      <td className="py-4 text-sm text-gray-700">{item.qty}</td>
                      <td className="py-4 text-sm text-gray-700">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                      <td className="py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(item.total, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDF3FF] text-[#1642F0]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Payment groundwork</p>
                <h2 className="text-xl font-black text-gray-900">Payment timeline</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {invoice.paymentHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                  No payments are attached to this booking yet.
                </div>
              ) : (
                invoice.paymentHistory.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-gray-200 bg-[#FAFBFF] px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5D74B0]">
                          {payment.provider} payment
                        </p>
                        <p className="mt-2 text-base font-bold text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Reference: {payment.providerReference}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm text-gray-500 md:text-right">
                        <p className="font-semibold capitalize text-gray-900">{payment.status}</p>
                        <p>{formatDateTime(payment.createdAt)}</p>
                        <p>
                          {payment.billingType ? `${payment.billingType} billing` : 'Billing type pending'}
                          {payment.paymentMode ? ` • ${payment.paymentMode}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDF3FF] text-[#1642F0]">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">Related invoices</p>
                <h2 className="text-xl font-black text-gray-900">Booking invoice history</h2>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-black uppercase tracking-[0.24em] text-gray-400">
                    <th className="pb-3">Invoice</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.relatedInvoices.map((relatedInvoice) => (
                    <tr key={relatedInvoice.id}>
                      <td className="py-4 pr-4">
                        {relatedInvoice.id === invoice.id ? (
                          <span className="font-bold text-gray-900">{relatedInvoice.invoiceNumber}</span>
                        ) : (
                          <Link href={`/admin/invoices/${relatedInvoice.id}`} className="font-bold text-[#1642F0] hover:text-[#1238D4]">
                            {relatedInvoice.invoiceNumber}
                          </Link>
                        )}
                      </td>
                      <td className="py-4 text-sm text-gray-600">{new Date(relatedInvoice.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-sm capitalize text-gray-600">{relatedInvoice.status}</td>
                      <td className="py-4 text-right text-sm font-bold text-gray-900">
                        {formatCurrency(relatedInvoice.total, relatedInvoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Booking context
            </p>
            <div className="mt-4 space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#1642F0]" />
                <div>
                  <p className="font-semibold text-gray-900">Storage site</p>
                  <p>{invoice.booking?.site?.name || 'No site attached'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-[#1642F0]" />
                <div>
                  <p className="font-semibold text-gray-900">Unit type</p>
                  <p>{invoice.booking?.unitType?.name || 'Not captured yet'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-[#1642F0]" />
                <div>
                  <p className="font-semibold text-gray-900">Invoice lifecycle</p>
                  <p>Created {formatDateTime(invoice.createdAt)}</p>
                  <p className="mt-1">Due {formatDateTime(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Operational snapshot
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-900">Booking status:</span> {invoice.booking?.status || 'Not linked'}</p>
              <p><span className="font-semibold text-gray-900">Booking paid:</span> {invoice.booking ? formatCurrency(invoice.booking.amountPaid, invoice.currency) : 'Not linked'}</p>
              <p><span className="font-semibold text-gray-900">Booking total:</span> {invoice.booking ? formatCurrency(invoice.booking.totalAmount, invoice.currency) : 'Not linked'}</p>
              <p><span className="font-semibold text-gray-900">Billing type:</span> {billingLabel}</p>
              <p><span className="font-semibold text-gray-900">Primary payment ref:</span> {invoice.payment?.providerReference || 'No payment attached'}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
