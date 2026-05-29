import type { Site } from './Site';
import type { UnitType } from './UnitType';

export enum StorageUnitStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

export class StorageUnit {
  id!: string;
  unitNumber!: string;
  status!: StorageUnitStatus;
  label!: string | null;
  note!: string | null;
  site?: Site;
  siteId?: string | null;
  unitType?: UnitType;
  unitTypeId?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default StorageUnit;
