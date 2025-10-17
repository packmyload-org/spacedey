import Image from 'next/image';

const LandlordWhatWeLookFor = () => {
  const buildingTypes = ['Office', 'Multifamily', 'Retail', 'Parking'];

  const spacePreferences = [
    '3,000 - 20,000 sf',
    'Side, service, loading, parking, or other entrance',
    'Finished and level floors',
    "8' ceilings",
    'Sprinkler system in place',
  ];

  return (
    <section 
      id="what-we-look-for" 
      className="w-full px-14 py-20 md:py-24 lg:py-28 bg-[#001f5c]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            What we look for
          </h2>
          <div className="w-12 h-1 bg-orange-500"></div>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Column 1: Building Types */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              Building types:
            </h3>
            <ul className="space-y-3">
              {buildingTypes.map((type, index) => (
                <li 
                  key={index} 
                  className="text-base md:text-lg text-white"
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Space Preferences */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              Space preferences:
            </h3>
            <ul className="space-y-3">
              {spacePreferences.map((preference, index) => (
                <li 
                  key={index} 
                  className="text-base md:text-lg text-white"
                >
                  {preference}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Image */}
          <div className="lg:col-span-5 flex items-start justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/197d7aadf2295bc3b17447d3706cd3c19f06cd5373edd4f06c9e11cc37dbd649?placeholderIfAbsent=true&width=596"
                alt="Stuf storage facility entrance"
                width={396}
                height={600}
                className="object-cover w-full h-auto"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandlordWhatWeLookFor;