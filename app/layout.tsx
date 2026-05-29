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
import { DEFAULT_KEYWORDS, SITE_NAME, getDefaultSeoImage } from "@/lib/seo";
import { env } from "@/config/env";
import CookieConsent from '@/components/ui/CookieConsent';
import Script from "next/script";

const defaultSeoImage = getDefaultSeoImage();

export const metadata: Metadata = {
  metadataBase: new URL(env.app.url),
  applicationName: SITE_NAME,
  title: {
    default: `Secure Storage Facilities in Lagos, Nigeria `,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Secure storage facilities in Lagos, Nigeria & West Africa. Largest options available for your needs.",
  keywords: DEFAULT_KEYWORDS,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: new URL(env.app.url),
    siteName: SITE_NAME,
    title: `Secure Storage Facilities in Lagos, Nigeria`,
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
    title: `Secure Storage Facilities in Lagos, Nigeria`,
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
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Spacedey",
              url: "https://spacedey.com",
              logo: "https://spacedey.com/logo.png",
              description:
                "Spacedey provides secure storage, warehousing, and logistics support solutions for individuals and businesses in Nigeria.",
              sameAs: [
                "https://packmyload.com",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                areaServed: "NG",
                availableLanguage: ["English"],
              },
            }),
          }}
        />
        <StorageCartProvider>
          <SitesProvider>
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
        <Suspense fallback={<p>Loading...</p>}>
          <RouteChangeTracker enabled={Boolean(googleTagManagerId)} />
        </Suspense>
        {vercelInsightsEnabled ? <VercelInsights /> : null}
        <GoogleTagManager containerId={googleTagManagerId} />
      </body>
    </html>
  );
}
