import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentMethodSettings20260316153000 implements MigrationInterface {
  name = 'CreatePaymentMethodSettings20260316153000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."payment_method_settings_provider_enum" AS ENUM('paystack', 'flutterwave')
    `);
    await queryRunner.query(`
      CREATE TABLE "payment_method_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider" "public"."payment_method_settings_provider_enum" NOT NULL,
        "enabled" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payment_method_settings_provider" UNIQUE ("provider"),
        CONSTRAINT "PK_payment_method_settings_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_method_settings"`);
    await queryRunner.query(`DROP TYPE "public"."payment_method_settings_provider_enum"`);
  }
}
