import PaymentMethodSetting from '@/lib/db/entities/PaymentMethodSetting';
import { PaymentProvider } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseRequiredDate } from '@/lib/db/row';

export interface PaymentMethodStatus {
  provider: PaymentProvider;
  label: string;
  enabled: boolean;
  configured: boolean;
  available: boolean;
  updatedAt: string | null;
}

const PAYMENT_METHOD_LABELS: Record<PaymentProvider, string> = {
  [PaymentProvider.PAYSTACK]: 'Paystack',
  [PaymentProvider.FLUTTERWAVE]: 'Flutterwave',
};

const PAYMENT_METHOD_ORDER: PaymentProvider[] = [
  PaymentProvider.PAYSTACK,
  PaymentProvider.FLUTTERWAVE,
];

function isProviderConfigured(provider: PaymentProvider) {
  if (provider === PaymentProvider.PAYSTACK) {
    return paystack.isConfigured();
  }

  if (provider === PaymentProvider.FLUTTERWAVE) {
    return flutterwave.isConfigured();
  }

  return false;
}

function mapPaymentMethodSetting(row: {
  provider: PaymentProvider;
  isEnabled: boolean;
  updatedAt: string;
}): PaymentMethodSetting {
  const record = new PaymentMethodSetting();
  record.provider = row.provider;
  record.enabled = row.isEnabled;
  record.updatedAt = parseRequiredDate(row.updatedAt);
  return record;
}

export async function getPaymentMethodStatuses(): Promise<PaymentMethodStatus[]> {
  const supabase = createAdminClient();
  const { data: records, error } = await supabase
    .from('payment_method_settings')
    .select('*');

  if (error) {
    throw error;
  }

  const recordMap = new Map(
    (records ?? []).map((record) => [
      record.provider as PaymentProvider,
      mapPaymentMethodSetting({
        provider: record.provider as PaymentProvider,
        isEnabled: record.isEnabled,
        updatedAt: record.updatedAt,
      }),
    ])
  );

  return PAYMENT_METHOD_ORDER.map((provider) => {
    const record = recordMap.get(provider);
    const enabled = record?.enabled ?? true;
    const configured = isProviderConfigured(provider);

    return {
      provider,
      label: PAYMENT_METHOD_LABELS[provider],
      enabled,
      configured,
      available: enabled && configured,
      updatedAt: record?.updatedAt?.toISOString() ?? null,
    };
  });
}

export async function updatePaymentMethodStatuses(
  updates: Partial<Record<PaymentProvider, boolean>>
) {
  const supabase = createAdminClient();

  for (const provider of PAYMENT_METHOD_ORDER) {
    const nextEnabled = updates[provider];
    if (typeof nextEnabled !== 'boolean') {
      continue;
    }

    const { data: existing, error: lookupError } = await supabase
      .from('payment_method_settings')
      .select('id')
      .eq('provider', provider)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('payment_method_settings')
        .update({ isEnabled: nextEnabled })
        .eq('id', existing.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('payment_method_settings')
        .insert({ provider, isEnabled: nextEnabled });

      if (insertError) {
        throw insertError;
      }
    }
  }

  return getPaymentMethodStatuses();
}

export function getDefaultPaymentProvider(methods: PaymentMethodStatus[]) {
  return methods.find((method) => method.available)?.provider ?? null;
}
