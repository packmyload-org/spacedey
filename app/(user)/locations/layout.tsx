import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import type { ReactNode } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

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
