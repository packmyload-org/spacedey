export const NAIRA_PER_SQUARE_FOOT_PER_MONTH = 3000;
export const PAY_ONCE_MONTHS = 12;
const SQUARE_FEET_PER_SQUARE_METER = 10.7639;

interface StorageDimensions {
  width: number;
  depth: number;
  unit?: string;
}

interface CheckoutPricingInput extends StorageDimensions {
  registrationFee?: number;
  annualDues?: number;
  payOnceMonths?: number;
}

function normalizeNumber(value: number) {
  return Number.isFinite(value) ? Number(value) : 0;
}

export function calculateStorageAreaSquareFeet({ width, depth, unit }: StorageDimensions): number {
  const normalizedWidth = normalizeNumber(width);
  const normalizedDepth = normalizeNumber(depth);
  const rawArea = normalizedWidth * normalizedDepth;
  const normalizedUnit = unit?.trim().toLowerCase();

  if (!normalizedUnit || normalizedUnit === 'ft' || normalizedUnit === 'feet' || normalizedUnit === 'foot') {
    return rawArea;
  }

  if (normalizedUnit === 'm' || normalizedUnit === 'meter' || normalizedUnit === 'meters') {
    return rawArea * SQUARE_FEET_PER_SQUARE_METER;
  }

  return rawArea;
}

export function calculateMonthlyStorageRate(dimensions: StorageDimensions): number {
  const areaInSquareFeet = calculateStorageAreaSquareFeet(dimensions);
  return Math.round(areaInSquareFeet * NAIRA_PER_SQUARE_FOOT_PER_MONTH);
}

export function calculateCheckoutPricing({
  width,
  depth,
  unit,
  registrationFee = 0,
  annualDues = 0,
  payOnceMonths = PAY_ONCE_MONTHS,
}: CheckoutPricingInput) {
  const monthlyRate = calculateMonthlyStorageRate({ width, depth, unit });
  const squareFootage = calculateStorageAreaSquareFeet({ width, depth, unit });
  const dueTodayForMonthlyPlan = normalizeNumber(registrationFee) + normalizeNumber(annualDues) + monthlyRate;
  const dueTodayForPayOncePlan = normalizeNumber(registrationFee) + normalizeNumber(annualDues) + (monthlyRate * payOnceMonths);

  return {
    monthlyRate,
    squareFootage,
    dueTodayForMonthlyPlan,
    dueTodayForPayOncePlan,
    payOnceMonths,
  };
}
