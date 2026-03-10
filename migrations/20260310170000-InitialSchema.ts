import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260310170000 implements MigrationInterface {
  name = 'InitialSchema20260310170000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."storage_units_status_enum" AS ENUM('available', 'reserved', 'occupied', 'blocked', 'maintenance')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'partial', 'active', 'expired', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."payments_provider_enum" AS ENUM('paystack', 'flutterwave')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'success', 'failed')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."invoices_status_enum" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "phone" character varying,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "sites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "code" character varying NOT NULL,
        "address" character varying NOT NULL,
        "contactPhone" character varying,
        "contactEmail" character varying,
        "lat" double precision,
        "lng" double precision,
        "measuringUnit" character varying NOT NULL DEFAULT 'ft',
        "image" character varying,
        "about" text,
        "siteMapUrl" character varying,
        "registrationFee" numeric(12,2) NOT NULL DEFAULT '30000',
        "annualDues" numeric(12,2) NOT NULL DEFAULT '35000',
        "latitude" double precision,
        "longitude" double precision,
        "city" character varying,
        "state" character varying,
        "features" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_dde6621eadc0c9c9621360ec668" UNIQUE ("code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "subscription_plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "durationMonths" integer NOT NULL,
        "discountPercent" numeric(5,2) NOT NULL DEFAULT '0',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "unit_types" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "width" double precision NOT NULL,
        "depth" double precision NOT NULL,
        "unit" character varying NOT NULL DEFAULT 'ft',
        "priceAmount" double precision NOT NULL,
        "priceCurrency" character varying NOT NULL DEFAULT 'NGN',
        "priceOriginalAmount" double precision,
        "description" character varying,
        "availableCount" integer NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "siteId" uuid,
        CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "storage_units" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "unitNumber" character varying NOT NULL,
        "status" "public"."storage_units_status_enum" NOT NULL DEFAULT 'available',
        "label" character varying,
        "note" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "siteId" uuid,
        "unitTypeId" uuid,
        CONSTRAINT "PK_d379e3b984c5d693ad53ec327f8" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending',
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP,
        "monthlyRate" numeric(12,2) NOT NULL,
        "registrationFee" numeric(12,2) NOT NULL DEFAULT '0',
        "annualDues" numeric(12,2) NOT NULL DEFAULT '0',
        "amountPaid" numeric(12,2) NOT NULL DEFAULT '0',
        "totalAmount" numeric(12,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'NGN',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        "siteId" uuid,
        "unitTypeId" uuid,
        "storageUnitId" uuid,
        CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider" "public"."payments_provider_enum" NOT NULL,
        "providerReference" character varying NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'NGN',
        "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "bookingId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_6bd9aa51f09e7dd2727adb8a6e6" UNIQUE ("providerReference")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "invoiceNumber" character varying NOT NULL,
        "items" jsonb NOT NULL,
        "subtotal" numeric(12,2) NOT NULL,
        "tax" numeric(12,2) NOT NULL DEFAULT '0',
        "total" numeric(12,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'NGN',
        "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'draft',
        "dueDate" TIMESTAMP NOT NULL,
        "paidAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "bookingId" uuid,
        "userId" uuid,
        "paymentId" uuid,
        CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"),
        CONSTRAINT "REL_64923f3a8d3f3247dd5fe9f43c" UNIQUE ("paymentId"),
        CONSTRAINT "UQ_bf8e0f9dd4558ef209ec111782d" UNIQUE ("invoiceNumber")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "unit_types"
      ADD CONSTRAINT "FK_993675685d39762b6d29ac06715"
      FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "storage_units"
      ADD CONSTRAINT "FK_b78d92022e500ecd87ff66827f6"
      FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "storage_units"
      ADD CONSTRAINT "FK_780b4ecf914ca7c66a79bd5af0e"
      FOREIGN KEY ("unitTypeId") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD CONSTRAINT "FK_6ab1de8b5d2af0b0cc9be2ae4ae"
      FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD CONSTRAINT "FK_0fdb64c09636f935ce2f59cf95e"
      FOREIGN KEY ("unitTypeId") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "bookings"
      ADD CONSTRAINT "FK_f2f1c17468763d229f8421547c6"
      FOREIGN KEY ("storageUnitId") REFERENCES "storage_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d"
      FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD CONSTRAINT "FK_eca01fda44679cc1c342822e01b"
      FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD CONSTRAINT "FK_64923f3a8d3f3247dd5fe9f43c5"
      FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_64923f3a8d3f3247dd5fe9f43c5"`);
    await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9"`);
    await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_eca01fda44679cc1c342822e01b"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_f2f1c17468763d229f8421547c6"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_0fdb64c09636f935ce2f59cf95e"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_6ab1de8b5d2af0b0cc9be2ae4ae"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_38a69a58a323647f2e75eb994de"`);
    await queryRunner.query(`ALTER TABLE "storage_units" DROP CONSTRAINT "FK_780b4ecf914ca7c66a79bd5af0e"`);
    await queryRunner.query(`ALTER TABLE "storage_units" DROP CONSTRAINT "FK_b78d92022e500ecd87ff66827f6"`);
    await queryRunner.query(`ALTER TABLE "unit_types" DROP CONSTRAINT "FK_993675685d39762b6d29ac06715"`);

    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "storage_units"`);
    await queryRunner.query(`DROP TABLE "unit_types"`);
    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(`DROP TABLE "sites"`);
    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."storage_units_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
