import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import User from '../lib/db/entities/User';
import UnitType from '../lib/db/entities/UnitType';
import Site from '../lib/db/entities/Site';
import Booking from '../lib/db/entities/Booking';
import SubscriptionPlan from '../lib/db/entities/SubscriptionPlan';
import Payment from '../lib/db/entities/Payment';
import Invoice from '../lib/db/entities/Invoice';
import StorageUnit from '../lib/db/entities/StorageUnit';

dotenv.config({ path: '.env.local' });
dotenv.config();

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
}

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isLocalConnectionString(connectionString: string): boolean {
  return /localhost|127\.0\.0\.1/.test(connectionString);
}

const pooledDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

const directDatabaseUrl =
  process.env.DIRECT_DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const useDirectUrl = process.env.DB_USE_DIRECT_URL === 'true';
const selectedDatabaseUrl = useDirectUrl
  ? directDatabaseUrl || pooledDatabaseUrl
  : pooledDatabaseUrl || directDatabaseUrl;

const defaultSsl = selectedDatabaseUrl
  ? !isLocalConnectionString(selectedDatabaseUrl)
  : false;

const ssl = readBoolean(process.env.DB_SSL, defaultSsl)
  ? { rejectUnauthorized: readBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false) }
  : false;

const postgresConnectionOptions = useDirectUrl && directDatabaseUrl
  ? { url: directDatabaseUrl }
  : selectedDatabaseUrl
    ? { url: selectedDatabaseUrl }
    : {
        host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
        port: readNumber(process.env.POSTGRES_PORT || process.env.DB_PORT, 5432),
        username: process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || process.env.DB_NAME || 'spacedey',
      };

const TypeormDataSource = new DataSource({
  type: 'postgres',
  ...postgresConnectionOptions,
  ssl,
  synchronize: false,
  logging: false,
  entities: [User, UnitType, Site, StorageUnit, Booking, SubscriptionPlan, Payment, Invoice],
  migrations: [path.join(process.cwd(), 'migrations/*{.ts,.js}')],
});

export default TypeormDataSource;
