import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  apartments: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', flag: '🇬🇧', apartments: 18520, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', popular: true },
  { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', apartments: 12450, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', popular: true },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', apartments: 8650, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: true },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', apartments: 9250, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', popular: true },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', apartments: 5890, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400', popular: true },
  { id: 'new-york', name: 'New York', country: 'United States', flag: '🇺🇸', apartments: 15450, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', popular: true },
  { id: 'berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', apartments: 7250, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400', popular: true },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', apartments: 5150, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400', popular: true },
  { id: 'vienna', name: 'Vienna', country: 'Austria', flag: '🇦🇹', apartments: 4280, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400', popular: false },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', flag: '🇨🇿', apartments: 5420, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400', popular: false },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', flag: '🇭🇺', apartments: 4850, image: 'https://images.unsplash.com/photo-1541343672885-9be56236c7fa?w=400', popular: false },
  { id: 'madrid', name: 'Madrid', country: 'Spain', flag: '🇪🇸', apartments: 6580, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: false },
  { id: 'milan', name: 'Milan', country: 'Italy', flag: '🇮🇹', apartments: 5120, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', popular: false },
  { id: 'dubai', name: 'Dubai', country: 'UAE', flag: '🇦🇪', apartments: 6850, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', popular: false },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', apartments: 4250, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', popular: false },
];

const apartmentTypes = [
  { id: 'studio', name: 'Studio', icon: '🛏️', description: 'Compact and efficient' },
  { id: 'one-bedroom', name: '1 Bedroom', icon: '🚪', description: 'Perfect for couples' },
  { id: 'two-bedroom', name: '2 Bedrooms', icon: '👨‍👩‍👧', description: 'Ideal for families' },
  { id: 'penthouse', name: 'Penthouse', icon: '🌆', description: 'Luxury with a view' },
  { id: 'loft', name: 'Loft', icon: '🏢', description: 'Open-plan living' },
  { id: 'serviced', name: 'Serviced', icon: '🛎️', description: 'Hotel-like amenities' },
];

export default function ApartmentsPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=apartments`);
  };

  const handleTypeClick = (typeId: string) => {
    navigate(`/search?type=apartments&apartment_type=${typeId}`);
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
              <li className="text-white">Apartments</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Apartments</h1>
          <p className="text-xl text-blue-100">
            Over 840,000 apartments in cities worldwide
          </p>
        </div>
      </div>

      {/* Apartment Types */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by apartment type</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {apartmentTypes.map((type) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular cities for apartments</h2>

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
                    {destination.apartments.toLocaleString()} apartments
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All apartment destinations</h2>

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
                      {destination.country} · {destination.apartments.toLocaleString()} apartments
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why choose an apartment?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Home comforts</h3>
              <p className="text-gray-600 text-sm">Live like a local with full kitchen and living space</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Great locations</h3>
              <p className="text-gray-600 text-sm">Stay in residential neighborhoods</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💵</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Better value</h3>
              <p className="text-gray-600 text-sm">More space for your money, especially for longer stays</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔑</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Flexibility</h3>
              <p className="text-gray-600 text-sm">Come and go as you please with self check-in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
