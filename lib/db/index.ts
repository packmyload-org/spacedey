import 'reflect-metadata';
import path from 'path';
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
import { PostgresConnectionOptions } from 'typeorm/browser/driver/postgres/PostgresConnectionOptions.js';


export const AppDataSource = new DataSource({
  type: env.postgres.type as PostgresConnectionOptions['type'] || 'postgres',
  host: env.postgres.host,
  port: env.postgres.port,
  username: env.postgres.username,
  password: env.postgres.password,
  database: env.postgres.database,
  synchronize: true,
  logging: env.app.isDevelopment,
  entities: [User, UnitType, Site, StorageUnit, Booking, SubscriptionPlan, Payment, Invoice],
  migrations: [path.join(process.cwd(), 'migrations/*{.ts,.js}')],
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
