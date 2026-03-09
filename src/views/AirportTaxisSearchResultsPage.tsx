import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { carsApi } from '@/api/client';

interface Vehicle {
  id: string;
  type: string;
  name: string;
  image: string;
  maxPassengers: number;
  maxBags: number;
  price: number;
  meetAndGreet: boolean;
  freeWaiting: string;
  freeCancellation: boolean;
  flightTracking: boolean;
  rating: number;
  reviews: number;
  supplier: string;
  features: string[];
}

const extractCountFromFeatures = (
  features: unknown,
  keyword: string,
  fallback: number
) => {
  if (!Array.isArray(features)) return fallback;
  for (const feature of features) {
    const match = String(feature).match(new RegExp(`(\\d+)\\s+${keyword}`, 'i'));
    if (match) return Number(match[1]);
  }
  return fallback;
};

const mapVehicle = (car: Record<string, unknown>): Vehicle => {
  const features = Array.isArray(car.features) ? car.features.map(String) : [];
  return {
    id: String(car.id ?? ''),
    type: String(car.type ?? 'Standard'),
    name: String(car.model ?? car.name ?? 'Airport transfer'),
    image:
      String(car.image ?? '') ||
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
    maxPassengers: extractCountFromFeatures(features, 'Seats', 4),
    maxBags: extractCountFromFeatures(features, 'Bags', 2),
    price: Number(car.pricePerDay ?? car.price ?? 0),
    meetAndGreet: Boolean(car.meetAndGreet ?? true),
    freeWaiting: String(car.freeWaiting ?? '60 min'),
    freeCancellation: Boolean(car.freeCancellation ?? true),
    flightTracking: Boolean(car.flightTracking ?? true),
    rating: Number(car.rating ?? 4.6),
    reviews: Number(car.reviews ?? 1200),
    supplier: String(car.provider ?? 'Partner Transfer'),
    features,
  };
};

const vehicleTypes = ['All', 'Standard', 'Executive', 'People Carrier', 'Large People Carrier', 'Luxury', 'Electric', 'Minibus'];

