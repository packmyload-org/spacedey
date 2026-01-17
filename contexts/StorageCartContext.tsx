"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface StorageUnit {
  size: string;
  originalPrice: string;
  currentPrice: string;
}

export interface CartItem extends StorageUnit {
  locationName: string;
  locationAddress: string;
}

interface StorageCartContextType {
  isOpen: boolean;
  cartItems: CartItem[];
  selectedUnit: CartItem | null;
  openCart: (unit: StorageUnit, locationName: string, locationAddress: string) => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const StorageCartContext = createContext<StorageCartContextType | undefined>(undefined);

export function StorageCartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<CartItem | null>(null);

  const openCart = (unit: StorageUnit, locationName: string, locationAddress: string) => {
    const cartItem: CartItem = {
      ...unit,
      locationName,
      locationAddress,
    };
    setSelectedUnit(cartItem);
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
    // Optionally clear selectedUnit on close
    setTimeout(() => setSelectedUnit(null), 300); // Delay to allow animation
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <StorageCartContext.Provider
      value={{
        isOpen,
        cartItems,
        selectedUnit,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        clearCart,
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
