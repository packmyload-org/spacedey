import { connectToDatabase } from '@/lib/db/mongo';
import Site from '@/lib/db/models/Site';
import SiteDetails from "@/components/locations/SiteDetails";
import { notFound } from 'next/navigation';
import { ISite } from '@/lib/db/models/Site';

async function getSiteByIdFromDB(siteId: string): Promise<ISite | null> {
  try {
    await connectToDatabase();
    const site = await Site.findById(siteId).populate('unitTypes').exec();
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

    if (!site) {
      return notFound();
    }

    // Convert Mongoose document to plain object
    const siteData = {
      ...site.toObject(),
      id: site._id.toString(),
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
