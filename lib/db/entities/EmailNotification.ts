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

export class EmailNotification {
  id!: string;
  eventKey!: string;
  kind!: EmailNotificationKind;
  status!: EmailNotificationStatus;
  recipientEmail!: string;
  recipientName!: string | null;
  subject!: string;
  payload!: Record<string, unknown>;
  scheduledFor!: Date;
  sentAt!: Date | null;
  failureReason!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default EmailNotification;
