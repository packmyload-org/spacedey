import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '@/config/env';
import User from './entities/User';
import UnitType from './entities/UnitType';
import Site from './entities/Site';
import Booking from './entities/Booking';
import SubscriptionPlan from './entities/SubscriptionPlan';
import Payment from './entities/Payment';
import Invoice from './entities/Invoice';
import StorageUnit from './entities/StorageUnit';

const ssl = env.postgres.ssl
  ? { rejectUnauthorized: env.postgres.sslRejectUnauthorized }
  : false;

if (!env.postgres.url) {
  throw new Error(
    'Missing DATABASE_URL or DIRECT_DATABASE_URL. Configure the database URL-based env vars before starting the app.'
  );
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.postgres.url,
  ssl,
  synchronize: env.postgres.synchronize,
  logging: env.postgres.logging,
  entities: [User, UnitType, Site, StorageUnit, Booking, SubscriptionPlan, Payment, Invoice],
});

let dataSourceInitializationPromise: Promise<DataSource> | null = null;

export async function connectTypeORM(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (!dataSourceInitializationPromise) {
    dataSourceInitializationPromise = AppDataSource.initialize()
      .then((dataSource) => {
        console.log('✓ Connected to relational DB via TypeORM');
        return dataSource;
      })
      .catch((error: unknown) => {
        dataSourceInitializationPromise = null;
        throw error;
      });
  }

  return dataSourceInitializationPromise;
}

export async function disconnectTypeORM(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    dataSourceInitializationPromise = null;
    console.log('Disconnected TypeORM');
  }
}

export default AppDataSource;
