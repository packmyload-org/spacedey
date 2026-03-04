import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import UnitType from './UnitType';

@Entity({ name: 'sites' })
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ type: 'varchar' })
  contactPhone!: string;

  @Column({ type: 'varchar' })
  contactEmail!: string;

  @Column({ type: 'float' })
  lat!: number;

  @Column({ type: 'float' })
  lng!: number;

  @OneToMany(() => UnitType, (unit) => unit.site, { cascade: true })
  unitTypes!: UnitType[];

  @Column({ type: 'varchar', default: 'ft' })
  measuringUnit!: string;

  @Column({ type: 'varchar', nullable: true })
  siteMapUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Site;
