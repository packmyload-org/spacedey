import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import UnitTypeEntity from './UnitType';
import type { UnitType as UnitTypeModel } from './UnitType';
import StorageUnitEntity from './StorageUnit';
import type { StorageUnit as StorageUnitModel } from './StorageUnit';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ type: 'varchar', nullable: true })
  contactPhone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  contactEmail!: string | null;

  @Column({ type: 'float', nullable: true })
  lat!: number | null;

  @Column({ type: 'float', nullable: true })
  lng!: number | null;

  @Column({ type: 'varchar', default: 'ft' })
  measuringUnit!: string;

  @Column({ type: 'varchar', nullable: true })
  image!: string | null;

  @Column({ type: 'text', nullable: true })
  about!: string | null;

  @Column({ type: 'varchar', nullable: true })
  siteMapUrl!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 30000 })
  registrationFee!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 35000 })
  annualDues!: number;

  // Legacy fields retained for compatibility with earlier seeded/local data.
  @Column({ type: 'float', nullable: true })
  latitude!: number | null;

  @Column({ type: 'float', nullable: true })
  longitude!: number | null;

  @Column({ type: 'varchar', nullable: true })
  city!: string | null;

  @Column({ type: 'varchar', nullable: true })
  state!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  features!: string[] | null;

  @OneToMany(() => UnitTypeEntity, (unitType) => unitType.site, { cascade: true })
  unitTypes!: Relation<UnitTypeModel[]>;

  @OneToMany(() => StorageUnitEntity, (unit) => unit.site, { cascade: true })
  units!: Relation<StorageUnitModel[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Site;
