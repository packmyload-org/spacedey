import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContentAndReferralTables20260316190000 implements MigrationInterface {
  name = 'CreateContentAndReferralTables20260316190000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "blog_posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "excerpt" text NOT NULL,
        "content" text NOT NULL,
        "image" character varying,
        "author" character varying NOT NULL,
        "published" boolean NOT NULL DEFAULT true,
        "publishedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_blog_posts_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_blog_posts_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "newsletter_subscribers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "subscribedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_newsletter_subscribers_email" UNIQUE ("email"),
        CONSTRAINT "PK_newsletter_subscribers_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "referral_submissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "referrerUserId" character varying,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "refereeFirstName" character varying NOT NULL,
        "refereeLastName" character varying,
        "refereeEmail" character varying NOT NULL,
        "refereePhone" character varying,
        "refereeLocation" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_referral_submissions_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "referral_submissions"`);
    await queryRunner.query(`DROP TABLE "newsletter_subscribers"`);
    await queryRunner.query(`DROP TABLE "blog_posts"`);
  }
}
