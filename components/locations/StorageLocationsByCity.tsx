import { getAvailableCities } from '@/lib/cities';

const StorageLocationsByCity = () => {
  const availableCities = getAvailableCities();

  return (
    <div className="py-12 px-6 lg:py-28 lg:px-20 bg-gray-50">
      <h3 className="text-xl text-blue-900 font-semibold mb-6 lg:mb-12">
        Storage locations by city
      </h3>
      
      {/* Available Cities */}
      <div className="flex flex-wrap gap-4 lg:gap-6">
        {availableCities.map((city) => (
          <a
            key={city.name}
            href={`/search?city=${encodeURIComponent(city.name)}`}
            className="px-6 py-3 border-1 border-blue-600 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors inline-block"
          >
            {city.name}
          </a>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Search for any other Nigerian city to see if it&apos;s coming soon!
      </p>
    </div>
  );
};

export default StorageLocationsByCity;