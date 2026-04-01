import { cache } from "react";
import { connectTypeORM } from "@/lib/db";
import Site from "@/lib/db/entities/Site";
import {
  extractCityFromAddress,
  extractStateFromAddress,
  sortAlphabetically,
} from "@/lib/utils/siteLocations";
import { LOCATION_DETAILS } from "@/lib/utils/sampleLocations";

export interface SiteDirectory {
  cities: string[];
  states: string[];
}

const fallbackDirectory: SiteDirectory = {
  cities: sortAlphabetically(
    Array.from(
      new Set(
        Object.values(LOCATION_DETAILS)
          .map((location) => location.city)
          .filter(Boolean)
      )
    )
  ),
  states: sortAlphabetically(
    Array.from(
      new Set(
        Object.values(LOCATION_DETAILS)
          .map((location) => location.state)
          .filter(Boolean)
      )
    )
  ),
};

export const getSiteDirectory = cache(async (): Promise<SiteDirectory> => {
  try {
    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(Site);
    const sites = await repo.find({
      select: {
        city: true,
        state: true,
        address: true,
      },
    });

    if (sites.length === 0) {
      return fallbackDirectory;
    }

    const cities = sortAlphabetically(
      Array.from(
        new Set(
          sites
            .map((site) => site.city?.trim() || extractCityFromAddress(site.address))
            .filter(Boolean)
        )
      )
    );

    const states = sortAlphabetically(
      Array.from(
        new Set(
          sites
            .map((site) => site.state?.trim() || extractStateFromAddress(site.address))
            .filter(Boolean)
        )
      )
    );

    return {
      cities: cities.length > 0 ? cities : fallbackDirectory.cities,
      states: states.length > 0 ? states : fallbackDirectory.states,
    };
  } catch (error) {
    console.error("Failed to build site directory", error);
    return fallbackDirectory;
  }
});
