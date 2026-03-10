import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../lib/db/index.js';
import User from '../lib/db/entities/User.js';
import Site from '../lib/db/entities/Site.js';
import UnitType from '../lib/db/entities/UnitType.js';
import StorageUnit, { StorageUnitStatus } from '../lib/db/entities/StorageUnit.js';
import { STORAGE_SITES, STORAGE_UNIT_TYPES, getStorageUnitSeedKey } from '../lib/data/storageCatalog.js';
import { UserRole } from '../lib/types/roles.js';

dotenv.config();

const DEFAULT_USERS = [
  {
    email: 'admin@spacedey.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  },
  {
    email: 'user@spacedey.com',
    password: 'user123456',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
  },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.debug('TypeORM initialized (synchronize:', AppDataSource.options.synchronize, ')');
    const userRepo = AppDataSource.getRepository(User);
    const siteRepo = AppDataSource.getRepository(Site);
    const unitTypeRepo = AppDataSource.getRepository(UnitType);
    const storageUnitRepo = AppDataSource.getRepository(StorageUnit);

    for (const u of DEFAULT_USERS) {
      const exists = await userRepo.findOne({ where: { email: u.email } });
      if (exists) {
        console.debug(`User ${u.email} already exists`);
        continue;
      }

      const user = userRepo.create(u);
      await userRepo.save(user);
      console.debug(`Created ${u.email}`);
    }

    for (const siteSeed of STORAGE_SITES) {
      const siteWhere = [siteSeed.code, ...(siteSeed.legacyCodes ?? [])].map((code) => ({ code }));
      let site = await siteRepo.findOne({
        where: siteWhere,
        relations: ['unitTypes', 'units', 'units.unitType'],
      });

      if (!site) {
        site = siteRepo.create({
          ...siteSeed,
          latitude: siteSeed.lat,
          longitude: siteSeed.lng,
          city: siteSeed.city,
          state: siteSeed.state,
        });
        console.debug(`Creating site ${siteSeed.code}`);
      } else {
        site.code = siteSeed.code;
        site.name = siteSeed.name;
        site.address = siteSeed.address;
        site.contactPhone = siteSeed.contactPhone;
        site.contactEmail = siteSeed.contactEmail;
        site.lat = siteSeed.lat;
        site.lng = siteSeed.lng;
        site.latitude = siteSeed.lat;
        site.longitude = siteSeed.lng;
        site.city = siteSeed.city;
        site.state = siteSeed.state;
        site.measuringUnit = siteSeed.measuringUnit;
        site.image = siteSeed.image;
        site.about = siteSeed.about;
        site.registrationFee = siteSeed.registrationFee;
        site.annualDues = siteSeed.annualDues;
        console.debug(`Updating site ${siteSeed.code}`);
      }

      site = await siteRepo.save(site);

      const existingUnits = await unitTypeRepo.find({
        where: { site: { id: site.id } },
        relations: ['site'],
      });
      const existingUnitMap = new Map(
        existingUnits.map((unit) => [getStorageUnitSeedKey(unit), unit]),
      );

      for (const [index, unitSeed] of STORAGE_UNIT_TYPES.entries()) {
        const unitKey = getStorageUnitSeedKey(unitSeed);
        const existingUnit = existingUnitMap.get(unitKey);
        let savedUnitType = existingUnit;

        if (existingUnit) {
          existingUnit.name = unitSeed.name;
          existingUnit.width = unitSeed.width;
          existingUnit.depth = unitSeed.depth;
          existingUnit.unit = unitSeed.unit;
          existingUnit.priceAmount = unitSeed.priceAmount;
          existingUnit.priceCurrency = 'NGN';
          existingUnit.priceOriginalAmount = unitSeed.priceOriginalAmount;
          existingUnit.description = unitSeed.description;
          existingUnit.availableCount = unitSeed.availableCount;
          savedUnitType = await unitTypeRepo.save(existingUnit);
        } else {
          savedUnitType = await unitTypeRepo.save(unitTypeRepo.create({
            ...unitSeed,
            priceCurrency: 'NGN',
            site,
          }));
        }

        const existingStorageUnits = await storageUnitRepo.find({
          where: { site: { id: site.id }, unitType: { id: savedUnitType.id } },
          relations: ['site', 'unitType'],
          order: { unitNumber: 'ASC' },
        });

        if (existingStorageUnits.length === 0) {
          const sitePrefix = site.code.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'UNIT';
          const blockStart = index * 100 + 1;
          const newStorageUnits = Array.from({ length: unitSeed.availableCount }, (_, unitIndex) => (
            storageUnitRepo.create({
              unitNumber: `${sitePrefix}${String(blockStart + unitIndex).padStart(3, '0')}`,
              status: StorageUnitStatus.AVAILABLE,
              site,
              unitType: savedUnitType,
            })
          ));

          await storageUnitRepo.save(newStorageUnits);
        }

        const refreshedAvailableCount = await storageUnitRepo.count({
          where: {
            site: { id: site.id },
            unitType: { id: savedUnitType.id },
            status: StorageUnitStatus.AVAILABLE,
          },
        });

        if (savedUnitType.availableCount !== refreshedAvailableCount) {
          savedUnitType.availableCount = refreshedAvailableCount;
          await unitTypeRepo.save(savedUnitType);
        }
      }
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
