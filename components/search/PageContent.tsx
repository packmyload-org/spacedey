"use client";

import React from "react";
import LocationCard from "@/components/Home/LocationCard";
import { SAMPLE_CITIES, makeLocationData } from "@/lib/sampleLocations";

export default function SearchPageContent(): React.ReactElement {
  const items = React.useMemo(() => SAMPLE_CITIES.map((city, i) => makeLocationData(city, i)), []);

  return (
    <main className="container-px py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="h-72 lg:h-[600px] bg-neutral-200 border border-neutral-300 rounded-xl flex items-center justify-center text-neutral-600">
          {/* [Placeholder: Map Component] */}
          Map placeholder
        </div>
        <div className="h-96 lg:h-[600px] overflow-auto pr-2">
          <div className="space-y-4">
            {items.map((it, idx) => (
              <LocationCard
                key={idx}
                name={it.name}
                address={it.address}
                hours={it.hours}
                pricing={it.pricing}
                imageUrl={it.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}



