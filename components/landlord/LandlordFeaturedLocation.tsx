// import Image from 'next/image';

// interface FeaturedLocationProps {
//   title?: string;
//   office?: string;
//   address?: string;
//   city?: string;
//   space?: string;
//   openingDate?: string;
//   occupancy?: string;
//   image?: string;
//   partnerLink?: string;
// }

// export default function FeaturedLocation({
//   title = "Featured location",
//   office = "OFFICE",
//   address = "6300 Wilshire Blvd.",
//   city = "Los Angeles, CA",
//   space = "4,000 sf in back-of-house mezzanine",
//   openingDate = "November 2021",
//   occupancy = "averaged 93% occupancy in 2023",
//   image = "/featured-location.jpg",
//   partnerLink = "#get-in-touch"
// }: FeaturedLocationProps) {
//   return (
//     <div className="w-full bg-white py-12 px-6">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-5xl font-bold text-blue-900 mb-6">
//           {title}
//         </h1>
//         <div className="flex justify-center">
//           <div className="w-16 h-1.5 bg-orange-500 rounded-full"></div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
//           {/* Left Column - Information */}
//           <div className="flex flex-col justify-between">
            
//             {/* Office Header */}
//             <div className="mb-12">
//               <p className="text-sm font-bold text-blue-900 tracking-widest mb-4">
//                 {office}
//               </p>
//               <p className="text-4xl font-bold text-blue-900 mb-2">
//                 {address}
//               </p>
//               <p className="text-3xl font-bold text-blue-900">
//                 {city}
//               </p>
//             </div>

//             {/* Details Section */}
//             <div className="space-y-8 mb-12">
              
//               {/* Space */}
//               <div>
//                 <p className="text-sm font-bold text-gray-900 mb-2">
//                   <strong>Space:</strong>
//                 </p>
//                 <p className="text-base text-gray-800 leading-relaxed">
//                   {space}
//                 </p>
//               </div>

//               {/* Opening Date */}
//               <div>
//                 <p className="text-sm font-bold text-gray-900 mb-2">
//                   <strong>Opening date:</strong>
//                 </p>
//                 <p className="text-base text-gray-800 leading-relaxed">
//                   {openingDate}
//                 </p>
//               </div>

//               {/* Occupancy */}
//               <div>
//                 <p className="text-sm font-bold text-gray-900 mb-2">
//                   <strong>Occupancy:</strong>
//                 </p>
//                 <p className="text-base text-gray-800 leading-relaxed">
//                   {occupancy}
//                 </p>
//               </div>

//             </div>

//             {/* CTA Buttons */}
//             <div className="flex gap-4 flex-wrap">
//               <a
//                 href={partnerLink}
//                 className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
//               >
//                 Partner with us
//               </a>
//             </div>

//           </div>

//           {/* Right Column - Images */}
//           <div className="flex flex-col gap-6">
            
//             {/* Before Image */}
//             <div>
//               <div className="relative">
//                 <p className="absolute top-4 left-4 bg-white text-gray-800 px-3 py-1 rounded text-sm font-semibold z-10">
//                   Before
//                 </p>
//                 <div className="relative w-full h-64">
//                   <Image
//                     src={image}
//                     alt="Before"
//                     fill
//                     className="object-cover rounded-lg shadow-md"
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* After Image Container */}
//             <div className="relative">
//               <div className="bg-blue-600 p-1 rounded-2xl shadow-xl">
//                 <div className="relative w-full h-72">
//                   <Image
//                     src={image}
//                     alt="After"
//                     fill
//                     className="object-cover rounded-xl"
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                   />
//                 </div>
//               </div>
              
//               {/* After Badge */}
//               <div className="absolute -top-5 -right-5 bg-orange-200 rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg border-4 border-white z-20">
//                 <p className="text-base font-bold text-gray-900">After</p>
//                 <p className="text-sm font-semibold text-gray-700">Stuf</p>
//               </div>
//             </div>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



import Image from 'next/image';
import { HelpCircle } from 'lucide-react';

interface FeaturedLocationProps {
  title?: string;
  office?: string;
  address?: string;
  city?: string;
  space?: string;
  openingDate?: string;
  occupancy?: string;
  beforeImage?: string;
  afterImage?: string;
  supportLink?: string;
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
  afterImage = "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
  supportLink = "#",
  partnerLink = "#get-in-touch"
}: FeaturedLocationProps) {
  return (
    <div className="w-full bg-white py-16 px-6 lg:px-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-8">
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
                  <Image
                    src={beforeImage}
                    alt="Before"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
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