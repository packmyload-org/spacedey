import 'reflect-metadata';
import TypeormDataSource from './typeorm-data-source';

const INITIAL_MIGRATION = {
  timestamp: 20260310170000,
  name: 'InitialSchema20260310170000',
};

async function baseline() {
  await TypeormDataSource.initialize();

  try {
    const queryRunner = TypeormDataSource.createQueryRunner();

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
      )
    `);

    const existing = await queryRunner.query(
      `SELECT 1 FROM "migrations" WHERE "timestamp" = $1 AND "name" = $2 LIMIT 1`,
      [INITIAL_MIGRATION.timestamp, INITIAL_MIGRATION.name]
    );

    if (existing.length > 0) {
      console.log(`Migration ${INITIAL_MIGRATION.name} is already baselined.`);
      return;
    }

    await queryRunner.query(
      `INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2)`,
      [INITIAL_MIGRATION.timestamp, INITIAL_MIGRATION.name]
    );

    console.log(`Baselined ${INITIAL_MIGRATION.name}. Future migration runs will skip the initial schema migration.`);
  } finally {
    await TypeormDataSource.destroy();
  }
}

baseline().catch((error) => {
  console.error('Failed to baseline migrations:', error);
  process.exit(1);
});
