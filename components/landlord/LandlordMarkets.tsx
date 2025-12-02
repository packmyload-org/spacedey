import Image from 'next/image';
import Link from 'next/link';

const LandlordMarkets = () => {
  return (
    <section className="w-full px-6 py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Column - Left */}
          <div className="w-full space-y-6">
            {/* Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#002366] leading-tight mb-3">
                Operating in 7 markets today
              </h2>
              <div className="w-12 h-1 bg-orange-500"></div>
            </div>

            {/* City List */}
            <div className="py-2">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#002366] tracking-wide">
                LA | NY | DC | SF | BOS | SEA | ATL
              </p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              Expanding our footprint in all 7 markets to better serve our communities
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="#get-in-touch"
                className="inline-block bg-white border-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 text-base"
              >
                Partner with us
              </Link>
            </div>
          </div>

          {/* Image Column - Right */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] aspect-[9/16]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F7da5f814e22c4159ae621921e3f9d5ff%2F17dec6ae0201415a9973afcb30ade863?width=539"
                alt="Phone screen showing Spacedey locations"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandlordMarkets;