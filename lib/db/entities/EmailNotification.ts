import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum EmailNotificationKind {
  ORDER_CONFIRMATION = 'order_confirmation',
  BOOKING_EXPIRING = 'booking_expiring',
  BOOKING_EXPIRED = 'booking_expired',
  INVOICE_DUE = 'invoice_due',
  INVOICE_OVERDUE = 'invoice_overdue',
  ALERT_MONITORING = 'alert_monitoring',
  ALERT_BILLING = 'alert_billing',
  ALERT_SECURITY = 'alert_security',
  ALERT_INVOICING = 'alert_invoicing',
  NEWSLETTER_DIGEST = 'newsletter_digest',
  REMINDER = 'reminder',
}

export enum EmailNotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity({ name: 'email_notifications' })
export class EmailNotification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  eventKey!: string;

  @Column({ type: 'enum', enum: EmailNotificationKind })
  kind!: EmailNotificationKind;

  @Column({ type: 'enum', enum: EmailNotificationStatus, default: EmailNotificationStatus.PENDING })
  status!: EmailNotificationStatus;

  @Column({ type: 'varchar' })
  recipientEmail!: string;

  @Column({ type: 'varchar', nullable: true })
  recipientName!: string | null;

  @Column({ type: 'varchar' })
  subject!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ type: 'timestamp' })
  scheduledFor!: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  failureReason!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default EmailNotification;
