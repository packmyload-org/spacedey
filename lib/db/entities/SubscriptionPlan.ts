import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("subscription_plans")
export class SubscriptionPlan {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "int" })
    durationMonths!: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    discountPercent!: number;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

export default SubscriptionPlan;
