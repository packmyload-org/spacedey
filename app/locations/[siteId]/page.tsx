import { connectTypeORM, AppDataSource } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import SiteDetails from "@/components/locations/SiteDetails";
import { notFound } from 'next/navigation';

async function getSiteByIdFromDB(siteId: string) {
  try {
    await connectTypeORM();
    const repo = AppDataSource.getRepository(Site);
    const site = await repo.findOne({ where: { id: siteId }, relations: ['unitTypes', 'units', 'units.unitType'] });
    return site;
  } catch (error) {
    console.error(`Failed to fetch site ${siteId}`, error);
    return null;
  }
}

export default async function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const site = await getSiteByIdFromDB(siteId);

  if (!site) {
    return notFound();
  }

  const siteUnits = site.units || [];

  const siteData = {
    id: site.id,
    name: site.name,
    code: site.code,
    about: site.about || undefined,
    image: site.image || undefined,
    address: {
      street: site.address || undefined,
    },
    contact: {
      phone: site.contactPhone || '',
      email: site.contactEmail || '',
    },
    coordinates: {
      lat: site.lat ?? site.latitude ?? 0,
      lng: site.lng ?? site.longitude ?? 0,
    },
    unitTypes: (site.unitTypes || []).map((ut) => {
      const unitsForType = siteUnits.filter((unit) => unit.unitType?.id === ut.id);

      return ({
        id: ut.id,
        name: ut.name,
        code: ut.id,
        price: ut.priceAmount,
        dimensions: { width: ut.width, depth: ut.depth, height: 0, unit: ut.unit },
        description: ut.description,
        availableCount: (unitsForType.length > 0)
          ? unitsForType.filter((unit) => unit.status === 'available').length
          : ut.availableCount,
        siteId: site.id,
        units: unitsForType.map((unit) => ({
            id: unit.id,
            unitNumber: unit.unitNumber,
            status: unit.status,
            label: unit.label || undefined,
            note: unit.note || undefined,
            unitTypeId: ut.id,
            siteId: site.id,
          })),
      });
    }),
    units: siteUnits.map((unit) => ({
      id: unit.id,
      unitNumber: unit.unitNumber,
      status: unit.status,
      label: unit.label || undefined,
      note: unit.note || undefined,
      unitTypeId: unit.unitType?.id || '',
      siteId: site.id,
    })),
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px]">
      <SiteDetails site={siteData} />
    </main>
  );
}
