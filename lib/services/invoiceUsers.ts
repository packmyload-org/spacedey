type InvoiceLinkedUser = {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  deletedAt?: Date | string | null;
} | null | undefined;

export interface InvoiceLinkedUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  deletedAt: string | null;
  isFallback: boolean;
}

const FALLBACK_USER_ID = 'deactivated-account';
const FALLBACK_USER_EMAIL = 'inactive-account@spacedey.local';

function normalizeText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeDeletedAt(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function resolveInvoiceLinkedUser(user: InvoiceLinkedUser): InvoiceLinkedUserProfile {
  const firstName = normalizeText(user?.firstName) || 'Deactivated';
  const lastName = normalizeText(user?.lastName) || 'Account';

  return {
    id: normalizeText(user?.id) || FALLBACK_USER_ID,
    email: normalizeText(user?.email) || FALLBACK_USER_EMAIL,
    firstName,
    lastName,
    phone: normalizeText(user?.phone) || null,
    deletedAt: normalizeDeletedAt(user?.deletedAt),
    isFallback: !user?.id,
  };
}
