import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInAppConversationMessages20260317163000 implements MigrationInterface {
  name = 'AddInAppConversationMessages20260317163000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "support_conversations"
      ADD COLUMN IF NOT EXISTS "topic" character varying
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "support_messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "conversationId" uuid NOT NULL,
        "role" character varying NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_support_messages_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_support_messages_conversation" FOREIGN KEY ("conversationId") REFERENCES "support_conversations"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "referral_messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "submissionId" uuid NOT NULL,
        "role" character varying NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_referral_messages_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_referral_messages_submission" FOREIGN KEY ("submissionId") REFERENCES "referral_submissions"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "landlord_messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "inquiryId" uuid NOT NULL,
        "role" character varying NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_landlord_messages_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_landlord_messages_inquiry" FOREIGN KEY ("inquiryId") REFERENCES "landlord_inquiries"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'support_conversations' AND column_name = 'messages'
        ) THEN
          INSERT INTO "support_messages" ("conversationId", "role", "content", "createdAt")
          SELECT
            sc."id",
            COALESCE(message->>'role', 'assistant'),
            COALESCE(message->>'content', ''),
            COALESCE(NULLIF(message->>'createdAt', '')::timestamp, now())
          FROM "support_conversations" sc
          CROSS JOIN LATERAL jsonb_array_elements(COALESCE(sc."messages", '[]'::jsonb)) AS message;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'referral_submissions' AND column_name = 'conversationMessages'
        ) THEN
          INSERT INTO "referral_messages" ("submissionId", "role", "content", "createdAt")
          SELECT
            rs."id",
            COALESCE(message->>'role', 'assistant'),
            COALESCE(message->>'content', ''),
            COALESCE(NULLIF(message->>'createdAt', '')::timestamp, now())
          FROM "referral_submissions" rs
          CROSS JOIN LATERAL jsonb_array_elements(COALESCE(rs."conversationMessages", '[]'::jsonb)) AS message;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'landlord_inquiries' AND column_name = 'conversationMessages'
        ) THEN
          INSERT INTO "landlord_messages" ("inquiryId", "role", "content", "createdAt")
          SELECT
            li."id",
            COALESCE(message->>'role', 'assistant'),
            COALESCE(message->>'content', ''),
            COALESCE(NULLIF(message->>'createdAt', '')::timestamp, now())
          FROM "landlord_inquiries" li
          CROSS JOIN LATERAL jsonb_array_elements(COALESCE(li."conversationMessages", '[]'::jsonb)) AS message;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "support_conversations"
      DROP COLUMN IF EXISTS "messages",
      DROP COLUMN IF EXISTS "phone"
    `);

    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      DROP COLUMN IF EXISTS "conversationMessages"
    `);

    await queryRunner.query(`
      ALTER TABLE "landlord_inquiries"
      DROP COLUMN IF EXISTS "conversationMessages"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "support_conversations"
      ADD COLUMN IF NOT EXISTS "phone" character varying,
      ADD COLUMN IF NOT EXISTS "messages" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      ADD COLUMN IF NOT EXISTS "conversationMessages" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "landlord_inquiries"
      ADD COLUMN IF NOT EXISTS "conversationMessages" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      UPDATE "support_conversations" sc
      SET "messages" = COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', sm."id",
          'role', sm."role",
          'content', sm."content",
          'createdAt', sm."createdAt"
        ) ORDER BY sm."createdAt" ASC)
        FROM "support_messages" sm
        WHERE sm."conversationId" = sc."id"
      ), '[]'::jsonb)
    `);

    await queryRunner.query(`
      UPDATE "referral_submissions" rs
      SET "conversationMessages" = COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', rm."id",
          'role', rm."role",
          'content', rm."content",
          'createdAt', rm."createdAt"
        ) ORDER BY rm."createdAt" ASC)
        FROM "referral_messages" rm
        WHERE rm."submissionId" = rs."id"
      ), '[]'::jsonb)
    `);

    await queryRunner.query(`
      UPDATE "landlord_inquiries" li
      SET "conversationMessages" = COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', lm."id",
          'role', lm."role",
          'content', lm."content",
          'createdAt', lm."createdAt"
        ) ORDER BY lm."createdAt" ASC)
        FROM "landlord_messages" lm
        WHERE lm."inquiryId" = li."id"
      ), '[]'::jsonb)
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "landlord_messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "referral_messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "support_messages"`);
  }
}
