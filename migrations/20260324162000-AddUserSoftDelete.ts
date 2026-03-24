import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSoftDelete20260324162000 implements MigrationInterface {
  name = 'AddUserSoftDelete20260324162000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "deletedAt" timestamp
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "deletedAt"
    `);
  }
}
