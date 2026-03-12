"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "../ui/Card";
import { useStorageCart } from "../../contexts/StorageCartContext";
import { getLocationDetails } from "../../lib/utils/sampleLocations";

interface LocationCardProps {
  name: string;
  address?: string;
  hours?: string;
  image: string;
  promo?: string;
  pricing?: Array<{ size: string; originalPrice: string; currentPrice: string }>;
  units?: Array<{
    id: string | number;
    siteId?: string;
    unitTypeId?: string;
    storageUnitId?: string;
    name: string;
    dimensionsLabel?: string;
    originalPrice: string;
    currentPrice: string;
    maxQuantity?: number;
    availableCount?: number;
  }>;
  onBook?: (unit?: { size: string; originalPrice: string; currentPrice: string }) => void;
  onViewDetails?: () => void;
  detailsLink?: string;
}

interface CardActionWrapperProps {
  children: React.ReactNode;
  className?: string;
  detailsLink?: string;
  onViewDetails: () => void;
}

function CardActionWrapper({
  children,
  className,
  detailsLink = "#",
  onViewDetails,
}: CardActionWrapperProps) {
  if (detailsLink && detailsLink !== "#") {
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
}

function LocationCard({
  name,
  address = "123 Main St, City, ST",
  hours = "6am - 10pm",
  image,
  promo,
  pricing,
  units,
  onBook = () => {},
  onViewDetails = () => {},
  detailsLink = "#",
}: LocationCardProps) {
  const { addToCart } = useStorageCart();
  
  // Get complete location details from centralized data if name matches known city
  const locationDetails = useMemo(() => getLocationDetails(name), [name]);
  
  // Use provided values or fall back to centralized location details
  const finalName = name || locationDetails.name;
  const finalAddress = address !== "123 Main St, City, ST" ? address : locationDetails.address;
  const finalHours = hours !== "6am - 10pm" ? hours : locationDetails.hours;
  
  // Handle image: prioritize prop, then handle http/https, then fallback
  const displayImage = useMemo(() => {
    if (image) {
       if (image.startsWith('http') || image.startsWith('/')) return image;
       return `/images/${image}`;
    }
    return locationDetails.image;
  }, [image, locationDetails.image]);

  // Fallback mock units if pricing not provided
  const displayUnits = useMemo(() => {
    if (units?.length) {
      return units;
    }

    if (pricing?.length) {
      return pricing.map((p, idx) => ({ id: idx + 1, size: p.size, originalPrice: p.originalPrice, currentPrice: p.currentPrice }));
    }

    return [
        { id: 1, size: "Small (6×8)", originalPrice: "7200", currentPrice: "5004.00" },
        { id: 2, size: "Medium (5×9)", originalPrice: "6800", currentPrice: "4706.00" },
        { id: 3, size: "Large (18×9)", originalPrice: "24300", currentPrice: "17001.00" },
    ];
  }, [pricing, units]);

  const getAvailableCount = (
    unit: (typeof displayUnits)[number]
  ) => ('availableCount' in unit ? unit.availableCount : undefined);

  return (
    <Card className="relative shadow rounded-xl mb-6 lg:p-4 bg-white lg:border-2 min-h-[330px] flex flex-col border-brand-blue hover:border-brand-blue transition-all duration-200 hover:shadow-lg group">
      <div className="lg:flex flex-1">
        {/* Left Side - Image & Basic Info */}
        <div
          className="lg:w-2/5 lg:flex lg:flex-col lg:border-r lg:pr-4"
        >
          <CardActionWrapper
            className="w-full text-left hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 cursor-pointer p-0 border-none bg-transparent"
            detailsLink={detailsLink}
            onViewDetails={onViewDetails}
          >
             <div className="w-full h-[170px] lg:h-[220px] relative rounded-t-xl lg:rounded-xl overflow-hidden bg-gray-100">
              {displayImage && (
                <Image
                    alt={finalName}
                    src={displayImage}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover rounded-t-xl lg:rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
          </CardActionWrapper>
         
          <div className="p-4 lg:px-0">
            <CardActionWrapper
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-brand-blue/40 cursor-pointer p-0 border-none bg-transparent"
              detailsLink={detailsLink}
              onViewDetails={onViewDetails}
            >
                <h3 className="text-xl font-semibold text-neutral-900 mb-1 group-hover:text-blue-700 transition-colors">{finalName}</h3>
                <div className="font-serif text-brand-graphite mb-2 text-sm">{finalAddress}</div>

                {/* Hours Info */}
                <div className="flex gap-2 font-serif items-center text-sm text-neutral-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1642F0" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v72h56A8,8,0,0,1,192,128Z"></path>
                </svg>
                <span>{finalHours}</span>
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
            </CardActionWrapper>

            {/* Mobile-only CTA */}
            <div className="mt-3 lg:hidden">
              {detailsLink && detailsLink !== "#" ? (
                 <Link href={detailsLink} className="block w-full">
                    <button className="w-full px-3 py-2 text-blue-600 font-medium text-xs border border-blue-600 rounded hover:bg-blue-50">View More</button>
                 </Link>
              ) : (
                <button onClick={onViewDetails} className="w-full px-3 py-2 text-blue-600 font-medium text-xs border border-blue-600 rounded hover:bg-blue-50">View More</button>
              )}
            </div>

            {/* Mobile Pricing Summary */}
            {displayUnits.length > 0 && (
              <div className="space-y-2 lg:hidden mt-3">
                {displayUnits.slice(0, 2).map((unit) => {
                  const unitLabel = 'size' in unit ? unit.size : unit.name;
                  const availableCount = getAvailableCount(unit);
                  const unitUnavailable = typeof availableCount === 'number' && availableCount < 1;

                  return (
                    <div
                      key={unit.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{unitLabel}</p>
                          {'dimensionsLabel' in unit && unit.dimensionsLabel ? (
                            <p className="text-xs text-neutral-500">{unit.dimensionsLabel}</p>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">₦{unit.currentPrice}</p>
                          <p className="text-[11px] text-neutral-400 line-through">₦{unit.originalPrice}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={unitUnavailable}
                        onClick={() => {
                          addToCart({
                            unitId: unit.id,
                            siteId: 'siteId' in unit ? unit.siteId : undefined,
                            unitTypeId: 'unitTypeId' in unit ? unit.unitTypeId : undefined,
                            storageUnitId: 'storageUnitId' in unit ? unit.storageUnitId : undefined,
                            size: unitLabel,
                            originalPrice: unit.originalPrice,
                            currentPrice: unit.currentPrice,
                            maxQuantity: 'maxQuantity' in unit ? unit.maxQuantity : undefined,
                            locationName: finalName,
                            locationAddress: finalAddress,
                            quantity: 1,
                          });
                          onBook({
                            size: unitLabel,
                            originalPrice: unit.originalPrice,
                            currentPrice: unit.currentPrice,
                          });
                        }}
                        className={`mt-3 w-full rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                          unitUnavailable
                            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                            : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {unitUnavailable ? 'Unavailable' : 'Select Unit'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Desktop Info */}
        <div className="flex-col justify-between px-4 py-6 w-3/5 hidden lg:flex">
          <div>
            <div className="text-xs text-neutral-600 uppercase tracking-wide mb-2">Location Details</div>
            <p className="text-sm text-neutral-700 mb-4 leading-relaxed">{finalAddress}</p>

            {promo && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Special Offer</p>
                <p className="text-sm text-green-900">{promo}</p>
              </div>
            )}

            {/* Desktop Pricing Table */}
            {displayUnits.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-600 uppercase mb-3">Available Units</p>
                <div className="space-y-2">
                  {displayUnits.map((unit, index) => {
                    const unitLabel = 'size' in unit ? unit.size : unit.name;
                    const availableCount = getAvailableCount(unit);
                    const unitUnavailable = typeof availableCount === 'number' && availableCount < 1;

                    return (
                    <div 
                      key={`${index}-${unit.id}`} 
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-sm transition-all duration-200 group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors">{unitLabel}</div>
                        {'dimensionsLabel' in unit && unit.dimensionsLabel ? (
                          <div className="text-xs text-neutral-500 mt-0.5">{unit.dimensionsLabel}</div>
                        ) : null}
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                           <span className="text-neutral-400 line-through">₦{unit.originalPrice}</span>
                           <strong className="text-blue-600 text-sm">₦{unit.currentPrice}</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            unitId: unit.id,
                            siteId: 'siteId' in unit ? unit.siteId : undefined,
                            unitTypeId: 'unitTypeId' in unit ? unit.unitTypeId : undefined,
                            storageUnitId: 'storageUnitId' in unit ? unit.storageUnitId : undefined,
                            size: unitLabel,
                            originalPrice: unit.originalPrice,
                            currentPrice: unit.currentPrice,
                            maxQuantity: 'maxQuantity' in unit ? unit.maxQuantity : undefined,
                            locationName: finalName,
                            locationAddress: finalAddress,
                            quantity: 1,
                          });
                          onBook({
                            size: unitLabel,
                            originalPrice: unit.originalPrice,
                            currentPrice: unit.currentPrice,
                          });
                        }}
                        disabled={unitUnavailable}
                        className={`text-xs font-medium ${
                          unitUnavailable
                            ? "cursor-not-allowed text-gray-400"
                            : "text-blue-600 underline hover:text-blue-700"
                        }`}
                      >
                        {unitUnavailable ? 'Unavailable' : 'Select Unit'}
                      </button>
                    </div>
                  )})}
                </div>
              </div>
            )}
          </div>

          <div>
            <a href={detailsLink} className="block w-full">
              <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded font-semibold uppercase text-sm hover:bg-blue-50 transition-colors">View More</button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LocationCard;
