import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import UserEntity from "./User";
import type { User as UserModel } from "./User";
import SiteEntity from "./Site";
import type { Site as SiteModel } from "./Site";
import UnitTypeEntity from "./UnitType";
import type { UnitType as UnitTypeModel } from "./UnitType";
import StorageUnitEntity from "./StorageUnit";
import type { StorageUnit as StorageUnitModel } from "./StorageUnit";

export enum BookingStatus {
    PENDING = "pending",
    PARTIAL = "partial", // Paid something but not the selected billing amount
    ACTIVE = "active",  // Met the selected billing amount
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}

export interface BookingBillingMetadata {
    paystack?: {
        allocationAmount?: number;
        authorizationCode?: string;
        authorizationSignature?: string;
        authorizationReusable?: boolean;
        customerCode?: string;
        customerEmail?: string;
        lastSuccessfulReference?: string;
        planCode?: string;
        planName?: string;
        subscriptionCode?: string;
    };
    [key: string]: unknown;
}

@Entity("bookings")
export class Booking {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user!: Relation<UserModel>;

    @ManyToOne(() => SiteEntity, (site) => site.id)
    site!: Relation<SiteModel>;

    @ManyToOne(() => UnitTypeEntity, (unitType) => unitType.id)
    unitType!: Relation<UnitTypeModel>;

    @ManyToOne(() => StorageUnitEntity, { nullable: true })
    storageUnit!: Relation<StorageUnitModel> | null;

    // No longer using fixed SubscriptionPlan

    @Column({
        type: "enum",
        enum: BookingStatus,
        default: BookingStatus.PENDING
    })
    status!: BookingStatus;

    @Column({ type: "timestamp" })
    startDate!: Date;

    @Column({ type: "timestamp", nullable: true })
    endDate!: Date | null;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    monthlyRate!: number; // Cached price of unit at time of booking

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    registrationFee!: number; // Retained for compatibility; new recurring bookings store 0

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    annualDues!: number; // Retained for compatibility; new recurring bookings store 0

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    amountPaid!: number; // Total installments received

    @Column({ type: "decimal", precision: 12, scale: 2 })
    totalAmount!: number; // Amount due for the selected billing option

    @Column({ type: "varchar", default: "NGN" })
    currency!: string;

    @Column({ type: "jsonb", nullable: true })
    billingMetadata!: BookingBillingMetadata | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

export default Booking;
