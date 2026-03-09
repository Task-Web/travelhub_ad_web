import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfToday, isSameDay, isWithinInterval } from 'date-fns';

// Country data with rental counts
const featuredCountries = [
  { name: 'Spain', rentals: '121,356', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop' },
  { name: 'Italy', rentals: '89,234', image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=400&h=300&fit=crop' },
  { name: 'France', rentals: '156,789', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { name: 'Portugal', rentals: '45,678', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop' },
  { name: 'Greece', rentals: '34,567', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop' },
  { name: 'United Kingdom', rentals: '78,901', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
];

// Property types for holiday rentals
const propertyTypes = [
  { name: 'Bungalows', icon: '🏡', count: '12,456' },
  { name: 'Apartments', icon: '🏢', count: '245,678' },
  { name: 'Chalets', icon: '🏔️', count: '8,901' },
  { name: 'Villas', icon: '🏖️', count: '67,890' },
  { name: 'Camping & boats', icon: '⛺', count: '5,432' },
  { name: 'Houses', icon: '🏠', count: '156,789' },
];

// Homes guests love (carousel)
const homesGuestsLove = [
  { name: 'Coastal Villa', location: 'Algarve, Portugal', rating: 9.4, reviews: 456, price: 189, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop' },
  { name: 'Mountain Chalet', location: 'Swiss Alps', rating: 9.6, reviews: 234, price: 245, image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop' },
  { name: 'City Apartment', location: 'Barcelona, Spain', rating: 9.1, reviews: 789, price: 125, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop' },
  { name: 'Beach House', location: 'Santorini, Greece', rating: 9.8, reviews: 321, price: 299, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop' },
];

// How does it work FAQ items
const howItWorksFAQ = [
  {
    title: 'Getting your key',
    content: 'When you book a holiday rental, the host will send you detailed instructions on how to access the property. This could be through a key lockbox, smart lock code, or meeting the host in person.',
  },
  {
    title: 'Communicating with your host',
    content: 'You can message your host directly through our platform before, during, and after your stay. Hosts typically respond within 24 hours and can provide local tips and recommendations.',
  },
  {
    title: 'Checking in',
    content: 'Check-in times vary by property but are typically in the afternoon. Your host will confirm the exact time and provide any special instructions for a smooth arrival.',
  },
];

// Trust signals for booking made easy
const trustSignals = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-booking-blue">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: 'No hidden fees',
    description: 'The price you see is the price you pay. No surprise charges at checkout.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-booking-blue">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
    title: 'Instant confirmation',
    description: 'Get immediate booking confirmation for peace of mind.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-booking-blue">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
    title: 'Flexibility',
    description: 'Many properties offer free cancellation, so you can book with confidence.',
  },
];

// Popular destinations autocomplete
const popularDestinations = [
  'London', 'Paris', 'Barcelona', 'Rome', 'Amsterdam', 'Lisbon', 'Madrid', 'Berlin', 'Vienna', 'Prague',
];

type FlexibleDays = 0 | 1 | 2 | 3 | 7;

export default function HolidayRentalsPage() {
  const navigate = useNavigate();
  const today = startOfToday();

  // Search form state
  const [destination, setDestination] = useState('London');
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTab, setCalendarTab] = useState<'calendar' | 'flexible'>('calendar');
  const [flexibleDays, setFlexibleDays] = useState<FlexibleDays>(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Guest selector state
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [travellingWithPets, setTravellingWithPets] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  // FAQ accordion state
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Calendar helpers
  const getMonthDays = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const nextMonth = addMonths(currentMonth, 1);
  const month1Days = getMonthDays(currentMonth);
  const month2Days = getMonthDays(nextMonth);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (isBefore(date, checkIn)) {
      setCheckIn(date);
    } else {
      setCheckOut(date);
      setShowCalendar(false);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return isWithinInterval(date, { start: checkIn, end: checkOut });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkin', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkout', format(checkOut, 'yyyy-MM-dd'));
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());
    params.set('entire_home', 'true'); // Holiday rentals are always entire homes
    if (travellingWithPets) params.set('pets', 'true');
    if (flexibleDays > 0) params.set('flex_days', flexibleDays.toString());

    navigate(`/search?${params.toString()}`);
  };

  const clearDestination = () => {
    setDestination('');
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[400px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=900&fit=crop)' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-container-lg mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Holiday rentals all over the world
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Houses, cabins, apartments and more
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-wrap gap-2">
              {/* Destination Input */}
              <div className="relative flex-1 min-w-[200px]">
                <div className="flex items-center border border-neutral-200 rounded px-4 py-3 bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 mr-2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowDestinationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                    placeholder="Where are you going?"
                    className="flex-1 outline-none text-neutral-800"
                  />
                  {destination && (
                    <button
                      onClick={clearDestination}
                      className="ml-2 text-neutral-400 hover:text-neutral-600"
                      aria-label="Clear destination"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}
                </div>
                {showDestinationDropdown && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg max-h-60 overflow-auto">
                    {popularDestinations
                      .filter(d => d.toLowerCase().includes(destination.toLowerCase()))
                      .map(d => (
                        <button
                          key={d}
                          onClick={() => {
                            setDestination(d);
                            setShowDestinationDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-100"
                        >
                          {d}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Date Picker Button */}
              <button
                onClick={() => setShowCalendar(true)}
                className="flex items-center border border-neutral-200 rounded px-4 py-3 bg-white hover:border-neutral-400 min-w-[200px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 mr-2">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                </svg>
                <span className="text-neutral-800">
                  {checkIn && checkOut
                    ? `${format(checkIn, 'MMM d')} - ${format(checkOut, 'MMM d')}`
                    : 'Check-in - Check-out'}
                </span>
              </button>

              {/* Guest Selector Button */}
              <button
                onClick={() => setShowGuestSelector(true)}
                className="flex items-center border border-neutral-200 rounded px-4 py-3 bg-white hover:border-neutral-400 min-w-[180px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 mr-2">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span className="text-neutral-800">
                  {adults} adult{adults !== 1 ? 's' : ''} · {children} child{children !== 1 ? 'ren' : ''} · {rooms} room{rooms !== 1 ? 's' : ''}
                </span>
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-booking-blue text-white font-bold px-8 py-3 rounded hover:bg-booking-blue-hover transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowCalendar(false)}>
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-800">Select dates</h3>
                <button onClick={() => setShowCalendar(false)} className="p-1 hover:bg-neutral-100 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-4 border-b border-neutral-200">
                <button
                  onClick={() => setCalendarTab('calendar')}
                  className={`pb-2 px-2 font-medium ${calendarTab === 'calendar' ? 'text-booking-blue border-b-2 border-booking-blue' : 'text-neutral-600'}`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setCalendarTab('flexible')}
                  className={`pb-2 px-2 font-medium ${calendarTab === 'flexible' ? 'text-booking-blue border-b-2 border-booking-blue' : 'text-neutral-600'}`}
                >
                  I&apos;m flexible
                </button>
              </div>
            </div>

            {calendarTab === 'calendar' && (
              <div className="p-4">
                {/* Flexible date options */}
                <div className="mb-4">
                  <p className="text-sm text-neutral-600 mb-2">Date flexibility</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFlexibleDays(0)}
                      className={`px-3 py-1 rounded-full text-sm ${flexibleDays === 0 ? 'bg-booking-blue text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    >
                      Exact dates
                    </button>
                    <button
                      onClick={() => setFlexibleDays(1)}
                      className={`px-3 py-1 rounded-full text-sm ${flexibleDays === 1 ? 'bg-booking-blue text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    >
                      +/- 1 day
                    </button>
                    <button
                      onClick={() => setFlexibleDays(2)}
                      className={`px-3 py-1 rounded-full text-sm ${flexibleDays === 2 ? 'bg-booking-blue text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    >
                      +/- 2 days
                    </button>
                    <button
                      onClick={() => setFlexibleDays(3)}
                      className={`px-3 py-1 rounded-full text-sm ${flexibleDays === 3 ? 'bg-booking-blue text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    >
                      +/- 3 days
                    </button>
                    <button
                      onClick={() => setFlexibleDays(7)}
                      className={`px-3 py-1 rounded-full text-sm ${flexibleDays === 7 ? 'bg-booking-blue text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    >
                      +/- 7 days
                    </button>
                  </div>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                    className="p-2 hover:bg-neutral-100 rounded"
                    disabled={isBefore(startOfMonth(currentMonth), startOfMonth(today))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>
                  <div className="flex gap-8">
                    <span className="font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
                    <span className="font-medium">{format(nextMonth, 'MMMM yyyy')}</span>
                  </div>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-neutral-100 rounded"
                    aria-label="Next month"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </button>
                </div>

                {/* Two Month Calendar Grid */}
                <div className="grid grid-cols-2 gap-8">
                  {[month1Days, month2Days].map((days, monthIndex) => (
                    <div key={monthIndex}>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                          <div key={day} className="text-center text-sm font-medium text-neutral-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {/* Padding for first day of month */}
                        {Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => (
                          <div key={`pad-${i}`} />
                        ))}
                        {days.map(date => {
                          const isPast = isBefore(date, today);
                          const isSelected = (checkIn && isSameDay(date, checkIn)) || (checkOut && isSameDay(date, checkOut));
                          const inRange = isDateInRange(date);

                          return (
                            <button
                              key={date.toISOString()}
                              onClick={() => handleDateClick(date)}
                              disabled={isPast}
                              className={`
                                py-2 rounded text-sm
                                ${isPast ? 'text-neutral-300 cursor-not-allowed' : 'hover:bg-booking-blue-light hover:text-white cursor-pointer'}
                                ${isSelected ? 'bg-booking-blue text-white' : ''}
                                ${inRange && !isSelected ? 'bg-booking-blue/20' : ''}
                              `}
                            >
                              {format(date, 'd')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {calendarTab === 'flexible' && (
              <div className="p-8 text-center">
                <p className="text-neutral-600 mb-4">Select how flexible you are with your dates</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[1, 2, 3, 7].map(days => (
                    <button
                      key={days}
                      onClick={() => {
                        setFlexibleDays(days as FlexibleDays);
                        setCalendarTab('calendar');
                      }}
                      className="px-6 py-3 border border-neutral-200 rounded-lg hover:border-booking-blue hover:bg-booking-blue/5"
                    >
                      +/- {days} day{days > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guest Selector Modal */}
      {showGuestSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowGuestSelector(false)}>
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-800">Guests & rooms</h3>
              <button onClick={() => setShowGuestSelector(false)} className="p-1 hover:bg-neutral-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-800">Adults</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-booking-blue"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:border-booking-blue"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-800">Children</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-booking-blue"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:border-booking-blue"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-800">Rooms</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    disabled={rooms <= 1}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-booking-blue"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{rooms}</span>
                  <button
                    onClick={() => setRooms(rooms + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:border-booking-blue"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Travelling with pets */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-neutral-800">Travelling with pets?</span>
                    <p className="text-xs text-neutral-500">Assistance animals are always welcome</p>
                  </div>
                  <button
                    onClick={() => setTravellingWithPets(!travellingWithPets)}
                    className={`w-12 h-6 rounded-full transition-colors ${travellingWithPets ? 'bg-booking-blue' : 'bg-neutral-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${travellingWithPets ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-200">
              <button
                onClick={() => setShowGuestSelector(false)}
                className="w-full bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Types Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Holiday rentals for every kind of trip
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {propertyTypes.map((type) => (
            <Link
              key={type.name}
              to={`/search?type=${encodeURIComponent(type.name.toLowerCase())}&entire_home=true`}
              className="group p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-center"
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <h3 className="font-bold text-neutral-800 group-hover:text-booking-blue transition-colors">
                {type.name}
              </h3>
              <p className="text-sm text-neutral-500">{type.count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Homes Guests Love */}
      <div className="bg-neutral-50 py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Homes guests love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homesGuestsLove.map((home) => (
              <Link
                key={home.name}
                to={`/search?destination=${encodeURIComponent(home.location)}&entire_home=true`}
                className="group bg-white rounded-lg shadow-card hover:shadow-card-hover overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={home.image}
                    alt={home.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-800">{home.name}</h3>
                  <p className="text-sm text-neutral-500">{home.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-booking-blue text-white text-sm font-bold px-2 py-1 rounded">
                      {home.rating}
                    </span>
                    <span className="text-sm text-neutral-600">{home.reviews} reviews</span>
                  </div>
                  <p className="mt-2 text-neutral-800">
                    From <span className="font-bold">${home.price}</span> per night
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Countries */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Feel at home wherever you go
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCountries.map((country) => (
            <Link
              key={country.name}
              to={`/search?destination=${encodeURIComponent(country.name)}&entire_home=true`}
              className="group relative rounded-lg overflow-hidden aspect-[16/9] shadow-card hover:shadow-card-hover"
            >
              <img
                src={country.image}
                alt={country.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-xl">{country.name}</h3>
                <p className="text-white/80">{country.rentals} holiday rentals</p>
                <button className="mt-2 px-4 py-1 bg-white text-booking-blue font-medium rounded text-sm hover:bg-neutral-100 transition-colors">
                  Explore
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How Does It Work */}
      <div className="bg-neutral-50 py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            How does it work?
          </h2>
          <div className="space-y-4">
            {howItWorksFAQ.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-neutral-800">{item.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 text-neutral-600 transform transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}
                  >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                  </svg>
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-neutral-600">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Made Easy */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">
          Booking made easy
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {trustSignals.map((signal, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{signal.icon}</div>
              <h3 className="font-bold text-neutral-800 mb-2">{signal.title}</h3>
              <p className="text-neutral-600">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
