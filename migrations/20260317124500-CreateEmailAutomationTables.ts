import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailAutomationTables20260317124500 implements MigrationInterface {
  name = 'CreateEmailAutomationTables20260317124500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      ADD COLUMN "chatThreadId" character varying,
      ADD COLUMN "followUpStatus" character varying NOT NULL DEFAULT 'new',
      ADD COLUMN "botReplyCount" integer NOT NULL DEFAULT 0,
      ADD COLUMN "lastInboundMessage" text,
      ADD COLUMN "lastInboundAt" TIMESTAMP,
      ADD COLUMN "lastOutboundAt" TIMESTAMP
    `);

    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      ADD CONSTRAINT "UQ_referral_submissions_chatThreadId" UNIQUE ("chatThreadId")
    `);

    await queryRunner.query(`
      CREATE TABLE "support_conversations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "threadId" character varying NOT NULL,
        "email" character varying NOT NULL,
        "fullName" character varying,
        "status" character varying NOT NULL DEFAULT 'new',
        "firstMessage" text,
        "lastInboundMessage" text,
        "lastInboundAt" TIMESTAMP,
        "lastOutboundAt" TIMESTAMP,
        "botReplyCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_support_conversations_threadId" UNIQUE ("threadId"),
        CONSTRAINT "PK_support_conversations_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."email_notifications_kind_enum" AS ENUM(
        'order_confirmation',
        'booking_expiring',
        'booking_expired',
        'invoice_due',
        'invoice_overdue',
        'alert_monitoring',
        'alert_billing',
        'alert_security',
        'alert_invoicing',
        'newsletter_digest',
        'reminder'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."email_notifications_status_enum" AS ENUM(
        'pending',
        'sent',
        'failed'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "email_notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "eventKey" character varying NOT NULL,
        "kind" "public"."email_notifications_kind_enum" NOT NULL,
        "status" "public"."email_notifications_status_enum" NOT NULL DEFAULT 'pending',
        "recipientEmail" character varying NOT NULL,
        "recipientName" character varying,
        "subject" character varying NOT NULL,
        "payload" jsonb NOT NULL,
        "scheduledFor" TIMESTAMP NOT NULL,
        "sentAt" TIMESTAMP,
        "failureReason" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_email_notifications_eventKey" UNIQUE ("eventKey"),
        CONSTRAINT "PK_email_notifications_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "email_notifications"`);
    await queryRunner.query(`DROP TYPE "public"."email_notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."email_notifications_kind_enum"`);
    await queryRunner.query(`DROP TABLE "support_conversations"`);
    await queryRunner.query(`ALTER TABLE "referral_submissions" DROP CONSTRAINT "UQ_referral_submissions_chatThreadId"`);
    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      DROP COLUMN "lastOutboundAt",
      DROP COLUMN "lastInboundAt",
      DROP COLUMN "lastInboundMessage",
      DROP COLUMN "botReplyCount",
      DROP COLUMN "followUpStatus",
      DROP COLUMN "chatThreadId"
    `);
  }
}
