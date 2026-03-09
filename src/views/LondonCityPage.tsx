import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Mock hotel data for London
const londonHotels = [
  {
    id: '1',
    name: 'The Savoy',
    type: 'Hotel',
    starRating: 5,
    location: 'Westminster Borough, London',
    district: 'Westminster',
    distance: '0.5 km from centre',
    description: 'Iconic luxury hotel on the Strand with Art Deco interiors, Thames views, and world-class dining.',
    fullDescription: 'The Savoy is one of London\'s most iconic hotels, located on the Strand with breathtaking views of the Thames. This legendary 5-star property features stunning Art Deco interiors, multiple award-winning restaurants, a world-class spa, and impeccable service.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    reviewScore: 9.2,
    reviewCount: 3245,
    reviewLabel: 'Superb',
    price: 450,
    originalPrice: 520,
    freeCancellation: true,
    breakfastIncluded: true,
    geniusDiscount: true,
    preferredPartner: true,
  },
  {
    id: '2',
    name: 'Premier Inn London City',
    type: 'Hotel',
    starRating: 3,
    location: 'City of London',
    district: 'City of London',
    distance: '1.2 km from centre',
    description: 'Modern hotel with comfortable rooms, restaurant, and excellent transport links near Tower Bridge.',
    fullDescription: 'Premier Inn London City offers modern, comfortable accommodation in the heart of the City of London. The hotel features spacious rooms with comfortable beds, en-suite bathrooms, and all essential amenities.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    reviewScore: 8.1,
    reviewCount: 5678,
    reviewLabel: 'Very good',
    price: 95,
    originalPrice: null,
    freeCancellation: true,
    breakfastIncluded: false,
    geniusDiscount: false,
    preferredPartner: false,
  },
  {
    id: '3',
    name: 'Luxury Apartment Covent Garden',
    type: 'Apartment',
    starRating: null,
    location: 'Covent Garden, London',
    district: 'Covent Garden',
    distance: '0.3 km from centre',
    description: 'Stylish 2-bedroom apartment with modern amenities in the heart of London\'s theatre district.',
    fullDescription: 'This stylish 2-bedroom apartment is located in the vibrant Covent Garden area, perfect for families or groups.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    reviewScore: 9.0,
    reviewCount: 234,
    reviewLabel: 'Superb',
    price: 180,
    originalPrice: null,
    freeCancellation: true,
    breakfastIncluded: false,
    geniusDiscount: true,
    preferredPartner: false,
  },
  {
    id: '4',
    name: 'Hilton London Tower Bridge',
    type: 'Hotel',
    starRating: 4,
    location: 'Southwark, London',
    district: 'Southwark',
    distance: '2.1 km from centre',
    description: 'Contemporary hotel near Tower Bridge with rooftop bar and stunning city views.',
    fullDescription: 'Hilton London Tower Bridge is a contemporary 4-star hotel offering stunning views of Tower Bridge and the River Thames.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    reviewScore: 8.5,
    reviewCount: 4521,
    reviewLabel: 'Very good',
    price: 175,
    originalPrice: 210,
    freeCancellation: true,
    breakfastIncluded: true,
    geniusDiscount: false,
    preferredPartner: true,
  },
  {
    id: '5',
    name: 'The Ritz London',
    type: 'Hotel',
    starRating: 5,
    location: 'Piccadilly, London',
    district: 'Piccadilly',
    distance: '0.8 km from centre',
    description: 'Legendary luxury hotel with opulent Louis XVI interiors, afternoon tea, and Michelin dining.',
    fullDescription: 'The Ritz London is a legendary 5-star hotel offering the finest in British hospitality with opulent Louis XVI interiors.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
    reviewScore: 9.5,
    reviewCount: 2156,
    reviewLabel: 'Exceptional',
    price: 650,
    originalPrice: 750,
    freeCancellation: true,
    breakfastIncluded: true,
    geniusDiscount: true,
    preferredPartner: true,
  },
];

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

