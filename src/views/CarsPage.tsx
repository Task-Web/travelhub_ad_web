import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, isAfter, getDay, isSameMonth } from 'date-fns';
import Link from 'next/link';

const popularBrands = [
  'Enterprise', 'Budget', 'Europcar', 'Hertz', 'Avis', 'Sixt', 'Alamo', 'National'
];

// Location data for autocomplete
const carRentalLocations = [
  { name: 'London', type: 'city', country: 'United Kingdom', locations: 47 },
  { name: 'London Heathrow Airport', type: 'airport', code: 'LHR', country: 'United Kingdom', locations: 15 },
  { name: 'London Gatwick Airport', type: 'airport', code: 'LGW', country: 'United Kingdom', locations: 12 },
  { name: 'London Stansted Airport', type: 'airport', code: 'STN', country: 'United Kingdom', locations: 6 },
  { name: 'London Luton Airport', type: 'airport', code: 'LTN', country: 'United Kingdom', locations: 5 },
  { name: 'London City Airport', type: 'airport', code: 'LCY', country: 'United Kingdom', locations: 3 },
  { name: 'London Kings Cross Station', type: 'station', country: 'United Kingdom', locations: 4 },
  { name: 'London Paddington Station', type: 'station', country: 'United Kingdom', locations: 3 },
  { name: 'Manchester', type: 'city', country: 'United Kingdom', locations: 12 },
  { name: 'Manchester Airport', type: 'airport', code: 'MAN', country: 'United Kingdom', locations: 8 },
  { name: 'Edinburgh', type: 'city', country: 'United Kingdom', locations: 8 },
  { name: 'Edinburgh Airport', type: 'airport', code: 'EDI', country: 'United Kingdom', locations: 5 },
  { name: 'Birmingham', type: 'city', country: 'United Kingdom', locations: 9 },
  { name: 'Birmingham Airport', type: 'airport', code: 'BHX', country: 'United Kingdom', locations: 6 },
  { name: 'Glasgow', type: 'city', country: 'United Kingdom', locations: 7 },
  { name: 'Glasgow Airport', type: 'airport', code: 'GLA', country: 'United Kingdom', locations: 4 },
  { name: 'Liverpool', type: 'city', country: 'United Kingdom', locations: 5 },
  { name: 'Bristol', type: 'city', country: 'United Kingdom', locations: 6 },
  { name: 'Bristol Airport', type: 'airport', code: 'BRS', country: 'United Kingdom', locations: 4 },
  { name: 'Leeds', type: 'city', country: 'United Kingdom', locations: 5 },
  { name: 'Central London', type: 'area', country: 'United Kingdom', locations: 25 },
  { name: 'Greater London', type: 'region', country: 'United Kingdom', locations: 52 },
];

const destinationTabs = [
  { id: 'cities', label: 'Cities' },
  { id: 'airports', label: 'Airports' },
  { id: 'regions', label: 'Regions' },
];

const cityDestinations = [
  { name: 'London', locations: 47, price: 28 },
  { name: 'Manchester', locations: 12, price: 24 },
  { name: 'Edinburgh', locations: 8, price: 26 },
  { name: 'Birmingham', locations: 9, price: 22 },
  { name: 'Glasgow', locations: 7, price: 25 },
];

const airportDestinations = [
  { name: 'Heathrow Airport', locations: 15, price: 32 },
  { name: 'Gatwick Airport', locations: 12, price: 29 },
  { name: 'Manchester Airport', locations: 8, price: 26 },
  { name: 'Stansted Airport', locations: 6, price: 24 },
  { name: 'Edinburgh Airport', locations: 5, price: 28 },
];

const regionDestinations = [
  { name: 'Greater London', locations: 52, price: 30 },
  { name: 'South East England', locations: 34, price: 27 },
  { name: 'Scotland', locations: 28, price: 26 },
  { name: 'North West England', locations: 22, price: 24 },
  { name: 'West Midlands', locations: 18, price: 23 },
];

