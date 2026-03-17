import type { Metadata } from 'next';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SizingHero from "@/components/sizing/SizingHero";
import ComparisonSizesSection from "@/components/sizing/ComparisonSizes";
import StorageUnitSizes from "@/components/sizing/StorageUnitSizes";

import SizingDetails from "@/components/sizing/SizingDetails";
import WhyStoreWithus from "@/components/sizing/SizingWhyStoreWithUs";
import SizingFaq from "@/components/sizing/SizingFaq";
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Storage Unit Sizes Guide',
  description:
    'Compare storage unit sizes, understand what fits in each option, and choose the right Spacedey unit for personal or business storage in Nigeria.',
  path: '/sizing',
  keywords: [
    'storage unit sizes nigeria',
    'what size storage unit do i need',
    'self storage size guide lagos',
    'storage sizing guide nigeria',
    'small medium large storage units',
  ],
});

export default function SizingPage() {
    return (
        <>
           <Header />
           <SizingHero />
           <ComparisonSizesSection />
           <StorageUnitSizes />
           <WhyStoreWithus />
           <SizingDetails />
           <SizingFaq />
           <Footer />
        </>
    );
}
