import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays } from 'date-fns';
import { carsApi } from '@/api/client';

interface Car {
  id: string;
  brand: string;
  model: string;
  category: string;
  image: string;
  seats: number;
  doors: number;
  transmission: string;
  fuel: string;
  bags: { large: number; small: number };
  mileage: string;
  pricePerDay: number;
  totalPrice: number;
  currency: string;
  supplier: string;
  rating: number;
  reviews: number;
  features: string[];
  freeCancellation: boolean;
  pickupLocation: string;
  distanceToPickup?: string;
}

interface Supplier {
  name: string;
  logo: string;
  rating: number;
  reviews: number;
}

const carSuppliers: Supplier[] = [
  { name: 'Enterprise', logo: 'E', rating: 8.4, reviews: 12543 },
  { name: 'Budget', logo: 'B', rating: 7.8, reviews: 8721 },
  { name: 'Europcar', logo: 'Eu', rating: 7.6, reviews: 9432 },
  { name: 'Hertz', logo: 'H', rating: 8.1, reviews: 15234 },
  { name: 'Avis', logo: 'A', rating: 7.9, reviews: 11234 },
  { name: 'Sixt', logo: 'S', rating: 8.2, reviews: 7845 },
  { name: 'Alamo', logo: 'Al', rating: 8.0, reviews: 6543 },
  { name: 'National', logo: 'N', rating: 8.3, reviews: 5432 },
];

const carCategories = [
  'Small', 'Medium', 'Large', 'SUV', 'Luxury', 'People Carrier', 'Electric'
];

