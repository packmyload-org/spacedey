import Image from "next/image";
import HeroSearch from "@/components/home/HeroSearch";

const TRUSTED_USERS = [
  { src: "/images/Ellipse1.png", className: "bg-amber-200" },
  { src: "/images/Ellipse2.png", className: "bg-rose-200" },
  { src: "/images/Ellipse3.png", className: "bg-blue-200" },
  { src: "/images/Ellipse4.png", className: "hidden sm:block bg-green-200" },
];

const HERO_GALLERY = [
  {
    src: "/images/hero2.jpg",
    alt: "Secure self storage facility available through Spacedey",
  },
  {
    src: "/images/hero3.jpg",
    alt: "Storage unit interior prepared for move-in",
  },
  {
    src: "/images/hero4.jpg",
    alt: "Organized storage space for household and business items",
  },
  {
    src: "/images/hero5.jpg",
    alt: "Spacedey-style self storage imagery for customers in Nigeria",
  },
];

interface HeroSectionProps {
  states: string[];
}

export default function HeroSection({ states }: Readonly<HeroSectionProps>) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#1642F0]">
      <div className="w-full px-4 pb-10 pt-24">
        <div className="mx-auto flex w-fit items-center gap-3 rounded-xl bg-white px-3 py-1 shadow-lg sm:px-6 sm:py-2">
          <div className="flex -ml-1 items-center">
            {TRUSTED_USERS.map((user, index) => (
              <div
                key={user.src}
                className={`-ml-2 h-6 w-6 rounded-full border-2 border-white sm:-ml-3 sm:h-8 sm:w-8 ${user.className} ${index === 0 ? "ml-0" : ""
                  }`}
              >
                <Image
                  src={user.src}
                  alt=""
                  width={32}
                  height={32}
                  sizes="32px"
                  className="rounded-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-700 sm:text-sm">
            Trusted by thousands of renters across{" "}
            <span className="text-neutral-400">7 cities</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <div className="mx-auto w-full max-w-7xl text-center">
          <h1 className="mt-2 mb-8 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">
            Self-Storage In Your Neighborhood
          </h1>

          <p className="mx-auto mb-6 max-w-3xl text-base text-white/95 sm:text-xl lg:text-2xl">
            No hidden fees. Fast booking. A smarter way to store.
          </p>

          <HeroSearch states={states} />

          <div className="mt-6 w-full flex flex-wrap items-center justify-center gap-1 px-2 sm:gap-2">
            {HERO_GALLERY.map((image, i) => (
              <div
                key={image.src + i}
                className="min-w-0 flex-1 basis-[22%] sm:w-[300px] sm:flex-none"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={250}
                  height={340}
                  quality={60}
                  sizes="(max-width: 639px) 23vw, 300px"
                  className="h-auto w-full rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
