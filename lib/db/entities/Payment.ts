import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import Booking from "./Booking";
import User from "./User";

export enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}

export enum PaymentProvider {
    PAYSTACK = "paystack",
    FLUTTERWAVE = "flutterwave"
}

@Entity("payments")
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Booking, (booking) => booking.id)
    booking: Booking;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Column({
        type: "enum",
        enum: PaymentProvider
    })
    provider: PaymentProvider;

    @Column({ unique: true })
    providerReference: string; // Internal TX ref or provider IDs

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount: number;

    @Column({ default: "NGN" })
    currency: string;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;

    @Column({ type: "jsonb", nullable: true })
    metadata: any; // Store provider raw response

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Payment;
