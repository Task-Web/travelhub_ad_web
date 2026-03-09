import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { attractionsApi } from '@/api/client';

interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  image: string;
  duration: string;
  freeCancellation: boolean;
  bestSeller: boolean;
  category: string;
  subcategory: string;
}

const mapAttraction = (source: Record<string, unknown>): Attraction => {
  const location = source.location as Record<string, unknown> | undefined;
  const category = String(source.category ?? 'Experiences');
  const reviewCount = Number(source.reviewCount || 0);
  const rating = Number(source.rating || 0);

  return {
    id: String(source.id ?? ''),
    name: String(source.name ?? 'Attraction'),
    description: String(source.description ?? ''),
    location: String(location?.city ?? location?.country ?? ''),
    rating,
    reviews: reviewCount,
    price: Number(source.price || 0),
    currency: String(source.currency ?? 'EUR'),
    image:
      String(source.image ?? '') ||
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=300&fit=crop',
    duration: String(source.duration ?? 'Flexible'),
    freeCancellation: Boolean(source.freeCancellation ?? true),
    bestSeller: reviewCount > 500 || rating >= 4.6,
    category,
    subcategory: String(source.subcategory ?? category),
  };
};

const filterCategories = [
  {
    name: 'Tours',
    subcategories: [
      'Walking & hiking tours',
      'Museums & cultural tours',
      'Bus & car tours',
      'Boat tours & cruises',
      'City tours',
      'Day trips',
      'Private tours',
      'Food tours',
      'Night tours',
      'Photography tours',
      'Segway tours',
      'Ghost tours',
    ],
  },
  {
    name: 'Entertainment',
    subcategories: ['Theme parks', 'Shows & concerts', 'Sports events', 'Casinos'],
  },
  {
    name: 'Museums',
    subcategories: ['Art museums', 'History museums', 'Science museums', 'War museums'],
  },
  {
    name: 'Food & drinks',
    subcategories: ['Food tours', 'Wine tasting', 'Cooking classes', 'Pub crawls'],
  },
];

