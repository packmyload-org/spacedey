import React from 'react'
import Image from "next/image";

const QuoteSection = () => {
  const logos = [
    { src: "/images/CompanyLogo1.svg", alt: "Fast Company" },
    { src: "/images/CompanyLogo2.svg", alt: "Inc." },
    { src: "/images/CompanyLogo3.svg", alt: "The New York Times" },
    { src: "/images/CompanyLogo4.svg", alt: "Yahoo!" },
    { src: "/images/CompanyLogo5.svg", alt: "Forbes" }
  ];

  return (
    <section className="py-12 bg-[#F9F5F0] mb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
