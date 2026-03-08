import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import UnitType from "./UnitType";

@Entity("sites")
export class Site {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: "float", nullable: true })
  latitude: number;

  @Column({ type: "float", nullable: true })
  longitude: number;

  @Column({ default: "Lagos" })
  city: string;

  @Column({ default: "Lagos" })
  state: string;

  @Column({ type: "jsonb", nullable: true })
  features: string[];

  @Column({ type: "varchar", nullable: true })
  siteMapUrl: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 30000 })
  registrationFee: number; // One-time joining fee

  @Column({ type: "decimal", precision: 12, scale: 2, default: 35000 })
  annualDues: number; // Yearly maintenance fee

  @OneToMany(() => UnitType, (unitType) => unitType.site, { cascade: true })
  unitTypes: UnitType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Site;