export default function AttractionsSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destName = searchParams.get('dest_name') || 'London';
  const startDate = searchParams.get('start_date');

  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [sortBy, setSortBy] = useState<'top_picks' | 'lowest_price' | 'highest_rating'>('top_picks');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedReviewScore, setSelectedReviewScore] = useState<string[]>([]);
  const [showCancelable, setShowCancelable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    attractionsApi
      .getAll({ city: destName })
      .then((response) => {
        if (cancelled) return;
        const mapped = response.attractions.map((item) =>
          mapAttraction(item as unknown as Record<string, unknown>)
        );
        setAllAttractions(mapped);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Error fetching attractions:', err);
        setError('Unable to load attractions from state.');
        setAllAttractions([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [destName]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allAttractions];

    // Filter by subcategory
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((a) => selectedSubcategories.includes(a.subcategory));
    }

    // Filter by review score
    if (selectedReviewScore.length > 0) {
      filtered = filtered.filter((a) => {
        if (selectedReviewScore.includes('superb') && a.rating >= 4.5) return true;
        if (selectedReviewScore.includes('very_good') && a.rating >= 4.0) return true;
        if (selectedReviewScore.includes('good') && a.rating >= 3.5) return true;
        return false;
      });
    }

    // Filter by free cancellation
    if (showCancelable) {
      filtered = filtered.filter((a) => a.freeCancellation);
    }

    // Sort
    if (sortBy === 'lowest_price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highest_rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setAttractions(filtered);

    // Update URL with sort parameter
    const params = new URLSearchParams(searchParams);
    if (sortBy !== 'top_picks') {
      params.set('sort_by', sortBy);
    } else {
      params.delete('sort_by');
    }
    if (selectedSubcategories.length > 0) {
      params.set('filter_by_subcategory', selectedSubcategories.join(','));
    } else {
      params.delete('filter_by_subcategory');
    }
  }, [sortBy, selectedSubcategories, selectedReviewScore, showCancelable, allAttractions, searchParams]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]
    );
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((s) => s !== subcategory) : [...prev, subcategory]
    );
  };

  const toggleReviewScore = (score: string) => {
    setSelectedReviewScore((prev) =>
      prev.includes(score) ? prev.filter((s) => s !== score) : [...prev, score]
    );
  };

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedReviewScore([]);
    setShowCancelable(false);
  };

  const hasActiveFilters = selectedSubcategories.length > 0 || selectedReviewScore.length > 0 || showCancelable;

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue py-6">
        <div className="max-w-container-lg mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">{destName} attractions</h1>
          <p className="text-white/80">
            {attractions.length} results {startDate && `for ${startDate}`}
          </p>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-neutral-200 p-4 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-neutral-800">Filter by:</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-booking-blue hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Location</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-neutral-300" />
                  <span className="text-sm text-neutral-600">{destName} centre</span>
                </label>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Category</h3>
                {filterCategories.map((category) => (
                  <div key={category.name} className="mb-2">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="flex items-center justify-between w-full text-left py-1"
                    >
                      <span className="text-sm text-neutral-600">{category.name}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          expandedCategories.includes(category.name) ? 'rotate-180' : ''
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {expandedCategories.includes(category.name) && (
                      <div className="pl-4 mt-1 space-y-1">
                        {category.subcategories.map((sub) => (
                          <label key={sub} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSubcategories.includes(sub)}
                              onChange={() => toggleSubcategory(sub)}
                              className="rounded border-neutral-300"
                            />
                            <span className="text-sm text-neutral-600">{sub}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show results with */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Show results with</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCancelable}
                    onChange={() => setShowCancelable(!showCancelable)}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm text-neutral-600">Free cancellation</span>
                </label>
              </div>

              {/* Review Score Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Review score</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedReviewScore.includes('superb')}
                      onChange={() => toggleReviewScore('superb')}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm text-neutral-600">Superb: 4.5+</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedReviewScore.includes('very_good')}
                      onChange={() => toggleReviewScore('very_good')}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm text-neutral-600">Very good: 4+</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedReviewScore.includes('good')}
                      onChange={() => toggleReviewScore('good')}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm text-neutral-600">Good: 3.5+</span>
                  </label>
                </div>
              </div>

              {/* Time of day Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Time of day</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">Morning (6am - 12pm)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">Afternoon (12pm - 6pm)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">Evening (6pm - 12am)</span>
                  </label>
                </div>
              </div>

              {/* Languages Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Languages</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">English</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">Spanish</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">French</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm text-neutral-600">German</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-600">Sort by:</span>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === 'top_picks'}
                      onChange={() => setSortBy('top_picks')}
                      className="text-booking-blue"
                    />
                    <span className="text-sm">Our top picks</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === 'lowest_price'}
                      onChange={() => setSortBy('lowest_price')}
                      className="text-booking-blue"
                    />
                    <span className="text-sm">Lowest price</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === 'highest_rating'}
                      onChange={() => setSortBy('highest_rating')}
                      className="text-booking-blue"
                    />
                    <span className="text-sm">Top reviewed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Attraction Cards */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
                  <div className="text-neutral-600">Loading attractions...</div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center text-error">
                  {error}
                </div>
              ) : attractions.length === 0 ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
                  <div className="text-neutral-600">No attractions found for this destination.</div>
                </div>
              ) : (
                attractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-64 flex-shrink-0 relative">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                      {attraction.bestSeller && (
                        <span className="absolute top-2 left-2 bg-booking-blue text-white text-xs font-bold px-2 py-1 rounded">
                          Best seller
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-neutral-800 mb-1 hover:text-booking-blue cursor-pointer"
                          onClick={() => navigate(`/attractions/detail/${attraction.id}`)}
                        >
                          {attraction.name}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-2">{attraction.location}</p>
                        <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                          {attraction.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium text-neutral-800">{attraction.rating}</span>
                          </div>
                          <span className="text-neutral-400">|</span>
                          <span className="text-sm text-neutral-500">
                            {attraction.reviews.toLocaleString()} reviews
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mb-2">Duration: {attraction.duration}</p>
                        {attraction.freeCancellation && (
                          <p className="text-sm text-success">Free cancellation</p>
                        )}
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-neutral-100">
                        <div>
                          <p className="text-xs text-neutral-500">From</p>
                          <p className="text-xl font-bold text-neutral-800">
                            {attraction.currency} {attraction.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-neutral-500">per person</p>
                        </div>
                        <button
                          onClick={() => navigate(`/attractions/detail/${attraction.id}?show_availability=true`)}
                          className="bg-booking-blue text-white font-medium px-6 py-2 rounded hover:bg-booking-blue-hover transition-colors"
                        >
                          See availability
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {attractions.length === 0 && (
              <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                <p className="text-neutral-600 mb-4">No attractions found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="text-booking-blue hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
