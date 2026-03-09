import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  villas: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'tuscany', name: 'Tuscany', country: 'Italy', flag: '🇮🇹', villas: 8520, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', popular: true },
  { id: 'bali', name: 'Bali', country: 'Indonesia', flag: '🇮🇩', villas: 5680, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', popular: true },
  { id: 'provence', name: 'Provence', country: 'France', flag: '🇫🇷', villas: 4250, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', popular: true },
  { id: 'costa-brava', name: 'Costa Brava', country: 'Spain', flag: '🇪🇸', villas: 6280, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: true },
  { id: 'greek-islands', name: 'Greek Islands', country: 'Greece', flag: '🇬🇷', villas: 5450, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400', popular: true },
  { id: 'algarve', name: 'Algarve', country: 'Portugal', flag: '🇵🇹', villas: 4850, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', popular: true },
  { id: 'caribbean', name: 'Caribbean', country: 'Various', flag: '🏝️', villas: 3250, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400', popular: true },
  { id: 'thailand', name: 'Thailand', country: 'Thailand', flag: '🇹🇭', villas: 4120, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', popular: true },
  { id: 'amalfi', name: 'Amalfi Coast', country: 'Italy', flag: '🇮🇹', villas: 2850, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', popular: false },
  { id: 'cote-d-azur', name: "Côte d'Azur", country: 'France', flag: '🇫🇷', villas: 3580, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', popular: false },
  { id: 'croatia', name: 'Croatia', country: 'Croatia', flag: '🇭🇷', villas: 4250, image: 'https://images.unsplash.com/photo-1555990538-18d7a0d57a8d?w=400', popular: false },
  { id: 'mallorca', name: 'Mallorca', country: 'Spain', flag: '🇪🇸', villas: 5120, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', popular: false },
  { id: 'florida', name: 'Florida', country: 'United States', flag: '🇺🇸', villas: 6850, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400', popular: false },
  { id: 'california', name: 'California', country: 'United States', flag: '🇺🇸', villas: 3250, image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400', popular: false },
  { id: 'morocco', name: 'Morocco', country: 'Morocco', flag: '🇲🇦', villas: 1850, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400', popular: false },
];

const villaFeatures = [
  { id: 'pool', name: 'Private Pool', icon: '🏊', description: 'Your own pool' },
  { id: 'sea-view', name: 'Sea View', icon: '🌊', description: 'Ocean panoramas' },
  { id: 'luxury', name: 'Luxury', icon: '✨', description: '5-star amenities' },
  { id: 'secluded', name: 'Secluded', icon: '🏝️', description: 'Total privacy' },
  { id: 'chef', name: 'Private Chef', icon: '👨‍🍳', description: 'Personal dining' },
  { id: 'family', name: 'Family-Friendly', icon: '👨‍👩‍👧‍👦', description: 'Kids welcome' },
];

export default function VillasPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=villas`);
  };

  const handleFeatureClick = (featureId: string) => {
    navigate(`/search?type=villas&feature=${featureId}`);
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
              <li className="text-white">Villas</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Villas</h1>
          <p className="text-xl text-blue-100">
            Over 430,000 villas in beautiful destinations around the world
          </p>
        </div>
      </div>

      {/* Villa Features */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find your perfect villa</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {villaFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.name}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top villa destinations</h2>

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
                    {destination.villas.toLocaleString()} villas
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All villa destinations</h2>

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
                      {destination.country} · {destination.villas.toLocaleString()} villas
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Villas Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why rent a villa?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏡</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Complete privacy</h3>
              <p className="text-gray-600 text-sm">Enjoy your own space without other guests around</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌴</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Stunning locations</h3>
              <p className="text-gray-600 text-sm">From beachfront to hillside, find your paradise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Perfect for groups</h3>
              <p className="text-gray-600 text-sm">Ideal for families, friends, or special celebrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
