'use client';

import React from 'react';

interface StorageUnit {
  size: string;
  dimensions: string;
  squareFeet: string;
  bestFor: string;
  dimensionsShort?: string;
  squareFeetShort?: string;
}

const ComparisonSizes = () => {
  const storageUnits: StorageUnit[] = [
    {
      size: 'Small',
      dimensions: '3 x 5',
      squareFeet: '15 SF',
      bestFor: 'Small closet',
      dimensionsShort: "3' x 5'",
      squareFeetShort: '15 SF',
    },
    {
      size: 'Small',
      dimensions: '5 x 5',
      squareFeet: '25 SF',
      bestFor: 'Large closet',
      dimensionsShort: "5' x 5'",
      squareFeetShort: '25 SF',
    },
    {
      size: 'Small',
      dimensions: '5 x 10',
      squareFeet: '50 SF',
      bestFor: 'Large bedroom',
      dimensionsShort: "5' x 10'",
      squareFeetShort: '50 SF',
    },
    {
      size: 'Medium',
      dimensions: '6 x 10',
      squareFeet: '60 SF',
      bestFor: '2 bedrooms',
      dimensionsShort: "6' x 10'",
      squareFeetShort: '60 SF',
    },
    {
      size: 'Medium',
      dimensions: '10 x 10',
      squareFeet: '100 SF',
      bestFor: '2 bedrooms',
      dimensionsShort: "10' x 10'",
      squareFeetShort: '100 SF',
    },
    {
      size: 'Large',
      dimensions: '10 x 15',
      squareFeet: '150 SF',
      bestFor: '3-4 bedrooms',
      dimensionsShort: "10' x 15'",
      squareFeetShort: '150 SF',
    },
    {
      size: 'Large',
      dimensions: '10 x 20',
      squareFeet: '200 SF',
      bestFor: '4-5 bedrooms',
      dimensionsShort: "10' x 20'",
      squareFeetShort: '200 SF',
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
        <h2 className="text-center text-blue-900 text-3xl lg:text-5xl font-bold mb-6">
          Compare sizes before you rent
        </h2>

        {/* Divider */}
        <div className="flex justify-center mb-6 lg:mb-12">
          <hr className="h-1 w-12 bg-orange-500 border-0" />
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto lg:mb-12 mb-6 hidden sm:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Unit size
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Dimensions
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Square feet
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              {storageUnits.map((unit, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">{unit.size}</td>
                  <td className="py-4 px-4 text-gray-700">{unit.dimensions}</td>
                  <td className="py-4 px-4 text-gray-700">{unit.squareFeet}</td>
                  <td className="py-4 px-4 text-gray-700">{unit.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Table */}
        <div className="overflow-x-auto lg:mb-12 mb-6 sm:hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Size
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Dims • SF
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-800">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              {storageUnits.map((unit, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700 text-sm">{unit.size}</td>
                  <td className="py-4 px-4 text-gray-700 text-sm">
                    {unit.dimensionsShort} • {unit.squareFeetShort}
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-sm">{unit.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            type="button"
            className="w-full sm:w-auto px-8 py-3 border-1 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200"
          >
            Explore all locations
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSizes;