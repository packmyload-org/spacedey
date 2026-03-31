import type { ReactNode } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

export default function SearchLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
