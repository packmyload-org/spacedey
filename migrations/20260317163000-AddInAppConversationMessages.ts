import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInAppConversationMessages20260317163000 implements MigrationInterface {
  name = 'AddInAppConversationMessages20260317163000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "support_conversations"
      ADD COLUMN "phone" character varying,
      ADD COLUMN "topic" character varying,
      ADD COLUMN "messages" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      ADD COLUMN "conversationMessages" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "landlord_inquiries"
      ADD COLUMN "conversationMessages" jsonb NOT NULL DEFAULT '[]'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "landlord_inquiries"
      DROP COLUMN "conversationMessages"
    `);

    await queryRunner.query(`
      ALTER TABLE "referral_submissions"
      DROP COLUMN "conversationMessages"
    `);

    await queryRunner.query(`
      ALTER TABLE "support_conversations"
      DROP COLUMN "messages",
      DROP COLUMN "topic",
      DROP COLUMN "phone"
    `);
  }
}
