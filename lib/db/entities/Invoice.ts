import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import Booking from "./Booking";
import User from "./User";
import Payment from "./Payment";

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
    id: string;

    @Column({ unique: true })
    invoiceNumber: string; // e.g., "INV-2026-0001"

    @ManyToOne(() => Booking, (booking) => booking.id)
    booking: Booking;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @OneToOne(() => Payment)
    @JoinColumn()
    payment: Payment;

    @Column({ type: "jsonb" })
    items: any[]; // Line items: { description, qty, unitPrice, total }

    @Column({ type: "decimal", precision: 12, scale: 2 })
    subtotal: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    tax: number;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    total: number;

    @Column({ default: "NGN" })
    currency: string;

    @Column({
        type: "enum",
        enum: InvoiceStatus,
        default: InvoiceStatus.DRAFT
    })
    status: InvoiceStatus;

    @Column({ type: "timestamp" })
    dueDate: Date;

    @Column({ type: "timestamp", nullable: true })
    paidAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Invoice;
