import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserEmailVerification20260316110000 implements MigrationInterface {
  name = 'AddUserEmailVerification20260316110000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "emailVerifiedAt" timestamp
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "emailVerifiedAt"
    `);
  }
}
