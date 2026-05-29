export class SubscriptionPlan {
  id!: string;
  name!: string;
  durationMonths!: number;
  discountPercent!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export default SubscriptionPlan;
