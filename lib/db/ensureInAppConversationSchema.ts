import type { DataSource } from 'typeorm';

let schemaEnsurePromise: Promise<void> | null = null;

async function ensureConversationColumnsAndTables(dataSource: DataSource) {
  await dataSource.query(`
    ALTER TABLE "support_conversations"
    ADD COLUMN IF NOT EXISTS "topic" character varying
  `);

  await dataSource.query(`
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

  await dataSource.query(`
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

  await dataSource.query(`
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
}

export async function ensureInAppConversationSchema(dataSource: DataSource) {
  if (schemaEnsurePromise) {
    return schemaEnsurePromise;
  }

  schemaEnsurePromise = ensureConversationColumnsAndTables(dataSource).catch((error: unknown) => {
    schemaEnsurePromise = null;
    throw error;
  });

  return schemaEnsurePromise;
}
