import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MemberBenefitsProps {
  title?: ReactNode;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
}

export default function MemberBenefits({
  title = (<><span>Member</span><br/>benefits</>),
  subtitle = "Enhance your self storage experience with our exclusive member benefits and add-ons.",
  buttonText = "Book now",
  buttonLink = "/search",
  image = "/images/hero2.jpg",
}: MemberBenefitsProps) {
  return (
    <div className="w-full pt-16">
  <div className="w-full bg-[#1642F0] pt-16 lg:pt-24 pb-6 px-6 sm:px-8 lg:px-12 relative">
      {/* Wave Background at Bottom
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{
        clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)',
      }}></div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 px-4 sm:px-8 lg:px-20 items-center">
          
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight mx-auto lg:mx-0">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-white mb-8 sm:mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* CTA Button */}
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <Link
                href={buttonLink}
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-base sm:text-lg transition-colors duration-200"
              >
                {buttonText}
              </Link>
            </div>

          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="relative w-64 sm:w-72 md:w-96 lg:w-[520px] h-64 sm:h-80 md:h-96 lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={image}
                  alt="Member Benefits"
                  fill
                  className="object-cover"
                  sizes="(max-width: 340px) 70vw, (max-width: 424px) 20vw, 10vw"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

  </div>

  {/* Image below the blue section - background ends above this image */}
  <div className="-mt-8 relative z-20">
        <Image
          src="/images/LandlordHero2.jpg"
          alt="Landlord hero"
          width={1200}
          height={400}
          className="w-full h-auto rounded-md"
        />
      </div>
    </div>
  );
}