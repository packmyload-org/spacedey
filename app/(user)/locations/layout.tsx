import type { Metadata } from 'next';
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import type { ReactNode } from "react";
import { buildPageMetadata } from '@/lib/seo';


export const metadata: Metadata = buildPageMetadata({
  title: 'Storage Facilities in Nigeria',
  description:
    'Browse Spacedey self storage locations across Lagos and other Nigerian cities, compare facilities, and reserve the right unit online.',
  path: '/locations',
  keywords: [
    'storage locations nigeria',
    'self storage locations lagos',
    'storage facilities nigeria',
    'storage units near me nigeria',
    'storage locations lagos',
  ],
});

export default function LocationsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
