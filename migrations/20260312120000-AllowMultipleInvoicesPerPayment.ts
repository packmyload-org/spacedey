import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowMultipleInvoicesPerPayment20260312120000 implements MigrationInterface {
  name = 'AllowMultipleInvoicesPerPayment20260312120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT IF EXISTS "REL_64923f3a8d3f3247dd5fe9f43c"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD CONSTRAINT "REL_64923f3a8d3f3247dd5fe9f43c" UNIQUE ("paymentId")
    `);
  }
}
