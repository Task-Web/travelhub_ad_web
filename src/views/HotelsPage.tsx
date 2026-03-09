import { Link, useNavigate } from 'react-router-dom';

interface HotelDestination {
  id: string;
  name: string;
  country: string;
  flag: string;
  hotels: number;
  image: string;
  popular: boolean;
}

const hotelDestinations: HotelDestination[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', flag: '🇬🇧', hotels: 16513, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', popular: true },
  { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', hotels: 8420, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', popular: true },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', hotels: 5680, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: true },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', hotels: 7250, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', popular: true },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', hotels: 3890, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400', popular: true },
  { id: 'new-york', name: 'New York', country: 'United States', flag: '🇺🇸', hotels: 12450, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', popular: true },
  { id: 'dubai', name: 'Dubai', country: 'UAE', flag: '🇦🇪', hotels: 4580, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', popular: true },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', hotels: 5120, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', popular: true },
  { id: 'berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', hotels: 4250, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400', popular: true },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', hotels: 3150, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400', popular: true },
  { id: 'manchester', name: 'Manchester', country: 'United Kingdom', flag: '🇬🇧', hotels: 2850, image: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=400', popular: false },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', flag: '🇬🇧', hotels: 2420, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400', popular: false },
  { id: 'madrid', name: 'Madrid', country: 'Spain', flag: '🇪🇸', hotels: 4850, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: false },
  { id: 'vienna', name: 'Vienna', country: 'Austria', flag: '🇦🇹', hotels: 2980, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400', popular: false },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', flag: '🇨🇿', hotels: 3420, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400', popular: false },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', flag: '🇸🇬', hotels: 2150, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400', popular: false },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', hotels: 5680, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', popular: false },
  { id: 'sydney', name: 'Sydney', country: 'Australia', flag: '🇦🇺', hotels: 2850, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400', popular: false },
];

export default function HotelsPage() {
  const navigate = useNavigate();

  const popularDestinations = hotelDestinations.filter(d => d.popular);
  const allDestinationsSorted = [...hotelDestinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: HotelDestination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=hotels`);
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
              <li className="text-white">Hotels</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Hotels worldwide</h1>
          <p className="text-xl text-blue-100">
            Browse over 820,000 hotels in popular destinations
          </p>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular hotel destinations</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {popularDestinations.map((destination) => (
              <button
                key={destination.id}
                onClick={() => handleDestinationClick(destination)}
                className="group relative rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow text-left"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">{destination.flag}</span>
                    <h3 className="font-bold text-sm">{destination.name}</h3>
                  </div>
                  <p className="text-xs text-white/80">
                    {destination.hotels.toLocaleString()} hotels
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All hotel destinations A-Z</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-100">
              {allDestinationsSorted.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{destination.flag}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{destination.name}</h3>
                    <p className="text-sm text-gray-500">
                      {destination.country} · {destination.hotels.toLocaleString()} hotels
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Types Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by hotel type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/search?stars=5&type=hotels" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <div className="text-yellow-500 text-xl mb-2">★★★★★</div>
              <h3 className="font-medium text-gray-900">5-Star Hotels</h3>
              <p className="text-sm text-gray-500">Luxury stays</p>
            </Link>
            <Link to="/search?stars=4&type=hotels" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <div className="text-yellow-500 text-xl mb-2">★★★★</div>
              <h3 className="font-medium text-gray-900">4-Star Hotels</h3>
              <p className="text-sm text-gray-500">Premium comfort</p>
            </Link>
            <Link to="/search?stars=3&type=hotels" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <div className="text-yellow-500 text-xl mb-2">★★★</div>
              <h3 className="font-medium text-gray-900">3-Star Hotels</h3>
              <p className="text-sm text-gray-500">Great value</p>
            </Link>
            <Link to="/search?type=boutique" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <div className="text-booking-blue text-xl mb-2">✦</div>
              <h3 className="font-medium text-gray-900">Boutique Hotels</h3>
              <p className="text-sm text-gray-500">Unique charm</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">820K+</div>
              <div className="text-gray-600">Hotels worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">226</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">300M+</div>
              <div className="text-gray-600">Guest reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">24/7</div>
              <div className="text-gray-600">Customer support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
