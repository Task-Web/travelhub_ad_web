import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StaysSearchForm from '../components/search/StaysSearchForm';

// Property type configuration
interface PropertyTypeConfig {
  slug: string;
  name: string;
  pluralName: string;
  description: string;
}

const propertyTypeConfigs: Record<string, PropertyTypeConfig> = {
  apartments: {
    slug: 'apartments',
    name: 'Apartment',
    pluralName: 'Apartments',
    description: 'Self-contained units with kitchen and living space',
  },
  'booking-home': {
    slug: 'booking-home',
    name: 'Holiday Home',
    pluralName: 'Holiday Rentals',
    description: 'Entire homes for your holiday getaway',
  },
  'holiday-homes': {
    slug: 'holiday-homes',
    name: 'Holiday Home',
    pluralName: 'Holiday Homes',
    description: 'Entire homes for your holiday getaway',
  },
  villas: {
    slug: 'villas',
    name: 'Villa',
    pluralName: 'Villas',
    description: 'Luxurious private properties with premium amenities',
  },
  hostels: {
    slug: 'hostels',
    name: 'Hostel',
    pluralName: 'Hostels',
    description: 'Budget-friendly accommodation with shared facilities',
  },
  hotels: {
    slug: 'hotels',
    name: 'Hotel',
    pluralName: 'Hotels',
    description: 'Traditional accommodation with full service',
  },
  resorts: {
    slug: 'resorts',
    name: 'Resort',
    pluralName: 'Resorts',
    description: 'All-inclusive properties with extensive amenities',
  },
  'bed-and-breakfast': {
    slug: 'bed-and-breakfast',
    name: 'Bed and Breakfast',
    pluralName: 'B&Bs',
    description: 'Cozy accommodation with breakfast included',
  },
  'guest-houses': {
    slug: 'guest-houses',
    name: 'Guest House',
    pluralName: 'Guest Houses',
    description: 'Family-run accommodation with local charm',
  },
};

// Country code to country name mapping
const countryNames: Record<string, string> = {
  gb: 'United Kingdom',
  us: 'United States',
  fr: 'France',
  es: 'Spain',
  it: 'Italy',
  de: 'Germany',
  jp: 'Japan',
  nl: 'Netherlands',
  pt: 'Portugal',
  at: 'Austria',
  cz: 'Czech Republic',
  hu: 'Hungary',
  ae: 'UAE',
  gr: 'Greece',
  hr: 'Croatia',
};

// City slug to city name mapping
const cityNames: Record<string, string> = {
  london: 'London',
  paris: 'Paris',
  barcelona: 'Barcelona',
  rome: 'Rome',
  amsterdam: 'Amsterdam',
  'new-york': 'New York',
  berlin: 'Berlin',
  lisbon: 'Lisbon',
  vienna: 'Vienna',
  prague: 'Prague',
  budapest: 'Budapest',
  madrid: 'Madrid',
  milan: 'Milan',
  dubai: 'Dubai',
  tokyo: 'Tokyo',
  manchester: 'Manchester',
  edinburgh: 'Edinburgh',
  liverpool: 'Liverpool',
  birmingham: 'Birmingham',
  bristol: 'Bristol',
};

interface PropertyCard {
  id: string;
  name: string;
  type: string;
  starRating: number | null;
  location: string;
  distance: string;
  description: string;
  image: string;
  reviewScore: number;
  reviewCount: number;
  reviewLabel: string;
  price: number;
  originalPrice: number | null;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  geniusDiscount: boolean;
}

const getReviewLabel = (score: number) => {
  if (score >= 9) return 'Superb';
  if (score >= 8) return 'Very good';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Pleasant';
  return 'Review score';
};

const fallbackHotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';

const resolveHotelImage = (rawImage?: string) => {
  if (!rawImage) {
    return fallbackHotelImage;
  }
  if (rawImage.startsWith('//')) {
    return `https:${rawImage}`;
  }
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    return rawImage;
  }
  return fallbackHotelImage;
};

