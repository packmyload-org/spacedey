'use client';

import React from 'react';
import Link from 'next/link';
import { formatStorageUnitLabel } from '@/lib/pricing/storagePricing';

interface StorageUnit {
  size: string;
  width: number;
  depth: number;
  needs: string;
}

const BASE_PRICE_PER_SQFT = 3000;

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};

const storageUnits: StorageUnit[] = [
  {
    size: 'Small',
    width: 5,
    depth: 5,
    needs: 'Boxes, documents, seasonal items',
  },
  {
    size: 'Small',
    width: 5,
    depth: 10,
    needs: 'Studio apartment items, bikes',
  },
  {
    size: 'Medium',
    width: 6,
    depth: 10,
    needs: '1-bedroom apartment storage',
  },
  {
    size: 'Medium',
    width: 10,
    depth: 10,
    needs: '2-bedroom apartment storage',
  },
  {
    size: 'Large',
    width: 10,
    depth: 15,
    needs: 'Office inventory, large furniture',
  },
  {
    size: 'Large',
    width: 10,
    depth: 20,
    needs: 'Full household or business storage',
  },
];

const ComparisonSizes = () => {
  return (
    <section className="relative lg:pt-40 lg:pb-28 py-12 lg:px-20 px-6 overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <div className="mx-auto mb-6 max-w-3xl text-center lg:mb-12">
          <h2 className="text-center text-white text-3xl lg:text-4xl font-bold mb-6">
            Most popular self-storage sizes in Nigeria
          </h2>

          <p className="text-base leading-7 text-white md:text-lg">
            5 x 10 and 10 x 10 units are common starting points because they
            suit moving, personal storage, and small business overflow.
          </p>
        </div>

        {/* Divider */}
        <div className="flex justify-center mb-6 lg:mb-12">
          <hr className="h-1 w-12 bg-orange-500 border-0" />
        </div>

        {/* Desktop Table */}
        <div className="mb-6 lg:mb-12">
          <div className="w-full max-w-6xl mx-auto">
            <div className="w-full bg-white rounded-xl px-6 lg:px-8 py-8 border-0 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-4 font-bold text-gray-800">
                      Unit Size
                    </th>

                    <th className="text-left py-4 px-4 font-bold text-gray-800">
                      Dimensions
                    </th>

                    <th className="text-left py-4 px-4 font-bold text-gray-800">
                      Best For
                    </th>

                    <th className="text-left py-4 px-4 font-bold text-gray-800">
                      Monthly Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {storageUnits.map((unit, index) => {
                    const squareFeet = unit.width * unit.depth;
                    const price = BASE_PRICE_PER_SQFT * squareFeet;

                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-gray-700 text-base lg:text-lg">
                          {unit.size}
                        </td>

                        <td className="py-4 px-4 text-gray-700 text-base lg:text-lg">
                          {formatStorageUnitLabel({
                            width: unit.width,
                            depth: unit.depth,
                            unit: 'ft',
                          })}
                        </td>

                        <td className="py-4 px-4 text-gray-700 text-base lg:text-lg">
                          {unit.needs}
                        </td>

                        <td className="py-4 px-4 text-gray-700 text-base lg:text-lg font-semibold">
                          {formatNaira(price)}
                        </td>
                      </tr>
                    );
                  })}
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