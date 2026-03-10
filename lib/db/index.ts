import 'reflect-metadata';
<<<<<<< HEAD
import path from 'path';
=======
>>>>>>> feat/custom-integration
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

const postgresConnectionOptions = env.postgres.url
  ? { url: env.postgres.url }
  : {
      host: env.postgres.host,
      port: env.postgres.port,
      username: env.postgres.username,
      password: env.postgres.password,
      database: env.postgres.database,
    };

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...postgresConnectionOptions,
  ssl,
  synchronize: env.postgres.synchronize,
  logging: env.postgres.logging,
  entities: [User, UnitType, Site, StorageUnit, Booking, SubscriptionPlan, Payment, Invoice],
<<<<<<< HEAD
  migrations: [path.join(process.cwd(), 'migrations/*{.ts,.js}')],
=======
>>>>>>> feat/custom-integration
});

export async function connectTypeORM(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('✓ Connected to relational DB via TypeORM');
  }
  return AppDataSource;
}

export async function disconnectTypeORM(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Disconnected TypeORM');
  }
}

export default AppDataSource;
