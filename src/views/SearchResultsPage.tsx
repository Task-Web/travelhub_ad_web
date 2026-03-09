import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import StaysSearchForm from '../components/search/StaysSearchForm';

// Property type from backend
interface Property {
  id: string;
  name: string;
  type: string;
  location: { city: string; country: string; address: string };
  starRating: number | null;
  reviewScore: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  images: string[];
  amenities: string[];
  roomTypes: Array<{ id: string; name: string; price: number; maxGuests: number }>;
  description: string;
}

// Transform backend hotel to display format
function transformProperty(hotel: Property) {
  const getReviewLabel = (score: number) => {
    if (score >= 9) return 'Superb';
    if (score >= 8) return 'Very good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Pleasant';
    return 'Review score';
  };

  return {
    id: hotel.id,
    name: hotel.name,
    type: hotel.type || 'Hotel',
    starRating: hotel.starRating,
    location: `${hotel.location.address}, ${hotel.location.city}`,
    distance: '0.5 km from centre', // Could be calculated from coordinates
    description: hotel.description,
    fullDescription: hotel.description,
    image: hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    reviewScore: hotel.reviewScore,
    reviewCount: hotel.reviewCount,
    reviewLabel: getReviewLabel(hotel.reviewScore),
    price: hotel.pricePerNight,
    originalPrice: null,
    freeCancellation: true,
    breakfastIncluded: hotel.amenities.some(a => a.toLowerCase().includes('breakfast')),
    geniusDiscount: hotel.reviewScore >= 9,
    preferredPartner: hotel.starRating === 5,
    coordinates: { lat: 0, lng: 0 },
    businessFriendly: hotel.amenities.some(a =>
      a.toLowerCase().includes('wifi') || a.toLowerCase().includes('business')
    ),
    workAmenities: hotel.amenities.filter(a =>
      a.toLowerCase().includes('wifi') ||
      a.toLowerCase().includes('business') ||
      a.toLowerCase().includes('desk')
    ),
    dealCategories: [] as string[],
    currency: hotel.currency,
  };
}

// Deal category display names
const dealCategoryNames: Record<string, string> = {
  'lunar-new-year': 'Lunar New Year',
  'spring': 'Spring Escapes',
  'easter': 'Easter Holidays',
  'golden-week': 'Golden Week',
  'carnival': 'Carnival Season',
  'valentines': "Valentine's Day",
  'christmas': 'Christmas Markets',
  'thanksgiving': 'Thanksgiving',
  'winter': 'Winter Escapes',
  'black-friday': 'Black Friday',
};

// Region metadata for display
interface RegionMeta {
  name: string;
  country: string;
}

const regionMetadata: Record<string, RegionMeta> = {
  // UK Regions
  'greater-london': { name: 'Greater London', country: 'United Kingdom' },
  'scotland': { name: 'Scotland', country: 'United Kingdom' },
  'wales': { name: 'Wales', country: 'United Kingdom' },
  'south-west-england': { name: 'South West England', country: 'United Kingdom' },
  'north-west-england': { name: 'North West England', country: 'United Kingdom' },
  'yorkshire': { name: 'Yorkshire', country: 'United Kingdom' },
  // Spain Regions
  'catalonia': { name: 'Catalonia', country: 'Spain' },
  'andalusia': { name: 'Andalusia', country: 'Spain' },
  'balearic-islands': { name: 'Balearic Islands', country: 'Spain' },
  'canary-islands': { name: 'Canary Islands', country: 'Spain' },
  'valencian-community': { name: 'Valencian Community', country: 'Spain' },
  // France Regions
  'ile-de-france': { name: 'Ile de France', country: 'France' },
  'provence-alpes': { name: 'Provence-Alpes-Côte d\'Azur', country: 'France' },
  'auvergne-rhone-alpes': { name: 'Auvergne-Rhône-Alpes', country: 'France' },
  'brittany': { name: 'Brittany', country: 'France' },
  // Italy Regions
  'tuscany': { name: 'Tuscany', country: 'Italy' },
  'lazio': { name: 'Lazio', country: 'Italy' },
  'lombardy': { name: 'Lombardy', country: 'Italy' },
  'veneto': { name: 'Veneto', country: 'Italy' },
  'sicily': { name: 'Sicily', country: 'Italy' },
  // Other European Regions
  'algarve': { name: 'Algarve', country: 'Portugal' },
  'lisbon-region': { name: 'Lisbon Region', country: 'Portugal' },
  'bavaria': { name: 'Bavaria', country: 'Germany' },
  'north-holland': { name: 'North Holland', country: 'Netherlands' },
  'attica': { name: 'Attica', country: 'Greece' },
  'crete': { name: 'Crete', country: 'Greece' },
  // Asia Pacific Regions
  'bali': { name: 'Bali', country: 'Indonesia' },
  'phuket': { name: 'Phuket Province', country: 'Thailand' },
  'tokyo-metro': { name: 'Tokyo Metropolitan', country: 'Japan' },
  // Americas Regions
  'california': { name: 'California', country: 'United States' },
  'florida': { name: 'Florida', country: 'United States' },
  'new-york-state': { name: 'New York State', country: 'United States' },
};

