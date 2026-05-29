import { createAdminClient } from '@/lib/supabase/admin';
import Invoice from '@/lib/db/entities/Invoice';
import { INVOICE_RELATION_SELECT, mapInvoice } from '@/lib/db/mappers';
import type { InvoiceLineItem } from '@/lib/db/entities/Invoice';
import { resolveInvoiceLinkedUser } from '@/lib/services/invoiceUsers';

const PAGE_WIDTH = 595.28;
const DEFAULT_PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 40;
export interface InvoiceDocumentData {
  id: string;
  invoiceNumber: string;
  currency: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  dueDate: string;
  paidAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  booking: {
    status: string;
    startDate: string;
    siteName: string;
    unitTypeName: string;
    billingType: 'one_time' | 'recurring';
    billingInterval: string | null;
  } | null;
  payment: {
    provider: string;
    providerReference: string;
    status: string;
    createdAt: string;
    paymentMode: string | null;
  } | null;
  items: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function formatCurrency(amount: number, currency: string) {
  const normalizedCurrency = currency.toUpperCase();
  const formattedAmount = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${normalizedCurrency} ${formattedAmount}`;
}

function formatDate(value: string | null, fallback = 'Not recorded') {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function titleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function drawFilledRect(
  x: number,
  top: number,
  width: number,
  height: number,
  color: [number, number, number],
  pageHeight = DEFAULT_PAGE_HEIGHT
) {
  const [r, g, b] = color;
  const y = pageHeight - top - height;
  return `${r} ${g} ${b} rg ${x} ${y} ${width} ${height} re f`;
}

function drawStrokedRect(
  x: number,
  top: number,
  width: number,
  height: number,
  color: [number, number, number],
  lineWidth = 1,
  pageHeight = DEFAULT_PAGE_HEIGHT
) {
  const [r, g, b] = color;
  const y = pageHeight - top - height;
  return `${lineWidth} w ${r} ${g} ${b} RG ${x} ${y} ${width} ${height} re S`;
}

function drawText(
  text: string,
  x: number,
  top: number,
  fontSize: number,
  font: 'F1' | 'F2',
  color: [number, number, number],
  pageHeight = DEFAULT_PAGE_HEIGHT
) {
  const [r, g, b] = color;
  const baseline = pageHeight - top - fontSize;
  return `BT /${font} ${fontSize} Tf ${r} ${g} ${b} rg 1 0 0 1 ${x} ${baseline} Tm (${escapePdfText(
    normalizeWhitespace(text)
  )}) Tj ET`;
}

function drawRule(
  x: number,
  top: number,
  width: number,
  color: [number, number, number],
  lineWidth = 1,
  pageHeight = DEFAULT_PAGE_HEIGHT
) {
  const [r, g, b] = color;
  const y = pageHeight - top;
  return `${lineWidth} w ${r} ${g} ${b} RG ${x} ${y} m ${x + width} ${y} l S`;
}

function wrapText(text: string, maxCharsPerLine: number) {
  const words = normalizeWhitespace(text).split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length <= maxCharsPerLine) {
      current = word;
      continue;
    }

    let remaining = word;
    while (remaining.length > maxCharsPerLine) {
      lines.push(remaining.slice(0, maxCharsPerLine - 1) + '-');
      remaining = remaining.slice(maxCharsPerLine - 1);
    }
    current = remaining;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [''];
}

function fitWrappedLines(text: string, maxCharsPerLine: number, maxLines: number) {
  const lines = wrapText(text, maxCharsPerLine);
  if (lines.length <= maxLines) {
    return lines;
  }

  const trimmed = lines.slice(0, maxLines);
  const lastLine = trimmed[maxLines - 1] || '';
  const ellipsis = '...';
  const shortened = lastLine.slice(0, Math.max(1, maxCharsPerLine - ellipsis.length)).trimEnd();
  trimmed[maxLines - 1] = `${shortened}${ellipsis}`;
  return trimmed;
}

function drawTextBlock(args: {
  text: string;
  x: number;
  top: number;
  fontSize: number;
  font: 'F1' | 'F2';
  color: [number, number, number];
  maxCharsPerLine: number;
  maxLines: number;
  lineHeight?: number;
  pageHeight?: number;
}) {
  const lines = fitWrappedLines(args.text, args.maxCharsPerLine, args.maxLines);
  const lineHeight = args.lineHeight ?? args.fontSize + 2;

  return lines.map((line, index) =>
    drawText(
      line,
      args.x,
      args.top + index * lineHeight,
      args.fontSize,
      args.font,
      args.color,
      args.pageHeight
    )
  );
}

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function serializeItems(items: InvoiceLineItem[] | null | undefined) {
  return (items || []).map((item) => ({
    description: item.description,
    qty: Number(item.qty),
    unitPrice: Number(item.unitPrice),
    total: Number(item.total),
  }));
}

function serializeInvoiceDocument(invoice: Invoice): InvoiceDocumentData {
  const bookingMetadata = invoice.booking?.billingMetadata;
  const user = resolveInvoiceLinkedUser(invoice.user);

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    currency: invoice.currency,
    status: invoice.status,
    subtotal: Number(invoice.subtotal),
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    createdAt: invoice.createdAt.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    booking: invoice.booking
      ? {
          status: invoice.booking.status,
          startDate: invoice.booking.startDate.toISOString(),
          siteName: invoice.booking.site?.name || 'Spacedey storage location',
          unitTypeName: invoice.booking.unitType?.name || 'Storage unit',
          billingType: bookingMetadata?.billingType === 'recurring' ? 'recurring' : 'one_time',
          billingInterval:
            typeof bookingMetadata?.billingInterval === 'string'
              ? bookingMetadata.billingInterval
              : null,
        }
      : null,
    payment: invoice.payment
      ? {
          provider: invoice.payment.provider,
          providerReference: invoice.payment.providerReference,
          status: invoice.payment.status,
          createdAt: invoice.payment.createdAt.toISOString(),
          paymentMode:
            invoice.payment.metadata && typeof invoice.payment.metadata.paymentMode === 'string'
              ? invoice.payment.metadata.paymentMode
              : null,
        }
      : null,
    items: serializeItems(invoice.items),
  };
}

async function getInvoiceDocumentRecord(where: {
  id: string;
  user?: {
    id: string;
  };
}) {
  const supabase = createAdminClient();
  let query = supabase
    .from('invoices')
    .select(INVOICE_RELATION_SELECT)
    .eq('id', where.id);

  if (where.user?.id) {
    query = query.eq('userId', where.user.id);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapInvoice(data) : null;
}

export async function getInvoiceDocumentForUser(userId: string, invoiceId: string) {
  const invoice = await getInvoiceDocumentRecord({
    id: invoiceId,
    user: { id: userId },
  });

  return invoice ? serializeInvoiceDocument(invoice) : null;
}

export async function getInvoiceDocumentForAdmin(invoiceId: string) {
  const invoice = await getInvoiceDocumentRecord({
    id: invoiceId,
  });

  return invoice ? serializeInvoiceDocument(invoice) : null;
}

export function getInvoiceDocumentFilename(invoiceNumber: string) {
  const normalizedNumber = invoiceNumber.trim().toLowerCase();
  const timestampMatch = normalizedNumber.match(/^inv-\d{4}-(\d+)/i);

  if (timestampMatch?.[1]) {
    return `invoice-${timestampMatch[1]}.pdf`;
  }

  return `${sanitizeFilename(normalizedNumber) || 'invoice'}.pdf`;
}

export async function generateInvoicePdf(document: InvoiceDocumentData) {
  const customerName = `${document.user.firstName} ${document.user.lastName}`.trim() || 'Spacedey customer';
  const billingLabel = document.booking?.billingType === 'recurring' ? 'Recurring billing' : 'One-time payment';
  const paymentStatus = document.paidAt ? 'Paid' : titleCase(document.status);
  const paymentReference = document.payment?.providerReference || 'Pending payment reference';
  const providerName = document.payment?.provider ? titleCase(document.payment.provider) : 'Payment provider';
  const itemDescriptionWidth = 33;
  const billingIntervalLabel = document.booking?.billingInterval
    ? titleCase(document.booking.billingInterval)
    : 'Not set';
  const moveInDateLabel = formatDate(document.booking?.startDate || null);
  const tableTop = 498;
  const col1 = PAGE_MARGIN;
  const col2 = 330;
  const col3 = 390;
  const col4 = 470;
  const itemRows = document.items.map((item) => ({
    ...item,
    descriptionLines: fitWrappedLines(item.description, itemDescriptionWidth, 4),
  }));
  const tableRowsHeight = itemRows.reduce(
    (total, item) => total + Math.max(34, item.descriptionLines.length * 14 + 18),
    0
  );
  const totalsTop = tableTop + 34 + tableRowsHeight + 20;
  const footerTop = Math.max(744, totalsTop + 76);
  const pageHeight = Math.max(DEFAULT_PAGE_HEIGHT, footerTop + 92);

  const commands: string[] = [];

  commands.push(drawFilledRect(0, 0, PAGE_WIDTH, 104, [0.086, 0.259, 0.941], pageHeight));
  commands.push(drawText('SPACEDEY', PAGE_MARGIN, 28, 17, 'F2', [1, 1, 1], pageHeight));
  commands.push(drawText('Storage invoice', PAGE_MARGIN, 52, 28, 'F2', [1, 1, 1], pageHeight));
  commands.push(
    drawText(
      'A downloadable billing record for your storage booking.',
      PAGE_MARGIN,
      84,
      11,
      'F1',
      [0.9, 0.94, 1],
      pageHeight
    )
  );

  commands.push(
    ...drawTextBlock({
      text: document.invoiceNumber,
      x: 390,
      top: 30,
      fontSize: 13,
      font: 'F2',
      color: [1, 1, 1],
      maxCharsPerLine: 22,
      maxLines: 2,
      lineHeight: 14,
      pageHeight,
    })
  );
  commands.push(drawText(`Issued ${formatDate(document.createdAt)}`, 390, 60, 10, 'F1', [0.92, 0.96, 1], pageHeight));
  commands.push(drawText(`Due ${formatDate(document.dueDate)}`, 390, 78, 10, 'F1', [0.92, 0.96, 1], pageHeight));
  commands.push(drawText(paymentStatus, 390, 92, 10, 'F2', [1, 1, 1], pageHeight));

  commands.push(drawFilledRect(PAGE_MARGIN, 130, 310, 174, [0.973, 0.984, 1], pageHeight));
  commands.push(drawStrokedRect(PAGE_MARGIN, 130, 310, 174, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Bill to', PAGE_MARGIN + 20, 148, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: customerName,
      x: PAGE_MARGIN + 20,
      top: 170,
      fontSize: 18,
      font: 'F2',
      color: [0.102, 0.118, 0.18],
      maxCharsPerLine: 26,
      maxLines: 2,
      lineHeight: 18,
      pageHeight,
    })
  );
  commands.push(
    ...drawTextBlock({
      text: document.user.email,
      x: PAGE_MARGIN + 20,
      top: 210,
      fontSize: 10,
      font: 'F1',
      color: [0.31, 0.36, 0.46],
      maxCharsPerLine: 38,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );
  if (document.user.phone) {
    commands.push(
      ...drawTextBlock({
        text: document.user.phone,
        x: PAGE_MARGIN + 20,
        top: 234,
        fontSize: 10,
        font: 'F1',
        color: [0.31, 0.36, 0.46],
        maxCharsPerLine: 26,
        maxLines: 1,
        lineHeight: 12,
        pageHeight,
      })
    );
  }
  commands.push(drawRule(PAGE_MARGIN + 20, 252, 270, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Storage site', PAGE_MARGIN + 20, 268, 9, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: document.booking?.siteName || 'Spacedey storage',
      x: PAGE_MARGIN + 20,
      top: 284,
      fontSize: 11,
      font: 'F1',
      color: [0.1, 0.13, 0.19],
      maxCharsPerLine: 18,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );
  commands.push(drawText('Unit type', PAGE_MARGIN + 160, 268, 9, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: document.booking?.unitTypeName || 'Storage booking',
      x: PAGE_MARGIN + 160,
      top: 284,
      fontSize: 11,
      font: 'F1',
      color: [0.1, 0.13, 0.19],
      maxCharsPerLine: 18,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );

  commands.push(drawFilledRect(370, 130, 185, 174, [0.988, 0.991, 0.996], pageHeight));
  commands.push(drawStrokedRect(370, 130, 185, 174, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Billing summary', 388, 148, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(drawRule(388, 166, 149, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Charge type', 388, 184, 9, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: billingLabel,
      x: 388,
      top: 200,
      fontSize: 11,
      font: 'F1',
      color: [0.1, 0.13, 0.19],
      maxCharsPerLine: 20,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );
  commands.push(drawText('Billing interval', 388, 228, 9, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: billingIntervalLabel,
      x: 388,
      top: 244,
      fontSize: 11,
      font: 'F1',
      color: [0.1, 0.13, 0.19],
      maxCharsPerLine: 20,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );
  commands.push(drawText('Move-in date', 388, 272, 9, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: moveInDateLabel,
      x: 388,
      top: 288,
      fontSize: 11,
      font: 'F1',
      color: [0.1, 0.13, 0.19],
      maxCharsPerLine: 20,
      maxLines: 1,
      lineHeight: 12,
      pageHeight,
    })
  );

  commands.push(drawFilledRect(PAGE_MARGIN, 314, 165, 102, [1, 1, 1], pageHeight));
  commands.push(drawStrokedRect(PAGE_MARGIN, 314, 165, 102, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Total', PAGE_MARGIN + 16, 332, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: formatCurrency(document.total, document.currency),
      x: PAGE_MARGIN + 16,
      top: 352,
      fontSize: 18,
      font: 'F2',
      color: [0.09, 0.14, 0.25],
      maxCharsPerLine: 16,
      maxLines: 2,
      lineHeight: 18,
      pageHeight,
    })
  );
  commands.push(
    ...drawTextBlock({
      text: `Subtotal ${formatCurrency(document.subtotal, document.currency)}`,
      x: PAGE_MARGIN + 16,
      top: 385,
      fontSize: 9,
      font: 'F1',
      color: [0.4, 0.46, 0.58],
      maxCharsPerLine: 24,
      maxLines: 2,
      lineHeight: 11,
      pageHeight,
    })
  );

  commands.push(drawFilledRect(PAGE_MARGIN + 175, 314, 165, 102, [1, 1, 1], pageHeight));
  commands.push(drawStrokedRect(PAGE_MARGIN + 175, 314, 165, 102, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Payment status', PAGE_MARGIN + 191, 332, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(drawText(paymentStatus, PAGE_MARGIN + 191, 354, 18, 'F2', [0.07, 0.44, 0.26], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: `Reference ${paymentReference}`,
      x: PAGE_MARGIN + 191,
      top: 381,
      fontSize: 9,
      font: 'F1',
      color: [0.4, 0.46, 0.58],
      maxCharsPerLine: 24,
      maxLines: 2,
      lineHeight: 11,
      pageHeight,
    })
  );

  commands.push(drawFilledRect(PAGE_MARGIN + 350, 314, 165, 102, [1, 1, 1], pageHeight));
  commands.push(drawStrokedRect(PAGE_MARGIN + 350, 314, 165, 102, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Billing mode', PAGE_MARGIN + 366, 332, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: billingLabel,
      x: PAGE_MARGIN + 366,
      top: 352,
      fontSize: 16,
      font: 'F2',
      color: [0.09, 0.14, 0.25],
      maxCharsPerLine: 16,
      maxLines: 2,
      lineHeight: 16,
      pageHeight,
    })
  );
  commands.push(
    ...drawTextBlock({
      text: document.booking?.billingInterval ? `Interval ${document.booking.billingInterval}` : providerName,
      x: PAGE_MARGIN + 366,
      top: 384,
      fontSize: 9,
      font: 'F1',
      color: [0.4, 0.46, 0.58],
      maxCharsPerLine: 24,
      maxLines: 2,
      lineHeight: 11,
      pageHeight,
    })
  );

  commands.push(drawText('Invoice breakdown', PAGE_MARGIN, 446, 18, 'F2', [0.09, 0.14, 0.25], pageHeight));
  commands.push(
    ...drawTextBlock({
      text: 'This document captures the charge lines, booking context, and payment details linked to your Spacedey storage order.',
      x: PAGE_MARGIN,
      top: 470,
      fontSize: 10,
      font: 'F1',
      color: [0.4, 0.46, 0.58],
      maxCharsPerLine: 86,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );

  commands.push(drawFilledRect(PAGE_MARGIN, tableTop, PAGE_WIDTH - PAGE_MARGIN * 2, 34, [0.973, 0.984, 1], pageHeight));
  commands.push(drawStrokedRect(PAGE_MARGIN, tableTop, PAGE_WIDTH - PAGE_MARGIN * 2, 34, [0.89, 0.92, 0.98], 1, pageHeight));
  commands.push(drawText('Description', col1 + 12, tableTop + 10, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(drawText('Qty', col2 + 6, tableTop + 10, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(drawText('Unit price', col3 + 6, tableTop + 10, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));
  commands.push(drawText('Total', col4 + 20, tableTop + 10, 10, 'F2', [0.365, 0.455, 0.69], pageHeight));

  let currentTop = tableTop + 34;
  for (const item of itemRows) {
    const rowHeight = Math.max(34, item.descriptionLines.length * 14 + 18);
    commands.push(
      drawStrokedRect(PAGE_MARGIN, currentTop, PAGE_WIDTH - PAGE_MARGIN * 2, rowHeight, [0.92, 0.94, 0.97], 1, pageHeight)
    );

    item.descriptionLines.forEach((line, index) => {
      commands.push(drawText(line, col1 + 12, currentTop + 10 + index * 14, 10, 'F1', [0.16, 0.2, 0.29], pageHeight));
    });
    commands.push(drawText(String(item.qty), col2 + 10, currentTop + 10, 10, 'F1', [0.16, 0.2, 0.29], pageHeight));
    commands.push(
      drawText(formatCurrency(item.unitPrice, document.currency), col3 + 6, currentTop + 10, 10, 'F1', [0.16, 0.2, 0.29], pageHeight)
    );
    commands.push(
      drawText(formatCurrency(item.total, document.currency), col4 + 6, currentTop + 10, 10, 'F2', [0.09, 0.14, 0.25], pageHeight)
    );
    currentTop += rowHeight;
  }

  commands.push(drawText('Subtotal', 380, totalsTop, 10, 'F1', [0.31, 0.36, 0.46], pageHeight));
  commands.push(drawText(formatCurrency(document.subtotal, document.currency), 470, totalsTop, 10, 'F2', [0.09, 0.14, 0.25], pageHeight));
  commands.push(drawText('Tax', 380, totalsTop + 18, 10, 'F1', [0.31, 0.36, 0.46], pageHeight));
  commands.push(drawText(formatCurrency(document.tax, document.currency), 470, totalsTop + 18, 10, 'F2', [0.09, 0.14, 0.25], pageHeight));
  commands.push(drawRule(380, totalsTop + 42, 120, [0.82, 0.86, 0.93], 1, pageHeight));
  commands.push(drawText('Grand total', 380, totalsTop + 50, 11, 'F2', [0.09, 0.14, 0.25], pageHeight));
  commands.push(drawText(formatCurrency(document.total, document.currency), 455, totalsTop + 48, 14, 'F2', [0.086, 0.259, 0.941], pageHeight));

  commands.push(drawRule(PAGE_MARGIN, footerTop, PAGE_WIDTH - PAGE_MARGIN * 2, [0.82, 0.86, 0.93], 1, pageHeight));
  commands.push(
    ...drawTextBlock({
      text: `Booking status: ${titleCase(document.booking?.status || 'pending')} | Move-in date: ${formatDate(
        document.booking?.startDate || null
      )}`,
      x: PAGE_MARGIN,
      top: footerTop + 12,
      fontSize: 10,
      font: 'F1',
      color: [0.31, 0.36, 0.46],
      maxCharsPerLine: 78,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );
  commands.push(
    ...drawTextBlock({
      text: `Payment recorded ${formatDate(document.payment?.createdAt || document.paidAt)} with ${providerName}.`,
      x: PAGE_MARGIN,
      top: footerTop + 36,
      fontSize: 10,
      font: 'F1',
      color: [0.31, 0.36, 0.46],
      maxCharsPerLine: 78,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );
  commands.push(
    ...drawTextBlock({
      text: 'Need help with this invoice? Reply to your billing email or contact support through Spacedey.',
      x: PAGE_MARGIN,
      top: footerTop + 60,
      fontSize: 10,
      font: 'F1',
      color: [0.31, 0.36, 0.46],
      maxCharsPerLine: 78,
      maxLines: 2,
      lineHeight: 12,
      pageHeight,
    })
  );

  const contentStream = commands.join('\n');
  const contentBuffer = Buffer.from(contentStream, 'utf8');
  const objects: Buffer[] = [];

  objects.push(Buffer.from('<< /Type /Catalog /Pages 2 0 R >>', 'utf8'));
  objects.push(Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>', 'utf8'));

  const pageResources = '<< /Font << /F1 4 0 R /F2 5 0 R >> >>';
  const contentObjectId = 6;
  objects.push(
    Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${pageHeight}] /Resources ${pageResources} /Contents ${contentObjectId} 0 R >>`,
      'utf8'
    )
  );
  objects.push(Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', 'utf8'));
  objects.push(Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>', 'utf8'));

  objects.push(
    Buffer.concat([
      Buffer.from(`<< /Length ${contentBuffer.length} >>\nstream\n`, 'utf8'),
      contentBuffer,
      Buffer.from('\nendstream', 'utf8'),
    ])
  );

  const header = Buffer.from('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n', 'binary');
  const chunks: Buffer[] = [header];
  const offsets: number[] = [];
  let offset = header.length;

  objects.forEach((object, index) => {
    offsets.push(offset);
    const prefix = Buffer.from(`${index + 1} 0 obj\n`, 'utf8');
    const suffix = Buffer.from('\nendobj\n', 'utf8');
    chunks.push(prefix, object, suffix);
    offset += prefix.length + object.length + suffix.length;
  });

  const xrefStart = offset;
  const xrefEntries = ['0000000000 65535 f ']
    .concat(offsets.map((value) => `${value.toString().padStart(10, '0')} 00000 n `))
    .join('\n');
  const xref = Buffer.from(`xref\n0 ${objects.length + 1}\n${xrefEntries}\n`, 'utf8');
  const trailer = Buffer.from(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`,
    'utf8'
  );
  chunks.push(xref, trailer);

  return Buffer.concat(chunks);
}
