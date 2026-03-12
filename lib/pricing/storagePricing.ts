export const NAIRA_PER_SQUARE_FOOT_PER_MONTH = 3000;
export const PAY_ONCE_MONTHS = 12;
const SQUARE_FEET_PER_SQUARE_METER = 10.7639;

interface StorageDimensions {
  width: number;
  depth: number;
  unit?: string;
}

interface CheckoutPricingInput extends StorageDimensions {
  payOnceMonths?: number;
}

function normalizeNumber(value: number) {
  return Number.isFinite(value) ? Number(value) : 0;
}

function formatDimensionNumber(value: number) {
  const normalizedValue = normalizeNumber(value);
  return Number.isInteger(normalizedValue)
    ? normalizedValue.toLocaleString()
    : normalizedValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function normalizeDimensionUnit(unit?: string) {
  return unit?.trim().toLowerCase();
}

function formatDimensionWithUnit(value: number, unit?: string) {
  const normalizedUnit = normalizeDimensionUnit(unit);
  const formattedValue = formatDimensionNumber(value);

  if (!normalizedUnit || normalizedUnit === 'ft' || normalizedUnit === 'feet' || normalizedUnit === 'foot') {
    return `${formattedValue}'`;
  }

  if (normalizedUnit === 'm' || normalizedUnit === 'meter' || normalizedUnit === 'meters') {
    return `${formattedValue} m`;
  }

  return `${formattedValue} ${unit}`;
}

export function calculateStorageAreaSquareFeet({ width, depth, unit }: StorageDimensions): number {
  const normalizedWidth = normalizeNumber(width);
  const normalizedDepth = normalizeNumber(depth);
  const rawArea = normalizedWidth * normalizedDepth;
  const normalizedUnit = normalizeDimensionUnit(unit);

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

export function formatSquareFeet(value: number): string {
  return `${normalizeNumber(value).toLocaleString()} ft²`;
}

export function formatStorageUnitLabel(dimensions: StorageDimensions): string {
  const widthLabel = formatDimensionWithUnit(dimensions.width, dimensions.unit);
  const depthLabel = formatDimensionWithUnit(dimensions.depth, dimensions.unit);
  const areaLabel = formatSquareFeet(calculateStorageAreaSquareFeet(dimensions));

  return `${widthLabel} × ${depthLabel} • ${areaLabel}`;
}

export function calculateCheckoutPricing({
  width,
  depth,
  unit,
  payOnceMonths = PAY_ONCE_MONTHS,
}: CheckoutPricingInput) {
  const monthlyRate = calculateMonthlyStorageRate({ width, depth, unit });
  const squareFootage = calculateStorageAreaSquareFeet({ width, depth, unit });
  const dueTodayForMonthlyPlan = monthlyRate;
  const dueTodayForPayOncePlan = monthlyRate * payOnceMonths;

  return {
    monthlyRate,
    squareFootage,
    dueTodayForMonthlyPlan,
    dueTodayForPayOncePlan,
    payOnceMonths,
  };
}
