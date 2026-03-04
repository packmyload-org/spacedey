import { connectTypeORM, AppDataSource } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import SiteDetails from "@/components/locations/SiteDetails";
import { notFound } from 'next/navigation';

async function getSiteByIdFromDB(siteId: string) {
  try {
    await connectTypeORM();
    const repo = AppDataSource.getRepository(Site);
    const site = await repo.findOne({ where: { id: siteId }, relations: ['unitTypes'] });
    return site;
  } catch (error) {
    console.error(`Failed to fetch site ${siteId}`, error);
    return null;
  }
}

export default async function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;

  try {
    const site = await getSiteByIdFromDB(siteId);

    if (!site) return notFound();

    const siteData = {
      id: site.id,
      name: site.name,
      code: site.code,
      image: site.image,
      address: {
        street: site.address || undefined,
      },
      contact: {
        phone: site.contactPhone,
        email: site.contactEmail,
      },
      coordinates: {
        lat: site.lat,
        lng: site.lng,
      },
      unitTypes: (site.unitTypes || []).map((ut: any) => ({
        id: ut.id,
        name: ut.name,
        code: ut.id,
        price: ut.priceAmount,
        dimensions: { width: ut.width, depth: ut.depth, height: 0, unit: ut.unit },
        description: ut.description,
        availableCount: ut.availableCount,
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
  } catch (error) {
    console.warn("Error loading site details page:", error);
    return notFound();
  }
}
