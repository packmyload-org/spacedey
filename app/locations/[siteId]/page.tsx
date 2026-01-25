import { getSiteDetails } from '@/lib/integration/storeganise';
import SiteDetails from "@/components/locations/SiteDetails";
import { notFound } from 'next/navigation';

export default async function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  
  try {
      const site = await getSiteDetails(siteId).catch(err => {
          console.error(`Failed to fetch site ${siteId}`, err);
          return null;
      });

      
      if (!site) {
          return notFound();
      }
      console.log(site);
      
      return (
        <main className="min-h-screen bg-gray-50 pt-[80px]">
            <SiteDetails site={site} sitemap={site.sitemap || null} />
        </main>
      )
  } catch (error) {
      console.warn("Error loading site details page:", error);
      return notFound();
  }
}
