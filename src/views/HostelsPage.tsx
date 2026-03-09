import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  hostels: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', flag: '🇬🇧', hostels: 420, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', popular: true },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', hostels: 380, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: true },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', hostels: 290, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400', popular: true },
  { id: 'berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', hostels: 350, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400', popular: true },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', flag: '🇨🇿', hostels: 280, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400', popular: true },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', hostels: 210, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400', popular: true },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', flag: '🇭🇺', hostels: 240, image: 'https://images.unsplash.com/photo-1541343672885-9be56236c7fa?w=400', popular: true },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', hostels: 450, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', popular: true },
  { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', hostels: 180, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', popular: false },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', hostels: 220, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', popular: false },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', hostels: 280, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', popular: false },
  { id: 'sydney', name: 'Sydney', country: 'Australia', flag: '🇦🇺', hostels: 150, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400', popular: false },
  { id: 'new-york', name: 'New York', country: 'United States', flag: '🇺🇸', hostels: 120, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', popular: false },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', flag: '🇮🇪', hostels: 95, image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400', popular: false },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', flag: '🇬🇧', hostels: 85, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400', popular: false },
];

const hostelTypes = [
  { id: 'budget', name: 'Budget', icon: '💰', description: 'Best value' },
  { id: 'party', name: 'Party', icon: '🎉', description: 'Social atmosphere' },
  { id: 'boutique', name: 'Boutique', icon: '✨', description: 'Stylish stays' },
  { id: 'eco', name: 'Eco-Friendly', icon: '🌿', description: 'Sustainable' },
  { id: 'female-only', name: 'Female Only', icon: '👩', description: 'Women travelers' },
  { id: 'quiet', name: 'Quiet', icon: '🤫', description: 'Peaceful stay' },
];

export default function HostelsPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=hostels`);
  };

  const handleTypeClick = (typeId: string) => {
    navigate(`/search?type=hostels&hostel_type=${typeId}`);
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
              <li className="text-white">Hostels</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Hostels</h1>
          <p className="text-xl text-blue-100">
            Find budget-friendly hostels in 35,000+ locations worldwide
          </p>
        </div>
      </div>

      {/* Hostel Types */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by hostel type</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hostelTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeClick(type.id)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{type.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{type.name}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top hostel destinations</h2>

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
                    {destination.hostels} hostels
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All hostel destinations</h2>

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
                      {destination.country} · {destination.hostels} hostels
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Hostels Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why stay in a hostel?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💵</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Budget friendly</h3>
              <p className="text-gray-600 text-sm">More travel for less money</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Meet people</h3>
              <p className="text-gray-600 text-sm">Social atmosphere and new friends</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Great locations</h3>
              <p className="text-gray-600 text-sm">Central spots in major cities</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Local tips</h3>
              <p className="text-gray-600 text-sm">Get insider advice from staff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