const sortOptions = [
  { value: 'top-picks', label: 'Our top picks' },
  { value: 'price-low', label: 'Lowest price first' },
  { value: 'star-price', label: 'Star rating and price' },
  { value: 'top-reviewed', label: 'Top reviewed' },
];

const starFilters = [5, 4, 3, 2, 1];
const reviewFilters = [
  { min: 9, label: 'Superb: 9+' },
  { min: 8, label: 'Very good: 8+' },
  { min: 7, label: 'Good: 7+' },
  { min: 6, label: 'Pleasant: 6+' },
];

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const regionParam = searchParams.get('region');
  const destinationParam = searchParams.get('destination');

  // Get region metadata if region param is present
  const regionMeta = regionParam ? regionMetadata[regionParam] : null;

  // Display name prioritizes region name, then destination, then defaults to London
  const displayName = regionMeta?.name || destinationParam || 'London';
  const displayCountry = regionMeta?.country || 'United Kingdom';

  // For API calls, use the display name
  const destination = displayName;
  const propertyType = searchParams.get('type') || null;
  const entireHome = searchParams.get('entire_home') === 'true';
  const addFlights = searchParams.get('add_flights') === 'true';
  const travellingForWork = searchParams.get('work') === 'true';
  const geniusFilter = searchParams.get('genius') === 'true' || searchParams.get('nflt')?.includes('genius_deals=1');
  const dealFilter = searchParams.get('deal') || null;
  const [sortBy, setSortBy] = useState('top-picks');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [minReview, setMinReview] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [geniusOnly, setGeniusOnly] = useState(geniusFilter);
  const [dealCategory, setDealCategory] = useState<string | null>(dealFilter);

  // Backend data state
  const [properties, setProperties] = useState<ReturnType<typeof transformProperty>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdOpen, setIsAdOpen] = useState(true);
  const [adPosition, setAdPosition] = useState({ x: 40, y: 40 });
  const [adCountdownSeconds, setAdCountdownSeconds] = useState(3 * 60 + 0);
  const adRef = useRef<HTMLDivElement | null>(null);
  const adVelocityRef = useRef({ vx: 2.2, vy: 1.6 });
  const adPositionRef = useRef({ x: 40, y: 40 });
  const adFrameRef = useRef<number | null>(null);
  const adSpeedMultiplierRef = useRef(1);

  useEffect(() => {
    let isMounted = true;
    let dispose: (() => void) | null = null;

    const setupDevtoolGuard = async () => {
      try {
        const module = await import('disable-devtool');
        const disableDevtool = module.default ?? module;
        if (!isMounted) {
          return;
        }
        const controller = disableDevtool({
          disableMenu: true,
          clearLog: true,
          ondevtoolopen: () => {
            navigate('/');
          },
        });
        if (controller && typeof controller.dispose === 'function') {
          dispose = controller.dispose.bind(controller);
        }
      } catch (error) {
        console.warn('disable-devtool failed to load', error);
      }
    };

    if (typeof window !== 'undefined') {
      void setupDevtoolGuard();
    }

    return () => {
      isMounted = false;
      if (dispose) {
        dispose();
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (!isAdOpen) {
      if (adFrameRef.current !== null) {
        window.cancelAnimationFrame(adFrameRef.current);
        adFrameRef.current = null;
      }
      return undefined;
    }

    const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
    const randomDirection = () => (Math.random() > 0.5 ? 1 : -1);
    const randomSignedSpeed = (min: number, max: number) => randomBetween(min, max) * randomDirection();

    adVelocityRef.current = {
      vx: randomSignedSpeed(1.6, 2.8),
      vy: randomSignedSpeed(1.3, 2.4),
    };

    adPositionRef.current = {
      x: randomBetween(24, Math.max(24, window.innerWidth - 320)),
      y: randomBetween(24, Math.max(24, window.innerHeight - 200)),
    };
    setAdPosition(adPositionRef.current);

    const updatePosition = () => {
      if (!adRef.current) {
        adFrameRef.current = window.requestAnimationFrame(updatePosition);
        return;
      }

      const rect = adRef.current.getBoundingClientRect();
      const maxX = Math.max(0, window.innerWidth - rect.width);
      const maxY = Math.max(0, window.innerHeight - rect.height);

      const speedMultiplier = adSpeedMultiplierRef.current;
      let nextX = adPositionRef.current.x + adVelocityRef.current.vx * speedMultiplier;
      let nextY = adPositionRef.current.y + adVelocityRef.current.vy * speedMultiplier;

      if (nextX <= 0 || nextX >= maxX) {
        adVelocityRef.current.vx = randomSignedSpeed(1.6, 2.8);
        nextX = Math.min(Math.max(0, nextX), maxX);
      }

      if (nextY <= 0 || nextY >= maxY) {
        adVelocityRef.current.vy = randomSignedSpeed(1.3, 2.4);
        nextY = Math.min(Math.max(0, nextY), maxY);
      }

      adPositionRef.current = { x: nextX, y: nextY };
      setAdPosition(adPositionRef.current);
      adFrameRef.current = window.requestAnimationFrame(updatePosition);
    };

    adFrameRef.current = window.requestAnimationFrame(updatePosition);

    const handleResize = () => {
      if (!adRef.current) {
        return;
      }
      const rect = adRef.current.getBoundingClientRect();
      const maxX = Math.max(0, window.innerWidth - rect.width);
      const maxY = Math.max(0, window.innerHeight - rect.height);
      adPositionRef.current = {
        x: Math.min(adPositionRef.current.x, maxX),
        y: Math.min(adPositionRef.current.y, maxY),
      };
      setAdPosition(adPositionRef.current);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (adFrameRef.current !== null) {
        window.cancelAnimationFrame(adFrameRef.current);
        adFrameRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isAdOpen]);

  useEffect(() => {
    if (!isAdOpen) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setAdCountdownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isAdOpen]);

  const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Fetch properties from backend API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build API URL with filters
        const params = new URLSearchParams();
        if (regionParam) {
          // If region is specified, pass it to API
          params.set('region', regionParam);
          params.set('city', displayName);
        } else if (destinationParam) {
          params.set('city', destinationParam);
        } else {
          params.set('city', 'London');
        }
        if (propertyType) {
          params.set('property_type', propertyType);
        }

        const response = await fetch(`/api/hotels?${params.toString()}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        const transformedProperties = (data.hotels || []).map(transformProperty);
        setProperties(transformedProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [regionParam, destinationParam, displayName, propertyType]);

  const toggleDescription = (propertyId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const navigateToProperty = (propertyId: string) => {
    navigate(`/hotel/${propertyId}`);
  };

  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter((s) => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  const toggleGeniusFilter = () => {
    const newGeniusOnly = !geniusOnly;
    setGeniusOnly(newGeniusOnly);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (newGeniusOnly) {
      newParams.set('genius', 'true');
    } else {
      newParams.delete('genius');
      // Also remove nflt if it contains genius_deals
      const nflt = newParams.get('nflt');
      if (nflt?.includes('genius_deals=1')) {
        newParams.delete('nflt');
      }
    }
    setSearchParams(newParams);
  };

  const clearDealFilter = () => {
    setDealCategory(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('deal');
    setSearchParams(newParams);
  };

  const filteredProperties = properties.filter((property) => {
    // Filter for Genius properties
    if (geniusOnly && !property.geniusDiscount) {
      return false;
    }
    // Filter by deal category
    if (dealCategory && (!property.dealCategories || !property.dealCategories.includes(dealCategory))) {
      return false;
    }
    // Filter for entire homes/apartments
    if (entireHome && property.type !== 'Apartment' && property.type !== 'Villa' && property.type !== 'Holiday Home') {
      return false;
    }
    if (selectedStars.length > 0 && property.starRating && !selectedStars.includes(property.starRating)) {
      return false;
    }
    if (minReview && property.reviewScore < minReview) {
      return false;
    }
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    // If travelling for work, prioritize business-friendly properties
    if (travellingForWork && sortBy === 'top-picks') {
      if (a.businessFriendly && !b.businessFriendly) return -1;
      if (!a.businessFriendly && b.businessFriendly) return 1;
    }
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'star-price':
        return (b.starRating || 0) - (a.starRating || 0) || a.price - b.price;
      case 'top-reviewed':
        return b.reviewScore - a.reviewScore;
      default:
        return 0;
    }
  });

  return (
    <div>
      {isAdOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-label="TravelHub promotional popup"
        >
          <div
            ref={adRef}
            className="absolute w-[280px] sm:w-[320px] rounded-xl border border-white/40 bg-white shadow-2xl"
            style={{
              transform: `translate3d(${adPosition.x}px, ${adPosition.y}px, 0)`,
            }}
            onMouseEnter={() => {
              adSpeedMultiplierRef.current = 0.6;
            }}
            onMouseLeave={() => {
              adSpeedMultiplierRef.current = 1;
            }}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div className="text-sm font-semibold text-booking-blue">TravelHub Limited Offer</div>
              <button
                type="button"
                onClick={() => setIsAdOpen(false)}
                className="rounded-full border border-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-600 hover:border-neutral-300 hover:text-neutral-800"
                aria-label="Close advertisement"
              >
                Close
              </button>
            </div>
            <div className="px-4 py-4">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Save $88 and travel tonight</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Book hotels, flights, and local experiences in one place. Limited-time bonus airport transfer voucher for new users.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Offer ends in {formatCountdown(adCountdownSeconds)}</div>
                <button
                  type="button"
                  className="rounded px-3 py-2 bg-booking-blue text-white text-sm font-semibold hover:bg-booking-blue-hover"
                >
                  Claim Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
            <Link to="/" className="text-booking-blue-light hover:underline">{displayCountry}</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">{displayName}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-card p-4 sticky top-24">
              <h2 className="font-bold text-neutral-800 mb-4">Filter by:</h2>

              {/* Genius Discount Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Deals</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={geniusOnly}
                    onChange={toggleGeniusFilter}
                    className="w-4 h-4 text-booking-blue"
                  />
                  <span className="flex items-center gap-2 text-neutral-700">
                    <span className="bg-booking-blue text-white text-xs font-bold px-1.5 py-0.5 rounded">Genius</span>
                    Genius discounts
                  </span>
                </label>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Star rating</h3>
                <div className="space-y-2">
                  {starFilters.map((star) => (
                    <label key={star} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStars.includes(star)}
                        onChange={() => toggleStar(star)}
                        className="w-4 h-4 text-booking-blue"
                      />
                      <span className="flex items-center gap-1">
                        {Array.from({ length: star }).map((_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Review Score */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Review score</h3>
                <div className="space-y-2">
                  {reviewFilters.map((filter) => (
                    <label key={filter.min} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reviewScore"
                        checked={minReview === filter.min}
                        onChange={() => setMinReview(filter.min)}
                        className="w-4 h-4 text-booking-blue"
                      />
                      <span className="text-neutral-700">{filter.label}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reviewScore"
                      checked={minReview === null}
                      onChange={() => setMinReview(null)}
                      className="w-4 h-4 text-booking-blue"
                    />
                    <span className="text-neutral-700">Any</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Genius Filter Banner */}
            {geniusOnly && (
              <div className="bg-gradient-to-r from-booking-blue to-blue-600 rounded-lg p-4 mb-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                    </svg>
                    <div>
                      <h2 className="font-bold text-lg">Showing Genius properties only</h2>
                      <p className="text-white/90 text-sm">Unlock these exclusive discounts by signing in to your Genius account.</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleGeniusFilter}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  >
                    Show all properties
                  </button>
                </div>
              </div>
            )}

            {/* Deal Category Filter Banner */}
            {dealCategory && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 mb-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                    </svg>
                    <div>
                      <h2 className="font-bold text-lg">
                        {dealCategoryNames[dealCategory] || dealCategory} deals
                      </h2>
                      <p className="text-white/90 text-sm">
                        Showing properties with special {dealCategoryNames[dealCategory]?.toLowerCase() || dealCategory} offers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearDealFilter}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  >
                    Show all properties
                  </button>
                </div>
              </div>
            )}

            {/* Flight + Hotel Banner */}
            {addFlights && (
              <div className="bg-gradient-to-r from-booking-blue to-booking-blue-light rounded-lg p-4 mb-4 text-white">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z" />
                  </svg>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg">Flight + Hotel Packages</h2>
                    <p className="text-white/90 text-sm">Save more when you book your flight and hotel together. Prices shown include return flights.</p>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded">
                    <span className="font-bold">Up to 30% off</span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-booking-blue"></div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Header */}
            {!loading && (
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-800">
                  {destination}: {sortedProperties.length} {propertyType ? propertyType : addFlights ? 'flight + hotel packages' : 'properties'} found
                </h1>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded hover:bg-neutral-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                  </svg>
                  Show on map
                </button>
              </div>
              {/* Sorting Buttons */}
              <div className="flex items-center gap-2">
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
            </div>
            )}

            {/* Map View */}
            {showMap && (
              <div className="mb-6 bg-white rounded-lg shadow-card overflow-hidden">
                <div className="relative h-96 bg-neutral-100">
                  {/* Map placeholder with property markers */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Map background */}
                      <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=600&fit=crop"
                        alt="Map of London"
                        className="w-full h-full object-cover opacity-70"
                      />
                      {/* Property markers */}
                      {sortedProperties.map((property, index) => (
                        <button
                          key={property.id}
                          onClick={() => navigateToProperty(property.id)}
                          className="absolute bg-booking-blue text-white text-xs font-bold px-2 py-1 rounded shadow-lg hover:bg-booking-blue-light transition-colors"
                          style={{
                            left: `${20 + (index * 15)}%`,
                            top: `${30 + (index % 3) * 20}%`,
                          }}
                        >
                          EUR {property.price}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMap(false)}
                    className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow-lg hover:bg-neutral-100"
                  >
                    Close map
                  </button>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!loading && sortedProperties.length === 0 && (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-bold text-neutral-700 mb-2">No properties found</h3>
                <p className="text-neutral-500">
                  We couldn&apos;t find any {propertyType || 'properties'} in {destination}. Try adjusting your filters or searching for a different destination.
                </p>
              </div>
            )}

            {/* Property Cards */}
            <div className="space-y-4">
              {sortedProperties.map((property) => {
                const isExpanded = expandedDescriptions.has(property.id);
                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
                  >
                    <div className="flex">
                      {/* Image - clickable */}
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
                                      <span key={i} className="text-yellow-500 text-sm">&#9733;</span>
                                    ))}
                                  </span>
                                )}
                                {property.preferredPartner && (
                                  <span className="relative group">
                                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded cursor-help">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                      </svg>
                                      Preferred Partner
                                    </span>
                                    <span className="absolute left-0 top-full mt-1 w-64 p-2 bg-neutral-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                      This property is part of our Preferred Partner Programme. It is committed to providing great service and quality. TravelHub pays a higher commission for these properties.
                                    </span>
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-sm text-booking-blue-light hover:underline cursor-pointer flex items-center gap-1"
                                onClick={() => navigateToProperty(property.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
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

                          {/* Description with Show more */}
                          <div className="mb-2">
                            <p className={`text-sm text-neutral-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                              {isExpanded ? property.fullDescription : property.description}
                            </p>
                            {property.fullDescription && property.fullDescription.length > property.description.length && (
                              <button
                                onClick={() => toggleDescription(property.id)}
                                className="text-sm text-booking-blue-light hover:underline mt-1"
                              >
                                {isExpanded ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {property.freeCancellation && (
                              <span className="text-xs text-success font-medium">Free cancellation</span>
                            )}
                            {property.breakfastIncluded && (
                              <span className="text-xs text-success font-medium">Breakfast included</span>
                            )}
                          </div>

                          {/* Work amenities - shown when travelling for work */}
                          {travellingForWork && property.businessFriendly && property.workAmenities && property.workAmenities.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-booking-blue">
                                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                                </svg>
                                <span className="text-xs font-medium text-booking-blue">Business-friendly</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {property.workAmenities.map((amenity, index) => (
                                  <span key={index} className="text-xs text-neutral-600 bg-white px-2 py-0.5 rounded">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-end justify-between mt-4 pt-4 border-t border-neutral-100">
                          <div className="text-sm text-neutral-500">
                            {addFlights ? (
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-booking-blue">
                                  <path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z" />
                                </svg>
                                <span>Flight + 1 night, 2 adults</span>
                              </div>
                            ) : (
                              '1 night, 2 adults'
                            )}
                          </div>
                          <div className="text-right">
                            {addFlights ? (
                              <>
                                <p className="text-sm text-neutral-500 line-through">
                                  EUR {property.price + 180}
                                </p>
                                <p className="text-xl font-bold text-neutral-800">
                                  EUR {property.price + 120}
                                </p>
                                <p className="text-xs text-success font-medium">Package deal - save EUR 60</p>
                              </>
                            ) : (
                              <>
                                {property.originalPrice && (
                                  <p className="text-sm text-neutral-500 line-through">
                                    EUR {property.originalPrice}
                                  </p>
                                )}
                                <p className="text-xl font-bold text-neutral-800">
                                  EUR {property.price}
                                </p>
                                <p className="text-xs text-neutral-500">Includes taxes and fees</p>
                              </>
                            )}
                            <button
                              onClick={() => navigateToProperty(property.id)}
                              className="mt-2 px-4 py-2 bg-booking-blue-light text-white font-medium rounded hover:bg-booking-blue transition-colors"
                            >
                              {addFlights ? 'View package' : 'Check availability'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
