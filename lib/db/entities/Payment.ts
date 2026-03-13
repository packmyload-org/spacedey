import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import BookingEntity from "./Booking";
import type { Booking as BookingModel } from "./Booking";
import UserEntity from "./User";
import type { User as UserModel } from "./User";

export interface PaymentBookingAllocation {
    bookingId: string;
    amount: number;
}

export enum PaymentBillingType {
    ONE_TIME = "one_time",
    RECURRING = "recurring"
}

export interface PaymentMetadata {
    data?: {
        id?: string | number;
        [key: string]: unknown;
    };
    verification?: unknown;
    bookingIds?: string[];
    bookingAllocations?: PaymentBookingAllocation[];
    checkoutSource?: "cart" | "direct" | "bookings" | "recurring";
    paymentMode?: "monthly" | "full";
    billingType?: PaymentBillingType;
    billingInterval?: "monthly";
    monthsCovered?: number;
    recurringDurationMonths?: number;
    recurringEndsAt?: string | null;
    paystackPlanCode?: string;
    paystackPlanName?: string;
    flutterwavePaymentPlanId?: number | string;
    flutterwavePaymentPlanName?: string;
    [key: string]: unknown;
}

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
    id!: string;

    @ManyToOne(() => BookingEntity, (booking) => booking.id)
    booking!: Relation<BookingModel>;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user!: Relation<UserModel>;

    @Column({
        type: "enum",
        enum: PaymentProvider
    })
    provider!: PaymentProvider;

    @Column({ type: "varchar", unique: true })
    providerReference!: string; // Internal TX ref or provider IDs

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount!: number;

    @Column({ type: "varchar", default: "NGN" })
    currency!: string;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status!: PaymentStatus;

    @Column({ type: "jsonb", nullable: true })
    metadata!: PaymentMetadata | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

export default Payment;
