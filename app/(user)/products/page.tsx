import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProductsHero from '@/components/products/ProductsHero';
import ProductsSpacedeyAddOns from '@/components/products/ProductsStufAddOns';
import { buildPageMetadata } from '@/lib/seo';
import React from 'react'

export const metadata: Metadata = buildPageMetadata({
  title: 'Moving and Packing Supplies',
  description:
    'Shop Spacedey moving and packing supplies, including boxes, tape, and storage add-ons designed to make moving and self storage easier in Nigeria.',
  path: '/products',
  keywords: [
    'moving boxes nigeria',
    'packing supplies lagos',
    'storage accessories nigeria',
    'moving supplies nigeria',
    'self storage add ons',
  ],
});

export default function ProductsPage() {
  return (
    <main>
      <Header />
      <ProductsHero />
      <ProductsSpacedeyAddOns />
      <Footer />

    </main>
  );
}