export default function AirportTaxisSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pickup = searchParams.get('pickup') || 'London Heathrow Airport';
  const dropoff = searchParams.get('dropoff') || 'Central London';
  const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const time = searchParams.get('time') || '10:00';
  const passengers = parseInt(searchParams.get('passengers') || '2');
  const returnDate = searchParams.get('return_date');
  const returnTime = searchParams.get('return_time');

  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'passengers'>('price');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    carsApi
      .getAll()
      .then((response) => {
        if (cancelled) return;
        const mapped = response.cars.map((car) =>
          mapVehicle(car as unknown as Record<string, unknown>)
        );
        setAllVehicles(mapped);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Error fetching airport taxi vehicles:', err);
        setError('Unable to load airport taxi options from state.');
        setAllVehicles([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff]);

  useEffect(() => {
    let vehicles = [...allVehicles];

    if (selectedType !== 'All') {
      vehicles = vehicles.filter(v => v.type === selectedType);
    }

    vehicles = vehicles.filter(v => v.maxPassengers >= passengers);

    if (sortBy === 'price') {
      vehicles.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      vehicles.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'passengers') {
      vehicles.sort((a, b) => b.maxPassengers - a.maxPassengers);
    }

    setFilteredVehicles(vehicles);
  }, [allVehicles, selectedType, sortBy, passengers]);

  const handleBookNow = (vehicle: Vehicle) => {
    const params = new URLSearchParams();
    params.set('vehicle_id', vehicle.id);
    params.set('vehicle_name', vehicle.name);
    params.set('vehicle_type', vehicle.type);
    params.set('price', vehicle.price.toString());
    params.set('pickup', pickup);
    params.set('dropoff', dropoff);
    params.set('date', date);
    params.set('time', time);
    params.set('passengers', passengers.toString());
    if (returnDate) {
      params.set('return_date', returnDate);
      params.set('return_time', returnTime || '10:00');
    }
    navigate(`/airport-taxis/checkout?${params.toString()}`);
  };

  const formattedDate = (() => {
    try {
      return format(parseISO(date), 'EEE, d MMM yyyy');
    } catch {
      return date;
    }
  })();

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Search Summary Header */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-2">
                {pickup} to {dropoff}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                  {time}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  {passengers} passenger{passengers > 1 ? 's' : ''}
                </span>
                {returnDate && (
                  <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
                    </svg>
                    Return trip included
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams();
                params.set('pickup', pickup);
                params.set('dropoff', dropoff);
                params.set('date', date);
                params.set('time', time);
                params.set('passengers', passengers.toString());
                if (returnDate) {
                  params.set('return_date', returnDate);
                  params.set('return_time', returnTime || '10:00');
                }
                navigate(`/airport-taxis?${params.toString()}`);
              }}
              className="bg-white text-booking-blue px-4 py-2 rounded font-semibold hover:bg-neutral-100 transition-colors"
            >
              Modify search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Vehicle Type Filter */}
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-booking-blue text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-booking-blue'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-600 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'passengers')}
              className="px-3 py-2 border border-neutral-200 rounded text-sm focus:outline-none focus:border-booking-blue"
            >
              <option value="price">Lowest price</option>
              <option value="rating">Highest rating</option>
              <option value="passengers">Most passengers</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-neutral-600 mb-4">
          {isLoading
            ? 'Searching...'
            : error
            ? 'Unable to load vehicles'
            : `${filteredVehicles.length} vehicles available`}
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-booking-blue"></div>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-white rounded-lg p-6 text-center text-error shadow-card">
            {error}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredVehicles.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center shadow-card">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-neutral-300 mx-auto mb-4">
              <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">No vehicles found</h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your filters or search for a different route.
            </p>
            <button
              onClick={() => setSelectedType('All')}
              className="text-booking-blue hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Vehicle Cards */}
        {!isLoading && !error && filteredVehicles.length > 0 && (
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Vehicle Image */}
                  <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 p-4 flex flex-col md:flex-row">
                    <div className="flex-1">
                      {/* Type Badge */}
                      <span className="inline-block bg-booking-blue-light/10 text-booking-blue-light text-xs font-semibold px-2 py-1 rounded mb-2">
                        {vehicle.type}
                      </span>

                      <h3 className="text-lg font-bold text-neutral-800 mb-1">
                        {vehicle.name}
                      </h3>

                      <p className="text-sm text-neutral-500 mb-3">
                        Supplied by {vehicle.supplier}
                      </p>

                      {/* Capacity Info */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex items-center gap-1 text-sm text-neutral-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                          </svg>
                          Up to {vehicle.maxPassengers} passengers
                        </span>
                        <span className="flex items-center gap-1 text-sm text-neutral-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                          {vehicle.maxBags} bags
                        </span>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {vehicle.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {vehicle.freeCancellation && (
                          <span className="text-success flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            Free cancellation
                          </span>
                        )}
                        <span className="text-neutral-600">
                          {vehicle.freeWaiting} free waiting
                        </span>
                      </div>
                    </div>

                    {/* Price and Book Section */}
                    <div className="md:w-48 mt-4 md:mt-0 md:ml-4 md:border-l md:pl-4 flex flex-col items-end justify-between">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-booking-blue text-white text-sm font-bold px-2 py-1 rounded">
                          {vehicle.rating.toFixed(1)}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-neutral-800">
                            {vehicle.rating >= 4.5 ? 'Excellent' : vehicle.rating >= 4 ? 'Very good' : 'Good'}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {vehicle.reviews.toLocaleString()} reviews
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right mb-4">
                        <div className="text-2xl font-bold text-neutral-800">
                          EUR {vehicle.price}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {returnDate ? 'Total for return trip' : 'One way'}
                        </div>
                      </div>

                      {/* Book Button */}
                      <button
                        onClick={() => handleBookNow(vehicle)}
                        className="w-full bg-booking-blue text-white font-bold py-3 px-4 rounded hover:bg-booking-blue-hover transition-colors"
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-card">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Why book with us?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Flight tracking</h3>
                <p className="text-sm text-neutral-600">Your driver tracks your flight</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">One clear price</h3>
                <p className="text-sm text-neutral-600">No hidden fees or surprises</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Tried and trusted</h3>
                <p className="text-sm text-neutral-600">Professional, vetted drivers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">24/7 support</h3>
                <p className="text-sm text-neutral-600">Help whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
