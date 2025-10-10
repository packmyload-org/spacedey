const LocationsSection = () => {
  const locations = [
    'California',
    'Georgia',
    'Massachusetts',
    'New York',
    'Washington',
    'Washington, DC'
  ];

  return (
    <div className="py-12 px-6 lg:px-20">
      <h2 className="text-center capitalize text-blue-900 text-3xl lg:text-4xl font-bold">
        Discover Our Locations
      </h2>
      
      <hr className="h-[3px] w-[50px] mt-6 mb-10 lg:mb-[72px] mx-auto bg-orange-500 border-0 " />
      
      <div className="flex gap-6 lg:flex-wrap lg:justify-center overflow-scroll lg:overflow-hidden">
        {locations.map((location) => (
          <a
            key={location}
            href="/search-available-units"
            className="flex items-center justify-between gap-6 p-10 border border-blue-600 bg-gray-50 text-2xl font-semibold cursor-pointer rounded-2xl w-full lg:w-[31%] min-w-[280px] hover:bg-gray-100 transition-colors"
          >
            <span>{location}</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
            </div>
          </a>
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
        <button
          type="button"
          className="px-6 py-3 border-1 border-blue-600 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors"
        >
          Find storage near me
        </button>
      </div>
    </div>
  );
};

export default LocationsSection;