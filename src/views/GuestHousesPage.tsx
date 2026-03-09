import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  guesthouses: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', flag: '🇬🇧', guesthouses: 850, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', popular: true },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', guesthouses: 620, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: true },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', guesthouses: 480, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400', popular: true },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', guesthouses: 320, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400', popular: true },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', flag: '🇨🇿', guesthouses: 450, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400', popular: true },
  { id: 'berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', guesthouses: 520, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400', popular: true },
  { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', guesthouses: 380, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', popular: true },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', guesthouses: 580, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', popular: true },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', flag: '🇬🇧', guesthouses: 280, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400', popular: false },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', flag: '🇮🇪', guesthouses: 220, image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400', popular: false },
  { id: 'vienna', name: 'Vienna', country: 'Austria', flag: '🇦🇹', guesthouses: 280, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400', popular: false },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', flag: '🇭🇺', guesthouses: 350, image: 'https://images.unsplash.com/photo-1541343672885-9be56236c7fa?w=400', popular: false },
  { id: 'krakow', name: 'Krakow', country: 'Poland', flag: '🇵🇱', guesthouses: 280, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400', popular: false },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', guesthouses: 1250, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', popular: false },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', flag: '🇯🇵', guesthouses: 580, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', popular: false },
];

export default function GuestHousesPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=guest-houses`);
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
              <li className="text-white">Guest Houses</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Guest Houses</h1>
          <p className="text-xl text-blue-100">
            Comfortable and affordable accommodation with a personal touch
          </p>
        </div>
      </div>

      {/* What Makes Guest Houses Special */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What makes guest houses special</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-bold text-gray-900 mb-1">Great Value</h3>
              <p className="text-xs text-gray-500">More affordable than hotels</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">🏠</div>
              <h3 className="font-bold text-gray-900 mb-1">Home Comfort</h3>
              <p className="text-xs text-gray-500">Cozy, homely atmosphere</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">👨‍👩‍👧</div>
              <h3 className="font-bold text-gray-900 mb-1">Family Run</h3>
              <p className="text-xs text-gray-500">Personal attention</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <h3 className="font-bold text-gray-900 mb-1">Local Experience</h3>
              <p className="text-xs text-gray-500">Authentic neighbourhood stays</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular destinations for guest houses</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{destination.flag}</span>
                    <h3 className="font-bold">{destination.name}</h3>
                  </div>
                  <p className="text-sm text-white/80">
                    {destination.guesthouses} guest houses
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All guest house destinations</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-100">
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
                      {destination.country} · {destination.guesthouses} guest houses
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guest House vs Hotel Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Guest house vs hotel</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏠</span> Guest House
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> More affordable
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Personal attention from hosts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Homely atmosphere
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Local neighbourhood experience
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Often includes breakfast
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏨</span> Hotel
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> More amenities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> 24/7 reception
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Room service available
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> On-site restaurants
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> Standardized service
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
