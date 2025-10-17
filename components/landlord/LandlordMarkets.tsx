// import Image from 'next/image';
// import Link from 'next/link';

// const LandlordMarkets = () => {
//   return (
//     <section className="w-full px-4 py-12 md:py-16 lg:py-20 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* Content Column - Left */}
//           <div className="w-full space-y-6">
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//               Operating in 7 markets today
//             </h2>

//             <div className="border-t-2 border-gray-200 my-6"></div>

//             <div className="space-y-6">
//               <div className="py-2">
//                 <p className="text-lg md:text-xl font-medium text-gray-800">
//                   LA | NY | DC | SF | BOS | SEA | ATL
//                 </p>
//               </div>

//               <p className="text-base md:text-lg text-gray-600 leading-relaxed">
//                 Expanding our footprint in all 7 markets to better serve our communities
//               </p>

//               {/* CTA Button */}
//               <div className="pt-4">
//                 <Link
//                   href="#get-in-touch"
//                   className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
//                 >
//                   Partner with us
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Image Column - Right */}
//           <div className="w-full flex justify-center lg:justify-end">
//             <div className="relative w-full max-w-md aspect-[539/1000]">
//               <Image
//                 src="https://cdn.builder.io/api/v1/image/assets%2F7da5f814e22c4159ae621921e3f9d5ff%2F17dec6ae0201415a9973afcb30ade863?width=539"
//                 alt="Phone screen showing Stuf Storage locations"
//                 fill
//                 className="object-contain"
//                 sizes="(max-width: 638px) 47vw, (max-width: 998px) 23vw, 39vw"
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LandlordMarkets;



// import Image from 'next/image';
// import Link from 'next/link';

// const LandlordMarkets = () => {
//   return (
//     <section className="w-full px-6 py-16 md:py-20 lg:py-24 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {/* Content Column - Left */}
//           <div className="w-full space-y-8">
//             {/* Heading */}
//             <div>
//               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002366] leading-tight mb-4">
//                 Operating in 7 markets today
//               </h2>
//               <div className="w-16 h-1 bg-orange-500"></div>
//             </div>

//             {/* City List */}
//             <div className="py-4">
//               <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#002366] tracking-wide">
//                 LA | NY | DC | SF | BOS | SEA | ATL
//               </p>
//             </div>

//             {/* Description */}
//             <p className="text-lg md:text-xl text-gray-800 leading-relaxed max-w-xl">
//               Expanding our footprint in all 7 markets to better serve our communities
//             </p>

//             {/* CTA Button */}
//             <div className="pt-4">
//               <Link
//                 href="#get-in-touch"
//                 className="inline-block bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 text-lg"
//               >
//                 Partner with us
//               </Link>
//             </div>
//           </div>

//           {/* Image Column - Right */}
//           <div className="w-full flex justify-center lg:justify-end">
//             <div className="relative w-full max-w-[400px] aspect-[9/16]">
//               <Image
//                 src="https://cdn.builder.io/api/v1/image/assets%2F7da5f814e22c4159ae621921e3f9d5ff%2F17dec6ae0201415a9973afcb30ade863?width=539"
//                 alt="Phone screen showing Stuf Storage locations"
//                 fill
//                 className="object-contain drop-shadow-2xl"
//                 sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
//                 priority
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LandlordMarkets;












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
                className="inline-block bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 text-base"
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
                alt="Phone screen showing Stuf Storage locations"
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