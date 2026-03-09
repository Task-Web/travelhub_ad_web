import { Link, useNavigate } from 'react-router-dom';

interface Region {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  hotels: number;
  popular: boolean;
}

const regions: Region[] = [
  // UK Regions
  { id: 'greater-london', name: 'Greater London', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 17112, popular: true },
  { id: 'scotland', name: 'Scotland', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 8450, popular: true },
  { id: 'wales', name: 'Wales', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 4230, popular: false },
  { id: 'south-west-england', name: 'South West England', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 12340, popular: true },
  { id: 'north-west-england', name: 'North West England', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 9870, popular: false },
  { id: 'yorkshire', name: 'Yorkshire', country: 'United Kingdom', countryCode: 'gb', flag: '🇬🇧', hotels: 7650, popular: false },

  // Spain Regions
  { id: 'catalonia', name: 'Catalonia', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 28450, popular: true },
  { id: 'andalusia', name: 'Andalusia', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 22340, popular: true },
  { id: 'balearic-islands', name: 'Balearic Islands', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 15670, popular: true },
  { id: 'canary-islands', name: 'Canary Islands', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 12890, popular: true },
  { id: 'valencian-community', name: 'Valencian Community', country: 'Spain', countryCode: 'es', flag: '🇪🇸', hotels: 18230, popular: false },

  // France Regions
  { id: 'ile-de-france', name: 'Ile de France', country: 'France', countryCode: 'fr', flag: '🇫🇷', hotels: 21450, popular: true },
  { id: 'provence-alpes', name: 'Provence-Alpes-Côte d\'Azur', country: 'France', countryCode: 'fr', flag: '🇫🇷', hotels: 18670, popular: true },
  { id: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes', country: 'France', countryCode: 'fr', flag: '🇫🇷', hotels: 14230, popular: false },
  { id: 'brittany', name: 'Brittany', country: 'France', countryCode: 'fr', flag: '🇫🇷', hotels: 8760, popular: false },

  // Italy Regions
  { id: 'tuscany', name: 'Tuscany', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 24560, popular: true },
  { id: 'lazio', name: 'Lazio', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 19870, popular: true },
  { id: 'lombardy', name: 'Lombardy', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 16450, popular: false },
  { id: 'veneto', name: 'Veneto', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 21340, popular: true },
  { id: 'sicily', name: 'Sicily', country: 'Italy', countryCode: 'it', flag: '🇮🇹', hotels: 12890, popular: true },

  // Other European Regions
  { id: 'algarve', name: 'Algarve', country: 'Portugal', countryCode: 'pt', flag: '🇵🇹', hotels: 8970, popular: true },
  { id: 'lisbon-region', name: 'Lisbon Region', country: 'Portugal', countryCode: 'pt', flag: '🇵🇹', hotels: 7650, popular: true },
  { id: 'bavaria', name: 'Bavaria', country: 'Germany', countryCode: 'de', flag: '🇩🇪', hotels: 18230, popular: true },
  { id: 'north-holland', name: 'North Holland', country: 'Netherlands', countryCode: 'nl', flag: '🇳🇱', hotels: 9870, popular: true },
  { id: 'attica', name: 'Attica', country: 'Greece', countryCode: 'gr', flag: '🇬🇷', hotels: 8450, popular: true },
  { id: 'crete', name: 'Crete', country: 'Greece', countryCode: 'gr', flag: '🇬🇷', hotels: 12340, popular: true },

  // Asia Pacific Regions
  { id: 'bali', name: 'Bali', country: 'Indonesia', countryCode: 'id', flag: '🇮🇩', hotels: 28670, popular: true },
  { id: 'phuket', name: 'Phuket Province', country: 'Thailand', countryCode: 'th', flag: '🇹🇭', hotels: 15890, popular: true },
  { id: 'tokyo-metro', name: 'Tokyo Metropolitan', country: 'Japan', countryCode: 'jp', flag: '🇯🇵', hotels: 12450, popular: true },

  // Americas Regions
  { id: 'california', name: 'California', country: 'United States', countryCode: 'us', flag: '🇺🇸', hotels: 32560, popular: true },
  { id: 'florida', name: 'Florida', country: 'United States', countryCode: 'us', flag: '🇺🇸', hotels: 28970, popular: true },
  { id: 'new-york-state', name: 'New York State', country: 'United States', countryCode: 'us', flag: '🇺🇸', hotels: 18670, popular: true },
];

export default function RegionsPage() {
  const navigate = useNavigate();

  // Sort by popularity first, then by hotel count
  const popularRegions = regions.filter(r => r.popular).sort((a, b) => b.hotels - a.hotels);
  const allRegionsSorted = [...regions].sort((a, b) => b.hotels - a.hotels);

  const handleRegionClick = (regionId: string) => {
    navigate(`/search?region=${regionId}`);
  };

  // Group regions by country for the full list
  const regionsByCountry = regions.reduce((acc, region) => {
    if (!acc[region.country]) {
      acc[region.country] = [];
    }
    acc[region.country].push(region);
    return acc;
  }, {} as Record<string, Region[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Regions</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Browse by region</h1>
          <p className="text-xl text-blue-100">
            Discover properties across {regions.length} popular regions worldwide
          </p>
        </div>
      </div>

      {/* Popular Regions */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Most popular regions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {popularRegions.slice(0, 12).map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionClick(region.id)}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left flex items-center gap-4"
              >
                <span className="text-3xl">{region.flag}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{region.name}</h3>
                  <p className="text-sm text-gray-600">{region.country}</p>
                  <p className="text-sm text-booking-blue font-medium">
                    {region.hotels.toLocaleString()} hotels
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* All Regions by Country */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All regions by country</h2>

          <div className="space-y-8">
            {Object.entries(regionsByCountry)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, countryRegions]) => (
              <div key={country} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{countryRegions[0].flag}</span>
                    <h3 className="font-bold text-gray-900">{country}</h3>
                    <span className="text-sm text-gray-500">
                      ({countryRegions.length} regions)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-100">
                  {countryRegions
                    .sort((a, b) => b.hotels - a.hotels)
                    .map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleRegionClick(region.id)}
                      className="p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <h4 className="font-medium text-gray-900">{region.name}</h4>
                      <p className="text-sm text-gray-600">
                        {region.hotels.toLocaleString()} hotels
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Over {allRegionsSorted.reduce((sum, r) => sum + r.hotels, 0).toLocaleString()} hotels across all regions
            </h2>
            <p className="text-gray-600 mb-6">
              From bustling cities to peaceful countryside retreats, find your perfect stay
            </p>
            <Link
              to="/"
              className="inline-block bg-booking-blue text-white px-6 py-3 rounded-md font-medium hover:bg-booking-blue-hover transition-colors"
            >
              Start searching
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
