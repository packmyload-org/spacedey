import { getSiteDetails, getSiteSitemap } from '@/lib/integration/storeganise';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteDetails from "@/components/locations/SiteDetails";
import { notFound } from 'next/navigation';

export default async function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  
  try {
      // Fetch site details and sitemap in parallel
      const [site, sitemap] = await Promise.all([
          getSiteDetails(siteId).catch(err => {
              console.error(`Failed to fetch site ${siteId}`, err);
              return null;
          }),
          getSiteSitemap(siteId).catch(err => {
              // Sitemap might not exist for all sites, which is fine
              console.warn(`Sitemap fetch warning for ${siteId}:`, err);
              return null;
          })
      ]);

      if (!site) {
          return notFound();
      }

      return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-[80px]">
                <SiteDetails site={site} sitemap={sitemap} />
            </main>
            <Footer />
        </>
      )
  } catch (error) {
      console.error("Error loading site details page:", error);
      return notFound();
  }
}
