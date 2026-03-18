import type { Metadata } from 'next';
import React from "react";
import Hero from "@/components/locations/Hero";
import LocationDiscoveryLinks from '@/components/locations/LocationDiscoveryLinks';
import LocationsSection from "@/components/locations/LocationsSection";
import StorageLocationsMap from "@/components/locations/StorageLocationsMap";
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Storage Locations Across Nigeria',
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

export default function LocationsPage() {
  return (
    <main className="flex flex-col min-h-screen pt-20">
      <Hero />
      <LocationsSection />
      <LocationDiscoveryLinks />
      <StorageLocationsMap />
    </main>
  );
}
