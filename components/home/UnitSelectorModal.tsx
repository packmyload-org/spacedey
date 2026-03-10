"use client";

import { useStorageCart } from "../../contexts/StorageCartContext";
import { useScrollLock } from "../../lib/hooks/useScrollLock";

interface Unit {
  id: number | string;
  size: string;
  originalPrice: string;
  currentPrice: string;
}

interface UnitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  locationName: string;
  locationAddress: string;
  onBook: (unit: Unit) => void;
}

export default function UnitSelectorModal({
  isOpen,
  onClose,
  units,
  locationName,
  locationAddress,
  onBook,
}: UnitSelectorModalProps) {
  useScrollLock(isOpen);
  const { addToCart } = useStorageCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 top-0 flex items-center justify-center bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-4 mb-6 relative">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col w-full">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex-1 text-center">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 p-1 text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>

          <div className="p-4 overflow-y-auto">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Select a Unit</h3>
            <p className="text-sm text-gray-500 mb-6">Tap a unit below to proceed with your reservation.</p>

            <ul className="space-y-3">
              {units.map((unit) => (
                <li key={unit.id}>
                  <button
                    onClick={() => {
                      addToCart({
                        ...unit,
                        locationName,
                        locationAddress,
                        quantity: 1,
                      });
                      onBook(unit);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between gap-3 text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-500 hover:shadow-md hover:bg-blue-50/30 transition-all duration-200 group"
                  >
                    <div>
                      <div className="font-bold text-lg text-gray-900 group-hover:text-blue-700">{unit.size}</div>
                      <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Available now
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-gray-400 line-through mb-0.5">₦{unit.originalPrice}</div>
                      <div className="text-xl font-bold text-blue-600">₦{unit.currentPrice}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button onClick={onClose} className="w-full py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
