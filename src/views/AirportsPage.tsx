import { Link, useNavigate } from 'react-router-dom';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  properties: number;
  popular: boolean;
}

const airports: Airport[] = [
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 2850, popular: true },
  { code: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 1650, popular: true },
  { code: 'STN', name: 'London Stansted Airport', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 980, popular: true },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', flag: '🇬🇧', properties: 1250, popular: true },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', flag: '🇬🇧', properties: 890, popular: true },
  { code: 'CDG', name: 'Paris Charles de Gaulle Airport', city: 'Paris', country: 'France', flag: '🇫🇷', properties: 2100, popular: true },
  { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France', flag: '🇫🇷', properties: 1450, popular: true },
  { code: 'AMS', name: 'Amsterdam Schiphol Airport', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', properties: 1850, popular: true },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', properties: 1650, popular: true },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', flag: '🇩🇪', properties: 1200, popular: true },
  { code: 'BCN', name: 'Barcelona El Prat Airport', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', properties: 1750, popular: true },
  { code: 'MAD', name: 'Madrid Barajas Airport', city: 'Madrid', country: 'Spain', flag: '🇪🇸', properties: 1580, popular: true },
  { code: 'FCO', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', flag: '🇮🇹', properties: 1420, popular: true },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', flag: '🇮🇹', properties: 980, popular: true },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', flag: '🇺🇸', properties: 2450, popular: true },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', flag: '🇺🇸', properties: 2100, popular: true },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', flag: '🇦🇪', properties: 1850, popular: true },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', properties: 1250, popular: true },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', properties: 980, popular: true },
  { code: 'NRT', name: 'Tokyo Narita Airport', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', properties: 850, popular: true },
  { code: 'BKK', name: 'Bangkok Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', properties: 1450, popular: false },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', flag: '🇦🇺', properties: 1200, popular: false },
  { code: 'LIS', name: 'Lisbon Portela Airport', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', properties: 980, popular: false },
  { code: 'PRG', name: 'Prague Václav Havel Airport', city: 'Prague', country: 'Czech Republic', flag: '🇨🇿', properties: 750, popular: false },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', flag: '🇦🇹', properties: 850, popular: false },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', flag: '🇨🇭', properties: 720, popular: false },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', flag: '🇩🇰', properties: 680, popular: false },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', flag: '🇮🇪', properties: 920, popular: false },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', properties: 1650, popular: false },
  { code: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'Greece', flag: '🇬🇷', properties: 1100, popular: false },
];

export default function AirportsPage() {
  const navigate = useNavigate();

  const popularAirports = airports.filter(a => a.popular);
  const allAirportsSorted = [...airports].sort((a, b) => a.name.localeCompare(b.name));

  const handleAirportClick = (airport: Airport) => {
    navigate(`/search?destination=${encodeURIComponent(airport.city)}&near_airport=${airport.code}`);
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
              <li className="text-white">Airports</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Hotels near airports</h1>
          <p className="text-xl text-blue-100">
            Find convenient accommodation near {airports.length} major airports worldwide
          </p>
        </div>
      </div>

      {/* Popular Airports */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular airports</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {popularAirports.map((airport) => (
              <button
                key={airport.code}
                onClick={() => handleAirportClick(airport)}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-booking-blue text-white px-2 py-1 rounded text-sm font-bold">
                    {airport.code}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{airport.flag}</span>
                      <h3 className="font-bold text-gray-900 text-sm">{airport.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{airport.city}, {airport.country}</p>
                    <p className="text-sm text-booking-blue font-medium mt-2">
                      {airport.properties.toLocaleString()} nearby properties
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* All Airports */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All airports A-Z</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-100">
              {allAirportsSorted.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => handleAirportClick(airport)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                    {airport.code}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{airport.flag}</span>
                      <h3 className="font-medium text-gray-900 text-sm">{airport.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      {airport.properties.toLocaleString()} properties
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why book near airports?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Early flights</h3>
              <p className="text-gray-600 text-sm">Stay close for early morning departures and avoid the stress of long transfers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Layover comfort</h3>
              <p className="text-gray-600 text-sm">Make long layovers comfortable with a proper bed and amenities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Shuttle service</h3>
              <p className="text-gray-600 text-sm">Many airport hotels offer free shuttle services to terminals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
