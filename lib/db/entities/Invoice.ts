import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import BookingEntity from "./Booking";
import type { Booking as BookingModel } from "./Booking";
import UserEntity from "./User";
import type { User as UserModel } from "./User";
import PaymentEntity from "./Payment";
import type { Payment as PaymentModel } from "./Payment";

export interface InvoiceLineItem {
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
}

export enum InvoiceStatus {
    DRAFT = "draft",
    SENT = "sent",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}

@Entity("invoices")
export class Invoice {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    invoiceNumber!: string; // e.g., "INV-2026-0001"

    @ManyToOne(() => BookingEntity, (booking) => booking.id)
    booking!: Relation<BookingModel>;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user!: Relation<UserModel>;

    @ManyToOne(() => PaymentEntity)
    @JoinColumn()
    payment!: Relation<PaymentModel>;

    @Column({ type: "jsonb" })
    items!: InvoiceLineItem[];

    @Column({ type: "decimal", precision: 12, scale: 2 })
    subtotal!: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    tax!: number;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    total!: number;

    @Column({ type: "varchar", default: "NGN" })
    currency!: string;

    @Column({
        type: "enum",
        enum: InvoiceStatus,
        default: InvoiceStatus.DRAFT
    })
    status!: InvoiceStatus;

    @Column({ type: "timestamp" })
    dueDate!: Date;

    @Column({ type: "timestamp", nullable: true })
    paidAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

export default Invoice;
