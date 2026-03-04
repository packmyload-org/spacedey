import type { Metadata } from "next";
import "./globals.css";
import ZendeskWidget from "@/components/ZendeskWidget";
import { StorageCartProvider } from "@/contexts/StorageCartContext";
import StorageCart from "@/components/StorageCart";

export const metadata: Metadata = {
  title: "Spacedey | Storage made simple",
  description: "Find, compare, and reserve secure storage units across Nigeria."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <StorageCartProvider>
          <ZendeskWidget />
          {children}
          <StorageCart />
        </StorageCartProvider>
      </body>
    </html>
  );
}