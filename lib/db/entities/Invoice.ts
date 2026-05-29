import type { Booking } from './Booking';
import type { User } from './User';
import type { Payment } from './Payment';

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export class Invoice {
  id!: string;
  invoiceNumber!: string;
  booking?: Booking;
  bookingId?: string | null;
  user?: User;
  userId?: string | null;
  payment?: Payment;
  paymentId?: string | null;
  items!: InvoiceLineItem[];
  subtotal!: number;
  tax!: number;
  total!: number;
  currency!: string;
  status!: InvoiceStatus;
  dueDate!: Date;
  paidAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Invoice;
