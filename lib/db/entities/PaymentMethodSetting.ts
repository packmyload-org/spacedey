import { PaymentProvider } from './Payment';

export class PaymentMethodSetting {
  id!: string;
  provider!: PaymentProvider;
  enabled!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export default PaymentMethodSetting;
