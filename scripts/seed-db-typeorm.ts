import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../lib/db/index.js';
import User from '../lib/db/entities/User.js';

dotenv.config();

const DEFAULT_USERS = [
  {
    email: 'admin@spacedey.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    email: 'user@spacedey.com',
    password: 'user123456',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
  },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.debug('TypeORM initialized (synchronize:', AppDataSource.options.synchronize, ')');
    const repo = AppDataSource.getRepository(User);

    for (const u of DEFAULT_USERS) {
      const exists = await repo.findOne({ where: { email: u.email } });
      if (exists) {
        console.debug(`User ${u.email} already exists`);
        continue;
      }

      const user = repo.create(u as any);
      await repo.save(user);
      console.debug(`Created ${u.email}`);
    }

    console.debug('Seeding complete');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
