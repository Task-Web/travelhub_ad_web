import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, addDays, parseISO } from 'date-fns';

const popularAirports = [
  { name: 'London Heathrow', code: 'LHR', price: 45 },
  { name: 'London Gatwick', code: 'LGW', price: 52 },
  { name: 'Manchester', code: 'MAN', price: 38 },
  { name: 'Edinburgh', code: 'EDI', price: 35 },
  { name: 'Birmingham', code: 'BHX', price: 32 },
];

// Location data for autocomplete
const taxiLocations = [
  { name: 'London Heathrow Airport', type: 'airport', code: 'LHR', country: 'United Kingdom' },
  { name: 'London Gatwick Airport', type: 'airport', code: 'LGW', country: 'United Kingdom' },
  { name: 'London Stansted Airport', type: 'airport', code: 'STN', country: 'United Kingdom' },
  { name: 'London Luton Airport', type: 'airport', code: 'LTN', country: 'United Kingdom' },
  { name: 'London City Airport', type: 'airport', code: 'LCY', country: 'United Kingdom' },
  { name: 'Manchester Airport', type: 'airport', code: 'MAN', country: 'United Kingdom' },
  { name: 'Edinburgh Airport', type: 'airport', code: 'EDI', country: 'United Kingdom' },
  { name: 'Birmingham Airport', type: 'airport', code: 'BHX', country: 'United Kingdom' },
  { name: 'Glasgow Airport', type: 'airport', code: 'GLA', country: 'United Kingdom' },
  { name: 'Bristol Airport', type: 'airport', code: 'BRS', country: 'United Kingdom' },
  { name: 'Central London', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Westminster, London', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Camden, London', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Kensington, London', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'City of London', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Canary Wharf, London', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Kings Cross Station, London', type: 'station', code: '', country: 'United Kingdom' },
  { name: 'Paddington Station, London', type: 'station', code: '', country: 'United Kingdom' },
  { name: 'Victoria Station, London', type: 'station', code: '', country: 'United Kingdom' },
  { name: 'Euston Station, London', type: 'station', code: '', country: 'United Kingdom' },
  { name: 'Manchester City Centre', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Edinburgh City Centre', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'Birmingham City Centre', type: 'area', code: '', country: 'United Kingdom' },
  { name: 'The Savoy Hotel, London', type: 'hotel', code: '', country: 'United Kingdom' },
  { name: 'The Ritz London', type: 'hotel', code: '', country: 'United Kingdom' },
  { name: 'Claridge\'s, London', type: 'hotel', code: '', country: 'United Kingdom' },
];

const benefits = [
  {
    icon: '🕐',
    title: 'Flight tracking',
    description: 'Your driver tracks your flight and waits for you if it\'s delayed',
  },
  {
    icon: '💰',
    title: 'One clear price',
    description: 'Your price is confirmed upfront - no extra costs, no cash required',
  },
  {
    icon: '✅',
    title: 'Tried and trusted',
    description: 'We work with professional drivers and trusted partners',
  },
  {
    icon: '🚗',
    title: '24/7 service',
    description: 'No matter what time your flight lands, we\'ll be there for you',
  },
];

export default function AirportTaxisPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState<Date>(addDays(new Date(), 7));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTrip, setReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 14));
  const [returnTime, setReturnTime] = useState('10:00');
  const [passengers, setPassengers] = useState(2);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

  // Pre-fill form from URL params (for "Modify search" functionality)
  useEffect(() => {
    const pickupParam = searchParams.get('pickup');
    const dropoffParam = searchParams.get('dropoff');
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    const passengersParam = searchParams.get('passengers');
    const returnDateParam = searchParams.get('return_date');
    const returnTimeParam = searchParams.get('return_time');

    if (pickupParam) setPickupLocation(pickupParam);
    if (dropoffParam) setDropoffLocation(dropoffParam);
    if (dateParam) {
      try {
        setPickupDate(parseISO(dateParam));
      } catch {
        // Keep default if invalid date
      }
    }
    if (timeParam) setPickupTime(timeParam);
    if (passengersParam) setPassengers(parseInt(passengersParam) || 2);
    if (returnDateParam) {
      setReturnTrip(true);
      try {
        setReturnDate(parseISO(returnDateParam));
      } catch {
        // Keep default if invalid date
      }
      if (returnTimeParam) setReturnTime(returnTimeParam);
    }
  }, [searchParams]);

  // Filter locations based on search input
  const getFilteredLocations = (query: string) => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return taxiLocations.filter(loc =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.country.toLowerCase().includes(lowerQuery) ||
      (loc.code && loc.code.toLowerCase().includes(lowerQuery))
    ).slice(0, 8);
  };

  const handlePickupSelect = (location: typeof taxiLocations[0]) => {
    setPickupLocation(location.name);
    setShowPickupSuggestions(false);
  };

  const handleDropoffSelect = (location: typeof taxiLocations[0]) => {
    setDropoffLocation(location.name);
    setShowDropoffSuggestions(false);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'airport':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        );
      case 'station':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        );
      case 'hotel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        );
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        times.push(`${h}:${m}`);
      }
    }
    return times;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (pickupLocation) params.set('pickup', pickupLocation);
    if (dropoffLocation) params.set('dropoff', dropoffLocation);
    params.set('date', format(pickupDate, 'yyyy-MM-dd'));
    params.set('time', pickupTime);
    params.set('passengers', passengers.toString());
    if (returnTrip) {
      params.set('return_date', format(returnDate, 'yyyy-MM-dd'));
      params.set('return_time', returnTime);
    }

    navigate(`/airport-taxis/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Book your airport taxi
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Easy airport transfers to and from your accommodation
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Pick-up location</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setShowPickupSuggestions(e.target.value.length >= 2);
                    }}
                    onFocus={() => setShowPickupSuggestions(pickupLocation.length >= 2)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                    placeholder="Airport, hotel, address"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                  />
                  {/* Autocomplete suggestions dropdown */}
                  {showPickupSuggestions && getFilteredLocations(pickupLocation).length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-b shadow-lg z-50 max-h-80 overflow-y-auto">
                      {getFilteredLocations(pickupLocation).map((loc, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handlePickupSelect(loc)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 text-left border-b border-neutral-100 last:border-b-0"
                        >
                          {getLocationIcon(loc.type)}
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">{loc.name}</div>
                            <div className="text-sm text-neutral-500">
                              {loc.code ? `${loc.code} · ` : ''}
                              {loc.type.charAt(0).toUpperCase() + loc.type.slice(1)} · {loc.country}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropoff Location */}
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Drop-off location</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => {
                      setDropoffLocation(e.target.value);
                      setShowDropoffSuggestions(e.target.value.length >= 2);
                    }}
                    onFocus={() => setShowDropoffSuggestions(dropoffLocation.length >= 2)}
                    onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
                    placeholder="Airport, hotel, address"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                  />
                  {/* Autocomplete suggestions dropdown */}
                  {showDropoffSuggestions && getFilteredLocations(dropoffLocation).length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-b shadow-lg z-50 max-h-80 overflow-y-auto">
                      {getFilteredLocations(dropoffLocation).map((loc, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDropoffSelect(loc)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 text-left border-b border-neutral-100 last:border-b-0"
                        >
                          {getLocationIcon(loc.type)}
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">{loc.name}</div>
                            <div className="text-sm text-neutral-500">
                              {loc.code ? `${loc.code} · ` : ''}
                              {loc.type.charAt(0).toUpperCase() + loc.type.slice(1)} · {loc.country}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date, Time, Passengers */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Pick-up date</label>
                <input
                  type="date"
                  value={format(pickupDate, 'yyyy-MM-dd')}
                  onChange={(e) => setPickupDate(new Date(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Pick-up time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                >
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Passengers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-3">
                  <input
                    type="checkbox"
                    checked={returnTrip}
                    onChange={(e) => setReturnTrip(e.target.checked)}
                    className="w-4 h-4 text-booking-blue"
                  />
                  <span className="text-neutral-800">Add return trip</span>
                </label>
              </div>
            </div>

            {/* Return Trip Details */}
            {returnTrip && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Return date</label>
                  <input
                    type="date"
                    value={format(returnDate, 'yyyy-MM-dd')}
                    onChange={(e) => setReturnDate(new Date(e.target.value))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Return time</label>
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                  >
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleSearch}
              className="bg-booking-blue-light text-white font-bold px-8 py-3 rounded hover:bg-booking-blue transition-colors text-lg"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <span className="text-4xl mb-4 block">{benefit.icon}</span>
              <h3 className="font-bold text-neutral-800 mb-2">{benefit.title}</h3>
              <p className="text-neutral-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Airports */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Popular airport transfers
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {popularAirports.map((airport) => (
              <button
                key={airport.code}
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set('pickup', `${airport.name} (${airport.code})`);
                  params.set('dropoff', 'Central London');
                  params.set('date', format(pickupDate, 'yyyy-MM-dd'));
                  params.set('time', pickupTime);
                  params.set('passengers', passengers.toString());
                  navigate(`/airport-taxis/search?${params.toString()}`);
                }}
                className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer text-left w-full"
              >
                <h3 className="font-bold text-neutral-800 mb-1">{airport.name}</h3>
                <p className="text-sm text-neutral-500 mb-2">{airport.code}</p>
                <p className="text-booking-blue-light font-bold">
                  From EUR {airport.price}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
          Airport transfers made easy
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-booking-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Book online</h3>
            <p className="text-neutral-600 text-sm">
              Enter your pick-up and drop-off details, select your vehicle and book in minutes
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-booking-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Receive confirmation</h3>
            <p className="text-neutral-600 text-sm">
              You&apos;ll receive an email confirmation with all the details of your booking
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-booking-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Enjoy your ride</h3>
            <p className="text-neutral-600 text-sm">
              Your driver will meet you at the designated pick-up point
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
