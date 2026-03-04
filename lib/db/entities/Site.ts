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

  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  address!: string;

  @Column()
  contactPhone!: string;

  @Column()
  contactEmail!: string;

  @Column('float')
  lat!: number;

  @Column('float')
  lng!: number;

  @OneToMany(() => UnitType, (unit) => unit.site, { cascade: true })
  unitTypes!: UnitType[];

  @Column({ default: 'ft' })
  measuringUnit!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Site;
