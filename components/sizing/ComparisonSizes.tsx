'use client';

import React from 'react';
import Link from "next/link";
import { formatStorageUnitLabel } from '@/lib/pricing/storagePricing';

interface StorageUnit {
  size: string;
  width: number;
  depth: number;
  price: number;
}
const basePrice = "15000"
const ComparisonSizes = () => {
  const storageUnits: StorageUnit[] = [
    {
      size: 'Small',
      width: 5,
      depth: 5,
      price: Number(basePrice) * 5,
    },
    {
      size: 'Small',
      width: 5,
      depth: 10,
      price: Number(basePrice) * 5,
    },
    {
      size: 'Medium',
      width: 6,
      depth: 10,
      price: Number(basePrice) * 6,
    },
    {
      size: 'Medium',
      width: 10,
      depth: 10,
      price: Number(basePrice) * 10,
    },
    {
      size: 'Large',
      width: 10,
      depth: 15,
      price: Number(basePrice) * 10,
    },
    {
      size: 'Large',
      width: 10,
      depth: 20,
      price: Number(basePrice) * 10,
    },
  ];

  return (
    <section className="relative  lg:pt-40 lg:pb-28 py-12 lg:px-20 px-6 overflow-hidden">
      {/* Top Left SVG */}
      <div className="absolute top-0 left-0  -translate-x-1/8 -translate-y-1/8 pointer-events-none hidden lg:block">
        <svg width="666" height="880" viewBox="0 0 666 780" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-222.5 776.501C-129.767 780.345 42.356 798.465 131.5 684.001C220.644 569.537 265.423 495.125 427.5 499.001C589.578 502.877 638.833 71.912 665 66.001C686.26 61.1986 23.8734 -31.0866 -62.0638 11.9076C-148.001 54.9018 -127.07 287.967 -127.07 287.967C-127.07 287.967 -315.233 772.658 -222.5 776.501Z" fill="#1642F0" fillOpacity="0.05"/>
        </svg>
      </div>

      {/* Bottom Right SVG */}
      <div className="absolute bottom-0 right-0   translate-x-1/8 translate-y-1/8 pointer-events-none hidden lg:block">
        <svg width="583" height="819" viewBox="0 0 483 819" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M694.07 818.408C568.169 815.702 454.974 813.27 238.87 715.406C22.7653 617.542 220.098 435.351 104.331 387.381C-11.4357 339.411 -45.2879 219.371 80.2861 123.407C205.86 27.4422 438.336 -60.5554 545.063 56.558C651.79 173.671 631.217 618.634 631.217 618.634C631.217 618.634 819.972 821.113 694.071 818.408L694.07 818.408Z" fill="#F8F2E3"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <div className="mx-auto mb-6 max-w-3xl text-center lg:mb-12">
          <h2 className="text-center text-white text-3xl lg:text-4xl font-bold mb-6">
            Most popular self-storage sizes in Nigeria
          </h2>
          <p className="text-base leading-7 text-white md:text-lg">
            5 x 10 and 10 x 10 units are common starting points because they suit moving, personal storage, and small
            business overflow. Use this table to compare the sizes people ask about most before renting.
          </p>
        </div>

        {/* Divider */}
        <div className="flex justify-center mb-6 lg:mb-12">
          <hr className="h-1 w-12 bg-orange-500 border-0" />
        </div>

        {/* Desktop Table */}
        <div className="mb-6 lg:mb-12">
          <div className="w-full max-w-5xl mx-auto">
            <div className="w-full bg-white rounded-xl px-6 lg:px-8 py-8 border-0">
              <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Unit size
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Unit Details
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {storageUnits.map((unit, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-700 lg:text-lg text-base font-normal">{unit.size}</td>
                    <td className="py-4 px-4 text-gray-700 lg:text-lg text-base font-normal">
                      {formatStorageUnitLabel({ width: unit.width, depth: unit.depth, unit: 'ft' })}
                    </td>
                    <td className="py-4 px-4 text-gray-700 lg:text-lg text-base font-normal">{unit.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Mobile Table */}
        <div className="mb-6 lg:mb-12 sm:hidden">
          <div className="w-full max-w-6xl mx-auto">
            <div className="w-full bg-white rounded-xl px-6 py-8 border-0">
              <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Size
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Unit Details
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {storageUnits.map((unit, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-4 text-gray-700 lg:text-lg text-base font-normal">{unit.size}</td>
                    <td className="py-4 px-4 text-gray-700 lg:text-lg text-base font-normal">
                      {formatStorageUnitLabel({ width: unit.width, depth: unit.depth, unit: 'ft' })}
                    </td>
                    <td className="py-4 px-4 text-gray-700 lg:text-lg text-base font-normal">{unit.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link href="/locations">
          <button
            type="button"
            className="w-full sm:w-auto px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200"
          >
            Explore all locations
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ComparisonSizes;