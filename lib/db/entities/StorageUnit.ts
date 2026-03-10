import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import type { Relation } from 'typeorm';
import SiteEntity from './Site';
import type { Site as SiteModel } from './Site';
import UnitTypeEntity from './UnitType';
import type { UnitType as UnitTypeModel } from './UnitType';

export enum StorageUnitStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

@Entity({ name: 'storage_units' })
export class StorageUnit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  unitNumber!: string;

  @Column({
    type: 'enum',
    enum: StorageUnitStatus,
    default: StorageUnitStatus.AVAILABLE,
  })
  status!: StorageUnitStatus;

  @Column({ type: 'varchar', nullable: true })
  label!: string | null;

  @Column({ type: 'varchar', nullable: true })
  note!: string | null;

  @ManyToOne(() => SiteEntity, (site) => site.units, { onDelete: 'CASCADE' })
  site!: Relation<SiteModel>;

  @ManyToOne(() => UnitTypeEntity, (unitType) => unitType.units, { onDelete: 'CASCADE' })
  unitType!: Relation<UnitTypeModel>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default StorageUnit;
