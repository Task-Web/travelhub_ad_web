import { Link, useNavigate } from 'react-router-dom';

interface Country {
  code: string;
  name: string;
  flag: string;
  properties: number;
  popular: boolean;
}

const countries: Country[] = [
  { code: 'es', name: 'Spain', flag: '🇪🇸', properties: 142350, popular: true },
  { code: 'it', name: 'Italy', flag: '🇮🇹', properties: 138200, popular: true },
  { code: 'fr', name: 'France', flag: '🇫🇷', properties: 125400, popular: true },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', properties: 98500, popular: true },
  { code: 'de', name: 'Germany', flag: '🇩🇪', properties: 89700, popular: true },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹', properties: 45600, popular: true },
  { code: 'gr', name: 'Greece', flag: '🇬🇷', properties: 52300, popular: true },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', properties: 38900, popular: true },
  { code: 'at', name: 'Austria', flag: '🇦🇹', properties: 35400, popular: false },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', properties: 28700, popular: false },
  { code: 'be', name: 'Belgium', flag: '🇧🇪', properties: 24300, popular: false },
  { code: 'pl', name: 'Poland', flag: '🇵🇱', properties: 31200, popular: false },
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿', properties: 25800, popular: false },
  { code: 'hr', name: 'Croatia', flag: '🇭🇷', properties: 42100, popular: true },
  { code: 'ie', name: 'Ireland', flag: '🇮🇪', properties: 18500, popular: false },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰', properties: 15200, popular: false },
  { code: 'se', name: 'Sweden', flag: '🇸🇪', properties: 19800, popular: false },
  { code: 'no', name: 'Norway', flag: '🇳🇴', properties: 14600, popular: false },
  { code: 'fi', name: 'Finland', flag: '🇫🇮', properties: 12300, popular: false },
  { code: 'hu', name: 'Hungary', flag: '🇭🇺', properties: 22400, popular: false },
  { code: 'tr', name: 'Turkey', flag: '🇹🇷', properties: 68500, popular: true },
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', properties: 15800, popular: true },
  { code: 'th', name: 'Thailand', flag: '🇹🇭', properties: 85200, popular: true },
  { code: 'jp', name: 'Japan', flag: '🇯🇵', properties: 42300, popular: true },
  { code: 'us', name: 'United States', flag: '🇺🇸', properties: 185400, popular: true },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', properties: 35600, popular: false },
  { code: 'br', name: 'Brazil', flag: '🇧🇷', properties: 28900, popular: false },
  { code: 'au', name: 'Australia', flag: '🇦🇺', properties: 32100, popular: true },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩', properties: 56800, popular: true },
  { code: 'my', name: 'Malaysia', flag: '🇲🇾', properties: 25400, popular: false },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', properties: 8900, popular: false },
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳', properties: 38200, popular: false },
  { code: 'in', name: 'India', flag: '🇮🇳', properties: 45600, popular: false },
  { code: 'za', name: 'South Africa', flag: '🇿🇦', properties: 18700, popular: false },
  { code: 'eg', name: 'Egypt', flag: '🇪🇬', properties: 12400, popular: false },
  { code: 'ma', name: 'Morocco', flag: '🇲🇦', properties: 15200, popular: false },
];

export default function CountriesPage() {
  const navigate = useNavigate();

  const popularCountries = countries.filter(c => c.popular);
  const allCountriesSorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));

  const handleCountryClick = (countryCode: string) => {
    navigate(`/country/${countryCode}`);
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
              <li className="text-white">Countries</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Browse by country</h1>
          <p className="text-xl text-blue-100">
            Discover properties in {countries.length} countries around the world
          </p>
        </div>
      </div>

      {/* Popular Countries */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular destinations</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {popularCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountryClick(country.code)}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{country.flag}</span>
                  <h3 className="font-bold text-gray-900">{country.name}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {country.properties.toLocaleString()} properties
                </p>
              </button>
            ))}
          </div>

          {/* All Countries */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All countries A-Z</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-100">
              {allCountriesSorted.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountryClick(country.code)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{country.name}</h3>
                    <p className="text-sm text-gray-500">
                      {country.properties.toLocaleString()} properties
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                {countries.length}
              </div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                2.5M+
              </div>
              <div className="text-gray-600">Properties worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-booking-blue mb-2">
                900M+
              </div>
              <div className="text-gray-600">Guest reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
