"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import InputSearch from "@/components/ui/InputSearch";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { resolveStateFromQuery } from "@/lib/utils/siteLocations";

interface HeroSearchProps {
  states: string[];
}

type SearchSite = {
  address: string;
  city?: string;
  code: string;
  name: string;
  state?: string;
};

function buildSearchSites(states: string[]): SearchSite[] {
  return states.map((state) => ({
    address: state,
    code: state.toLowerCase().replace(/\s+/g, "-"),
    name: state,
    state,
  }));
}

export default function HeroSearch({ states }: Readonly<HeroSearchProps>) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState("");
  const searchSites = buildSearchSites(states);

  const handleReserve = () => {
    const resolvedState = resolveStateFromQuery(
      query || activeState,
      searchSites
    );

    if (!resolvedState) {
      return;
    }

    startTransition(() => {
      router.push(`/search?state=${encodeURIComponent(resolvedState)}`);
    });
  };

  return (
    <div className="mx-auto rounded-2xl bg-white py-4 shadow-2xl sm:max-w-6xl">
      <div className="mb-5 flex min-h-[44px] flex-wrap items-center justify-center gap-2 border-b border-neutral-200 px-2 sm:gap-10 sm:px-0">
        {states.map((state) => (
          <button
            key={state}
            type="button"
            onClick={() => {
              setActiveState(state);
              setQuery(state);
            }}
            className={`text-sm font-medium transition-colors sm:text-base ${
              activeState === state
                ? "border-b-2 border-[#1642F0] text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="mx-4 flex flex-col gap-3 py-2 sm:flex-row">
        <InputSearch
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleReserve();
            }
          }}
          placeholder="Enter your state, city, or site"
          className="flex-1"
          inputClassName="border-neutral-300 text-base focus:ring-orange-500"
        />
        <PrimaryButton
          type="button"
          onClick={handleReserve}
          variant="primary"
          className="whitespace-nowrap rounded-lg border-0 bg-[#D96541] px-8 py-4 text-white hover:bg-[#B85737] focus:ring-orange-500"
        >
          Reserve now
        </PrimaryButton>
      </div>
    </div>
  );
}
