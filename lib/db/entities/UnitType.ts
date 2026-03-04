import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import Site from './Site';

@Entity({ name: 'unit_types' })
export class UnitType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('float')
  width!: number;

  @Column('float')
  depth!: number;

  @Column({ default: 'ft' })
  unit!: string;

  @Column('float')
  priceAmount!: number;

  @Column({ default: 'NGN' })
  priceCurrency!: string;

  @Column('float', { nullable: true })
  priceOriginalAmount?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  availableCount!: number;

  @ManyToOne(() => Site, (site) => site.unitTypes, { onDelete: 'CASCADE' })
  site!: Site;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default UnitType;
