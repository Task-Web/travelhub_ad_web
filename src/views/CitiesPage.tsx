import { Link, useNavigate } from 'react-router-dom';

interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  hotels: number;
  otherAccommodation: {
    holidayRentals: number;
    cottages: number;
    cabins: number;
    apartments: number;
  };
  popular: boolean;
}

const cities: City[] = [
  // Top destinations
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 16513, otherAccommodation: { holidayRentals: 8450, cottages: 125, cabins: 45, apartments: 6780 }, popular: true },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'fr', flag: '🇫🇷', hotels: 12450, otherAccommodation: { holidayRentals: 6230, cottages: 85, cabins: 30, apartments: 5420 }, popular: true },
  { id: 'rome', name: 'Rome', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 9870, otherAccommodation: { holidayRentals: 4560, cottages: 120, cabins: 25, apartments: 3890 }, popular: true },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 8650, otherAccommodation: { holidayRentals: 4120, cottages: 95, cabins: 35, apartments: 3450 }, popular: true },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', countryCode: 'nl', flag: '🇳🇱', hotels: 5430, otherAccommodation: { holidayRentals: 2340, cottages: 65, cabins: 20, apartments: 1890 }, popular: true },
  { id: 'berlin', name: 'Berlin', country: 'Germany', countryCode: 'de', flag: '🇩🇪', hotels: 6780, otherAccommodation: { holidayRentals: 3120, cottages: 75, cabins: 40, apartments: 2560 }, popular: true },
  { id: 'madrid', name: 'Madrid', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 5890, otherAccommodation: { holidayRentals: 2780, cottages: 55, cabins: 15, apartments: 2340 }, popular: true },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', countryCode: 'pt', flag: '🇵🇹', hotels: 4560, otherAccommodation: { holidayRentals: 2120, cottages: 80, cabins: 25, apartments: 1890 }, popular: true },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', countryCode: 'cz', flag: '🇨🇿', hotels: 3450, otherAccommodation: { holidayRentals: 1560, cottages: 45, cabins: 30, apartments: 1230 }, popular: true },
  { id: 'vienna', name: 'Vienna', country: 'Austria', countryCode: 'at', flag: '🇦🇹', hotels: 4120, otherAccommodation: { holidayRentals: 1890, cottages: 55, cabins: 20, apartments: 1450 }, popular: true },

  // More European cities
  { id: 'milan', name: 'Milan', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 3890, otherAccommodation: { holidayRentals: 1670, cottages: 35, cabins: 15, apartments: 1340 }, popular: true },
  { id: 'florence', name: 'Florence', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 3560, otherAccommodation: { holidayRentals: 1890, cottages: 120, cabins: 35, apartments: 1560 }, popular: true },
  { id: 'venice', name: 'Venice', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 2780, otherAccommodation: { holidayRentals: 1450, cottages: 25, cabins: 10, apartments: 1120 }, popular: true },
  { id: 'munich', name: 'Munich', country: 'Germany', countryCode: 'de', flag: '🇩🇪', hotels: 3210, otherAccommodation: { holidayRentals: 1340, cottages: 45, cabins: 35, apartments: 980 }, popular: false },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', countryCode: 'ie', flag: '🇮🇪', hotels: 2890, otherAccommodation: { holidayRentals: 1230, cottages: 180, cabins: 45, apartments: 890 }, popular: true },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 2450, otherAccommodation: { holidayRentals: 1120, cottages: 85, cabins: 35, apartments: 780 }, popular: true },
  { id: 'brussels', name: 'Brussels', country: 'Belgium', countryCode: 'be', flag: '🇧🇪', hotels: 2340, otherAccommodation: { holidayRentals: 980, cottages: 25, cabins: 10, apartments: 650 }, popular: false },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', countryCode: 'hu', flag: '🇭🇺', hotels: 2890, otherAccommodation: { holidayRentals: 1450, cottages: 35, cabins: 20, apartments: 1120 }, popular: true },

  // Asia Pacific cities
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'jp', flag: '🇯🇵', hotels: 8970, otherAccommodation: { holidayRentals: 2340, cottages: 45, cabins: 120, apartments: 3450 }, popular: true },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', countryCode: 'th', flag: '🇹🇭', hotels: 12340, otherAccommodation: { holidayRentals: 3450, cottages: 65, cabins: 25, apartments: 4560 }, popular: true },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'sg', flag: '🇸🇬', hotels: 4560, otherAccommodation: { holidayRentals: 1230, cottages: 15, cabins: 5, apartments: 890 }, popular: true },
  { id: 'bali', name: 'Bali', country: 'Indonesia', countryCode: 'id', flag: '🇮🇩', hotels: 15670, otherAccommodation: { holidayRentals: 8970, cottages: 340, cabins: 120, apartments: 2340 }, popular: true },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', countryCode: 'hk', flag: '🇭🇰', hotels: 3890, otherAccommodation: { holidayRentals: 1120, cottages: 25, cabins: 10, apartments: 780 }, popular: true },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'ae', flag: '🇦🇪', hotels: 5670, otherAccommodation: { holidayRentals: 2340, cottages: 35, cabins: 15, apartments: 1890 }, popular: true },

  // Americas cities
  { id: 'new-york', name: 'New York', country: 'United States', countryCode: 'us', flag: '🇺🇸', hotels: 9870, otherAccommodation: { holidayRentals: 3450, cottages: 85, cabins: 120, apartments: 4560 }, popular: true },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', countryCode: 'us', flag: '🇺🇸', hotels: 6780, otherAccommodation: { holidayRentals: 2890, cottages: 120, cabins: 85, apartments: 2340 }, popular: true },
  { id: 'miami', name: 'Miami', country: 'United States', countryCode: 'us', flag: '🇺🇸', hotels: 4560, otherAccommodation: { holidayRentals: 2120, cottages: 65, cabins: 25, apartments: 1780 }, popular: true },
  { id: 'cancun', name: 'Cancun', country: 'Mexico', countryCode: 'mx', flag: '🇲🇽', hotels: 3450, otherAccommodation: { holidayRentals: 1890, cottages: 45, cabins: 35, apartments: 1230 }, popular: true },
];

