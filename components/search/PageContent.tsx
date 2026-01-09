"use client";

import React from "react";
import type { JSX } from "react";
import LocationCard from "@/components/Home/LocationCard";

export default function SearchPageContent(): JSX.Element {
  const items = React.useMemo(() => (
    Array.from({ length: 6 }).map((_, i) => ({
      name: `Spacedey - Location ${i + 1}`,
      address: `${100 + i} Market St, City, ST`,
      hours: "6am - 10pm",
      pricing: [
        { size: "S (6' x 8')", originalPrice: "72", currentPrice: "50.40" },
        { size: "M (5' x 9')", originalPrice: "68", currentPrice: "47.60" },
        { size: "L (18' x 9')", originalPrice: "243", currentPrice: "170.10" }
      ]
    }))
  ), []);

  return (
    <main className="container-px py-8 lg:py-12 fixed">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="h-72 lg:h-[600px] bg-neutral-200 border border-neutral-300 rounded-xl flex items-center justify-center text-neutral-600">
          {/* [Placeholder: Map Component] */}
        </div>
        <div className="h-96 lg:h-[600px] overflow-auto pr-2">
          <div className="space-y-4">
            {items.map((it, idx) => (
              <LocationCard key={idx} name={it.name} address={it.address} hours={it.hours} pricing={it.pricing} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


