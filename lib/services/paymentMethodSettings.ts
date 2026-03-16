import type { DataSource } from 'typeorm';
import PaymentMethodSetting from '@/lib/db/entities/PaymentMethodSetting';
import { PaymentProvider } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';

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

export async function getPaymentMethodStatuses(dataSource: DataSource): Promise<PaymentMethodStatus[]> {
  const repo = dataSource.getRepository(PaymentMethodSetting);
  const records = await repo.find();
  const recordMap = new Map(records.map((record) => [record.provider, record]));

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
  dataSource: DataSource,
  updates: Partial<Record<PaymentProvider, boolean>>
) {
  const repo = dataSource.getRepository(PaymentMethodSetting);

  for (const provider of PAYMENT_METHOD_ORDER) {
    const nextEnabled = updates[provider];
    if (typeof nextEnabled !== 'boolean') {
      continue;
    }

    const existing = await repo.findOne({ where: { provider } });
    const record = existing ?? repo.create({ provider });
    record.enabled = nextEnabled;
    await repo.save(record);
  }

  return getPaymentMethodStatuses(dataSource);
}

export function getDefaultPaymentProvider(methods: PaymentMethodStatus[]) {
  return methods.find((method) => method.available)?.provider ?? null;
}
