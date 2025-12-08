import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProductsHero from '@/components/products/ProductsHero';
import ProductsStufAddOns from '@/components/products/ProductsStufAddOns';
import React from 'react'
export default function ProductsPage() {
  return (
    <main>
      <Header />
      <ProductsHero />
      <ProductsStufAddOns />
      <Footer />

    </main>
  );
}