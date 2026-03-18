import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLandlordInquiries20260317103000 implements MigrationInterface {
  name = 'CreateLandlordInquiries20260317103000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "landlord_inquiries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "streetAddress" character varying NOT NULL,
        "region" character varying,
        "squareFootage" character varying,
        "details" text,
        "status" character varying NOT NULL DEFAULT 'new',
        "chatThreadId" character varying,
        "botReplyCount" integer NOT NULL DEFAULT 0,
        "lastInboundMessage" text,
        "lastInboundAt" TIMESTAMP,
        "lastOutboundAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_landlord_inquiries_chatThreadId" UNIQUE ("chatThreadId"),
        CONSTRAINT "PK_landlord_inquiries_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "landlord_inquiries"`);
  }
}
