export function normalizeEmail(value: string) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase();
}

export const EMAIL_INPUT_PROPS = {
  autoCapitalize: 'none' as const,
  autoCorrect: 'off' as const,
  spellCheck: false,
};
