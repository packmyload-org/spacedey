import { DataSource } from 'typeorm';
import UnitType from '@/lib/db/entities/UnitType';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';

export async function syncUnitTypeAvailability(dataSource: DataSource, unitTypeId: string) {
  const unitRepo = dataSource.getRepository(StorageUnit);
  const unitTypeRepo = dataSource.getRepository(UnitType);

  const availableCount = await unitRepo.count({
    where: {
      unitType: { id: unitTypeId },
      status: StorageUnitStatus.AVAILABLE,
    },
  });

  await unitTypeRepo.update(unitTypeId, { availableCount });
  return availableCount;
}