const faqItems = [
  { q: 'How old do I need to be to rent a car?', a: 'Most car rental companies require drivers to be at least 21 years old, though some may rent to drivers as young as 18 with additional fees. Drivers under 25 often face young driver surcharges.' },
  { q: 'What documents do I need to rent a car?', a: 'You typically need a valid driving licence, a credit card in the main driver\'s name, and a valid ID or passport. International renters may also need an International Driving Permit.' },
  { q: 'Can I return the car to a different location?', a: 'Yes, many car rental companies offer one-way rentals where you can pick up in one location and drop off in another. There may be an additional fee for this service.' },
  { q: 'What is the fuel policy?', a: 'Most rentals operate on a "full-to-full" policy where you receive the car with a full tank and return it full. Some offer "full-to-empty" where you prepay for fuel.' },
  { q: 'Is insurance included?', a: 'Basic insurance is usually included, but you may want additional coverage. Check what\'s included and consider purchasing excess reduction or personal accident insurance.' },
];

const reasonsToBook = [
  {
    icon: 'support',
    title: "We're here for you",
    description: 'Customer support in over 30 languages'
  },
  {
    icon: 'cancel',
    title: 'Free cancellation',
    description: 'On most bookings, cancel up to 48 hours before pick-up'
  },
  {
    icon: 'reviews',
    title: '5 million+ reviews',
    description: 'Trusted by customers worldwide'
  },
];

