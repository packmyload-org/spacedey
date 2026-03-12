"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStorageCart } from "@/contexts/StorageCartContext";
import { useSitesData } from "@/contexts/SitesContext";
import { useAuthStore } from "@/lib/store/useAuthStore";
import type { CartItem } from "@/contexts/StorageCartContext";

function resolveCheckoutTarget(cartItems: CartItem[], sites: ReturnType<typeof useSitesData>["sites"]) {
  const selectedItem = cartItems.find((item) => item.itemType !== "addon");

  if (!selectedItem) {
    return null;
  }

  if (selectedItem.siteId && selectedItem.unitTypeId) {
    return {
      siteId: selectedItem.siteId,
      unitTypeId: selectedItem.unitTypeId,
      storageUnitId: selectedItem.storageUnitId,
    };
  }

  const itemId = selectedItem.storageUnitId || selectedItem.unitId;
  if (!itemId) {
    return null;
  }

  const normalizedItemId = String(itemId);

  for (const site of sites) {
    for (const unitType of site.unitTypes || []) {
      if (unitType.id === normalizedItemId) {
        return {
          siteId: site.id,
          unitTypeId: unitType.id,
        };
      }

      const storageUnit = unitType.units?.find((unit) => unit.id === normalizedItemId);
      if (storageUnit) {
        return {
          siteId: site.id,
          unitTypeId: unitType.id,
          storageUnitId: storageUnit.id,
        };
      }
    }
  }

  return null;
}

export default function StorageCart() {
  const { isOpen, closeCart, cartItems, removeFromCart } = useStorageCart();
  const { isAuthenticated } = useAuthStore();
  const { sites } = useSitesData();
  const router = useRouter();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleProceedToCheckout = () => {
    const checkoutTarget = resolveCheckoutTarget(cartItems, sites);

    if (!isAuthenticated) {
      setCheckoutError(null);
      closeCart();
      router.push("/auth/signin");
      return;
    }

    if (!checkoutTarget) {
      setCheckoutError("Add a storage unit before checkout.");
      return;
    }

    setCheckoutError(null);

    const params = new URLSearchParams({
      siteId: checkoutTarget.siteId,
      unitTypeId: checkoutTarget.unitTypeId,
    });

    if (checkoutTarget.storageUnitId) {
      params.set("storageUnitId", checkoutTarget.storageUnitId);
    }

    closeCart();
    router.push(`/checkout?${params.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={closeCart}
      />

      {/* Right Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Storage Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Cart Items List */}
          {cartItems.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3">Items in Cart</h4>
              <div className="space-y-2">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-2 bg-gray-50 rounded text-xs">
                    <div>
                      <div className="font-medium">{item.size}</div>
                      <div className="text-gray-600">{item.locationName}</div>
                      <div className="text-gray-500">{item.itemType === "addon" ? "Add-on" : "Storage unit"}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <button
                      onClick={() => {
                        setCheckoutError(null);
                        removeFromCart(idx);
                      }}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cartItems.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">Select a unit to get started</p>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>₦{cartItems.reduce((sum, item) => sum + (parseFloat(item.currentPrice) * item.quantity), 0).toFixed(2)}</span>
            </div>
            {checkoutError ? (
              <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-600">{checkoutError}</p>
            ) : null}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold uppercase text-sm hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
