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

let appDataSource: DataSource | null = null;

function getAppDataSource(): DataSource {
  if (appDataSource) {
    return appDataSource;
  }

  if (!env.postgres.url) {
    throw new Error(
      'Missing DATABASE_URL or DIRECT_DATABASE_URL. Configure the database URL-based env vars before starting the app.'
    );
  }

  appDataSource = new DataSource({
    type: 'postgres',
    url: env.postgres.url,
    ssl,
    synchronize: env.postgres.synchronize,
    logging: env.postgres.logging,
    entities: [User, UnitType, Site, StorageUnit, Booking, SubscriptionPlan, Payment, Invoice],
  });

  return appDataSource;
}

let dataSourceInitializationPromise: Promise<DataSource> | null = null;

export async function connectTypeORM(): Promise<DataSource> {
  const dataSource = getAppDataSource();

  if (dataSource.isInitialized) {
    return dataSource;
  }

  if (!dataSourceInitializationPromise) {
    dataSourceInitializationPromise = dataSource.initialize()
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
  if (appDataSource?.isInitialized) {
    await appDataSource.destroy();
    dataSourceInitializationPromise = null;
    console.log('Disconnected TypeORM');
  }
}

export { getAppDataSource };
