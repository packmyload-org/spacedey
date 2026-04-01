"use client";

import dynamic from "next/dynamic";
import { useStorageCart } from "@/contexts/StorageCartContext";

const StorageCart = dynamic(() => import("@/components/StorageCart"), {
  loading: () => null,
  ssr: false,
});

export default function StorageCartMount() {
  const { isOpen } = useStorageCart();

  return isOpen ? <StorageCart /> : null;
}
