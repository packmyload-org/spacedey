import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingBillingMetadata20260312183000 implements MigrationInterface {
  name = 'AddBookingBillingMetadata20260312183000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD COLUMN IF NOT EXISTS "billingMetadata" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "bookings"
      DROP COLUMN IF EXISTS "billingMetadata"
    `);
  }
}
