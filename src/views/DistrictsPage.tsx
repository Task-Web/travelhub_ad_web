import { Link, useNavigate } from 'react-router-dom';

interface District {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  properties: number;
  popular: boolean;
}

const districts: District[] = [
  { id: 'london-westminster', name: 'Westminster', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 1250, popular: true },
  { id: 'london-kensington', name: 'Kensington and Chelsea', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 980, popular: true },
  { id: 'london-camden', name: 'Camden', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 720, popular: true },
  { id: 'london-southwark', name: 'Southwark', city: 'London', country: 'United Kingdom', flag: '🇬🇧', properties: 650, popular: true },
  { id: 'paris-marais', name: 'Le Marais', city: 'Paris', country: 'France', flag: '🇫🇷', properties: 890, popular: true },
  { id: 'paris-montmartre', name: 'Montmartre', city: 'Paris', country: 'France', flag: '🇫🇷', properties: 560, popular: true },
  { id: 'paris-stgermain', name: 'Saint-Germain-des-Prés', city: 'Paris', country: 'France', flag: '🇫🇷', properties: 480, popular: true },
  { id: 'barcelona-gothic', name: 'Gothic Quarter', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', properties: 720, popular: true },
  { id: 'barcelona-eixample', name: 'Eixample', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', properties: 680, popular: true },
  { id: 'rome-centro', name: 'Centro Storico', city: 'Rome', country: 'Italy', flag: '🇮🇹', properties: 950, popular: true },
  { id: 'rome-trastevere', name: 'Trastevere', city: 'Rome', country: 'Italy', flag: '🇮🇹', properties: 420, popular: true },
  { id: 'nyc-manhattan', name: 'Manhattan', city: 'New York', country: 'United States', flag: '🇺🇸', properties: 2100, popular: true },
  { id: 'nyc-brooklyn', name: 'Brooklyn', city: 'New York', country: 'United States', flag: '🇺🇸', properties: 890, popular: true },
  { id: 'amsterdam-centrum', name: 'Centrum', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', properties: 650, popular: true },
  { id: 'amsterdam-jordaan', name: 'Jordaan', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', properties: 320, popular: false },
  { id: 'berlin-mitte', name: 'Mitte', city: 'Berlin', country: 'Germany', flag: '🇩🇪', properties: 780, popular: true },
  { id: 'berlin-kreuzberg', name: 'Kreuzberg', city: 'Berlin', country: 'Germany', flag: '🇩🇪', properties: 450, popular: false },
  { id: 'tokyo-shibuya', name: 'Shibuya', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', properties: 520, popular: true },
  { id: 'tokyo-shinjuku', name: 'Shinjuku', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', properties: 680, popular: true },
  { id: 'dubai-downtown', name: 'Downtown Dubai', city: 'Dubai', country: 'UAE', flag: '🇦🇪', properties: 890, popular: true },
  { id: 'dubai-marina', name: 'Dubai Marina', city: 'Dubai', country: 'UAE', flag: '🇦🇪', properties: 720, popular: true },
  { id: 'lisbon-alfama', name: 'Alfama', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', properties: 380, popular: false },
  { id: 'lisbon-baixa', name: 'Baixa', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', properties: 420, popular: false },
  { id: 'prague-oldtown', name: 'Old Town', city: 'Prague', country: 'Czech Republic', flag: '🇨🇿', properties: 560, popular: false },
  { id: 'vienna-innerestadt', name: 'Innere Stadt', city: 'Vienna', country: 'Austria', flag: '🇦🇹', properties: 480, popular: false },
  { id: 'sydney-cbd', name: 'Sydney CBD', city: 'Sydney', country: 'Australia', flag: '🇦🇺', properties: 650, popular: false },
  { id: 'singapore-marina', name: 'Marina Bay', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', properties: 380, popular: false },
  { id: 'bangkok-sukhumvit', name: 'Sukhumvit', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', properties: 720, popular: false },
];

export default function DistrictsPage() {
  const navigate = useNavigate();

  const popularDistricts = districts.filter(d => d.popular);
  const allDistrictsSorted = [...districts].sort((a, b) => a.name.localeCompare(b.name));

  const handleDistrictClick = (district: District) => {
    navigate(`/search?destination=${encodeURIComponent(district.name + ', ' + district.city)}`);
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
              <li className="text-white">Districts</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Browse by district</h1>
          <p className="text-xl text-blue-100">
            Explore {districts.length} popular districts around the world
          </p>
        </div>
      </div>

      {/* Popular Districts */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular districts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {popularDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => handleDistrictClick(district)}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{district.flag}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{district.name}</h3>
                    <p className="text-sm text-gray-600">{district.city}, {district.country}</p>
                  </div>
                </div>
                <p className="text-sm text-booking-blue font-medium">
                  {district.properties.toLocaleString()} properties
                </p>
              </button>
            ))}
          </div>

          {/* All Districts */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All districts A-Z</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-100">
              {allDistrictsSorted.map((district) => (
                <button
                  key={district.id}
                  onClick={() => handleDistrictClick(district)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-xl">{district.flag}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{district.name}</h3>
                    <p className="text-sm text-gray-500">
                      {district.city} · {district.properties.toLocaleString()} properties
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
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                {districts.length}
              </div>
              <div className="text-gray-600">Districts listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                200+
              </div>
              <div className="text-gray-600">Cities covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                18K+
              </div>
              <div className="text-gray-600">District properties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
