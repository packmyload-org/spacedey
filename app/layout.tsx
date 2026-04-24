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
    default: `Affordable Secure Self Storage in Nigeria | ${SITE_NAME} `,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Self Storage in Nigeria`,
    description: SITE_DESCRIPTION,
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
    title: `${SITE_NAME} | Self Storage in Nigeria`,
    description: SITE_DESCRIPTION,
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
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: env.app.url,
    description: SITE_DESCRIPTION,
    logo: `${env.app.url}/apple-icon.png`,
    sameAs: [
      'https://www.instagram.com/spacedey.ng/',
      'https://x.com/spacedeyng',
      'https://www.linkedin.com/company/spacedey/',
      'https://web.facebook.com/spacedeyng/?_rdc=1&_rdr#',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: env.app.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${env.app.url}/search?state={state}`,
      'query-input': 'required name=state',
    },
  };

  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <GoogleTagManager containerId={googleTagManagerId} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
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
