import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import User from "./User";
import Site from "./Site";
import UnitType from "./UnitType";

export enum BookingStatus {
    PENDING = "pending",
    PARTIAL = "partial", // Paid something but not full initial fees
    ACTIVE = "active",  // Met activation threshold
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}

@Entity("bookings")
export class Booking {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @ManyToOne(() => Site, (site) => site.id)
    site: Site;

    @ManyToOne(() => UnitType, (unitType) => unitType.id)
    unitType: UnitType;

    // No longer using fixed SubscriptionPlan

    @Column({
        type: "enum",
        enum: BookingStatus,
        default: BookingStatus.PENDING
    })
    status: BookingStatus;

    @Column({ type: "timestamp" })
    startDate: Date;

    @Column({ type: "timestamp", nullable: true })
    endDate: Date;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    monthlyRate: number; // Cached price of unit at time of booking

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    registrationFee: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    annualDues: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    amountPaid: number; // Total installments received

    @Column({ type: "decimal", precision: 12, scale: 2 })
    totalAmount: number; // Total initial due (Reg + 1st Month + Annual)

    @Column({ default: "NGN" })
    currency: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Booking;
