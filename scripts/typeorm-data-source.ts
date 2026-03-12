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

function isLocalConnectionString(connectionString: string): boolean {
  return /localhost|127\.0\.0\.1/.test(connectionString);
}

const pooledDatabaseUrl = process.env.DATABASE_URL;

const directDatabaseUrl = process.env.DIRECT_DATABASE_URL;

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

if (!selectedDatabaseUrl) {
  throw new Error(
    'Missing DATABASE_URL or DIRECT_DATABASE_URL. Configure the database URL-based env vars before running TypeORM scripts.'
  );
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: useDirectUrl && directDatabaseUrl ? directDatabaseUrl : selectedDatabaseUrl,
  ssl,
  synchronize: false,
  logging: false,
  entities: [User, UnitType, Site, StorageUnit, Booking, SubscriptionPlan, Payment, Invoice],
  migrations: [path.join(process.cwd(), 'migrations/*{.ts,.js}')],
});

export default AppDataSource;
