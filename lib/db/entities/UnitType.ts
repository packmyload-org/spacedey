import type { Site } from './Site';
import type { StorageUnit } from './StorageUnit';

export class UnitType {
  id!: string;
  name!: string;
  width!: number;
  depth!: number;
  unit!: string;
  priceAmount!: number;
  priceCurrency!: string;
  priceOriginalAmount?: number;
  description?: string;
  availableCount!: number;
  site?: Site;
  siteId?: string | null;
  units?: StorageUnit[];
  createdAt!: Date;
  updatedAt!: Date;
}

export default UnitType;
