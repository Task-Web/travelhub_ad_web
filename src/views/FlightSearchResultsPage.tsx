import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays, isBefore, startOfDay, addMonths } from 'date-fns';
import { airportsApi, flightsApi, searchApi } from '@/api/client';
import { useAppStore } from '@/store';

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  departureCode: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCode: string;
  arrivalTime: string;
  duration: number; // in minutes
  stops: number;
  stopLocations?: string[];
  price: number;
  currency: string;
  cabinClass: string;
  aircraft: string;
  baggage: {
    cabin: string;
    checked: string;
  };
}

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  distance?: string;
}

type TripType = 'round-trip' | 'one-way' | 'multi-city';
type SortOption = 'best' | 'cheapest' | 'fastest';

const parseDurationToMinutes = (duration?: string) => {
  if (!duration) return 0;
  const hoursMatch = duration.match(/(\\d+)h/);
  const minutesMatch = duration.match(/(\\d+)m/);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  return hours * 60 + minutes;
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const resolveAirportName = (code: string, airportsByCode: Map<string, Airport>) =>
  airportsByCode.get(code)?.name || code;

const mapFlight = (
  source: Record<string, unknown>,
  selectedCabin: string,
  airportsByCode: Map<string, Airport>,
  currency: string
): Flight => {
  const cabinClasses = (source.cabinClasses || {}) as Record<
    string,
    { price: number }
  >;
  const cabinClass =
    selectedCabin in cabinClasses ? selectedCabin : Object.keys(cabinClasses)[0] || 'economy';
  const price = cabinClasses[cabinClass]?.price || 0;
  const originCode = String(source.origin ?? '');
  const destinationCode = String(source.destination ?? '');

  return {
    id: String(source.id ?? ''),
    airline: String(source.airline ?? 'Airline'),
    airlineCode: String(source.airlineCode ?? ''),
    flightNumber: String(source.flightNumber ?? source.id ?? ''),
    departureAirport: resolveAirportName(originCode, airportsByCode),
    departureCode: originCode,
    departureTime: String(source.departureTime ?? ''),
    arrivalAirport: resolveAirportName(destinationCode, airportsByCode),
    arrivalCode: destinationCode,
    arrivalTime: String(source.arrivalTime ?? ''),
    duration: parseDurationToMinutes(String(source.duration ?? '')),
    stops: Number(source.stops || 0),
    stopLocations: source.stopLocations as string[] | undefined,
    price,
    currency,
    cabinClass,
    aircraft: String(source.aircraft ?? ''),
    baggage: {
      cabin: '1 x 7kg (23x36x56cm)',
      checked: '1 x 23kg',
    },
  };
};

export default function FlightSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get search params with defaults
  const initialOrigin = searchParams.get('origin') || 'London';
  const initialOriginCode = searchParams.get('originCode') || 'LON';
  const initialDestination = searchParams.get('destination') || 'Paris';
  const initialDestCode = searchParams.get('destCode') || 'PAR';
  const initialDepartDate = searchParams.get('depart') || format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const initialReturnDate = searchParams.get('return') || format(addDays(new Date(), 14), 'yyyy-MM-dd');
  const initialTripType = (searchParams.get('tripType') as TripType) || 'round-trip';
  const initialAdults = parseInt(searchParams.get('adults') || '1');
  const initialChildren = parseInt(searchParams.get('children') || '0');
  const initialInfants = parseInt(searchParams.get('infants') || '0');
  const initialCabinClass = searchParams.get('cabin') || 'economy';
  const initialDirectOnly = searchParams.get('direct') === 'true';

  // Search form state
  const [origin, setOrigin] = useState(initialOrigin);
  const [originCode, setOriginCode] = useState(initialOriginCode);
  const [destination, setDestination] = useState(initialDestination);
  const [destCode, setDestCode] = useState(initialDestCode);
  const [departDate, setDepartDate] = useState(initialDepartDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [tripType, setTripType] = useState<TripType>(initialTripType);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);
  const [cabinClass, setCabinClass] = useState(initialCabinClass);
  const [directOnly, setDirectOnly] = useState(initialDirectOnly);

  // Multiple airport selection state
  const [selectedOriginAirports, setSelectedOriginAirports] = useState<Airport[]>([]);
  const [selectedDestAirports, setSelectedDestAirports] = useState<Airport[]>([]);

  // Modal states
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showDestModal, setShowDestModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  const [airportSearch, setAirportSearch] = useState('');
  const [dateSelectionMode, setDateSelectionMode] = useState<'depart' | 'return'>('depart');

  // Filter/sort state
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [filterStops, setFilterStops] = useState<number | null>(null);
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  // Flight detail modal state
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showFlightDetailModal, setShowFlightDetailModal] = useState(false);
  const [showFlexibleTicketDialog, setShowFlexibleTicketDialog] = useState(false);
  const [showFlexibleTicketDetails, setShowFlexibleTicketDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [availableAirports, setAvailableAirports] = useState<Airport[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const currency = useAppStore((state) => state.preferences.currency || 'EUR');

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('flexibleTicketPromoDismissed');
      if (!dismissed) {
        setShowFlexibleTicketDialog(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [origin, destination, departDate]);

  useEffect(() => {
    let cancelled = false;
    airportsApi
      .getAll()
      .then((response) => {
        if (cancelled) return;
        const mapped = response.airports.map((airport) => ({
          ...airport,
          distance: '',
        }));
        setAvailableAirports(mapped);
      })
      .catch((error) => {
        console.error('Error fetching airports:', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const airportsByCode = useMemo(
    () => new Map(availableAirports.map((airport) => [airport.code, airport])),
    [availableAirports]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    flightsApi
      .getAll({
        origin: originCode || origin,
        destination: destCode || destination,
        cabinClass,
        directOnly,
      })
      .then((response) => {
        if (cancelled) return;
        const mapped = response.flights.map((flight) =>
          mapFlight(flight as unknown as Record<string, unknown>, cabinClass, airportsByCode, currency)
        );
        setAllFlights(mapped);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Error fetching flights:', error);
        setLoadError('Unable to load flights from state.');
        setAllFlights([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [originCode, destCode, origin, destination, cabinClass, directOnly, airportsByCode, currency]);

  // Handle "No thanks" - persist dismissal preference
  const handleFlexibleTicketNoThanks = () => {
    localStorage.setItem('flexibleTicketPromoDismissed', 'true');
    setShowFlexibleTicketDialog(false);
  };

  // Handle "Learn more" - show detailed information
  const handleFlexibleTicketLearnMore = () => {
    setShowFlexibleTicketDetails(true);
  };

  // Calculate alternative dates prices
  const alternativeDates = useMemo(() => {
    const dates = [];
    const baseDate = parseISO(departDate);
    for (let i = -3; i <= 3; i++) {
      const altDate = addDays(baseDate, i);
      if (!isBefore(altDate, startOfDay(new Date()))) {
        const basePrice = allFlights.length > 0 ? Math.min(...allFlights.map(f => f.price)) : 500;
        const priceVariation = 0.8 + Math.random() * 0.4; // 80% to 120%
        dates.push({
          date: altDate,
          dateStr: format(altDate, 'yyyy-MM-dd'),
          dayName: format(altDate, 'EEE'),
          dayNum: format(altDate, 'd'),
          month: format(altDate, 'MMM'),
          price: Math.round(basePrice * priceVariation),
          isCurrent: i === 0,
        });
      }
    }
    return dates;
  }, [departDate, allFlights]);

  // Get unique airlines
  const availableAirlines = useMemo(
    () => [...new Set(allFlights.map(f => f.airline))].sort(),
    [allFlights]
  );

  // Get filter counts
  const filterCounts = useMemo(() => {
    const directFlights = allFlights.filter(f => f.stops === 0);
    const oneStopFlights = allFlights.filter(f => f.stops === 1);
    const twoStopFlights = allFlights.filter(f => f.stops >= 2);

    return {
      direct: {
        count: directFlights.length,
        minPrice: directFlights.length > 0 ? Math.min(...directFlights.map(f => f.price)) : 0,
      },
      oneStop: {
        count: oneStopFlights.length,
        minPrice: oneStopFlights.length > 0 ? Math.min(...oneStopFlights.map(f => f.price)) : 0,
      },
      twoStop: {
        count: twoStopFlights.length,
        minPrice: twoStopFlights.length > 0 ? Math.min(...twoStopFlights.map(f => f.price)) : 0,
      },
      airlines: availableAirlines.map(airline => ({
        name: airline,
        count: allFlights.filter(f => f.airline === airline).length,
      })),
    };
  }, [allFlights, availableAirlines]);

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    let flights = [...allFlights];

    // Filter by stops
    if (filterStops !== null) {
      if (filterStops === 2) {
        flights = flights.filter(f => f.stops >= 2);
      } else {
        flights = flights.filter(f => f.stops === filterStops);
      }
    }

    // Filter by airlines
    if (filterAirlines.length > 0) {
      flights = flights.filter(f => filterAirlines.includes(f.airline));
    }

    // Filter by price
    flights = flights.filter(f => f.price >= priceRange[0] && f.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'cheapest':
        flights.sort((a, b) => a.price - b.price);
        break;
      case 'fastest':
        flights.sort((a, b) => a.duration - b.duration);
        break;
      case 'best':
      default:
        // Best combines price, duration, and stops for a balanced result
        flights.sort((a, b) => {
          const aScore = a.price * 0.5 + a.duration * 0.3 + a.stops * 100;
          const bScore = b.price * 0.5 + b.duration * 0.3 + b.stops * 100;
          return aScore - bScore;
        });
        break;
    }

    return flights;
  }, [allFlights, filterStops, filterAirlines, priceRange, sortBy]);

  const totalTravellers = adults + children + infants;

  // Filter airports based on search
  const filteredAirports = useMemo(() => {
    if (!airportSearch) return availableAirports.slice(0, 10);
    const search = airportSearch.toLowerCase();
    return availableAirports.filter(
      a => a.code.toLowerCase().includes(search) ||
           a.name.toLowerCase().includes(search) ||
           a.city.toLowerCase().includes(search) ||
           a.country.toLowerCase().includes(search)
    );
  }, [airportSearch, availableAirports]);

  // Handle search
  const handleSearch = async (overrideDepartDate?: string) => {
    const effectiveDepartDate = overrideDepartDate || departDate;
    const params = new URLSearchParams();
    params.set('origin', origin);
    params.set('originCode', originCode);
    params.set('destination', destination);
    params.set('destCode', destCode);
    params.set('depart', effectiveDepartDate);
    if (tripType === 'round-trip' && returnDate) {
      params.set('return', returnDate);
    }
    params.set('tripType', tripType);
    params.set('adults', String(adults));
    params.set('children', String(children));
    params.set('infants', String(infants));
    params.set('cabin', cabinClass);
    params.set('direct', String(directOnly));

    // Persist search to backend state
    try {
      await searchApi.saveFlightSearch({
        origin,
        originCode,
        destination,
        destCode,
        departDate: effectiveDepartDate,
        returnDate: tripType === 'round-trip' ? returnDate : undefined,
        travelers: adults + children + infants,
        cabinClass,
        tripType,
      });
    } catch (error) {
      console.error('Error saving search state:', error);
    }

    navigate(`/flights/search?${params.toString()}`);
  };

  // Handle swap airports
  const handleSwapAirports = () => {
    const tempOrigin = origin;
    const tempOriginCode = originCode;
    setOrigin(destination);
    setOriginCode(destCode);
    setDestination(tempOrigin);
    setDestCode(tempOriginCode);
  };

  // Handle airport selection - toggle checkbox for multi-select
  const toggleOriginAirport = (airport: Airport) => {
    setSelectedOriginAirports(prev => {
      const isSelected = prev.some(a => a.code === airport.code);
      if (isSelected) {
        return prev.filter(a => a.code !== airport.code);
      } else {
        return [...prev, airport];
      }
    });
  };

  const toggleDestAirport = (airport: Airport) => {
    setSelectedDestAirports(prev => {
      const isSelected = prev.some(a => a.code === airport.code);
      if (isSelected) {
        return prev.filter(a => a.code !== airport.code);
      } else {
        return [...prev, airport];
      }
    });
  };

  // Confirm multiple airport selection
  const confirmOriginAirports = () => {
    if (selectedOriginAirports.length > 0) {
      if (selectedOriginAirports.length === 1) {
        setOrigin(selectedOriginAirports[0].city);
        setOriginCode(selectedOriginAirports[0].code);
      } else {
        // Multiple airports selected - show city name with count
        const cities = [...new Set(selectedOriginAirports.map(a => a.city))];
        setOrigin(cities.length === 1 ? cities[0] : `${cities[0]} +${cities.length - 1}`);
        setOriginCode(selectedOriginAirports.map(a => a.code).join(','));
      }
    }
    setShowOriginModal(false);
    setAirportSearch('');
    setSelectedOriginAirports([]);
  };

  const confirmDestAirports = () => {
    if (selectedDestAirports.length > 0) {
      if (selectedDestAirports.length === 1) {
        setDestination(selectedDestAirports[0].city);
        setDestCode(selectedDestAirports[0].code);
      } else {
        // Multiple airports selected - show city name with count
        const cities = [...new Set(selectedDestAirports.map(a => a.city))];
        setDestination(cities.length === 1 ? cities[0] : `${cities[0]} +${cities.length - 1}`);
        setDestCode(selectedDestAirports.map(a => a.code).join(','));
      }
    }
    setShowDestModal(false);
    setAirportSearch('');
    setSelectedDestAirports([]);
  };

  // Generate calendar days
  const generateCalendarDays = (monthOffset: number) => {
    const today = startOfDay(new Date());
    const monthStart = addMonths(today, monthOffset);
    const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: (Date | null)[] = [];
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), i));
    }
    return { month: monthStart, days };
  };

  const calendar1 = generateCalendarDays(0);
  const calendar2 = generateCalendarDays(1);

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    return isBefore(date, startOfDay(new Date()));
  };

  const isDateSelected = (date: Date | null) => {
    if (!date) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return dateStr === departDate || (tripType === 'round-trip' && dateStr === returnDate);
  };

  const isDateInRange = (date: Date | null) => {
    if (!date || tripType !== 'round-trip' || !returnDate) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return dateStr > departDate && dateStr < returnDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    const dateStr = format(date, 'yyyy-MM-dd');

    if (tripType === 'one-way') {
      setDepartDate(dateStr);
      setShowDateModal(false);
    } else {
      if (dateSelectionMode === 'depart') {
        setDepartDate(dateStr);
        setDateSelectionMode('return');
      } else {
        if (dateStr <= departDate) {
          setDepartDate(dateStr);
          setDateSelectionMode('return');
        } else {
          setReturnDate(dateStr);
          setShowDateModal(false);
          setDateSelectionMode('depart');
        }
      }
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Search Form Header */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          {/* Trip Type Selection */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'round-trip'}
                onChange={() => setTripType('round-trip')}
                className="w-4 h-4"
              />
              <span>Round trip</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'one-way'}
                onChange={() => setTripType('one-way')}
                className="w-4 h-4"
              />
              <span>One way</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'multi-city'}
                onChange={() => setTripType('multi-city')}
                className="w-4 h-4"
              />
              <span>Multi-city</span>
            </label>
          </div>

          {/* Search Fields */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Origin Airport */}
            <button
              onClick={() => { setShowOriginModal(true); setAirportSearch(''); }}
              className="flex-1 min-w-[180px] bg-white rounded px-4 py-3 text-left"
            >
              <div className="text-xs text-neutral-500">Leaving from</div>
              <div className="font-medium text-neutral-800">{origin || 'City or airport'}</div>
              <div className="text-xs text-neutral-500">
                {originCode.includes(',') ? (
                  <span className="flex items-center gap-1">
                    {originCode.split(',').slice(0, 3).join(', ')}
                    {originCode.split(',').length > 3 && ` +${originCode.split(',').length - 3}`}
                  </span>
                ) : originCode}
              </div>
            </button>

            {/* Swap Button */}
            <button
              onClick={handleSwapAirports}
              className="p-2 bg-white rounded-full hover:bg-neutral-100 transition-colors"
              title="Swap origin and destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-booking-blue">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>

            {/* Destination Airport */}
            <button
              onClick={() => { setShowDestModal(true); setAirportSearch(''); }}
              className="flex-1 min-w-[180px] bg-white rounded px-4 py-3 text-left"
            >
              <div className="text-xs text-neutral-500">Going to</div>
              <div className="font-medium text-neutral-800">{destination || 'City or airport'}</div>
              <div className="text-xs text-neutral-500">
                {destCode.includes(',') ? (
                  <span className="flex items-center gap-1">
                    {destCode.split(',').slice(0, 3).join(', ')}
                    {destCode.split(',').length > 3 && ` +${destCode.split(',').length - 3}`}
                  </span>
                ) : destCode}
              </div>
            </button>

            {/* Date Picker */}
            <button
              onClick={() => { setShowDateModal(true); setDateSelectionMode('depart'); }}
              className="flex-1 min-w-[200px] bg-white rounded px-4 py-3 text-left"
            >
              <div className="text-xs text-neutral-500">Travel dates</div>
              <div className="font-medium text-neutral-800">
                {format(parseISO(departDate), 'EEE, d MMM')}
                {tripType === 'round-trip' && returnDate && ` - ${format(parseISO(returnDate), 'EEE, d MMM')}`}
              </div>
            </button>

            {/* Travellers */}
            <button
              onClick={() => setShowTravelerModal(true)}
              className="flex-1 min-w-[150px] bg-white rounded px-4 py-3 text-left"
            >
              <div className="text-xs text-neutral-500">Travellers</div>
              <div className="font-medium text-neutral-800">
                {totalTravellers} traveller{totalTravellers !== 1 ? 's' : ''}
              </div>
            </button>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              className="bg-booking-blue-light hover:bg-blue-600 text-white font-bold px-8 py-4 rounded transition-colors"
            >
              Search
            </button>
          </div>

          {/* Cabin Class and Direct */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">Cabin class</span>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="bg-white border-0 rounded px-3 py-1 text-sm"
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium economy</option>
                <option value="business">Business</option>
                <option value="first">First class</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={directOnly}
                onChange={(e) => setDirectOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Direct flights only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-lg shadow-card p-4 sticky top-4">
              <h2 className="font-bold text-neutral-800 mb-4">Filters</h2>

              {/* Stops Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-700 mb-2">Stops</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stops"
                        checked={filterStops === null}
                        onChange={() => setFilterStops(null)}
                        className="w-4 h-4"
                      />
                      <span className="text-neutral-600">Any stops</span>
                    </div>
                    <span className="text-xs text-neutral-400">{allFlights.length}</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stops"
                        checked={filterStops === 0}
                        onChange={() => setFilterStops(0)}
                        className="w-4 h-4"
                      />
                      <span className="text-neutral-600">Direct only</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-400">{filterCounts.direct.count}</span>
                      {filterCounts.direct.minPrice > 0 && (
                        <div className="text-xs text-success">from EUR {filterCounts.direct.minPrice}</div>
                      )}
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stops"
                        checked={filterStops === 1}
                        onChange={() => setFilterStops(1)}
                        className="w-4 h-4"
                      />
                      <span className="text-neutral-600">Max 1 stop</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-400">{filterCounts.oneStop.count}</span>
                      {filterCounts.oneStop.minPrice > 0 && (
                        <div className="text-xs text-success">from EUR {filterCounts.oneStop.minPrice}</div>
                      )}
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stops"
                        checked={filterStops === 2}
                        onChange={() => setFilterStops(2)}
                        className="w-4 h-4"
                      />
                      <span className="text-neutral-600">2+ stops</span>
                    </div>
                    <span className="text-xs text-neutral-400">{filterCounts.twoStop.count}</span>
                  </label>
                </div>
              </div>

              {/* Airlines Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-700 mb-2">Airlines</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filterCounts.airlines.map(({ name, count }) => (
                    <label key={name} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filterAirlines.includes(name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilterAirlines([...filterAirlines, name]);
                            } else {
                              setFilterAirlines(filterAirlines.filter(a => a !== name));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-neutral-600 text-sm">{name}</span>
                      </div>
                      <span className="text-xs text-neutral-400">{count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-neutral-700 mb-2">Price range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-neutral-400">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilterStops(null);
                  setFilterAirlines([]);
                  setPriceRange([0, 5000]);
                }}
                className="mt-4 w-full text-booking-blue-light hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Alternative Dates Widget */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-4">
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Alternative dates</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {alternativeDates.map((alt) => (
                  <button
                    key={alt.dateStr}
                    onClick={() => {
                      setDepartDate(alt.dateStr);
                      handleSearch(alt.dateStr);
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg border text-center transition-colors ${
                      alt.isCurrent
                        ? 'border-booking-blue bg-booking-blue/10 text-booking-blue'
                        : 'border-neutral-200 hover:border-booking-blue-light hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-xs text-neutral-500">{alt.dayName}</div>
                    <div className="font-medium">{alt.dayNum} {alt.month}</div>
                    <div className={`text-sm font-bold ${alt.price < (allFlights[0]?.price || 0) ? 'text-success' : 'text-neutral-700'}`}>
                      EUR {alt.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Tabs */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">
                  {isLoading
                    ? 'Searching...'
                    : loadError
                    ? 'Unable to load flights'
                    : `${filteredFlights.length} flight${filteredFlights.length !== 1 ? 's' : ''} found`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSortBy('best')}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      sortBy === 'best'
                        ? 'bg-booking-blue text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Best
                  </button>
                  <button
                    onClick={() => setSortBy('cheapest')}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      sortBy === 'cheapest'
                        ? 'bg-booking-blue text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Cheapest
                  </button>
                  <button
                    onClick={() => setSortBy('fastest')}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      sortBy === 'fastest'
                        ? 'bg-booking-blue text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Fastest
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-card p-8 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-booking-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">Searching for flights...</h3>
                  <p className="text-neutral-500">Finding the best options for {origin} to {destination}</p>
                </div>
              ) : loadError ? (
                <div className="bg-white rounded-lg shadow-card p-8 text-center text-error">
                  {loadError}
                </div>
              ) : filteredFlights.length === 0 ? (
                <div className="bg-white rounded-lg shadow-card p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto text-neutral-300 mb-4">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">No flights matching your search</h3>
                  <p className="text-neutral-500 mb-4">We couldn&apos;t find any flights for your selected route and dates.</p>
                  <div className="text-sm text-neutral-600 mb-4">
                    <p className="mb-2">Try the following:</p>
                    <ul className="list-disc list-inside text-left max-w-sm mx-auto">
                      <li>Select different dates</li>
                      <li>Try nearby airports</li>
                      <li>Remove filters like &quot;Direct only&quot;</li>
                      <li>Check back later for new flights</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setFilterStops(null);
                      setFilterAirlines([]);
                      setDirectOnly(false);
                    }}
                    className="px-6 py-2 bg-booking-blue text-white font-medium rounded hover:bg-booking-blue-hover transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                filteredFlights.map(flight => (
                  <div
                    key={flight.id}
                    className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Airline Info */}
                        <div className="flex items-center gap-3 md:w-32">
                          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-sm font-bold text-neutral-600">
                            {flight.airlineCode}
                          </div>
                          <div>
                            <div className="font-medium text-neutral-800 text-sm">{flight.airline}</div>
                            <div className="text-xs text-neutral-500">{flight.flightNumber}</div>
                          </div>
                        </div>

                        {/* Flight Times */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            {/* Departure */}
                            <div className="text-center">
                              <div className="text-xl font-bold text-neutral-800">{flight.departureTime}</div>
                              <div className="text-sm text-neutral-500">{flight.departureCode}</div>
                            </div>

                            {/* Duration & Stops */}
                            <div className="flex-1 px-4">
                              <div className="text-center text-xs text-neutral-500 mb-1">
                                {formatDuration(flight.duration)}
                              </div>
                              <div className="relative">
                                <div className="border-t-2 border-neutral-300"></div>
                                {flight.stops === 0 ? (
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 rotate-90">
                                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                                    {Array(Math.min(flight.stops, 3)).fill(null).map((_, i) => (
                                      <div key={i} className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-center text-xs text-neutral-500 mt-1">
                                {flight.stops === 0 ? (
                                  <span className="text-success">Direct</span>
                                ) : (
                                  <span>{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
                                )}
                              </div>
                            </div>

                            {/* Arrival */}
                            <div className="text-center">
                              <div className="text-xl font-bold text-neutral-800">{flight.arrivalTime}</div>
                              <div className="text-sm text-neutral-500">{flight.arrivalCode}</div>
                            </div>
                          </div>

                          {/* Stop locations */}
                          {flight.stopLocations && flight.stopLocations.length > 0 && (
                            <div className="mt-2 text-xs text-neutral-500 text-center">
                              via {flight.stopLocations.join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Price and Book */}
                        <div className="flex md:flex-col items-center md:items-end gap-2 md:w-40 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-booking-blue">{flight.currency} {flight.price}</div>
                            <div className="text-xs text-neutral-500">per person</div>
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <button
                              onClick={() => {
                                setSelectedFlight(flight);
                                setShowFlightDetailModal(true);
                              }}
                              className="text-booking-blue-light hover:text-booking-blue font-medium text-sm underline"
                            >
                              View details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFlight(flight);
                                setShowFlightDetailModal(true);
                              }}
                              className="bg-booking-blue-light text-white font-bold px-6 py-2 rounded hover:bg-booking-blue transition-colors"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extra Info Bar */}
                    <div className="bg-neutral-50 px-4 md:px-6 py-3 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M17 4H7a2 2 0 0 0-2 2v14l7-3 7 3V6a2 2 0 0 0-2-2z" />
                        </svg>
                        {flight.baggage.cabin} cabin
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 3h4v3h-4V3z" />
                        </svg>
                        {flight.baggage.checked} checked
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        {flight.aircraft}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Airport Selection Modal - Origin with Multi-select */}
      {showOriginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowOriginModal(false); setSelectedOriginAirports([]); }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Select departure airport(s)</h3>
                <button onClick={() => { setShowOriginModal(false); setSelectedOriginAirports([]); }} className="p-1 hover:bg-neutral-100 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search airports..."
                value={airportSearch}
                onChange={(e) => setAirportSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light"
                autoFocus
              />
              {selectedOriginAirports.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedOriginAirports.map(airport => (
                    <span
                      key={airport.code}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-booking-blue text-white text-sm rounded"
                    >
                      {airport.code}
                      <button
                        onClick={() => toggleOriginAirport(airport)}
                        className="hover:bg-white/20 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="max-h-[45vh] overflow-y-auto">
              {filteredAirports.map(airport => {
                const isSelected = selectedOriginAirports.some(a => a.code === airport.code);
                return (
                  <div
                    key={airport.code}
                    onClick={() => toggleOriginAirport(airport)}
                    className={`w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-start gap-3 border-b border-neutral-100 cursor-pointer ${
                      isSelected ? 'bg-booking-blue/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOriginAirport(airport)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded border-neutral-300 text-booking-blue focus:ring-booking-blue cursor-pointer"
                      />
                    </div>
                    <div className="bg-neutral-100 rounded px-2 py-1 font-bold text-sm text-neutral-600">{airport.code}</div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-800">{airport.name}</div>
                      <div className="text-sm text-neutral-500">{airport.city}, {airport.country}</div>
                      {airport.distance && <div className="text-xs text-neutral-400">{airport.distance}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t bg-neutral-50 flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                {selectedOriginAirports.length === 0
                  ? 'Select one or more airports'
                  : `${selectedOriginAirports.length} airport${selectedOriginAirports.length > 1 ? 's' : ''} selected`}
              </span>
              <button
                onClick={confirmOriginAirports}
                disabled={selectedOriginAirports.length === 0}
                className="px-6 py-2 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Airport Selection Modal - Destination with Multi-select */}
      {showDestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowDestModal(false); setSelectedDestAirports([]); }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Select destination airport(s)</h3>
                <button onClick={() => { setShowDestModal(false); setSelectedDestAirports([]); }} className="p-1 hover:bg-neutral-100 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search airports..."
                value={airportSearch}
                onChange={(e) => setAirportSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light"
                autoFocus
              />
              {selectedDestAirports.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedDestAirports.map(airport => (
                    <span
                      key={airport.code}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-booking-blue text-white text-sm rounded"
                    >
                      {airport.code}
                      <button
                        onClick={() => toggleDestAirport(airport)}
                        className="hover:bg-white/20 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="max-h-[45vh] overflow-y-auto">
              {filteredAirports.map(airport => {
                const isSelected = selectedDestAirports.some(a => a.code === airport.code);
                return (
                  <div
                    key={airport.code}
                    onClick={() => toggleDestAirport(airport)}
                    className={`w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-start gap-3 border-b border-neutral-100 cursor-pointer ${
                      isSelected ? 'bg-booking-blue/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDestAirport(airport)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded border-neutral-300 text-booking-blue focus:ring-booking-blue cursor-pointer"
                      />
                    </div>
                    <div className="bg-neutral-100 rounded px-2 py-1 font-bold text-sm text-neutral-600">{airport.code}</div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-800">{airport.name}</div>
                      <div className="text-sm text-neutral-500">{airport.city}, {airport.country}</div>
                      {airport.distance && <div className="text-xs text-neutral-400">{airport.distance}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t bg-neutral-50 flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                {selectedDestAirports.length === 0
                  ? 'Select one or more airports'
                  : `${selectedDestAirports.length} airport${selectedDestAirports.length > 1 ? 's' : ''} selected`}
              </span>
              <button
                onClick={confirmDestAirports}
                disabled={selectedDestAirports.length === 0}
                className="px-6 py-2 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDateModal(false)}>
          <div className="bg-white rounded-lg shadow-xl m-4 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {tripType === 'one-way' ? 'Select departure date' :
                 dateSelectionMode === 'depart' ? 'Select departure date' : 'Select return date'}
              </h3>
              <button onClick={() => setShowDateModal(false)} className="p-1 hover:bg-neutral-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex flex-col md:flex-row gap-4">
              {[calendar1, calendar2].map((cal, calIdx) => (
                <div key={calIdx} className="min-w-[280px]">
                  <div className="text-center font-bold mb-4">
                    {format(cal.month, 'MMMM yyyy')}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                      <div key={day} className="font-medium text-neutral-500 py-1">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cal.days.map((date, idx) => (
                      <button
                        key={idx}
                        onClick={() => date && handleDateClick(date)}
                        disabled={isDateDisabled(date)}
                        className={`
                          py-2 text-sm rounded transition-colors
                          ${!date ? 'invisible' : ''}
                          ${isDateDisabled(date) ? 'text-neutral-300 cursor-not-allowed' : 'hover:bg-booking-blue-light hover:text-white'}
                          ${isDateSelected(date) ? 'bg-booking-blue text-white' : ''}
                          ${isDateInRange(date) ? 'bg-booking-blue/20' : ''}
                        `}
                      >
                        {date ? format(date, 'd') : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-6 py-2 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Traveler Selector Modal */}
      {showTravelerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTravelerModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Travellers</h3>
              <button onClick={() => setShowTravelerModal(false)} className="p-1 hover:bg-neutral-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-neutral-500">Age 18+</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-neutral-500">Age 2-17</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-sm text-neutral-500">Under 2</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    disabled={infants <= 0}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{infants}</span>
                  <button
                    onClick={() => setInfants(Math.min(adults, infants + 1))}
                    disabled={infants >= adults}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowTravelerModal(false)}
                className="w-full py-2 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flight Detail Modal */}
      {showFlightDetailModal && selectedFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFlightDetailModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 border-b bg-booking-blue text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Flight details</h3>
                  <p className="text-sm opacity-90">{selectedFlight.departureAirport} to {selectedFlight.arrivalAirport}</p>
                </div>
                <button onClick={() => setShowFlightDetailModal(false)} className="p-1 hover:bg-white/20 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Flight Route */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-600">
                  {selectedFlight.airlineCode}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-lg">{selectedFlight.airline}</div>
                  <div className="text-sm text-neutral-500">Flight {selectedFlight.flightNumber} - {selectedFlight.aircraft}</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedFlight.departureTime}</div>
                  <div className="text-sm text-neutral-500">{selectedFlight.departureCode}</div>
                  <div className="text-xs text-neutral-400">{format(parseISO(departDate), 'EEE, MMM d')}</div>
                </div>
                <div className="flex-1 px-4">
                  <div className="text-center text-sm text-neutral-500 mb-1">{formatDuration(selectedFlight.duration)}</div>
                  <div className="relative">
                    <div className="border-t-2 border-neutral-300"></div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 rotate-90">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center text-sm mt-1">
                    {selectedFlight.stops === 0 ? (
                      <span className="text-success font-medium">Direct</span>
                    ) : (
                      <span className="text-neutral-600">{selectedFlight.stops} stop{selectedFlight.stops > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedFlight.arrivalTime}</div>
                  <div className="text-sm text-neutral-500">{selectedFlight.arrivalCode}</div>
                  <div className="text-xs text-neutral-400">{format(parseISO(departDate), 'EEE, MMM d')}</div>
                </div>
              </div>

              {selectedFlight.stopLocations && selectedFlight.stopLocations.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <span className="font-medium text-amber-800">Layover:</span>
                  <span className="text-amber-700 ml-1">{selectedFlight.stopLocations.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Baggage Information */}
            <div className="p-6 border-b">
              <h4 className="font-bold text-neutral-800 mb-4">Baggage allowance</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Personal item</div>
                    <div className="text-sm text-neutral-500">1 small bag under the seat - Included</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Cabin bag</div>
                    <div className="text-sm text-neutral-500">{selectedFlight.baggage.cabin} - Included</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Checked bag</div>
                    <div className="text-sm text-neutral-500">{selectedFlight.baggage.checked} - Included</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Rules */}
            <div className="p-6 border-b">
              <h4 className="font-bold text-neutral-800 mb-4">Fare rules</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
                      <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Modification</div>
                    <div className="text-sm text-neutral-500">Changes allowed with fee (varies by route)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-600">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Cancellation</div>
                    <div className="text-sm text-neutral-500">Refundable with fee. Cancel before departure to receive partial refund.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flexible Ticket Option */}
            <div className="p-6 border-b bg-blue-50">
              <h4 className="font-bold text-neutral-800 mb-2">Upgrade to Flexible Ticket</h4>
              <p className="text-sm text-neutral-600 mb-3">Allows free date changes. Get more flexibility for your trip.</p>
              <div className="flex items-center justify-between">
                <span className="text-booking-blue font-bold">+ EUR {Math.round(selectedFlight.price * 0.15)} per passenger</span>
                <span className="text-sm text-neutral-500">Can be selected in next steps</span>
              </div>
            </div>

            {/* Price and Continue */}
            <div className="p-6 flex items-center justify-between bg-neutral-50">
              <div>
                <div className="text-2xl font-bold text-booking-blue">{selectedFlight.currency} {selectedFlight.price}</div>
                <div className="text-sm text-neutral-500">Total price per person (taxes included)</div>
              </div>
              <button
                onClick={() => {
                  setShowFlightDetailModal(false);
                  navigate(`/flights/checkout?flight=${selectedFlight.id}&price=${selectedFlight.price}&origin=${originCode}&destination=${destCode}&date=${departDate}&adults=${adults}&children=${children}&infants=${infants}`);
                }}
                className="bg-booking-blue text-white font-bold px-8 py-3 rounded hover:bg-booking-blue-hover transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flexible Ticket Dialog - appears on page load */}
      {showFlexibleTicketDialog && !isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFlexibleTicketDialog(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-800">Need more flexibility?</h3>
                <button onClick={() => setShowFlexibleTicketDialog(false)} className="p-1 hover:bg-neutral-100 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">Flexible ticket</div>
                    <div className="text-sm text-neutral-500">Change your flight dates for free</div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span>Change flight dates without extra fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span>Only pay the fare difference if applicable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span>Peace of mind when plans change</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleFlexibleTicketNoThanks}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded font-medium hover:bg-neutral-50 transition-colors"
                >
                  No thanks
                </button>
                <button
                  onClick={handleFlexibleTicketLearnMore}
                  className="flex-1 px-4 py-2 bg-booking-blue text-white rounded font-medium hover:bg-booking-blue-hover transition-colors"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flexible Ticket Details Modal */}
      {showFlexibleTicketDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFlexibleTicketDetails(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-800">Flexible Ticket Details</h3>
                <button onClick={() => setShowFlexibleTicketDetails(false)} className="p-1 hover:bg-neutral-100 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Pricing Section */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-700 font-medium">Flexible ticket upgrade</span>
                  <span className="text-2xl font-bold text-booking-blue">+EUR 15</span>
                </div>
                <p className="text-sm text-neutral-600">per person, per flight</p>
              </div>

              {/* Benefits Section */}
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-800 mb-3">What&apos;s included</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-medium text-neutral-800">Unlimited date changes</span>
                      <p className="text-sm text-neutral-600">Change your flight dates as many times as you need, up to 24 hours before departure</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-medium text-neutral-800">No change fees</span>
                      <p className="text-sm text-neutral-600">Only pay the fare difference if your new flight costs more</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-medium text-neutral-800">Same route flexibility</span>
                      <p className="text-sm text-neutral-600">Change to any available flight on the same route</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Terms Section */}
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-800 mb-3">Terms & conditions</h4>
                <ul className="text-sm text-neutral-600 space-y-2">
                  <li>• Changes must be made at least 24 hours before the original departure</li>
                  <li>• New flight must be on the same route (origin and destination)</li>
                  <li>• If the new flight costs more, you&apos;ll pay the fare difference</li>
                  <li>• If the new flight costs less, no refund will be provided</li>
                  <li>• Valid for travel within 12 months of original booking date</li>
                  <li>• Non-refundable upgrade fee</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFlexibleTicketDetails(false);
                    setShowFlexibleTicketDialog(false);
                  }}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded font-medium hover:bg-neutral-50 transition-colors"
                >
                  Back to results
                </button>
                <button
                  onClick={() => {
                    setShowFlexibleTicketDetails(false);
                    setShowFlexibleTicketDialog(false);
                    // In a real app, this would add the flexible ticket option to cart/selection
                  }}
                  className="flex-1 px-4 py-2 bg-booking-blue text-white rounded font-medium hover:bg-booking-blue-hover transition-colors"
                >
                  Add to selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
