// import Image from 'next/image';
// import Link from 'next/link';

// interface PressItemProps {
//   url: string;
//   publication: string;
//   title: string;
// }

// const PressItem = ({ url, publication, title }: PressItemProps) => {
//   return (
//     <Link
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="block text-left hover:opacity-80 transition-opacity duration-200"
//     >
//       <h3 className="text-base md:text-lg">
//         <strong>
//           <span className="text-blue-600 underline">{publication}</span>
//         </strong>
//         <br />
//         <span className="text-gray-800">{title}</span>
//       </h3>
//     </Link>
//   );
// };

// const LandlordPress = () => {
//   const pressItems = [
//     {
//       url: 'https://www.bisnow.com/new-york/news/self-storage/stuf-expands-into-brooklyn-with-two-self-storage-leases-124271',
//       publication: 'BISNOW',
//       title: 'Self-Storage Startup Expands Into Brooklyn With 2 Leases',
//     },
//     {
//       url: 'https://commercialobserver.com/2024/02/kat-laus-self-storage-concept-stuf-can-help-offices-oversupply-problem/',
//       publication: 'Commercial Observer',
//       title: "Kat Lau's Self-Storage Concept Stuf Can Help Office's Oversupply Problem",
//     },
//     {
//       url: 'https://abc7.com/stuf-storage-self-los-angeles-abc7-solutions/11225139/',
//       publication: 'ABC7',
//       title: 'Stuf Storage Offers a Convenient Alternative to Traditional Storage Space',
//     },
//   ];

//   return (
//     <section className="w-full px-6 py-12 md:py-16 lg:py-20 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* Image Column - Left */}
//           <div className="w-full">
//             <div className="relative w-full aspect-[16/10]">
//               <Image
//                 src="https://cdn.builder.io/api/v1/image/assets%2F7da5f814e22c4159ae621921e3f9d5ff%2Faf3fb4e31b954fd4afcfef3942754ccb"
//                 alt=""
//                 fill
//                 className="object-cover rounded-lg"
//                 sizes="(max-width: 638px) 94vw, (max-width: 998px) 38vw, 55vw"
//                 loading="lazy"
//               />
//             </div>
//           </div>

//           {/* Press Links Column - Right */}
//           <div className="w-full space-y-6 md:space-y-8">
//             {pressItems.map((item, index) => (
//               <PressItem
//                 key={index}
//                 url={item.url}
//                 publication={item.publication}
//                 title={item.title}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LandlordPress;









import Image from 'next/image';
import Link from 'next/link';

interface PressItemProps {
  url: string;
  publication: string;
  title: string;
}

const PressItem = ({ url, publication, title }: PressItemProps) => {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-center hover:opacity-80 transition-opacity duration-200"
    >
      <h3 className="text-lg md:text-xl">
        <strong className="text-blue-600 font-bold">
          {publication}
        </strong>
        <br />
        <span className="text-gray-900 font-normal mt-2 inline-block">
          {title}
        </span>
      </h3>
    </Link>
  );
};

const  LandlordPress = () => {
  const pressItems = [
    {
      url: 'https://www.bisnow.com/new-york/news/self-storage/stuf-expands-into-brooklyn-with-two-self-storage-leases-124271',
      publication: 'BISNOW',
      title: 'Self-Storage Startup Expands Into Brooklyn With 2 Leases',
    },
    {
      url: 'https://commercialobserver.com/2024/02/kat-laus-self-storage-concept-stuf-can-help-offices-oversupply-problem/',
      publication: 'Commercial Observer',
      title: "Kat Lau's Self-Storage Concept Stuf Can Help Office's Oversupply Problem",
    },
    {
      url: 'https://abc7.com/stuf-storage-self-los-angeles-abc7-solutions/11225139/',
      publication: 'ABC7',
      title: 'Stuf Storage Offers a Convenient Alternative to Traditional Storage Space',
    },
  ];

  return (
    <section className="w-full px-6 py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#002366] mb-4">
            Trusted by commercial real estate owners
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column - Left */}
          <div className="w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F7da5f814e22c4159ae621921e3f9d5ff%2Faf3fb4e31b954fd4afcfef3942754ccb"
                alt="Storage facility interior"
                fill
                className="object-cover"
                sizes="(max-width: 638px) 94vw, (max-width: 998px) 38vw, 55vw"
                loading="lazy"
              />
            </div>
          </div>

          {/* Press Links Column - Right */}
          <div className="w-full space-y-10 md:space-y-12">
            {pressItems.map((item, index) => (
              <PressItem
                key={index}
                url={item.url}
                publication={item.publication}
                title={item.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default  LandlordPress;