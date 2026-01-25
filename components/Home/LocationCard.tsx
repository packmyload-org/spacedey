"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "../ui/Card";

import type { ButtonVariant } from "../ui/PrimaryButton";

// Hook to lock body scroll using CSS class
function useScrollLock(isLocked: boolean) {
// ... existing useScrollLock ...
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
  onViewDetails,
  detailsLink,
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

  const MainWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (detailsLink) {
      return <Link href={detailsLink} className={className}>{children}</Link>;
    }
    return (
      <button
        type="button"
        className={className}
        onClick={onViewDetails}
      >
        {children}
      </button>
    );
  };

  return (
    <Card className="relative shadow rounded-xl mb-6 lg:p-4 bg-white lg:border-2 min-h-[330px] flex flex-col border-brand-blue hover:border-brand-blue transition-all duration-200 hover:shadow-lg group">
      <div className="lg:flex flex-1">
        {/* Left Side - Image & Basic Info */}
        <div className="lg:w-2/5 lg:flex lg:flex-col lg:border-r lg:pr-4">
          <MainWrapper className="w-full text-left hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 cursor-pointer p-0 border-none bg-transparent">
            <div className="w-full h-full relative rounded-t-xl lg:rounded-xl flex-1 flex-grow-0 overflow-hidden bg-gray-100">
              {displayImage && (
                <Image
                  alt={name}
                  src={displayImage}
                  width={600}
                  height={170}
                  style={{ height: '170px', width: '100%' }}
                  className="object-cover rounded-t-xl lg:rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
          </MainWrapper>
         
          <div className="p-4 lg:px-0">
            <MainWrapper className="w-full text-left focus:outline-none focus:ring-2 focus:ring-brand-blue/40 cursor-pointer p-0 border-none bg-transparent">
              <h3 className="text-xl font-semibold text-neutral-900 mb-1 group-hover:text-blue-700 transition-colors">{name}</h3>
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
            </MainWrapper>

            {/* Mobile-only CTA */}
            <div className="flex gap-2 mt-3 lg:hidden">
              {detailsLink ? (
                 <Link href={detailsLink} className="flex-1">
                    <button className="w-full px-3 py-2 text-blue-600 font-medium text-xs border border-blue-600 rounded hover:bg-blue-50">Details</button>
                 </Link>
              ) : (
                <button onClick={onViewDetails} className="flex-1 w-full px-3 py-2 text-blue-600 font-medium text-xs border border-blue-600 rounded hover:bg-blue-50">Details</button>
              )}
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
              <div className="flex gap-2 font-serif items-center lg:hidden mt-3 p-2 bg-gray-50 rounded text-xs border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1642F0" viewBox="0 0 256 256" className="flex-shrink-0">
                  <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z"></path>
                </svg>
                <span className="text-gray-700">Starting at: {units.slice(0, 3).map(u => `${u.size.split(' ')[0]} ₦${u.currentPrice}`).join(' • ')}</span>
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
                <p className="text-xs font-semibold text-neutral-600 uppercase mb-3">Available Units</p>
                <div className="space-y-2">
                  {units.map((unit, index) => (
                    <div 
                      key={index + unit.id} 
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-sm transition-all duration-200 group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors">{unit.size}</div>
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                           <span className="text-neutral-400 line-through">₦{unit.originalPrice}</span>
                           <strong className="text-blue-600 text-sm">₦{unit.currentPrice}</strong>
                        </div>
                      </div>
                      <button 
                        onClick={() => onBook(unit)} 
                        className="px-4 py-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-bold rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                      >
                        RESERVE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <a href={detailsLink} className="flex-1">
              <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded font-semibold uppercase text-sm hover:bg-blue-50 transition-colors">View Details</button>
            </a>
            <button 
              onClick={() => setShowUnitSelector(true)} 
              className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold uppercase text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE UNIT SELECTOR OVERLAY */}
      {showUnitSelector && (
        <div className="fixed inset-0 z-50 top-0 flex items-center justify-center bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-md mx-4 mb-6 relative">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col w-full">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex-1 text-center">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />
                </div>
                <button 
                  onClick={() => setShowUnitSelector(false)} 
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
                          onBook(unit);
                          setShowUnitSelector(false);
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
                 <button onClick={() => setShowUnitSelector(false)} className="w-full py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default LocationCard;