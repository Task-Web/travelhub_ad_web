import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  properties: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'cornwall', name: 'Cornwall', country: 'United Kingdom', flag: '🇬🇧', properties: 8520, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', popular: true },
  { id: 'lake-district', name: 'Lake District', country: 'United Kingdom', flag: '🇬🇧', properties: 5680, image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400', popular: true },
  { id: 'cotswolds', name: 'Cotswolds', country: 'United Kingdom', flag: '🇬🇧', properties: 4250, image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400', popular: true },
  { id: 'tuscany', name: 'Tuscany', country: 'Italy', flag: '🇮🇹', properties: 12450, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', popular: true },
  { id: 'provence', name: 'Provence', country: 'France', flag: '🇫🇷', properties: 8920, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', popular: true },
  { id: 'costa-brava', name: 'Costa Brava', country: 'Spain', flag: '🇪🇸', properties: 6580, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: true },
  { id: 'algarve', name: 'Algarve', country: 'Portugal', flag: '🇵🇹', properties: 7850, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', popular: true },
  { id: 'greek-islands', name: 'Greek Islands', country: 'Greece', flag: '🇬🇷', properties: 9450, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400', popular: true },
  { id: 'scottish-highlands', name: 'Scottish Highlands', country: 'United Kingdom', flag: '🇬🇧', properties: 3850, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400', popular: false },
  { id: 'devon', name: 'Devon', country: 'United Kingdom', flag: '🇬🇧', properties: 5120, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', popular: false },
  { id: 'norfolk', name: 'Norfolk', country: 'United Kingdom', flag: '🇬🇧', properties: 3280, image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400', popular: false },
  { id: 'balearic-islands', name: 'Balearic Islands', country: 'Spain', flag: '🇪🇸', properties: 8250, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: false },
  { id: 'amalfi-coast', name: 'Amalfi Coast', country: 'Italy', flag: '🇮🇹', properties: 4580, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', popular: false },
  { id: 'cote-d-azur', name: "Côte d'Azur", country: 'France', flag: '🇫🇷', properties: 6250, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', popular: false },
  { id: 'croatian-coast', name: 'Croatian Coast', country: 'Croatia', flag: '🇭🇷', properties: 7850, image: 'https://images.unsplash.com/photo-1555990538-18d7a0d57a8d?w=400', popular: false },
];

const propertyTypes = [
  { id: 'cottages', name: 'Cottages', icon: '🏡', count: 125000, description: 'Charming rural retreats' },
  { id: 'cabins', name: 'Cabins', icon: '🪵', count: 45000, description: 'Cozy woodland getaways' },
  { id: 'villas', name: 'Villas', icon: '🏛️', count: 180000, description: 'Luxurious private properties' },
  { id: 'chalets', name: 'Chalets', icon: '⛷️', count: 35000, description: 'Mountain escapes' },
  { id: 'farmhouses', name: 'Farmhouses', icon: '🌾', count: 28000, description: 'Countryside living' },
  { id: 'bungalows', name: 'Bungalows', icon: '🏠', count: 52000, description: 'Ground-floor comfort' },
];

export default function HolidayHomesPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=holiday-homes`);
  };

  const handleTypeClick = (typeId: string) => {
    navigate(`/search?type=${typeId}`);
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
              <li className="text-white">Holiday Homes</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Holiday homes & rentals</h1>
          <p className="text-xl text-blue-100">
            Find your perfect holiday home from over 1.5 million properties worldwide
          </p>
        </div>
      </div>

      {/* Property Types */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by property type</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeClick(type.id)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{type.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{type.name}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
                <p className="text-xs text-booking-blue mt-2">{type.count.toLocaleString()} properties</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular destinations for holiday homes</h2>

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
                    {destination.properties.toLocaleString()} holiday homes
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All holiday home destinations</h2>

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
                      {destination.country} · {destination.properties.toLocaleString()} properties
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Book Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why book a holiday home?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">More space</h3>
              <p className="text-gray-600 text-sm">Enjoy separate bedrooms, living areas, and often outdoor spaces</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍳</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Self-catering</h3>
              <p className="text-gray-600 text-sm">Cook your own meals with fully equipped kitchens</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Great value</h3>
              <p className="text-gray-600 text-sm">Often more affordable for families and groups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
