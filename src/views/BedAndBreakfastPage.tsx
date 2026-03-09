import { Link, useNavigate } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  bnbs: number;
  image: string;
  popular: boolean;
}

const destinations: Destination[] = [
  { id: 'cotswolds', name: 'Cotswolds', country: 'United Kingdom', flag: '🇬🇧', bnbs: 1250, image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400', popular: true },
  { id: 'lake-district', name: 'Lake District', country: 'United Kingdom', flag: '🇬🇧', bnbs: 980, image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400', popular: true },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', flag: '🇬🇧', bnbs: 720, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400', popular: true },
  { id: 'bath', name: 'Bath', country: 'United Kingdom', flag: '🇬🇧', bnbs: 450, image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400', popular: true },
  { id: 'york', name: 'York', country: 'United Kingdom', flag: '🇬🇧', bnbs: 380, image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400', popular: true },
  { id: 'tuscany', name: 'Tuscany', country: 'Italy', flag: '🇮🇹', bnbs: 1580, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', popular: true },
  { id: 'provence', name: 'Provence', country: 'France', flag: '🇫🇷', bnbs: 1120, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', popular: true },
  { id: 'ireland', name: 'Ireland', country: 'Ireland', flag: '🇮🇪', bnbs: 2850, image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400', popular: true },
  { id: 'cornwall', name: 'Cornwall', country: 'United Kingdom', flag: '🇬🇧', bnbs: 850, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', popular: false },
  { id: 'devon', name: 'Devon', country: 'United Kingdom', flag: '🇬🇧', bnbs: 720, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', popular: false },
  { id: 'scottish-highlands', name: 'Scottish Highlands', country: 'United Kingdom', flag: '🇬🇧', bnbs: 580, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400', popular: false },
  { id: 'bruges', name: 'Bruges', country: 'Belgium', flag: '🇧🇪', bnbs: 320, image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400', popular: false },
  { id: 'galway', name: 'Galway', country: 'Ireland', flag: '🇮🇪', bnbs: 280, image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400', popular: false },
  { id: 'new-england', name: 'New England', country: 'United States', flag: '🇺🇸', bnbs: 1250, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400', popular: false },
  { id: 'napa-valley', name: 'Napa Valley', country: 'United States', flag: '🇺🇸', bnbs: 420, image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400', popular: false },
];

export default function BedAndBreakfastPage() {
  const navigate = useNavigate();

  const popularDestinations = destinations.filter(d => d.popular);
  const allDestinationsSorted = [...destinations].sort((a, b) => a.name.localeCompare(b.name));

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/search?destination=${encodeURIComponent(destination.name)}&type=bed-and-breakfast`);
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
              <li className="text-white">B&Bs</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Bed & Breakfasts</h1>
          <p className="text-xl text-blue-100">
            Charming B&Bs with homemade breakfasts in cozy locations
          </p>
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What to expect at a B&B</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">🍳</div>
              <h3 className="font-bold text-gray-900 mb-1">Full Breakfast</h3>
              <p className="text-xs text-gray-500">Homemade morning meals</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">🏡</div>
              <h3 className="font-bold text-gray-900 mb-1">Cozy Rooms</h3>
              <p className="text-xs text-gray-500">Charming decor</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">👋</div>
              <h3 className="font-bold text-gray-900 mb-1">Personal Touch</h3>
              <p className="text-xs text-gray-500">Friendly hosts</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-2">📍</div>
              <h3 className="font-bold text-gray-900 mb-1">Local Tips</h3>
              <p className="text-xs text-gray-500">Insider knowledge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top B&B destinations</h2>

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
                    {destination.bnbs.toLocaleString()} B&Bs
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* All Destinations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All B&B destinations</h2>

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
                      {destination.country} · {destination.bnbs.toLocaleString()} B&Bs
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why B&B Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why choose a B&B?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🥞</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Breakfast included</h3>
              <p className="text-gray-600 text-sm">Start your day with a hearty, home-cooked meal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Personal service</h3>
              <p className="text-gray-600 text-sm">Hosts who genuinely care about your stay</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Unique character</h3>
              <p className="text-gray-600 text-sm">Each B&B has its own story and charm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
