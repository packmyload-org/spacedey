import Image from "next/image";
import Link from "next/link";
import { toLocationSlug } from "@/lib/utils/locationSeo";

type FeaturedLocation = {
  city: string;
  image: string;
};

const FEATURED_LOCATIONS: FeaturedLocation[] = [
  { city: "Lagos", image: "/images/Lagos.jpg" },
  { city: "Abuja", image: "/images/Abuja.jpeg" },
  { city: "Kano", image: "/images/Kano.png" },
  { city: "Ibadan", image: "/images/Ibadan.jpg" },
];

export default function FeatureList() {
  return (
    <section className="bg-white px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center text-[#1642F0] hover:text-[#0F2FB4]">
          <Link
            href="/locations"
            className="inline-flex items-center justify-center px-6 py-3 text-xl font-black transition-colors"
          >
            Explore All Locations
          </Link>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#D96541]" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {FEATURED_LOCATIONS.map((location) => (
            <article key={location.city}>
              <div className="flex h-full flex-col rounded-[30px] border border-[#EFF3FB] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]">
                <div className="relative h-48 overflow-hidden rounded-[22px] sm:h-52">
                  <Image
                    src={location.image}
                    alt={`Storage in ${location.city}`}
                    fill
                    quality={60}
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) calc(50vw - 48px), 280px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col pt-5 text-[#355EFA] hover:text-white">
                  <h4 className="text-xl font-bold tracking-[-0.01em] text-[#16316B]">
                    Storage in {location.city}
                  </h4>

                  <Link
                    href={`/search?city=${toLocationSlug(location.city)}`}
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#5B7BFF] px-6 py-3 text-base font-bold transition hover:bg-[#355EFA]"
                  >
                    View All Facilities
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
