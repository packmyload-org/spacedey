import type { Booking } from './Booking';
import type { User } from './User';

export interface PaymentBookingAllocation {
  bookingId: string;
  amount: number;
}

export enum PaymentBillingType {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export interface PaymentMetadata {
  data?: {
    id?: string | number;
    [key: string]: unknown;
  };
  verification?: unknown;
  bookingIds?: string[];
  bookingAllocations?: PaymentBookingAllocation[];
  checkoutSource?: 'cart' | 'direct' | 'bookings' | 'recurring';
  paymentMode?: 'monthly' | 'full';
  billingType?: PaymentBillingType;
  billingInterval?: 'monthly';
  monthsCovered?: number;
  recurringDurationMonths?: number;
  recurringEndsAt?: string | null;
  paystackPlanCode?: string;
  paystackPlanName?: string;
  flutterwavePaymentPlanId?: number | string;
  flutterwavePaymentPlanName?: string;
  [key: string]: unknown;
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum PaymentProvider {
  PAYSTACK = 'paystack',
  FLUTTERWAVE = 'flutterwave',
}

export class Payment {
  id!: string;
  booking?: Booking;
  bookingId?: string | null;
  user?: User;
  userId?: string | null;
  provider!: PaymentProvider;
  providerReference!: string;
  amount!: number;
  currency!: string;
  status!: PaymentStatus;
  metadata!: PaymentMetadata | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Payment;
