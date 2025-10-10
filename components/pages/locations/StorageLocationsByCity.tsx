const StorageLocationsByCity = () => {
  const cities = [
    'Atlanta',
    'Boston',
    'Brooklyn',
    'Culver City',
    'Long Island City',
    'Los Angeles',
    'New York',
    'Oakland',
    'Pasadena',
    'Queens',
    'San Francisco',
    'Seattle',
    'Walnut Creek',
    'Washington, DC'
  ];

  return (
    <div className="py-12 px-6 lg:py-28 lg:px-20 bg-gray-50">
      <h3 className="text-xl text-blue-900 font-semibold mb-6 lg:mb-12">
        Storage locations by city
      </h3>
      
      <div className="flex flex-wrap gap-4 lg:gap-6">
        {cities.map((city) => (
          <a
            key={city}
            href="/search-available-units"
            className="px-6 py-3 border-1 border-blue-600 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors inline-block"
          >
            {city}
          </a>
        ))}
      </div>
    </div>
  );
};

export default StorageLocationsByCity;