const extractFeatureCount = (
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

const resolveTransmission = (features: string[]) => {
  if (features.some((feature) => feature.toLowerCase().includes('automatic'))) {
    return 'Automatic';
  }
  if (features.some((feature) => feature.toLowerCase().includes('manual'))) {
    return 'Manual';
  }
  return 'Automatic';
};

const mapCar = (car: Record<string, unknown>, days: number, pickup: string): Car => {
  const features = Array.isArray(car.features) ? car.features.map(String) : [];
  const seats = extractFeatureCount(features, 'Seats', 4);
  const bags = extractFeatureCount(features, 'Bags', 2);
  const pricePerDay = Number(car.pricePerDay ?? car.price ?? 0);
  const brand = String(car.provider ?? car.brand ?? 'Car');
  const model = String(car.model ?? car.name ?? 'Standard');

  return {
    id: String(car.id ?? ''),
    brand,
    model,
    category: String(car.type ?? 'Small'),
    image:
      String(car.image ?? '') ||
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    seats,
    doors: Number(car.doors ?? 4),
    transmission: resolveTransmission(features),
    fuel: String(car.fuel ?? 'Petrol'),
    bags: { large: Math.max(1, bags - 1), small: bags },
    mileage: String(car.mileage ?? 'Unlimited'),
    pricePerDay,
    totalPrice: pricePerDay * days,
    currency: String(car.currency ?? 'EUR'),
    supplier: String(car.provider ?? brand),
    rating: Number(car.rating ?? 8.2),
    reviews: Number(car.reviews ?? 120),
    features,
    freeCancellation: Boolean(car.freeCancellation ?? true),
    pickupLocation: pickup || 'City centre',
    distanceToPickup: String(car.distanceToPickup ?? '1.5 km from city centre'),
  };
};

export default function CarSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse search parameters
  const pickup = searchParams.get('pickup') || 'London';
  const dropoff = searchParams.get('dropoff') || pickup;
  const pickupDateStr = searchParams.get('pickup_date') || format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const dropoffDateStr = searchParams.get('dropoff_date') || format(addDays(new Date(), 10), 'yyyy-MM-dd');
  const pickupTime = searchParams.get('pickup_time') || '10:00';
  const dropoffTime = searchParams.get('dropoff_time') || '10:00';
  const brandFilter = searchParams.get('brand') || '';

  const pickupDate = parseISO(pickupDateStr);
  const dropoffDate = parseISO(dropoffDateStr);
  const days = Math.max(1, Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(brandFilter ? [brandFilter] : []);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    carsApi
      .getAll()
      .then((response) => {
        if (cancelled) return;
        const mapped = response.cars.map((car) =>
          mapCar(car as unknown as Record<string, unknown>, days, pickup)
        );
        const filteredByBrand = brandFilter
          ? mapped.filter(
              (car) => car.supplier.toLowerCase() === brandFilter.toLowerCase()
            )
          : mapped;
        setAllCars(filteredByBrand);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Error fetching cars:', error);
        setLoadError('Unable to load cars from state.');
        setAllCars([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pickup, days, brandFilter]);

  // Apply filters
  const filteredCars = useMemo(() => {
    let cars = [...allCars];

    if (selectedCategories.length > 0) {
      cars = cars.filter(car => selectedCategories.includes(car.category));
    }

    if (selectedSuppliers.length > 0) {
      cars = cars.filter(car => selectedSuppliers.includes(car.supplier));
    }

    if (selectedTransmission.length > 0) {
      cars = cars.filter(car => selectedTransmission.includes(car.transmission));
    }

    if (selectedFuel.length > 0) {
      cars = cars.filter(car => selectedFuel.includes(car.fuel));
    }

    cars = cars.filter(car => car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        cars.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        // Default sort by combination of rating and price
        cars.sort((a, b) => (b.rating * 10 - b.pricePerDay / 10) - (a.rating * 10 - a.pricePerDay / 10));
    }

    return cars;
  }, [allCars, selectedCategories, selectedSuppliers, selectedTransmission, selectedFuel, priceRange, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleSupplier = (supplier: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplier) ? prev.filter(s => s !== supplier) : [...prev, supplier]
    );
  };

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmission(prev =>
      prev.includes(transmission) ? prev.filter(t => t !== transmission) : [...prev, transmission]
    );
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuel(prev =>
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSuppliers([]);
    setSelectedTransmission([]);
    setSelectedFuel([]);
    setPriceRange([0, 200]);
  };

  const handleBookCar = (car: Car) => {
    // Navigate to car checkout with car details
    const params = new URLSearchParams();
    params.set('car_id', car.id);
    params.set('pickup_location', pickup);
    params.set('dropoff_location', dropoff);
    params.set('pickup_date', pickupDateStr);
    params.set('dropoff_date', dropoffDateStr);
    params.set('pickup_time', pickupTime);
    params.set('dropoff_time', dropoffTime);
    params.set('total', car.totalPrice.toString());
    navigate(`/cars/checkout?${params.toString()}`);
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Search Summary Header */}
      <div className="bg-booking-blue text-white py-4">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="font-medium">{pickup}</span>
              {dropoff !== pickup && (
                <>
                  <span className="text-white/70">to</span>
                  <span className="font-medium">{dropoff}</span>
                </>
              )}
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
              </svg>
              <span>{format(pickupDate, 'EEE, d MMM')} {pickupTime}</span>
              <span className="text-white/70">-</span>
              <span>{format(dropoffDate, 'EEE, d MMM')} {dropoffTime}</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <span className="text-white/90">{days} {days === 1 ? 'day' : 'days'}</span>
            <button
              onClick={() => navigate('/cars')}
              className="ml-auto text-sm underline hover:no-underline"
            >
              Modify search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        {/* Results count and sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-neutral-800">
            {isLoading
              ? 'Searching...'
              : loadError
              ? 'Unable to load cars'
              : `${filteredCars.length} cars available in ${pickup}`}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-neutral-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:border-booking-blue-light"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price (lowest first)</option>
              <option value="price-high">Price (highest first)</option>
              <option value="rating">Rating (highest first)</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-neutral-800">Filter by:</h2>
                {(selectedCategories.length > 0 || selectedSuppliers.length > 0 || selectedTransmission.length > 0 || selectedFuel.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-booking-blue-light hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Car Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-700 mb-3">Car category</h3>
                <div className="space-y-2">
                  {carCategories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-booking-blue rounded"
                      />
                      <span className="text-neutral-700">{category}</span>
                      <span className="text-neutral-400 text-sm ml-auto">
                        ({allCars.filter(c => c.category === category).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supplier Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-700 mb-3">Car hire company</h3>
                <div className="space-y-2">
                  {carSuppliers.map((supplier) => (
                    <label key={supplier.name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier.name)}
                        onChange={() => toggleSupplier(supplier.name)}
                        className="w-4 h-4 text-booking-blue rounded"
                      />
                      <span className="text-neutral-700">{supplier.name}</span>
                      <span className="text-neutral-400 text-sm ml-auto">
                        {supplier.rating}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-700 mb-3">Transmission</h3>
                <div className="space-y-2">
                  {['Automatic', 'Manual'].map((trans) => (
                    <label key={trans} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTransmission.includes(trans)}
                        onChange={() => toggleTransmission(trans)}
                        className="w-4 h-4 text-booking-blue rounded"
                      />
                      <span className="text-neutral-700">{trans}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-700 mb-3">Fuel type</h3>
                <div className="space-y-2">
                  {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
                    <label key={fuel} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFuel.includes(fuel)}
                        onChange={() => toggleFuel(fuel)}
                        className="w-4 h-4 text-booking-blue rounded"
                      />
                      <span className="text-neutral-700">{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium text-neutral-700 mb-3">Price per day</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-neutral-600">EUR {priceRange[0]}</span>
                  <span className="text-neutral-400">-</span>
                  <span className="text-neutral-600">EUR {priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-booking-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">Searching for cars...</h3>
                <p className="text-neutral-600">Fetching availability from your state</p>
              </div>
            ) : loadError ? (
              <div className="bg-white rounded-lg shadow-card p-8 text-center text-error">
                {loadError}
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto text-neutral-300 mb-4">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">No cars found</h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your filters or search criteria to find available cars.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-booking-blue text-white font-bold px-6 py-2 rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Car Image */}
                      <div className="md:w-72 h-48 md:h-auto bg-neutral-100 flex-shrink-0">
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Car Details */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs bg-booking-blue-light/10 text-booking-blue-light px-2 py-0.5 rounded font-medium">
                                {car.category}
                              </span>
                              <span className="text-neutral-500 text-sm">or similar</span>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800">
                              {car.brand} {car.model}
                            </h3>
                            <div className="flex items-center gap-3 mt-2 text-sm text-neutral-600">
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                                {car.seats} seats
                              </span>
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                                </svg>
                                {car.doors} doors
                              </span>
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path d="M17.5 10c.75 0 1.5.75 1.5 1.5V18c0 .75-.75 1.5-1.5 1.5h-11c-.75 0-1.5-.75-1.5-1.5v-6.5c0-.75.75-1.5 1.5-1.5h11zm-5.5-5c1.11 0 2 .89 2 2v1H10V7c0-1.11.89-2 2-2z" />
                                </svg>
                                {car.transmission}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-sm text-neutral-600">
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
                                </svg>
                                {car.fuel}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path d="M17 6h-2V3H9v3H7l-4 4v11h18V10l-4-4zm-6-1h2v2h-2V5zm0 10v3H9v-3H6v-2h3v-3h2v3h3v2h-3zm6 3h-2v-4h-2v-2h4v6z" />
                                </svg>
                                {car.bags.large} large bag{car.bags.large !== 1 ? 's' : ''}
                              </span>
                              <span>{car.mileage} mileage</span>
                            </div>
                          </div>

                          {/* Supplier Rating */}
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end mb-1">
                              <span className="bg-booking-blue text-white text-sm font-bold px-2 py-1 rounded">
                                {car.rating}
                              </span>
                            </div>
                            <div className="text-sm text-neutral-600">{car.supplier}</div>
                            <div className="text-xs text-neutral-400">{car.reviews} reviews</div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {car.freeCancellation && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Free cancellation
                            </span>
                          )}
                          {car.features.slice(0, 3).map((feature) => (
                            <span key={feature} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Pickup location */}
                        <div className="flex items-center gap-1 mt-3 text-sm text-neutral-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {car.pickupLocation}
                          {car.distanceToPickup && (
                            <span className="text-neutral-400">({car.distanceToPickup})</span>
                          )}
                        </div>
                      </div>

                      {/* Price and Book */}
                      <div className="md:w-48 p-4 border-t md:border-t-0 md:border-l border-neutral-100 flex flex-col justify-between">
                        <div>
                          <div className="text-sm text-neutral-600 mb-1">Price for {days} {days === 1 ? 'day' : 'days'}:</div>
                          <div className="text-2xl font-bold text-neutral-800">
                            EUR {car.totalPrice}
                          </div>
                          <div className="text-sm text-neutral-500">
                            EUR {car.pricePerDay}/day
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookCar(car)}
                          className="mt-4 w-full bg-booking-blue-light text-white font-bold py-3 rounded hover:bg-booking-blue transition-colors"
                        >
                          View deal
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
