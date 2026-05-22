import type { User } from './User';
import type { Site } from './Site';
import type { UnitType } from './UnitType';
import type { StorageUnit } from './StorageUnit';

export type BookingBillingType = 'one_time' | 'recurring';

export enum BookingStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface BookingBillingMetadata {
  billingType?: BookingBillingType;
  billingInterval?: 'monthly';
  recurringDurationMonths?: number;
  recurringEndDate?: string | null;
  pendingPaymentReference?: string;
  pendingPaymentInitializedAt?: string | null;
  paystack?: {
    allocationAmount?: number;
    authorizationCode?: string;
    authorizationSignature?: string;
    authorizationReusable?: boolean;
    customerCode?: string;
    customerEmail?: string;
    lastSuccessfulReference?: string;
    planCode?: string;
    planName?: string;
    subscriptionCode?: string;
    invoiceLimit?: number;
  };
  flutterwave?: {
    allocationAmount?: number;
    customerEmail?: string;
    lastSuccessfulReference?: string;
    paymentPlanId?: number | string;
    paymentPlanName?: string;
    subscriptionId?: number | string;
  };
  [key: string]: unknown;
}

export class Booking {
  id!: string;
  user?: User;
  userId?: string | null;
  site?: Site;
  siteId?: string | null;
  unitType?: UnitType;
  unitTypeId?: string | null;
  storageUnit?: StorageUnit | null;
  storageUnitId?: string | null;
  status!: BookingStatus;
  startDate!: Date;
  endDate!: Date | null;
  monthlyRate!: number;
  registrationFee!: number;
  annualDues!: number;
  amountPaid!: number;
  totalAmount!: number;
  currency!: string;
  billingMetadata!: BookingBillingMetadata | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Booking;
