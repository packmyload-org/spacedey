"use client";

import React from "react";
import { useStorageCart } from "@/contexts/StorageCartContext";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function StorageCart() {
  const { isOpen, closeCart, cartItems, removeFromCart } = useStorageCart();
  const { isAuthenticated } = useAuthStore();

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
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
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
            <button className={`w-full bg-blue-600 text-white py-3 rounded font-semibold uppercase text-sm hover:bg-blue-700 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isAuthenticated}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
