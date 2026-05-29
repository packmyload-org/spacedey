export function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
}

export function parseRequiredDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function toNumber(value: string | number | null | undefined, fallback = 0): number {
  if (value === null || typeof value === 'undefined') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
