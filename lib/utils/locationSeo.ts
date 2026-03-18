export function toLocationSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatCountLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatPriceFromAmount(amount: number | null) {
  if (amount === null || !Number.isFinite(amount)) {
    return 'Request pricing';
  }

  return `From NGN ${Math.round(amount).toLocaleString()}/month`;
}
