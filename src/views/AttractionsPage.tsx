import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, addMonths, startOfWeek, endOfWeek } from 'date-fns';

const nearbyDestinations = [
  { id: 'london', name: 'London', country: 'United Kingdom', activities: 742, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { id: 'liverpool', name: 'Liverpool', country: 'United Kingdom', activities: 156, image: 'https://images.unsplash.com/photo-1560428469-8f88dd79f800?w=400&h=300&fit=crop' },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', activities: 234, image: 'https://images.unsplash.com/photo-1506377585622-bedcbb5f9b9a?w=400&h=300&fit=crop' },
  { id: 'southampton', name: 'Southampton', country: 'United Kingdom', activities: 89, image: 'https://images.unsplash.com/photo-1563463224937-4a8c90cfb3b9?w=400&h=300&fit=crop' },
  { id: 'manchester', name: 'Manchester', country: 'United Kingdom', activities: 187, image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop' },
  { id: 'birmingham', name: 'Birmingham', country: 'United Kingdom', activities: 142, image: 'https://images.unsplash.com/photo-1589889847023-9fb0efb7e2c6?w=400&h=300&fit=crop' },
];

const regionData: Record<string, { name: string; activities: number }[]> = {
  Europe: [
    { name: 'London', activities: 742 },
    { name: 'Istanbul', activities: 468 },
    { name: 'Paris', activities: 534 },
    { name: 'Rome', activities: 387 },
    { name: 'Barcelona', activities: 428 },
    { name: 'Amsterdam', activities: 312 },
    { name: 'Prague', activities: 256 },
    { name: 'Berlin', activities: 289 },
  ],
  'North America': [
    { name: 'New York', activities: 892 },
    { name: 'Las Vegas', activities: 534 },
    { name: 'Los Angeles', activities: 467 },
    { name: 'San Francisco', activities: 345 },
    { name: 'Miami', activities: 287 },
    { name: 'Orlando', activities: 423 },
    { name: 'Chicago', activities: 234 },
    { name: 'Toronto', activities: 198 },
  ],
  Asia: [
    { name: 'Tokyo', activities: 567 },
    { name: 'Bangkok', activities: 489 },
    { name: 'Singapore', activities: 345 },
    { name: 'Hong Kong', activities: 312 },
    { name: 'Dubai', activities: 423 },
    { name: 'Seoul', activities: 267 },
    { name: 'Bali', activities: 234 },
    { name: 'Beijing', activities: 189 },
  ],
  Africa: [
    { name: 'Cape Town', activities: 234 },
    { name: 'Marrakech', activities: 187 },
    { name: 'Cairo', activities: 156 },
    { name: 'Nairobi', activities: 123 },
  ],
  Oceania: [
    { name: 'Sydney', activities: 345 },
    { name: 'Melbourne', activities: 287 },
    { name: 'Auckland', activities: 156 },
    { name: 'Queenstown', activities: 98 },
  ],
  'Middle East': [
    { name: 'Dubai', activities: 423 },
    { name: 'Abu Dhabi', activities: 234 },
    { name: 'Jerusalem', activities: 187 },
    { name: 'Amman', activities: 89 },
  ],
  Caribbean: [
    { name: 'Nassau', activities: 156 },
    { name: 'Punta Cana', activities: 187 },
    { name: 'Montego Bay', activities: 134 },
    { name: 'San Juan', activities: 167 },
  ],
  'South America': [
    { name: 'Rio de Janeiro', activities: 287 },
    { name: 'Buenos Aires', activities: 234 },
    { name: 'Lima', activities: 167 },
    { name: 'Cusco', activities: 189 },
  ],
  'Central America': [
    { name: 'Cancun', activities: 312 },
    { name: 'Mexico City', activities: 267 },
    { name: 'San Jose', activities: 98 },
    { name: 'Panama City', activities: 87 },
  ],
};

const regions = Object.keys(regionData);

const categoryData: Record<string, string[]> = {
  Tours: ['Cultural tours', 'Crime tours', 'Historical tours', 'Walking tours', 'Ghost tours', 'Night tours', 'Art tours', 'Food tours'],
  'City tours': ['Hop-on hop-off bus', 'Sightseeing tours', 'Walking tours', 'Bike tours', 'Segway tours'],
  Museums: ['Art museums', 'History museums', 'Science museums', 'Natural history', 'War museums'],
  'Travel services': ['Airport transfers', 'City cards', 'Travel insurance', 'Currency exchange'],
  Entertainment: ['Shows', 'Concerts', 'Sports events', 'Theme parks', 'Casinos'],
  'Food & drinks': ['Food tours', 'Wine tasting', 'Cooking classes', 'Pub crawls', 'Market tours'],
};

const categories = Object.keys(categoryData).map(name => ({
  name,
  icon: name === 'Tours' ? '🚶' : name === 'City tours' ? '🏙️' : name === 'Museums' ? '🏛️' : name === 'Travel services' ? '✈️' : name === 'Entertainment' ? '🎭' : '🍽️',
}));

const featuredAttractions = [
  {
    id: '1',
    name: 'The London Eye',
    location: 'London',
    rating: 4.5,
    reviews: 12543,
    price: 32,
    image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=300&fit=crop',
    duration: '30 minutes',
    freeCancellation: true,
    bestSeller: true,
  },
  {
    id: '2',
    name: 'Tower of London',
    location: 'London',
    rating: 4.7,
    reviews: 8932,
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400&h=300&fit=crop',
    duration: '2-3 hours',
    freeCancellation: true,
    bestSeller: false,
  },
  {
    id: '3',
    name: 'Westminster Abbey',
    location: 'London',
    rating: 4.6,
    reviews: 5421,
    price: 24,
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop',
    duration: '1-2 hours',
    freeCancellation: true,
    bestSeller: false,
  },
  {
    id: '4',
    name: 'Harry Potter Studio Tour',
    location: 'Watford',
    rating: 4.9,
    reviews: 23456,
    price: 51.50,
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=300&fit=crop',
    duration: '4-5 hours',
    freeCancellation: false,
    bestSeller: true,
  },
];

export default function AttractionsPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<{ id: string; name: string; country: string } | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('Europe');
  const [selectedCategory, setSelectedCategory] = useState('Tours');
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const destinationRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDestinationSelect = (dest: { id: string; name: string; country: string }) => {
    setSelectedDestination(dest);
    setDestination(dest.name);
    setShowDestinationDropdown(false);
    // Auto-open date picker after destination selection
    setShowDatePicker(true);
  };

  const handleClearDestination = () => {
    setDestination('');
    setSelectedDestination(null);
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDestination) {
      params.set('dest_id', selectedDestination.id);
      params.set('dest_name', selectedDestination.name);
    } else if (destination) {
      params.set('dest_name', destination);
    }
    if (date) {
      params.set('start_date', format(date, 'yyyy-MM-dd'));
      params.set('end_date', format(date, 'yyyy-MM-dd'));
    }

    navigate(`/attractions/searchresults.en-gb.html?${params.toString()}`);
  };

  const handleNearbyDestinationClick = (dest: { id: string; name: string; country: string }) => {
    const params = new URLSearchParams();
    params.set('dest_id', dest.id);
    params.set('dest_name', dest.name);
    navigate(`/attractions/searchresults.en-gb.html?${params.toString()}`);
  };

  // Calendar helpers
  const today = new Date();
  const nextMonth = addMonths(currentMonth, 1);

  const getDaysInMonth = (monthDate: Date) => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const isDateDisabled = (dateToCheck: Date) => {
    return isBefore(dateToCheck, today) && !isSameDay(dateToCheck, today);
  };

  const filteredDestinations = nearbyDestinations.filter(dest =>
    dest.name.toLowerCase().includes(destination.toLowerCase()) ||
    dest.country.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Attractions, activities and experiences
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover new attractions and experiences to match your interests and travel style
          </p>

          {/* Search Form */}
          <div className="bg-yellow-400 rounded-lg p-1">
            <div className="bg-white rounded-lg p-4 flex flex-wrap gap-4">
              {/* Destination Input */}
              <div className="flex-1 min-w-[200px] relative" ref={destinationRef}>
                <label className="block text-xs text-neutral-500 mb-1">Where are you going?</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setSelectedDestination(null);
                      setShowDestinationDropdown(true);
                    }}
                    onFocus={() => setShowDestinationDropdown(true)}
                    placeholder="Destination, attraction"
                    className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                  />
                  {destination && (
                    <button
                      onClick={handleClearDestination}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      aria-label="Clear destination"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Destination Dropdown */}
                {showDestinationDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200">
                      <span className="text-xs text-neutral-500 font-medium">Nearby destinations</span>
                    </div>
                    {filteredDestinations.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => handleDestinationSelect(dest)}
                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 border-b border-neutral-100 last:border-b-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div>
                          <div className="font-medium text-neutral-800">{dest.name}</div>
                          <div className="text-sm text-neutral-500">{dest.country}</div>
                        </div>
                      </button>
                    ))}
                    {filteredDestinations.length === 0 && (
                      <div className="px-4 py-3 text-neutral-500 text-sm">No destinations found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Date Input */}
              <div className="min-w-[200px] relative" ref={datePickerRef}>
                <label className="block text-xs text-neutral-500 mb-1">Select date</label>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light text-left flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  <span className={date ? 'text-neutral-800' : 'text-neutral-400'}>
                    {date ? format(date, 'EEE, d MMM yyyy') : 'Select your dates'}
                  </span>
                </button>

                {/* Date Picker Modal */}
                {showDatePicker && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowDatePicker(false)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-[700px] w-full mx-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-neutral-800">Select a date</h3>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="text-neutral-400 hover:text-neutral-600"
                          aria-label="Close"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        {/* Current Month */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                              className="p-1 hover:bg-neutral-100 rounded"
                              disabled={isSameMonth(currentMonth, today)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isSameMonth(currentMonth, today) ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <h4 className="font-bold text-neutral-800">{format(currentMonth, 'MMMM yyyy')}</h4>
                            <div className="w-5"></div>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <div key={day} className="text-xs text-neutral-500 font-medium py-1">{day}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth(currentMonth).map((day, idx) => {
                              const disabled = isDateDisabled(day) || !isSameMonth(day, currentMonth);
                              const isSelected = date && isSameDay(day, date);
                              const isToday = isSameDay(day, today);

                              return (
                                <button
                                  key={idx}
                                  onClick={() => !disabled && handleDateSelect(day)}
                                  disabled={disabled}
                                  className={`py-2 text-sm rounded transition-colors ${
                                    !isSameMonth(day, currentMonth)
                                      ? 'text-transparent cursor-default'
                                      : disabled
                                      ? 'text-neutral-300 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-booking-blue text-white'
                                      : isToday
                                      ? 'bg-booking-blue-light text-white'
                                      : 'text-neutral-800 hover:bg-booking-blue/10'
                                  }`}
                                >
                                  {format(day, 'd')}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Next Month */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-5"></div>
                            <h4 className="font-bold text-neutral-800">{format(nextMonth, 'MMMM yyyy')}</h4>
                            <button
                              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                              className="p-1 hover:bg-neutral-100 rounded"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <div key={day} className="text-xs text-neutral-500 font-medium py-1">{day}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth(nextMonth).map((day, idx) => {
                              const disabled = isDateDisabled(day) || !isSameMonth(day, nextMonth);
                              const isSelected = date && isSameDay(day, date);
                              const isToday = isSameDay(day, today);

                              return (
                                <button
                                  key={idx}
                                  onClick={() => !disabled && handleDateSelect(day)}
                                  disabled={disabled}
                                  className={`py-2 text-sm rounded transition-colors ${
                                    !isSameMonth(day, nextMonth)
                                      ? 'text-transparent cursor-default'
                                      : disabled
                                      ? 'text-neutral-300 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-booking-blue text-white'
                                      : isToday
                                      ? 'bg-booking-blue-light text-white'
                                      : 'text-neutral-800 hover:bg-booking-blue/10'
                                  }`}
                                >
                                  {format(day, 'd')}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="bg-booking-blue text-white font-bold px-8 py-3 rounded hover:bg-booking-blue-hover transition-colors self-end"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Destinations */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Nearby destinations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {nearbyDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleNearbyDestinationClick(dest)}
              className="group relative rounded-lg overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                <p className="text-white/80 text-sm">{dest.activities} activities</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by Region */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Explore more destinations
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedRegion === region
                    ? 'bg-booking-blue text-white'
                    : 'bg-white text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regionData[selectedRegion].map((city) => (
              <button
                key={city.name}
                onClick={() => navigate(`/attractions/searchresults.en-gb.html?dest_name=${encodeURIComponent(city.name)}`)}
                className="bg-white p-4 rounded-lg shadow-card hover:shadow-card-hover transition-shadow text-left"
              >
                <div className="font-medium text-neutral-800">{city.name}</div>
                <div className="text-sm text-neutral-500">{city.activities} activities</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Browse by Category - Popular things to do */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Popular things to do
        </h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-booking-blue text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryData[selectedCategory].map((activity) => (
            <button
              key={activity}
              onClick={() => navigate(`/attractions/searchresults.en-gb.html?category=${encodeURIComponent(activity)}`)}
              className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-left"
            >
              <div className="font-medium text-neutral-800">{activity}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Attractions */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Featured attractions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredAttractions.map((attraction) => (
              <div
                key={attraction.id}
                onClick={() => navigate(`/attractions/detail/${attraction.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-48 object-cover"
                  />
                  {attraction.bestSeller && (
                    <span className="absolute top-2 left-2 bg-booking-blue text-white text-xs font-bold px-2 py-1 rounded">
                      Best seller
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-800 mb-1 hover:text-booking-blue">{attraction.name}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{attraction.location}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{attraction.rating}</span>
                    <span className="text-neutral-500">({attraction.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-2">{attraction.duration}</p>
                  {attraction.freeCancellation && (
                    <p className="text-sm text-success mb-2">Free cancellation</p>
                  )}
                  <p className="font-bold text-neutral-800">
                    From EUR {attraction.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
