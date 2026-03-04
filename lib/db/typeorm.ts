import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { env } from '@/config/env';

const entitiesPath = path.join(process.cwd(), 'lib/db/entities/*{.ts,.js}');

export const AppDataSource = new DataSource({
  type: (env.postgres.type as any) || 'postgres',
  host: env.postgres.host,
  port: env.postgres.port,
  username: env.postgres.username,
  password: env.postgres.password,
  database: env.postgres.database,
  synchronize: env.app.isDevelopment,
  logging: env.app.isDevelopment,
  entities: [entitiesPath],
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
