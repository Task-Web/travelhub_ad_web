import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { packagesApi } from '../api/client';

interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
}

interface Hotel {
  name: string;
  stars: number;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
}

interface Package {
  id: string;
  origin?: string;
  destination?: string;
  flight: {
    outbound: Flight;
    return: Flight;
  };
  hotel: Hotel;
  flightPrice: number;
  hotelPrice: number;
  packagePrice: number;
  savings: number;
  roomType: string;
  boardBasis: string;
  freeCancellation: boolean;
  currency?: string;
}

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price (lowest first)' },
  { value: 'price-high', label: 'Price (highest first)' },
  { value: 'savings', label: 'Biggest savings' },
  { value: 'rating', label: 'Guest rating' },
];

const starFilters = [5, 4, 3, 2];

export default function FlightHotelSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const origin = searchParams.get('origin') || 'London';
  const destination = searchParams.get('destination') || 'Barcelona';
  const checkin = searchParams.get('checkin') || format(new Date(), 'yyyy-MM-dd');
  const checkout = searchParams.get('checkout') || format(new Date(), 'yyyy-MM-dd');
  const adults = parseInt(searchParams.get('adults') || '2');
  const rooms = parseInt(searchParams.get('rooms') || '1');

  const [sortBy, setSortBy] = useState('recommended');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [allPackages, setAllPackages] = useState<Package[]>([]);

  const nights = (() => {
    try {
      return differenceInDays(parseISO(checkout), parseISO(checkin));
    } catch {
      return 7;
    }
  })();

  const formattedCheckin = (() => {
    try {
      return format(parseISO(checkin), 'EEE, d MMM');
    } catch {
      return checkin;
    }
  })();

  const formattedCheckout = (() => {
    try {
      return format(parseISO(checkout), 'EEE, d MMM');
    } catch {
      return checkout;
    }
  })();

  // Fetch packages from backend API (state-driven)
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        // Fetch packages from backend (reads from user state)
        const response = await packagesApi.getAll({
          origin: origin,
          destination: destination,
        });
        setAllPackages(response.packages);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setAllPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [origin, destination]);

  // Filter and sort packages locally
  useEffect(() => {
    let packages = [...allPackages];

    // Filter by stars
    if (selectedStars.length > 0) {
      packages = packages.filter(p => selectedStars.includes(p.hotel.stars));
    }

    // Filter by free cancellation
    if (freeCancellationOnly) {
      packages = packages.filter(p => p.freeCancellation);
    }

    // Sort
    if (sortBy === 'price-low') {
      packages.sort((a, b) => a.packagePrice - b.packagePrice);
    } else if (sortBy === 'price-high') {
      packages.sort((a, b) => b.packagePrice - a.packagePrice);
    } else if (sortBy === 'savings') {
      packages.sort((a, b) => b.savings - a.savings);
    } else if (sortBy === 'rating') {
      packages.sort((a, b) => b.hotel.rating - a.hotel.rating);
    }

    setFilteredPackages(packages);
  }, [allPackages, sortBy, selectedStars, freeCancellationOnly]);

  const toggleStarFilter = (star: number) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const handleBookPackage = (pkg: Package) => {
    const params = new URLSearchParams();
    params.set('package_id', pkg.id);
    params.set('origin', origin);
    params.set('destination', destination);
    params.set('checkin', checkin);
    params.set('checkout', checkout);
    params.set('adults', adults.toString());
    params.set('rooms', rooms.toString());
    params.set('price', pkg.packagePrice.toString());
    navigate(`/flight-hotel/checkout?${params.toString()}`);
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Search Summary Header */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-2">
                {origin} to {destination}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  {formattedCheckin} - {formattedCheckout} ({nights} nights)
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  {adults} adult{adults > 1 ? 's' : ''}, {rooms} room{rooms > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                  Flight + Hotel
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/flight-hotel')}
              className="bg-white text-booking-blue px-4 py-2 rounded font-semibold hover:bg-neutral-100 transition-colors"
            >
              Modify search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-4 sticky top-4">
              <h2 className="font-bold text-neutral-800 mb-4">Filter by:</h2>

              {/* Free Cancellation */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeCancellationOnly}
                    onChange={(e) => setFreeCancellationOnly(e.target.checked)}
                    className="w-4 h-4 text-booking-blue rounded"
                  />
                  <span className="text-sm text-neutral-700">Free cancellation</span>
                </label>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-800 mb-3">Hotel star rating</h3>
                <div className="space-y-2">
                  {starFilters.map((star) => (
                    <label key={star} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStars.includes(star)}
                        onChange={() => toggleStarFilter(star)}
                        className="w-4 h-4 text-booking-blue rounded"
                      />
                      <span className="flex items-center text-sm text-neutral-700">
                        {[...Array(star)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedStars.length > 0 || freeCancellationOnly) && (
                <button
                  onClick={() => {
                    setSelectedStars([]);
                    setFreeCancellationOnly(false);
                  }}
                  className="text-booking-blue hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            {/* Sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-neutral-600">
                {isLoading ? 'Searching...' : `${filteredPackages.length} packages found`}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded text-sm focus:outline-none focus:border-booking-blue"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-booking-blue"></div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredPackages.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center shadow-card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-neutral-300 mx-auto mb-4">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">No packages found</h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your filters or search for different dates.
                </p>
                <button
                  onClick={() => {
                    setSelectedStars([]);
                    setFreeCancellationOnly(false);
                  }}
                  className="text-booking-blue hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Package Cards */}
            {!isLoading && filteredPackages.length > 0 && (
              <div className="space-y-4">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
                  >
                    {/* Savings Banner */}
                    {pkg.savings > 0 && (
                      <div className="bg-success text-white text-sm font-semibold px-4 py-2">
                        Save EUR {pkg.savings} by booking together!
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row">
                      {/* Hotel Image */}
                      <div className="lg:w-64 h-48 lg:h-auto flex-shrink-0">
                        <img
                          src={pkg.hotel.image}
                          alt={pkg.hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Package Info */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Hotel Section */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="flex">
                                {[...Array(pkg.hotel.stars)].map((_, i) => (
                                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                  </svg>
                                ))}
                              </span>
                              <span className="text-xs text-neutral-500">Hotel</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-800 mb-1">
                              {pkg.hotel.name}
                            </h3>
                            <p className="text-sm text-neutral-500 mb-2">
                              {pkg.hotel.location}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-booking-blue text-white text-sm font-bold px-2 py-0.5 rounded">
                                {pkg.hotel.rating}
                              </span>
                              <span className="text-sm text-neutral-600">
                                {pkg.hotel.rating >= 9 ? 'Superb' : pkg.hotel.rating >= 8 ? 'Very good' : 'Good'} ({pkg.hotel.reviews.toLocaleString()} reviews)
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">
                              {pkg.roomType} - {pkg.boardBasis}
                            </p>
                          </div>

                          {/* Flight Section */}
                          <div className="flex-1 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-4 lg:pt-0 lg:pl-4">
                            <div className="flex items-center gap-1 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-booking-blue">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                              </svg>
                              <span className="text-xs text-neutral-500">Flights included</span>
                            </div>

                            {/* Outbound */}
                            <div className="mb-3">
                              <div className="text-xs text-neutral-500 mb-1">Outbound</div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">{pkg.flight.outbound.departureTime}</span>
                                <span className="text-neutral-400">{pkg.flight.outbound.departure}</span>
                                <span className="text-neutral-400">→</span>
                                <span className="font-semibold">{pkg.flight.outbound.arrivalTime}</span>
                                <span className="text-neutral-400">{pkg.flight.outbound.arrival}</span>
                              </div>
                              <div className="text-xs text-neutral-500">
                                {pkg.flight.outbound.airline} {pkg.flight.outbound.flightNumber} - {pkg.flight.outbound.duration} - {pkg.flight.outbound.stops === 0 ? 'Direct' : `${pkg.flight.outbound.stops} stop`}
                              </div>
                            </div>

                            {/* Return */}
                            <div>
                              <div className="text-xs text-neutral-500 mb-1">Return</div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">{pkg.flight.return.departureTime}</span>
                                <span className="text-neutral-400">{pkg.flight.return.departure}</span>
                                <span className="text-neutral-400">→</span>
                                <span className="font-semibold">{pkg.flight.return.arrivalTime}</span>
                                <span className="text-neutral-400">{pkg.flight.return.arrival}</span>
                              </div>
                              <div className="text-xs text-neutral-500">
                                {pkg.flight.return.airline} {pkg.flight.return.flightNumber} - {pkg.flight.return.duration} - {pkg.flight.return.stops === 0 ? 'Direct' : `${pkg.flight.return.stops} stop`}
                              </div>
                            </div>
                          </div>

                          {/* Price Section */}
                          <div className="lg:w-48 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-4 lg:pt-0 lg:pl-4 flex flex-col items-end justify-between">
                            {/* Features */}
                            <div className="text-right mb-4">
                              {pkg.freeCancellation && (
                                <span className="text-success text-xs flex items-center justify-end gap-1 mb-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                  </svg>
                                  Free cancellation
                                </span>
                              )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="text-right">
                              <div className="text-xs text-neutral-500 line-through">
                                EUR {pkg.flightPrice + pkg.hotelPrice}
                              </div>
                              <div className="text-2xl font-bold text-neutral-800">
                                EUR {pkg.packagePrice}
                              </div>
                              <div className="text-xs text-neutral-500">
                                Total for {nights} nights + flights
                              </div>
                            </div>

                            {/* Book Button */}
                            <button
                              onClick={() => handleBookPackage(pkg)}
                              className="w-full mt-4 bg-booking-blue text-white font-bold py-3 px-4 rounded hover:bg-booking-blue-hover transition-colors"
                            >
                              Book package
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-card">
          <h2 className="text-xl font-bold text-neutral-800 mb-4 text-center">Why book Flight + Hotel packages?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Save money</h3>
                <p className="text-sm text-neutral-600">Book together and save compared to booking separately</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Save time</h3>
                <p className="text-sm text-neutral-600">One booking, one confirmation, one easy trip</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Stay protected</h3>
                <p className="text-sm text-neutral-600">Full package protection and 24/7 support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
