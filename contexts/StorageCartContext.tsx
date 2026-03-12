"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface StorageUnit {
  unitId?: string | number;
  siteId?: string;
  unitTypeId?: string;
  storageUnitId?: string;
  itemType?: "storage" | "addon";
  size: string;
  originalPrice: string;
  currentPrice: string;
  maxQuantity?: number;
}

export interface CartItem extends StorageUnit {
  locationName: string;
  locationAddress: string;
  quantity: number;
}

const STORAGE_CART_KEY = "spacedey-storage-cart";

interface StorageCartContextType {
  isOpen: boolean;
  cartItems: CartItem[];
  cartCount: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  clearStorageItems: () => void;
}

const StorageCartContext = createContext<StorageCartContextType | undefined>(undefined);

export function StorageCartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasHydratedCart, setHasHydratedCart] = useState(false);

  useEffect(() => {
    try {
      const storedItems = globalThis.localStorage.getItem(STORAGE_CART_KEY);
      if (!storedItems) {
        return;
      }

      const parsedItems = JSON.parse(storedItems) as Partial<CartItem>[];
      if (Array.isArray(parsedItems)) {
        setCartItems(
          parsedItems.map((item) => ({
            unitId: item.unitId,
            siteId: typeof item.siteId === "string" ? item.siteId : undefined,
            unitTypeId: typeof item.unitTypeId === "string" ? item.unitTypeId : undefined,
            storageUnitId: typeof item.storageUnitId === "string" ? item.storageUnitId : undefined,
            itemType: item.itemType === "addon" ? "addon" : "storage",
            size: item.size || "",
            originalPrice: item.originalPrice || "0",
            currentPrice: item.currentPrice || "0",
            maxQuantity: item.maxQuantity,
            locationName: item.locationName || "",
            locationAddress: item.locationAddress || "",
            quantity: Math.max(1, Number(item.quantity) || 1),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to restore storage cart", error);
    } finally {
      setHasHydratedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedCart) {
      return;
    }

    try {
      globalThis.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to persist storage cart", error);
    }
  }, [cartItems, hasHydratedCart]);

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (entry) =>
          (entry.unitId && item.unitId
            ? entry.unitId === item.unitId && entry.itemType === item.itemType
            : entry.locationName === item.locationName &&
              entry.locationAddress === item.locationAddress &&
              entry.size === item.size &&
              entry.itemType === item.itemType)
      );

      if (existingIndex === -1) {
        return [...prev, { ...item, quantity: Math.max(1, Number(item.quantity) || 1) }];
      }

      const existingItem = prev[existingIndex];
      const maxQuantity = item.maxQuantity ?? existingItem.maxQuantity;

      if (maxQuantity && existingItem.quantity >= maxQuantity) {
        return prev;
      }

      return prev.map((entry, index) =>
        index === existingIndex
          ? {
              ...entry,
              maxQuantity,
              quantity: entry.quantity + Math.max(1, Number(item.quantity) || 1),
            }
          : entry
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearStorageItems = () => {
    setCartItems((prev) => prev.filter((item) => item.itemType === "addon"));
  };

  return (
    <StorageCartContext.Provider
      value={{
        isOpen,
        cartItems,
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        clearCart,
        clearStorageItems,
      }}
    >
      {children}
    </StorageCartContext.Provider>
  );
}

export function useStorageCart(): StorageCartContextType {
  const context = useContext(StorageCartContext);
  if (!context) {
    throw new Error("useStorageCart must be used within a StorageCartProvider");
  }
  return context;
}