const mapHotelToProperty = (hotel: Record<string, unknown>): PropertyCard => {
  const location = hotel.location as { city?: string; country?: string; address?: string } | undefined;
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities.map(String) : [];
  const reviewScore = Number(hotel.reviewScore ?? 0);
  const image =
    Array.isArray(hotel.images) && hotel.images.length > 0
      ? String(hotel.images[0])
      : '';
  return {
    id: String(hotel.id ?? ''),
    name: String(hotel.name ?? 'Property'),
    type: String(hotel.type ?? 'Hotel'),
    starRating: typeof hotel.starRating === 'number' ? hotel.starRating : null,
    location: location
      ? `${location.address || ''}${location.address && location.city ? ', ' : ''}${location.city || ''}`
      : 'City center',
    distance: '0.5 km from centre',
    description: String(hotel.description ?? 'Comfortable stay with great amenities.'),
    image: resolveHotelImage(image),
    reviewScore,
    reviewCount: Number(hotel.reviewCount ?? 0),
    reviewLabel: getReviewLabel(reviewScore),
    price: Number(hotel.pricePerNight ?? 0),
    originalPrice: null,
    freeCancellation: Boolean(hotel.freeCancellation ?? true),
    breakfastIncluded: amenities.some((a) => a.toLowerCase().includes('breakfast')),
    geniusDiscount: reviewScore >= 9,
  };
};

const sortOptions = [
  { value: 'top-picks', label: 'Our top picks' },
  { value: 'price-low', label: 'Lowest price first' },
  { value: 'top-reviewed', label: 'Top reviewed' },
];

