import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import type { Relation } from 'typeorm';
import SiteEntity from './Site';
import type { Site as SiteModel } from './Site';
import StorageUnitEntity from './StorageUnit';
import type { StorageUnit as StorageUnitModel } from './StorageUnit';

@Entity({ name: 'unit_types' })
export class UnitType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'float' })
  width!: number;

  @Column({ type: 'float' })
  depth!: number;

  @Column({ type: 'varchar', default: 'ft' })
  unit!: string;

  @Column({ type: 'float' })
  priceAmount!: number;

  @Column({ type: 'varchar', default: 'NGN' })
  priceCurrency!: string;

  @Column({ type: 'float', nullable: true })
  priceOriginalAmount?: number;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  availableCount!: number;

  @ManyToOne(() => SiteEntity, (site) => site.unitTypes, { onDelete: 'CASCADE' })
  site!: Relation<SiteModel>;

  @OneToMany(() => StorageUnitEntity, (unit) => unit.unitType, { cascade: true })
  units!: Relation<StorageUnitModel[]>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

export default UnitType;
