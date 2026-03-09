import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  resorts: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'maldives', name: 'Maldives', country: 'Maldives', flag: '🇲🇻', resorts: 580, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', popular: true },
  { id: 'bali', name: 'Bali', country: 'Indonesia', flag: '🇮🇩', resorts: 1250, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', popular: true },
  { id: 'phuket', name: 'Phuket', country: 'Thailand', flag: '🇹🇭', resorts: 980, image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400', popular: true },
  { id: 'cancun', name: 'Cancun', country: 'Mexico', flag: '🇲🇽', resorts: 450, image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=400', popular: true },
  { id: 'dubai', name: 'Dubai', country: 'UAE', flag: '🇦🇪', resorts: 320, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', popular: true },
  { id: 'santorini', name: 'Santorini', country: 'Greece', flag: '🇬🇷', resorts: 280, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400', popular: true },
  { id: 'hawaii', name: 'Hawaii', country: 'United States', flag: '🇺🇸', resorts: 520, image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400', popular: true },
  { id: 'caribbean', name: 'Caribbean', country: 'Various', flag: '🏝️', resorts: 1850, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400', popular: true },
  { id: 'seychelles', name: 'Seychelles', country: 'Seychelles', flag: '🇸🇨', resorts: 180, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400', popular: false },
  { id: 'mauritius', name: 'Mauritius', country: 'Mauritius', flag: '🇲🇺', resorts: 220, image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=400', popular: false },
  { id: 'fiji', name: 'Fiji', country: 'Fiji', flag: '🇫🇯', resorts: 150, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', popular: false },
  { id: 'costa-rica', name: 'Costa Rica', country: 'Costa Rica', flag: '🇨🇷', resorts: 380, image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=400', popular: false },
  { id: 'zanzibar', name: 'Zanzibar', country: 'Tanzania', flag: '🇹🇿', resorts: 120, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400', popular: false },
  { id: 'algarve', name: 'Algarve', country: 'Portugal', flag: '🇵🇹', resorts: 250, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', popular: false },
  { id: 'french-riviera', name: 'French Riviera', country: 'France', flag: '🇫🇷', resorts: 320, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', popular: false },
];

const resortTypes = [
  { id: 'beach', name: 'Beach Resorts', icon: '🏖️', description: 'Sun, sand, and sea' },
  { id: 'spa', name: 'Spa Resorts', icon: '💆', description: 'Relax and rejuvenate' },
  { id: 'golf', name: 'Golf Resorts', icon: '⛳', description: 'Tee off in paradise' },
  { id: 'ski', name: 'Ski Resorts', icon: '⛷️', description: 'Slopes and snow' },
  { id: 'all-inclusive', name: 'All-Inclusive', icon: '🍹', description: 'Everything included' },
  { id: 'eco', name: 'Eco Resorts', icon: '🌿', description: 'Sustainable luxury' },
];

export default function ResortsPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=resorts`);
  };

  const handleTypeClick = (typeId: string) => {
    navigate(`/search?type=resorts&resort_type=${typeId}`);
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
              <li className="text-white">Resorts</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Resorts</h1>
          <p className="text-xl text-blue-100">
            Discover 17,000+ resorts in stunning destinations worldwide
          </p>
        </div>
      </div>

      {/* Resort Types */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by resort type</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resortTypes.map((type) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top resort destinations</h2>

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
                    {destination.resorts.toLocaleString()} resorts
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All resort destinations</h2>

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
                      {destination.country} · {destination.resorts.toLocaleString()} resorts
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What makes a great resort?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏊</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Pools & beaches</h3>
              <p className="text-gray-600 text-sm">Swim, relax, and soak up the sun</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fine dining</h3>
              <p className="text-gray-600 text-sm">Multiple restaurants and cuisines</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎾</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Activities</h3>
              <p className="text-gray-600 text-sm">Sports, excursions, and entertainment</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Family friendly</h3>
              <p className="text-gray-600 text-sm">Kids clubs and family amenities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
