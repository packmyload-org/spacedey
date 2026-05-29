import type { Metadata } from 'next';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SizingHero from "@/components/sizing/SizingHero";
import ComparisonSizesSection from "@/components/sizing/ComparisonSizes";
import StorageUnitSizes from "@/components/sizing/StorageUnitSizes";

import SizingDetails from "@/components/sizing/SizingDetails";
import WhyStoreWithus from "@/components/sizing/SizingWhyStoreWithUs";
import SizingFaq from "@/components/sizing/SizingFaq";
import { buildPageMetadata, serializeJsonLd } from '@/lib/seo';
import { SIZING_FAQS } from '@/lib/sizingSeoContent';

export const metadata: Metadata = buildPageMetadata({
  title: 'Pricing | Storage Unit Prices and Sizes Guide',
  description:
    'Compare storage unit sizes, understand what fits in each option, and choose the right Spacedey unit for personal or business storage in Nigeria.',
  path: '/sizing',
  keywords: [
    'storage facilities in nigeria and their prices',
    'what size storage unit do i need',
    'self storage size guide lagos',
    'storage sizing guide nigeria',
    'small medium large storage units',
    'what is the most popular self-storage size',
    'how many rooms will a 10x10 storage unit hold',
    'how big is a 5x10 storage unit',
  ],
});

export default function SizingPage() {
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SIZING_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    return (
        <>
           <script
             type="application/ld+json"
             dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
           />
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