export default function PropertyTypeSearchPage() {
  const { propertyType, countryCode, citySlug } = useParams<{
    propertyType: string;
    countryCode: string;
    citySlug: string;
  }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('top-picks');
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Get property type configuration
  const typeConfig = useMemo(() => {
    const type = propertyType?.toLowerCase() || 'hotels';
    return propertyTypeConfigs[type] || {
      slug: type,
      name: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' '),
      pluralName: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' '),
      description: '',
    };
  }, [propertyType]);

  // Get city and country names
  const cityName = useMemo(() => {
    const slug = citySlug?.toLowerCase() || 'london';
    return cityNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  }, [citySlug]);

  const countryName = useMemo(() => {
    const code = countryCode?.toLowerCase() || 'gb';
    return countryNames[code] || code.toUpperCase();
  }, [countryCode]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    const params = new URLSearchParams();
    if (cityName) params.set('city', cityName);
    if (countryName) params.set('country', countryName);
    if (typeConfig.slug) params.set('property_type', typeConfig.slug);

    fetch(`/api/hotels?${params.toString()}`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        const hotels = Array.isArray(data.hotels) ? data.hotels : [];
        setProperties(hotels.map((hotel: unknown) => mapHotelToProperty(hotel as Record<string, unknown>)));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Error fetching properties:', error);
        setLoadError('Unable to load properties from state.');
        setProperties([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cityName, countryName, typeConfig.slug]);

  // Filter properties by type
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const propertyTypeLower = property.type.toLowerCase();
      const configName = typeConfig.name.toLowerCase();

      // Match property type
      if (propertyTypeLower === configName) return true;

      // Handle holiday home / holiday rental variations
      if (typeConfig.slug === 'booking-home' || typeConfig.slug === 'holiday-homes') {
        return propertyTypeLower === 'holiday home' || propertyTypeLower === 'holiday rental';
      }

      // Handle B&B variations
      if (typeConfig.slug === 'bed-and-breakfast') {
        return propertyTypeLower === 'bed and breakfast' || propertyTypeLower === 'b&b';
      }

      // Handle guest house variations
      if (typeConfig.slug === 'guest-houses') {
        return propertyTypeLower === 'guest house';
      }

      return false;
    });
  }, [properties, typeConfig]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'top-reviewed':
          return b.reviewScore - a.reviewScore;
        default:
          return 0;
      }
    });
  }, [filteredProperties, sortBy]);

  const navigateToProperty = (propertyId: string) => {
    navigate(`/hotel/${propertyId}`);
  };

  // Page title
  const pageTitle = `${typeConfig.pluralName} in ${cityName}`;

  return (
    <div>
      {/* Search Bar */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <StaysSearchForm compact />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-2">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to={`/${typeConfig.slug}`} className="text-booking-blue-light hover:underline">
              {typeConfig.pluralName}
            </Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to={`/country/${countryCode}`} className="text-booking-blue-light hover:underline">
              {countryName}
            </Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">{cityName}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-6">
        {(isLoading || loadError) && (
          <div className="mb-6">
            {isLoading && properties.length === 0 && (
              <div className="bg-neutral-100 text-neutral-700 rounded-lg px-4 py-3 text-sm">
                Loading properties...
              </div>
            )}
            {loadError && (
              <div className="bg-amber-50 text-amber-800 rounded-lg px-4 py-3 text-sm mt-3">
                {loadError}
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">{pageTitle}</h1>
          <p className="text-neutral-600">
            {sortedProperties.length} {typeConfig.pluralName.toLowerCase()} found in {cityName}
          </p>
          {typeConfig.description && (
            <p className="text-sm text-neutral-500 mt-1">{typeConfig.description}</p>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-neutral-500 mr-2">Sort by:</span>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                sortBy === option.value
                  ? 'bg-booking-blue text-white border-booking-blue'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-booking-blue-light hover:bg-neutral-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {sortedProperties.length > 0 ? (
          <div className="space-y-4">
            {sortedProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                <div className="flex">
                  {/* Image */}
                  <div
                    className="w-64 flex-shrink-0 relative cursor-pointer"
                    onClick={() => navigateToProperty(property.id)}
                  >
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                    {property.geniusDiscount && (
                      <span className="absolute top-2 left-2 bg-booking-blue text-white text-xs font-bold px-2 py-1 rounded">
                        Genius
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2
                              className="text-lg font-bold text-booking-blue-light hover:underline cursor-pointer"
                              onClick={() => navigateToProperty(property.id)}
                            >
                              {property.name}
                            </h2>
                            {property.starRating && (
                              <span className="flex">
                                {Array.from({ length: property.starRating }).map((_, i) => (
                                  <span key={i} className="text-yellow-500 text-sm">★</span>
                                ))}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-booking-blue bg-booking-blue/10 px-2 py-0.5 rounded inline-block mt-1">
                            {property.type}
                          </p>
                          <p className="text-sm text-booking-blue-light hover:underline cursor-pointer mt-1">
                            {property.location}
                          </p>
                          <p className="text-xs text-neutral-500">{property.distance}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium text-neutral-800">{property.reviewLabel}</p>
                              <p className="text-xs text-neutral-500">{property.reviewCount} reviews</p>
                            </div>
                            <span className="bg-booking-blue text-white font-bold px-2 py-1 rounded">
                              {property.reviewScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {property.freeCancellation && (
                          <span className="text-xs text-success font-medium">Free cancellation</span>
                        )}
                        {property.breakfastIncluded && (
                          <span className="text-xs text-success font-medium">Breakfast included</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-neutral-100">
                      <div className="text-sm text-neutral-500">1 night, 2 adults</div>
                      <div className="text-right">
                        {property.originalPrice && (
                          <p className="text-sm text-neutral-500 line-through">
                            EUR {property.originalPrice}
                          </p>
                        )}
                        <p className="text-xl font-bold text-neutral-800">EUR {property.price}</p>
                        <p className="text-xs text-neutral-500">Includes taxes and fees</p>
                        <button
                          onClick={() => navigateToProperty(property.id)}
                          className="mt-2 px-4 py-2 bg-booking-blue-light text-white font-medium rounded hover:bg-booking-blue transition-colors"
                        >
                          Check availability
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">
              No {typeConfig.pluralName.toLowerCase()} found
            </h2>
            <p className="text-neutral-600 mb-4">
              We couldn&apos;t find any {typeConfig.pluralName.toLowerCase()} in {cityName} at the moment.
            </p>
            <Link
              to={`/search?destination=${encodeURIComponent(cityName)}`}
              className="inline-block px-6 py-2 bg-booking-blue text-white font-medium rounded hover:bg-booking-blue-hover transition-colors"
            >
              View all properties in {cityName}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
