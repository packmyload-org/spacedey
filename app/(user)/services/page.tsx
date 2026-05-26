import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProductsHero from '@/components/products/ProductsHero';
import ProductsSpacedeyAddOns from '@/components/products/ProductsStufAddOns';
import { buildPageMetadata } from '@/lib/seo';
import React from 'react'

export const metadata: Metadata = buildPageMetadata({
  title: 'Services | Self Storage Facilities in Lagos, Nigeria',
  description:
    'Explore Spacedey services, including packing, moving, and storage solutions for homes and businesses in Nigeria. Learn about our storage unit sizes, pricing, and more.',
  path: '/services',
  keywords: [
    'services',
    'self storage services',
    'storage services lagos',
    'storage services nigeria',
    'storage services in nigeria',
  ],
});

export default function ServicesPage() {
  return (
    <main>
      <Header />
      <ProductsHero />
      <ProductsSpacedeyAddOns />
      <Footer />
    </main>
  );
}
