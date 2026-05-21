// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import RouteChangeTracker from '@/components/analytics/RouteChangeTracker';
import VercelInsights from '@/components/analytics/VercelInsights';
import { SitesProvider } from "@/contexts/SitesContext";
import { StorageCartProvider } from "@/contexts/StorageCartContext";
import StorageCartMount from "@/components/StorageCartMount";
import { DEFAULT_KEYWORDS, SITE_DESCRIPTION, SITE_NAME, getDefaultSeoImage, serializeJsonLd } from "@/lib/seo";
import { env } from "@/config/env";
import CookieConsent from '@/components/ui/CookieConsent';

const defaultSeoImage = getDefaultSeoImage();

export const metadata: Metadata = {
  metadataBase: new URL(env.app.url),
  applicationName: SITE_NAME,
  title: {
    default: `Secure Storage Facilities in Lagos, Nigeria `,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Affordable secure storage facilities in Lagos, Nigeria & West Africa. Largest options available for your needs.",
  keywords: DEFAULT_KEYWORDS,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: new URL(env.app.url),
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Secure Storage Facilities in Lagos, Nigeria`,
    description: "Affordable secure storage facilities in Lagos, Nigeria & West Africa. Largest options available for your needs.",
    locale: 'en_NG',
    images: [
      {
        url: defaultSeoImage,
        alt: `${SITE_NAME} self storage in Nigeria`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Secure Storage Facilities in Lagos, Nigeria`,
    description: "Affordable secure storage facilities in Lagos, Nigeria & West Africa. Largest options available for your needs.",
    images: [defaultSeoImage],
  },
  category: 'storage',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { googleTagManagerId, vercelInsightsEnabled } = env.integrations.analytics;
  


  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <GoogleTagManager containerId={googleTagManagerId} />

        <StorageCartProvider>
          <SitesProvider>
            <Suspense fallback={null}>
              <RouteChangeTracker enabled={Boolean(googleTagManagerId)} />
            </Suspense>
            {children}
            <StorageCartMount />
            <CookieConsent />
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  borderRadius: '18px',
                },
              }}
            />
          </SitesProvider>
        </StorageCartProvider>
        {vercelInsightsEnabled ? <VercelInsights /> : null}
      </body>
    </html>
  );
}