export default function CitiesPage() {
  const navigate = useNavigate();

  // Sort by popularity (hotels count)
  const popularCities = cities.filter(c => c.popular).sort((a, b) => b.hotels - a.hotels);
  const allCitiesSorted = [...cities].sort((a, b) => b.hotels - a.hotels);

  const handleCityClick = (city: City) => {
    navigate(`/city/${city.countryCode}/${city.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Cities</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Browse by city</h1>
          <p className="text-xl text-blue-100">
            Explore {cities.length} cities worldwide with millions of properties
          </p>
        </div>
      </div>

      {/* Popular Cities */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Most popular cities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {popularCities.slice(0, 12).map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <button
                  onClick={() => handleCityClick(city)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{city.flag}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{city.name}</h3>
                      <p className="text-sm text-gray-600">{city.country}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-bold text-booking-blue">
                        {city.hotels.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">hotels</p>
                    </div>
                  </div>
                </button>

                {/* Other accommodation links */}
                <div className="border-t px-4 py-3 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Other accommodation</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Link
                      to={`/search?destination=${city.name.toLowerCase()}&type=holiday-rental`}
                      className="text-booking-blue hover:underline"
                    >
                      Holiday rentals ({city.otherAccommodation.holidayRentals.toLocaleString()})
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link
                      to={`/search?destination=${city.name.toLowerCase()}&type=cottage`}
                      className="text-booking-blue hover:underline"
                    >
                      Cottages ({city.otherAccommodation.cottages})
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link
                      to={`/search?destination=${city.name.toLowerCase()}&type=cabin`}
                      className="text-booking-blue hover:underline"
                    >
                      Cabins ({city.otherAccommodation.cabins})
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link
                      to={`/search?destination=${city.name.toLowerCase()}&type=apartment`}
                      className="text-booking-blue hover:underline"
                    >
                      Apartments ({city.otherAccommodation.apartments.toLocaleString()})
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Cities */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All cities by popularity</h2>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allCitiesSorted.map((city, index) => (
                <div
                  key={city.id}
                  className={`${index !== 0 ? 'border-t sm:border-l' : ''} border-gray-100`}
                >
                  <button
                    onClick={() => handleCityClick(city)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{city.flag}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {city.name}, {city.country}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {city.hotels.toLocaleString()} hotels
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="px-4 pb-3 text-xs">
                    <Link
                      to={`/search?destination=${city.name.toLowerCase()}&type=holiday-rental`}
                      className="text-booking-blue hover:underline"
                    >
                      Holiday rentals
                    </Link>
                    <span className="text-gray-300 mx-1">•</span>
                    <Link
                      to={`/search?destination=${city.name.toLowerCase()}&type=apartment`}
                      className="text-booking-blue hover:underline"
                    >
                      Apartments
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                {cities.length}
              </div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                {Math.round(allCitiesSorted.reduce((sum, c) => sum + c.hotels, 0) / 1000)}K+
              </div>
              <div className="text-gray-600">Hotels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                {Math.round(allCitiesSorted.reduce((sum, c) => sum + c.otherAccommodation.holidayRentals, 0) / 1000)}K+
              </div>
              <div className="text-gray-600">Holiday rentals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                {Math.round(allCitiesSorted.reduce((sum, c) => sum + c.otherAccommodation.apartments, 0) / 1000)}K+
              </div>
              <div className="text-gray-600">Apartments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
