import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section>
    <div className="relative w-full h-full bg-[#1642F0] pt-12 overflow-hidden">
      <div className="max-w-full mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-6 md:pt-24 md:pb-8 lg:pt-32 lg:pb-10">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 z-10">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-[1.1] text-white">
              Transform unsellable space into rent
            </h1>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              We monetize underutilized real estate as tech-enabled self storage
              to create a new rental stream and building amenity.
            </p>

            <Link
              href="#get-in-touch"
              className="inline-block bg-[#ff6b35] hover:bg-[#e55a28] text-white font-semibold text-lg px-12 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Right Column - Image with rounded border */}
          <div className="relative z-10 flex sm:justify-center lg:justify-end left-0">
            <div className="relative w-full max-w-full aspect-[4/3]  ">
              <div className="relative w-full h-full sm:ml-0 lg:ml-[64px]">
                <Image
                  src="/images/LandlordHero.jpg"
                  alt="Landlord Hero"
                  fill
                  sizes="(max-width: 768px) 90vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
        <img
          src="/images/LandlordHero2.jpg"
          alt=""
          className="w-full h-24 object-cover "
        />
        <img
          src="/images/Landlordpartners.jpg"
          alt=""
          className="w-full h-24 object-cover my-10 "
        />
    </section>
  );
}
