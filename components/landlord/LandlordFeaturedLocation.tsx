import Image from 'next/image';

interface FeaturedLocationProps {
  title?: string;
  office?: string;
  address?: string;
  city?: string;
  space?: string;
  openingDate?: string;
  occupancy?: string;
  beforeImage?: string;
  partnerLink?: string;
}

export default function LandlordFeaturedLocation({
  title = "Featured location",
  office = "OFFICE",
  address = "6300 Wilshire Blvd.",
  city = "Los Angeles, CA",
  space = "4,000 sf in back-of-house mezzanine",
  openingDate = "November 2021",
  occupancy = "averaged 93% occupancy in 2023",
  beforeImage = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
  partnerLink = "#get-in-touch"
}: FeaturedLocationProps) {
  return (
    <div className="w-full bg-white py-16 px-6 lg:px-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-4xl font-bold text-blue-900 mb-8">
          {title}
        </h1>
        <div className="flex justify-center">
          <div className="w-20 h-1 bg-orange-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column - Information */}
          <div className="flex flex-col">
            
            {/* Office Header */}
            <div className="mb-12">
              <p className="text-sm font-bold text-blue-900 tracking-widest mb-3">
                {office}
              </p>
              <p className="text-4xl font-bold text-blue-900 mb-1 leading-tight">
                {address}
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {city}
              </p>
            </div>

            {/* Details Section */}
            <div className="space-y-6 mb-16">
              
              {/* Space */}
              <div className="flex gap-3">
                <span className="font-bold text-gray-900 whitespace-nowrap">Space:</span>
                <span className="text-gray-800">{space}</span>
              </div>

              {/* Opening Date */}
              <div className="flex gap-3">
                <span className="font-bold text-gray-900 whitespace-nowrap">Opening date:</span>
                <span className="text-gray-800">{openingDate}</span>
              </div>

              {/* Occupancy */}
              <div className="flex gap-3">
                <span className="font-bold text-gray-900 whitespace-nowrap">Occupancy:</span>
                <span className="text-gray-800">{occupancy}</span>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 items-center flex-wrap">
              {/* <a
                href={supportLink}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                <HelpCircle size={20} />
                Support
              </a> */}
              <a
                href={partnerLink}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                Partner with us
              </a>
            </div>

          </div>

          {/* Right Column - Images */}
          <div className="relative flex flex-col justify-center">
            
            {/* Before Image */}
            <div className="mb-8 relative z-10">
              <div className="relative">
                <p className="absolute top-4 left-4 bg-white text-blue-900 px-4 py-1 rounded font-bold text-sm z-20">
                  Before
                </p>
                <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg">
                  {/* <Image
                    src={beforeImage}
                    alt="Before"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  /> */}
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="absolute left-1/4 top-56 w-1 h-12 bg-blue-600 z-10"></div>

           
          </div>

        </div>
      </div>
    </div>
  );
}