// Calendar Picker Modal Component for Car Rental
function CarCalendarPicker({
  isOpen,
  onClose,
  pickupDate,
  dropoffDate,
  onSelectDates,
  selectingPickup,
}: {
  isOpen: boolean;
  onClose: () => void;
  pickupDate: Date;
  dropoffDate: Date;
  onSelectDates: (pickup: Date, dropoff: Date) => void;
  selectingPickup: boolean;
}) {
  const [selectedPickup, setSelectedPickup] = useState<Date>(pickupDate);
  const [selectedDropoff, setSelectedDropoff] = useState<Date>(dropoffDate);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [isSelectingPickup, setIsSelectingPickup] = useState(selectingPickup);
  const today = startOfDay(new Date());

  useEffect(() => {
    if (isOpen) {
      setSelectedPickup(pickupDate);
      setSelectedDropoff(dropoffDate);
      setIsSelectingPickup(selectingPickup);
    }
  }, [isOpen, pickupDate, dropoffDate, selectingPickup]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (isSelectingPickup) {
      setSelectedPickup(date);
      // If dropoff is before new pickup, adjust it
      if (isBefore(selectedDropoff, date) || isSameDay(selectedDropoff, date)) {
        setSelectedDropoff(addDays(date, 3));
      }
      setIsSelectingPickup(false);
    } else {
      // Selecting drop-off
      if (isBefore(date, selectedPickup) || isSameDay(date, selectedPickup)) {
        // If clicked date is before pickup, make it the new pickup
        setSelectedPickup(date);
        setSelectedDropoff(addDays(date, 3));
      } else {
        setSelectedDropoff(date);
        onSelectDates(selectedPickup, date);
        onClose();
      }
    }
  };

  const renderMonth = (monthStart: Date) => {
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);
    const paddingDays = Array(startDay).fill(null);

    return (
      <div className="flex-1">
        <div className="text-center font-bold text-neutral-800 mb-4">
          {format(monthStart, 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-xs text-neutral-500 font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} />
          ))}
          {days.map((day) => {
            const isDisabled = isBefore(day, today);
            const isPickup = isSameDay(day, selectedPickup);
            const isDropoff = isSameDay(day, selectedDropoff);
            const isInRange = isAfter(day, selectedPickup) && isBefore(day, selectedDropoff);
            const isToday = isSameDay(day, today);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={`
                  p-2 text-sm rounded transition-colors
                  ${isDisabled ? 'text-neutral-300 cursor-not-allowed' : 'hover:bg-booking-blue-light/10'}
                  ${isPickup || isDropoff ? 'bg-booking-blue text-white hover:bg-booking-blue' : ''}
                  ${isInRange ? 'bg-booking-blue/10' : ''}
                  ${isToday && !isPickup && !isDropoff ? 'ring-1 ring-booking-blue' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-800">
            {isSelectingPickup ? 'Select pick-up date' : 'Select drop-off date'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Selection indicator */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsSelectingPickup(true)}
            className={`flex-1 p-3 rounded border-2 transition-colors ${
              isSelectingPickup ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200'
            }`}
          >
            <div className="text-xs text-neutral-500 mb-1">Pick-up</div>
            <div className="font-medium text-neutral-800">{format(selectedPickup, 'EEE, d MMM yyyy')}</div>
          </button>
          <button
            onClick={() => setIsSelectingPickup(false)}
            className={`flex-1 p-3 rounded border-2 transition-colors ${
              !isSelectingPickup ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200'
            }`}
          >
            <div className="text-xs text-neutral-500 mb-1">Drop-off</div>
            <div className="font-medium text-neutral-800">{format(selectedDropoff, 'EEE, d MMM yyyy')}</div>
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            disabled={isSameMonth(currentMonth, today)}
            className="p-2 hover:bg-neutral-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-neutral-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>

        {/* Two Month Display */}
        <div className="flex gap-8">
          {renderMonth(currentMonth)}
          {renderMonth(addMonths(currentMonth, 1))}
        </div>

        {/* Confirm button */}
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={() => {
              onSelectDates(selectedPickup, selectedDropoff);
              onClose();
            }}
            className="bg-booking-blue text-white font-bold px-6 py-2 rounded hover:bg-booking-blue-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date>(addDays(new Date(), 7));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState<Date>(addDays(new Date(), 10));
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [driverAge, setDriverAge] = useState(true);
  const [activeDestTab, setActiveDestTab] = useState('cities');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingPickup, setSelectingPickup] = useState(true);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

  // Filter locations based on search input
  const getFilteredLocations = (query: string) => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return carRentalLocations.filter(loc =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.country.toLowerCase().includes(lowerQuery) ||
      (loc.code && loc.code.toLowerCase().includes(lowerQuery))
    ).slice(0, 8);
  };

  const handlePickupSelect = (location: typeof carRentalLocations[0]) => {
    setPickupLocation(location.name);
    setShowPickupSuggestions(false);
  };

  const handleDropoffSelect = (location: typeof carRentalLocations[0]) => {
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
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        );
    }
  };

  const getDestinations = () => {
    switch (activeDestTab) {
      case 'airports':
        return airportDestinations;
      case 'regions':
        return regionDestinations;
      default:
        return cityDestinations;
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
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
    if (differentDropoff && dropoffLocation) params.set('dropoff', dropoffLocation);
    params.set('pickup_date', format(pickupDate, 'yyyy-MM-dd'));
    params.set('pickup_time', pickupTime);
    params.set('dropoff_date', format(dropoffDate, 'yyyy-MM-dd'));
    params.set('dropoff_time', dropoffTime);
    if (!driverAge) params.set('young_driver', 'true');

    navigate(`/cars/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Car hire for any kind of trip
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Great deals at great prices, from the biggest car hire companies
          </p>

          {/* Car Search Form */}
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
                    placeholder="City, airport, station, region"
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
                              {loc.type === 'airport' && loc.code ? `${loc.code} · ` : ''}
                              {loc.type.charAt(0).toUpperCase() + loc.type.slice(1)} · {loc.country}
                              {loc.locations && ` · ${loc.locations} locations`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropoff Location (conditional) */}
              {differentDropoff && (
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
                      placeholder="City, airport, station, region"
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
                                {loc.type === 'airport' && loc.code ? `${loc.code} · ` : ''}
                                {loc.type.charAt(0).toUpperCase() + loc.type.slice(1)} · {loc.country}
                                {loc.locations && ` · ${loc.locations} locations`}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={differentDropoff}
                onChange={(e) => setDifferentDropoff(e.target.checked)}
                className="w-4 h-4 text-booking-blue"
              />
              <span className="text-neutral-800">Different drop-off location</span>
            </label>

            {/* Dates and Times */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Pick-up date</label>
                <button
                  onClick={() => {
                    setSelectingPickup(true);
                    setShowCalendar(true);
                  }}
                  className="w-full px-4 py-3 border border-neutral-200 rounded text-left hover:border-booking-blue-light focus:outline-none focus:border-booking-blue-light flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                  </svg>
                  <span className="text-neutral-800">{format(pickupDate, 'EEE, d MMM')}</span>
                </button>
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
                <label className="block text-xs text-neutral-500 mb-1">Drop-off date</label>
                <button
                  onClick={() => {
                    setSelectingPickup(false);
                    setShowCalendar(true);
                  }}
                  className="w-full px-4 py-3 border border-neutral-200 rounded text-left hover:border-booking-blue-light focus:outline-none focus:border-booking-blue-light flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                  </svg>
                  <span className="text-neutral-800">{format(dropoffDate, 'EEE, d MMM')}</span>
                </button>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Drop-off time</label>
                <select
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                >
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={driverAge}
                  onChange={(e) => setDriverAge(e.target.checked)}
                  className="w-4 h-4 text-booking-blue"
                />
                <span className="text-neutral-800">Driver aged 30 - 65?</span>
              </label>
            </div>

            <button
              onClick={handleSearch}
              className="bg-booking-blue-light text-white font-bold px-8 py-3 rounded hover:bg-booking-blue transition-colors text-lg"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular Car Hire Brands */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Popular car hire brands
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {popularBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => {
                const params = new URLSearchParams();
                params.set('brand', brand);
                params.set('pickup', pickupLocation || 'London');
                params.set('pickup_date', format(pickupDate, 'yyyy-MM-dd'));
                params.set('pickup_time', pickupTime);
                params.set('dropoff_date', format(dropoffDate, 'yyyy-MM-dd'));
                params.set('dropoff_time', dropoffTime);
                navigate(`/cars/search?${params.toString()}`);
              }}
              className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow text-center cursor-pointer"
            >
              <span className="font-medium text-neutral-800">{brand}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Genius Loyalty Section - Travel more, spend less */}
      <div className="bg-neutral-50">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-lg p-6 shadow-card">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-booking-blue to-booking-blue-light rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                Travel more, spend less
              </h2>
              <h3 className="text-lg font-bold text-neutral-700 mb-2">
                Sign in, save money
              </h3>
              <p className="text-neutral-600 mb-4">
                Save 10% or more with a free <span className="inline-flex items-center px-2 py-0.5 bg-booking-blue text-white text-xs font-bold rounded">Genius</span> membership. Sign in or create an account to see Genius discounts at participating car hire companies.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  href="/sign-in"
                  className="bg-booking-blue text-white font-bold px-6 py-2 rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-booking-blue font-bold px-6 py-2 rounded border-2 border-booking-blue hover:bg-booking-blue/5 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reasons to Book Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Reasons to book car rentals with TravelHub
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reasonsToBook.map((reason) => (
            <div key={reason.title} className="bg-white rounded-lg p-6 shadow-card">
              <div className="w-12 h-12 bg-booking-blue-light/10 rounded-lg flex items-center justify-center mb-4">
                {reason.icon === 'support' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue-light">
                    <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                  </svg>
                )}
                {reason.icon === 'cancel' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue-light">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                  </svg>
                )}
                {reason.icon === 'reviews' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue-light">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">{reason.title}</h3>
              <p className="text-neutral-600 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Popular car hire destinations
          </h2>

          {/* Destination Tabs */}
          <div className="border-b border-neutral-200 mb-6">
            <div className="flex gap-4">
              {destinationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDestTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeDestTab === tab.id
                      ? 'text-booking-blue border-b-2 border-booking-blue'
                      : 'text-neutral-600 hover:text-booking-blue'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {getDestinations().map((dest) => (
              <button
                key={dest.name}
                onClick={() => {
                  setPickupLocation(dest.name);
                  const params = new URLSearchParams();
                  params.set('pickup', dest.name);
                  params.set('pickup_date', format(pickupDate, 'yyyy-MM-dd'));
                  params.set('pickup_time', pickupTime);
                  params.set('dropoff_date', format(dropoffDate, 'yyyy-MM-dd'));
                  params.set('dropoff_time', dropoffTime);
                  navigate(`/cars/search?${params.toString()}`);
                }}
                className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer text-left"
              >
                <h3 className="font-bold text-neutral-800 mb-1">{dest.name}</h3>
                <p className="text-sm text-neutral-500 mb-2">{dest.locations} locations</p>
                <p className="text-booking-blue-light font-bold">
                  From EUR {dest.price}/day
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Frequently asked questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqItems.map((faq, index) => (
            <details key={index} className="group border border-neutral-200 rounded-lg bg-white">
              <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-neutral-800 hover:bg-neutral-50 rounded-lg transition-colors">
                {faq.q}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </summary>
              <div className="border-t border-neutral-100">
                <p className="px-4 py-3 text-neutral-600 text-sm">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Calendar Modal */}
      <CarCalendarPicker
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        pickupDate={pickupDate}
        dropoffDate={dropoffDate}
        onSelectDates={(pickup, dropoff) => {
          setPickupDate(pickup);
          setDropoffDate(dropoff);
        }}
        selectingPickup={selectingPickup}
      />
    </div>
  );
}
