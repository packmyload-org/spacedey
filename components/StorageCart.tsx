"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStorageCart } from "@/contexts/StorageCartContext";
import { useAuthStore } from "@/lib/store/useAuthStore";
import type { CartItem } from "@/contexts/StorageCartContext";

function isAddOn(item: CartItem) {
  return item.itemType === "addon";
}

function getStorageItems(cartItems: CartItem[]) {
  return cartItems.filter((item) => !isAddOn(item));
}

function getCheckoutValidationMessage(cartItems: CartItem[]) {
  const storageItems = getStorageItems(cartItems);
  const storageQuantity = storageItems.reduce((sum, item) => sum + item.quantity, 0);

  if (storageQuantity === 0) {
    return "Add a storage unit before checkout.";
  }

  if (cartItems.some(isAddOn)) {
    return "Cart add-ons are not included in online checkout yet. Remove add-ons to continue.";
  }

  return null;
}

export default function StorageCart() {
  const { isOpen, closeCart, cartItems, removeFromCart } = useStorageCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const storageItems = getStorageItems(cartItems);
  const addOnItems = cartItems.filter(isAddOn);
  const storageTotal = storageItems.reduce((sum, item) => sum + (parseFloat(item.currentPrice) * item.quantity), 0);
  const addOnTotal = addOnItems.reduce((sum, item) => sum + (parseFloat(item.currentPrice) * item.quantity), 0);
  const validationMessage = getCheckoutValidationMessage(cartItems);
  const visibleCheckoutMessage = checkoutError ?? validationMessage;

  const handleProceedToCheckout = () => {
    if (validationMessage) {
      setCheckoutError(validationMessage);
      return;
    }

    if (!isAuthenticated) {
      setCheckoutError(null);
      closeCart();
      router.push("/auth/signin");
      return;
    }

    setCheckoutError(null);

    closeCart();
    router.push("/checkout");
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
            <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-sm">
              <div className="flex justify-between font-semibold">
                <span>Storage subtotal:</span>
                <span>₦{storageTotal.toFixed(2)}</span>
              </div>
              {addOnItems.length > 0 ? (
                <div className="flex justify-between text-gray-500">
                  <span>Add-ons in cart:</span>
                  <span>₦{addOnTotal.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                <span>Cart total:</span>
                <span>₦{(storageTotal + addOnTotal).toFixed(2)}</span>
              </div>
            </div>
            {addOnItems.length > 0 ? (
              <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Add-ons stay in your cart, but they are not included in the current online checkout flow.
              </p>
            ) : null}
            {visibleCheckoutMessage ? (
              <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-600">{visibleCheckoutMessage}</p>
            ) : null}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={Boolean(validationMessage)}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold uppercase text-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
