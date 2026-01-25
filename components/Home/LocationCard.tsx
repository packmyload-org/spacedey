"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Card from "../ui/Card";

import type { ButtonVariant } from "../ui/PrimaryButton";

// Hook to lock body scroll using CSS class
function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    const body = document.body;
    if (isLocked) {
      body.classList.add('lock-scroll');
    } else {
      body.classList.remove('lock-scroll');
    }

    return () => {
      body.classList.remove('lock-scroll');
    };
  }, [isLocked]);
}

interface LocationCardProps {
  name: string;
  address?: string;
  hours?: string;
  image: string;
  promo?: string;
  pricing?: Array<{ size: string; originalPrice: string; currentPrice: string }>;
  onBook?: (unit?: { size: string; originalPrice: string; currentPrice: string }) => void;
  onViewDetails?: () => void;
  detailsLink?: string;
  variant?: ButtonVariant;
}

function LocationCard({
  name = "Spacedey Location",
  address = "123 Main St, City, ST",
  hours = "6am - 10pm",
  image,
  promo,
  pricing,
  onBook = () => { },
  onViewDetails = () => { },
  detailsLink = "#",
}: Readonly<LocationCardProps>) {
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  // Custom hook to handle body scroll locking
  useScrollLock(showUnitSelector);

  // Use location image if not provided, fall back to imageUrl
  // Handle case where image is just a filename (e.g. "Lagos.jpg")
  const displayImage = useMemo(() => {
    if (!image) return null;
    if (image.startsWith('http') || image.startsWith('/')) return image;
    return `/images/${image}`;
  }, [image]);

  // Fallback mock units if pricing not provided
  const units = useMemo(() => {
    if (pricing?.length) {
      return pricing.map((p, idx) => ({ id: idx + 1, size: p.size, originalPrice: p.originalPrice, currentPrice: p.currentPrice }));
    }
    return [
      { id: 1, size: "Small (6×8)", originalPrice: "720", currentPrice: "500.40" },
      { id: 2, size: "Medium (5×9)", originalPrice: "680", currentPrice: "470.60" },
      { id: 3, size: "Large (18×9)", originalPrice: "2430", currentPrice: "1700.10" },
    ];
  }, [pricing]);

  return (
    <Card className="relative shadow rounded-xl mb-6 lg:p-4 bg-white lg:border-2 min-h-[330px] flex flex-col border-brand-blue hover:border-brand-blue">
      <div className="lg:flex flex-1">
        {/* Left Side - Image & Basic Info */}
        <div className="lg:w-2/5 lg:flex lg:flex-col lg:border-r lg:pr-4">
          <button
            type="button"
            className="w-full text-left hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 cursor-pointer p-0 border-none bg-transparent"
            onClick={onViewDetails}
          >
            <div className="w-full h-full relative rounded-t-xl lg:rounded-xl flex-1 flex-grow-0 overflow-hidden bg-red">
              <Image
                alt={name}
                src={displayImage || ''}
                width={600}
                height={170}
                style={{ height: '170px', width: '100%' }}
                className="object-cover rounded-t-xl lg:rounded-xl"
              />
            </div>
          </button>
         
          <div className="p-4 lg:px-0">
            <button
              type="button"
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-brand-blue/40 cursor-pointer p-0 border-none bg-transparent"
              onClick={onViewDetails}
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-1">{name}</h3>
              <div className="font-serif text-brand-graphite mb-2 text-sm">{address}</div>

              {/* Hours Info */}
              <div className="flex gap-2 font-serif items-center text-sm text-neutral-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1642F0" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v72h56A8,8,0,0,1,192,128Z"></path>
                </svg>
                <span>{hours}</span>
              </div>

              {/* Promo Tag */}
              {promo && (
                <div className="flex gap-2 font-serif items-center mb-3 p-2 bg-blue-50 rounded text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1642F0" viewBox="0 0 256 256">
                    <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"></path>
                  </svg>
                  <div className="text-xs">{promo}</div>
                </div>
              )}
            </button>

            {/* Mobile-only CTA */}
            <div className="flex gap-2 mt-3 lg:hidden">
              <a 
                href={detailsLink} 
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full px-3 py-2 text-blue-600 font-medium text-xs border border-blue-600 rounded hover:bg-blue-50">Details</button>
              </a>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUnitSelector(true);
                }} 
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded font-medium text-xs hover:bg-blue-700"
              >
                Select a Unit
              </button>
            </div>

            {/* Mobile Pricing Summary */}
            {units && units.length > 0 && (
              <div className="flex gap-2 font-serif items-center lg:hidden mt-3 p-2 bg-gray-50 rounded text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1642F0" viewBox="0 0 256 256">
                  <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z"></path>
                </svg>
                <span>Starting at: {units.slice(0, 3).map(u => `${u.size.split(' ')[0]} ${u.currentPrice}`).join(' • ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Desktop Info */}
        <div className="flex-col justify-between px-4 py-6 w-3/5 hidden lg:flex">
          <div>
            <div className="text-xs text-neutral-600 uppercase tracking-wide mb-2">Location Details</div>
            <p className="text-sm text-neutral-700 mb-4 leading-relaxed">{address}</p>

            {promo && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Special Offer</p>
                <p className="text-sm text-green-900">{promo}</p>
              </div>
            )}

            {/* Desktop Pricing Table */}
            {units && units.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-600 uppercase mb-3">Pricing</p>
                {units.map((unit, index) => (
                  <div key={index + unit.id} className="mb-3">
                    <div className="text-xs leading-3 text-neutral-600 mb-1">Starting at</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        {unit.size} - <span className="text-neutral-500 line-through"> ₦{unit.originalPrice}</span> <strong className="text-blue-600"> ₦{unit.currentPrice}</strong>
                      </div>
                      <button onClick={() => onBook(unit)} className="text-blue-600 underline text-xs font-medium hover:text-blue-700">Reserve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <a href={detailsLink} className="flex-1">
              <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded font-semibold uppercase text-sm hover:bg-blue-50">View Details</button>
            </a>
            <button onClick={() => setShowUnitSelector(true)} className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold uppercase text-sm hover:bg-blue-700">Book Now</button>
          </div>
        </div>
      </div>

      {/* MOBILE UNIT SELECTOR OVERLAY */}
      {showUnitSelector && (
        <div className="fixed inset-0 z-50 top-0 flex items-center justify-center bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-md mx-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-h-[80vh] flex flex-col">
              <div className="px-4 py-3 flex items-center justify-between border-b">
                <div className="flex-1 text-center">
                  <div className="w-14 h-1.5 bg-gray-200 rounded-full mx-auto" />
                </div>
                <button onClick={() => setShowUnitSelector(false)} className="text-gray-500 hover:text-gray-800">✕</button>
              </div>

              <div className="p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-3">Select a Unit</h3>
                <p className="text-sm text-gray-500 mb-4">Choose a unit to reserve — tap any option to continue.</p>

                <ul className="divide-y divide-gray-100">
                  <li className="p-3 text-sm text-gray-500">Available units</li>
                  {units.map((unit) => (
                    <li key={unit.id} className="p-3">
                      <button
                        onClick={() => {
                          onBook(unit);
                          setShowUnitSelector(false);
                        }}
                        className="w-full flex items-center justify-between gap-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-black">{unit.size}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-400 line-through">${unit.originalPrice}</div>
                          <div className="text-sm font-semibold text-black">${unit.currentPrice}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default LocationCard;
