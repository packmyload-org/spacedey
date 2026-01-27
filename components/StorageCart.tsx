"use client";

import React from "react";
import { useStorageCart } from "@/contexts/StorageCartContext";

export default function StorageCart() {
  const { isOpen, closeCart, selectedUnit, cartItems, addToCart, removeFromCart } = useStorageCart();

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
          {selectedUnit ? (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-sm mb-2">{selectedUnit.locationName}</h3>
              <p className="text-xs text-gray-600 mb-3">{selectedUnit.locationAddress}</p>
              
              <div className="text-sm mb-3">
                <div className="font-medium">{selectedUnit.size}</div>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="text-gray-400 line-through">₦{selectedUnit.originalPrice}</span>
                  <span className="font-bold text-blue-600">₦{selectedUnit.currentPrice}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedUnit);
                  // Optionally close or show feedback
                }}
                className="w-full bg-blue-600 text-white py-2 rounded text-xs font-medium hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ) : null}

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

          {cartItems.length === 0 && !selectedUnit && (
            <p className="text-gray-500 text-sm text-center py-8">Select a unit to get started</p>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>₦{cartItems.reduce((sum, item) => sum + parseFloat(item.currentPrice), 0).toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold uppercase text-sm hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
