export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamp = string;

export type UserRow = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'admin' | 'user';
  emailVerifiedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};

export type SiteRow = {
  id: string;
  name: string;
  code: string;
  address: string;
  contactPhone: string | null;
  contactEmail: string | null;
  lat: number | null;
  lng: number | null;
  measuringUnit: string;
  image: string | null;
  about: string | null;
  siteMapUrl: string | null;
  registrationFee: string | number;
  annualDues: string | number;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  features: string[] | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type UnitTypeRow = {
  id: string;
  name: string;
  width: number;
  depth: number;
  unit: string;
  priceAmount: number;
  priceCurrency: string;
  priceOriginalAmount: number | null;
  description: string | null;
  availableCount: number;
  siteId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type StorageUnitRow = {
  id: string;
  unitNumber: string;
  status: 'available' | 'reserved' | 'occupied' | 'blocked' | 'maintenance';
  label: string | null;
  note: string | null;
  siteId: string | null;
  unitTypeId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type BookingRow = {
  id: string;
  status: 'pending' | 'partial' | 'active' | 'expired' | 'cancelled';
  startDate: Timestamp;
  endDate: Timestamp | null;
  monthlyRate: string | number;
  registrationFee: string | number;
  annualDues: string | number;
  amountPaid: string | number;
  totalAmount: string | number;
  currency: string;
  billingMetadata: Json | null;
  userId: string | null;
  siteId: string | null;
  unitTypeId: string | null;
  storageUnitId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type PaymentRow = {
  id: string;
  provider: 'paystack' | 'flutterwave';
  providerReference: string;
  amount: string | number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  metadata: Json | null;
  bookingId: string | null;
  userId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  items: Json;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Timestamp;
  paidAt: Timestamp | null;
  bookingId: string | null;
  userId: string | null;
  paymentId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type EmailNotificationRow = {
  id: string;
  eventKey: string;
  kind: string;
  status: string;
  recipientEmail: string;
  recipientName: string | null;
  subject: string;
  payload: Json | null;
  scheduledFor: Timestamp | null;
  sentAt: Timestamp | null;
  failureReason: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  subscribedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      users: TableDef<UserRow>;
      sites: TableDef<SiteRow>;
      unit_types: TableDef<UnitTypeRow>;
      storage_units: TableDef<StorageUnitRow>;
      bookings: TableDef<BookingRow>;
      subscription_plans: TableDef<{
        id: string;
        name: string;
        durationMonths: number;
        discountPercent: string | number;
        isActive: boolean;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>;
      payments: TableDef<PaymentRow>;
      invoices: TableDef<InvoiceRow>;
      payment_method_settings: TableDef<{
        id: string;
        provider: string;
        isEnabled: boolean;
        displayName: string;
        sortOrder: number;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>;
      blog_posts: TableDef<{
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        image: string | null;
        author: string;
        published: boolean;
        publishedAt: Timestamp | null;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>;
      newsletter_subscribers: TableDef<NewsletterSubscriberRow>;
      referral_submissions: TableDef<{
        id: string;
        referrerUserId: string | null;
        firstName: string;
        lastName: string;
        email: string;
        refereeFirstName: string;
        refereeLastName: string | null;
        refereeEmail: string;
        refereePhone: string | null;
        refereeLocation: string;
        chatThreadId: string | null;
        followUpStatus: string;
        botReplyCount: number;
        lastInboundMessage: string | null;
        lastInboundAt: Timestamp | null;
        lastOutboundAt: Timestamp | null;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>;
      landlord_inquiries: TableDef<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        streetAddress: string;
        region: string | null;
        squareFootage: string | null;
        details: string | null;
        status: string;
        chatThreadId: string | null;
        botReplyCount: number;
        lastInboundMessage: string | null;
        lastInboundAt: Timestamp | null;
        lastOutboundAt: Timestamp | null;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>;
      email_notifications: TableDef<EmailNotificationRow>;
      support_conversations: TableDef<{
        id: string;
        threadId: string;
        email: string;
        fullName: string | null;
        topic: string | null;
        status: string;
        firstMessage: string | null;
        lastInboundMessage: string | null;
        lastInboundAt: Timestamp | null;
        lastOutboundAt: Timestamp | null;
        botReplyCount: number;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>;
      support_messages: TableDef<{
        id: string;
        conversationId: string;
        role: string;
        content: string;
        createdAt: Timestamp;
      }>;
      referral_messages: TableDef<{
        id: string;
        submissionId: string;
        role: string;
        content: string;
        createdAt: Timestamp;
      }>;
      landlord_messages: TableDef<{
        id: string;
        inquiryId: string;
        role: string;
        content: string;
        createdAt: Timestamp;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