export default function LondonCityPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('top-picks');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [minReview, setMinReview] = useState<number | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  // Search form state
  const [destination, setDestination] = useState('London');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [travellingWithPets, setTravellingWithPets] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [flexibleDays, setFlexibleDays] = useState<'exact' | '1' | '2' | '3' | '7'>('exact');

  const toggleDescription = (propertyId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter((s) => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  const navigateToProperty = (propertyId: string) => {
    navigate(`/hotel/${propertyId}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('destination', destination);
    if (checkInDate) params.set('checkin', checkInDate.toISOString().split('T')[0]);
    if (checkOutDate) params.set('checkout', checkOutDate.toISOString().split('T')[0]);
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());
    if (travellingWithPets) params.set('pets', 'true');
    navigate(`/search?${params.toString()}`);
  };

  const handleSortClick = (sortValue: string) => {
    setSortBy(sortValue);
    // Navigate to search results with sort applied
    navigate(`/search?destination=London&sort=${sortValue}`);
  };

  const filteredHotels = londonHotels.filter((hotel) => {
    if (selectedStars.length > 0 && hotel.starRating && !selectedStars.includes(hotel.starRating)) {
      return false;
    }
    if (minReview && hotel.reviewScore < minReview) {
      return false;
    }
    return true;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
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

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getDateDisplay = () => {
    if (checkInDate && checkOutDate) {
      return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
    }
    return 'Check-in - Check-out';
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const isSelectedDate = (date: Date) => {
    if (checkInDate && date.toDateString() === checkInDate.toDateString()) return true;
    if (checkOutDate && date.toDateString() === checkOutDate.toDateString()) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (date > checkInDate) {
      setCheckOutDate(date);
      setShowCalendar(false);
    } else {
      setCheckInDate(date);
    }
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const renderCalendarMonth = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = getFirstDayOfMonth(monthDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const isPast = isPastDate(date);
      const isSelected = isSelectedDate(date);
      const isRange = isInRange(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={isPast}
          className={`h-10 w-10 rounded-full text-sm transition-colors ${
            isPast
              ? 'text-neutral-300 cursor-not-allowed'
              : isSelected
              ? 'bg-booking-blue text-white'
              : isRange
              ? 'bg-booking-blue/20 text-booking-blue'
              : 'hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[400px]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&h=600&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Search hotels in London</h1>
          <p className="text-white/90 text-lg mb-8">16,513 hotels available</p>

          {/* Search Form */}
          <div className="bg-[#ffb700] p-1 rounded-lg">
            <div className="bg-white rounded-md p-3 flex flex-wrap gap-2 items-center">
              {/* Destination */}
              <div className="flex-1 min-w-[200px] relative">
                <div className="flex items-center gap-2 border border-neutral-300 rounded px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm-10 8H5v-2h4v2zm2-8H5V5h6v2z" />
                  </svg>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="flex-1 outline-none text-neutral-800"
                  />
                  {destination && (
                    <button
                      onClick={() => setDestination('')}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Date Picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowCalendar(!showCalendar); setShowGuests(false); }}
                  className="flex items-center gap-2 border border-neutral-300 rounded px-3 py-2 min-w-[250px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                  </svg>
                  <span className="text-neutral-700">{getDateDisplay()}</span>
                </button>

                {/* Calendar Modal */}
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[600px]">
                    {/* Flexible Days */}
                    <div className="mb-4 pb-4 border-b border-neutral-200">
                      <p className="text-sm text-neutral-600 mb-2">Date flexibility</p>
                      <div className="flex gap-2">
                        {[
                          { value: 'exact' as const, label: 'Exact dates' },
                          { value: '1' as const, label: '+/- 1 day' },
                          { value: '2' as const, label: '+/- 2 days' },
                          { value: '3' as const, label: '+/- 3 days' },
                          { value: '7' as const, label: '+/- 7 days' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFlexibleDays(option.value)}
                            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                              flexibleDays === option.value
                                ? 'bg-booking-blue text-white border-booking-blue'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-booking-blue-light'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="p-2 hover:bg-neutral-100 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                      </button>
                      <span className="font-medium">
                        {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        {' - '}
                        {nextMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="p-2 hover:bg-neutral-100 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </button>
                    </div>

                    {/* Two Month Calendar */}
                    <div className="flex gap-8">
                      {/* Current Month */}
                      <div className="flex-1">
                        <h3 className="text-center font-medium mb-2">
                          {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-neutral-500 mb-2">
                          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {renderCalendarMonth(currentMonth)}
                        </div>
                      </div>

                      {/* Next Month */}
                      <div className="flex-1">
                        <h3 className="text-center font-medium mb-2">
                          {nextMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-neutral-500 mb-2">
                          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {renderCalendarMonth(nextMonth)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowGuests(!showGuests); setShowCalendar(false); }}
                  className="flex items-center gap-2 border border-neutral-300 rounded px-3 py-2 min-w-[200px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span className="text-neutral-700">{adults} adults . {children} children . {rooms} room</span>
                </button>

                {/* Guest Modal */}
                {showGuests && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
                    {/* Adults */}
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-800">Adults</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            adults <= 1 ? 'border-neutral-200 text-neutral-300' : 'border-booking-blue text-booking-blue hover:bg-booking-blue/10'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <button
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full border border-booking-blue text-booking-blue hover:bg-booking-blue/10 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-800">Children</p>
                        <p className="text-sm text-neutral-500">Ages 0-17</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            children <= 0 ? 'border-neutral-200 text-neutral-300' : 'border-booking-blue text-booking-blue hover:bg-booking-blue/10'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <button
                          onClick={() => setChildren(children + 1)}
                          className="w-8 h-8 rounded-full border border-booking-blue text-booking-blue hover:bg-booking-blue/10 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-800">Rooms</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setRooms(Math.max(1, rooms - 1))}
                          disabled={rooms <= 1}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            rooms <= 1 ? 'border-neutral-200 text-neutral-300' : 'border-booking-blue text-booking-blue hover:bg-booking-blue/10'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{rooms}</span>
                        <button
                          onClick={() => setRooms(rooms + 1)}
                          className="w-8 h-8 rounded-full border border-booking-blue text-booking-blue hover:bg-booking-blue/10 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Pets Toggle */}
                    <div className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-800">Travelling with pets?</p>
                          <p className="text-sm text-neutral-500">
                            Assistance animals aren&apos;t considered pets.{' '}
                            <a href="#" className="text-booking-blue-light underline">
                              Read more about travelling with assistance animals
                            </a>
                          </p>
                        </div>
                        <button
                          onClick={() => setTravellingWithPets(!travellingWithPets)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            travellingWithPets ? 'bg-booking-blue' : 'bg-neutral-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                              travellingWithPets ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowGuests(false)}
                      className="w-full mt-4 px-4 py-2 bg-booking-blue text-white rounded font-medium hover:bg-booking-blue-hover transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-booking-blue text-white font-medium rounded hover:bg-booking-blue-hover transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-2">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/" className="text-booking-blue-light hover:underline">Hotels</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/country/gb" className="text-booking-blue-light hover:underline">United Kingdom</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="#" className="text-booking-blue-light hover:underline">Greater London</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">London</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-card overflow-hidden sticky top-24">
              {/* Map Preview */}
              <div className="relative h-48 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop"
                  alt="Map of London"
                  className="w-full h-full object-cover"
                />
                <Link
                  to="/search?destination=London&view=map"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded shadow font-medium text-booking-blue hover:bg-neutral-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z" />
                  </svg>
                  Show hotels on map
                </Link>
              </div>

              {/* Filters */}
              <div className="p-4">
                <h2 className="font-bold text-neutral-800 mb-4">Filter by:</h2>

                {/* Star Rating */}
                <div className="mb-6">
                  <h3 className="font-medium text-neutral-800 mb-3">Star rating</h3>
                  <div className="flex flex-wrap gap-2">
                    {starFilters.map((star) => (
                      <button
                        key={star}
                        onClick={() => toggleStar(star)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                          selectedStars.includes(star)
                            ? 'bg-booking-blue text-white border-booking-blue'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-booking-blue-light'
                        }`}
                      >
                        {star} {star === 1 ? 'star' : 'stars'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Score */}
                <div className="mb-6">
                  <h3 className="font-medium text-neutral-800 mb-3">Review score</h3>
                  <div className="space-y-2">
                    {reviewFilters.map((filter) => (
                      <label key={filter.min} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={minReview === filter.min}
                          onChange={() => setMinReview(minReview === filter.min ? null : filter.min)}
                          className="w-4 h-4 text-booking-blue rounded"
                        />
                        <span className="text-neutral-700">{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sorting Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortClick(option.value)}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                    sortBy === option.value
                      ? 'bg-booking-blue text-white border-booking-blue'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-booking-blue-light'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Hotel Cards */}
            <div className="space-y-4">
              {sortedHotels.map((hotel) => {
                const isExpanded = expandedDescriptions.has(hotel.id);
                return (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
                  >
                    <div className="flex">
                      {/* Image */}
                      <div
                        className="w-64 flex-shrink-0 relative cursor-pointer"
                        onClick={() => navigateToProperty(hotel.id)}
                      >
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover min-h-[200px]"
                        />
                        {hotel.geniusDiscount && (
                          <div className="absolute top-2 left-2 bg-[#004cb8] text-white text-xs font-medium px-2 py-1 rounded">
                            Genius
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            {/* Hotel Name & Stars */}
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="text-lg font-bold text-booking-blue-light hover:underline cursor-pointer"
                                onClick={() => navigateToProperty(hotel.id)}
                              >
                                {hotel.name}
                              </h3>
                              {hotel.starRating && (
                                <span className="flex items-center gap-0.5">
                                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                  ))}
                                </span>
                              )}
                              {hotel.preferredPartner && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded flex items-center gap-1" title="This property is part of our Preferred Partner Programme. It's committed to giving guests positive experiences with excellent service and great value.">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                  Preferred
                                </span>
                              )}
                            </div>

                            {/* Location */}
                            <p className="text-sm text-booking-blue-light mb-2 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              </svg>
                              {hotel.location} - {hotel.distance}
                            </p>

                            {/* Description */}
                            <p className="text-sm text-neutral-600 mb-2">
                              {isExpanded ? hotel.fullDescription : hotel.description}
                            </p>
                            <button
                              onClick={() => toggleDescription(hotel.id)}
                              className="text-sm text-booking-blue-light hover:underline"
                            >
                              {isExpanded ? 'Show less' : 'Show more'}
                            </button>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {hotel.freeCancellation && (
                                <span className="text-xs text-success font-medium">Free cancellation</span>
                              )}
                              {hotel.breakfastIncluded && (
                                <span className="text-xs text-success font-medium">Breakfast included</span>
                              )}
                            </div>
                          </div>

                          {/* Review & Price */}
                          <div className="flex flex-col items-end justify-between ml-4 min-w-[140px]">
                            {/* Review Score */}
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800">{hotel.reviewLabel}</p>
                                  <p className="text-xs text-neutral-500">{hotel.reviewCount.toLocaleString()} reviews</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-white font-bold ${
                                  hotel.reviewScore >= 9 ? 'bg-[#003580]' :
                                  hotel.reviewScore >= 8 ? 'bg-[#003580]' :
                                  'bg-[#003580]'
                                }`}>
                                  {hotel.reviewScore}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right mt-auto">
                              <p className="text-xs text-neutral-500">Price from</p>
                              {hotel.originalPrice && (
                                <p className="text-sm text-neutral-400 line-through">EUR {hotel.originalPrice}</p>
                              )}
                              <p className="text-xl font-bold text-neutral-800">EUR {hotel.price}</p>
                              <p className="text-xs text-neutral-500">1 night, 2 adults</p>
                              <button
                                onClick={() => navigateToProperty(hotel.id)}
                                className="mt-2 px-4 py-2 bg-booking-blue text-white text-sm font-medium rounded hover:bg-booking-blue-hover transition-colors"
                              >
                                Check availability
                              </button>
                            </div>
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
