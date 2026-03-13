export type BillingType = "one_time" | "recurring";

export const MIN_RECURRING_DURATION_MONTHS = 2;
export const MAX_RECURRING_DURATION_MONTHS = 24;
export const DEFAULT_RECURRING_DURATION_MONTHS = 6;

export function normalizeRecurringDurationMonths(value: unknown): number | null {
  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue)) {
    return null;
  }

  const roundedValue = Math.round(normalizedValue);
  if (roundedValue < MIN_RECURRING_DURATION_MONTHS || roundedValue > MAX_RECURRING_DURATION_MONTHS) {
    return null;
  }

  return roundedValue;
}

export function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export function getRecurringEndDate(startDate: Date, durationMonths: number): Date {
  return addMonths(startDate, durationMonths);
}

export function isRecurringBilling(args: {
  billingType?: unknown;
  legacyPaymentMode?: unknown;
  provider?: unknown;
}) {
  if (args.billingType === "recurring") {
    return true;
  }

  return args.provider === "paystack" && args.legacyPaymentMode === "monthly";
}
