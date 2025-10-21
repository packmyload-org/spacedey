"use client";

import React from "react";
import type { JSX } from "react";
import LocationCard from "@/components/sections/LocationCard";

export default function SearchPageContent(): JSX.Element {
  const items = React.useMemo(() => (
    Array.from({ length: 6 }).map((_, i) => ({
      name: `Stuf Storage - Location ${i + 1}`,
      address: `${100 + i} Market St, City, ST`,
      hours: "6am - 10pm",
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
              <LocationCard key={idx} name={it.name} address={it.address} hours={it.hours} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


