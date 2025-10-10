// const StorageHeroSection = () => {
//   return (
//     <div className="text-center lg:-mb-20 bg-gradient-to-br from-blue-900 to-blue-700">
//       <div className="lg:pt-32 pt-10 lg:pb-20 pb-12 lg:px-20 px-6">
//         <h1 className="lg:text-7xl text-5xl leading-tight font-bold text-white lg:mb-6 mb-5">
//           Find the Right Storage Unit Size
//         </h1>
        
//         <p className="font-serif lg:text-3xl text-lg font-normal text-white lg:mb-12 mb-10">
//           Get a clear picture of what fits inside a 5x10 or 10x10 unit.
//         </p>
        
//         <button
//           type="button"
//           className="px-8 py-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors shadow-lg sm:w-auto w-full"
//         >
//           Find storage near me
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StorageHeroSection;










// const StorageHeroSection = () => {
//   return (
//     <div
//       className="text-center lg:-mb-20 bg-cover bg-center bg-no-repeat relative "
//       style={{
//         backgroundImage: "url('/images/SizingHeroBg.png')",
//       }}
//     >
//       <div className="lg:pt-32 pt-10 lg:pb-20 pb-12 lg:px-20 px-6 ">
//         <h1 className="lg:text-7xl text-5xl leading-tight font-bold text-white lg:mb-6 mb-5">
//           Find the Right Storage Unit Size
//         </h1>

//         <p className="font-serif lg:text-3xl text-lg font-normal text-white lg:mb-12 mb-10">
//           Get a clear picture of what fits inside a 5x10 or 10x10 unit.
//         </p>

//         <button
//           type="button"
//           className="px-8 py-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors shadow-lg sm:w-auto w-full"
//         >
//           Find storage near me
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StorageHeroSection;









const StorageHeroSection = () => {
  return (
    <section
      className="relative text-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/SizingHeroBg.png')",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 "></div>

      {/* Hero Content */}
      <div className="relative z-10  lg:pt-32 pt-10 lg:pb-20 pb-12 lg:px-20 px-6">
        <h1 className="lg:text-6xl text-5xl leading-tight font-bold text-white lg:mb-6 mb-5">
          Find the Right Storage Unit Size
        </h1>

        <p className="font-serif lg:text-3xl text-lg font-normal text-white lg:mb-12 mb-10">
          Get a clear picture of what fits inside a 5x10 or 10x10 unit.
        </p>

        <button
          type="button"
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors shadow-lg sm:w-auto w-full"
        >
          Find storage near me
        </button>
      </div>
    </section>
  );
};

export default StorageHeroSection;
