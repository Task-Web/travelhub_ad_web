import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Top destinations in UK
const topDestinations = [
  {
    id: 'london',
    name: 'London',
    characteristic: 'Historic landmarks',
    hotels: 16513,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
  },
  {
    id: 'manchester',
    name: 'Manchester',
    characteristic: 'Sports & nightlife',
    hotels: 1245,
    image: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=400&h=300&fit=crop',
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh',
    characteristic: 'Castle & culture',
    hotels: 2134,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop',
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    characteristic: 'Music & museums',
    hotels: 876,
    image: 'https://images.unsplash.com/photo-1558459654-c430be0ae1d9?w=400&h=300&fit=crop',
  },
  {
    id: 'birmingham',
    name: 'Birmingham',
    characteristic: 'Cultural diversity',
    hotels: 1456,
    image: 'https://images.unsplash.com/photo-1567359781514-3b964ea46b79?w=400&h=300&fit=crop',
  },
  {
    id: 'bristol',
    name: 'Bristol',
    characteristic: 'Street art & harbours',
    hotels: 654,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
];

// Popular regions
const popularRegions = [
  { name: 'England', hotels: 125678 },
  { name: 'Greater London', hotels: 16513 },
  { name: 'Scotland', hotels: 12456 },
  { name: 'Wales', hotels: 8765 },
  { name: 'Northern Ireland', hotels: 3456 },
  { name: 'South East England', hotels: 18234 },
  { name: 'North West England', hotels: 14567 },
  { name: 'Yorkshire', hotels: 11234 },
];

// UK Airports
const ukAirports = [
  { code: 'LHR', name: 'London Heathrow Airport', hotels: 245 },
  { code: 'LGW', name: 'London Gatwick Airport', hotels: 189 },
  { code: 'MAN', name: 'Manchester Airport', hotels: 156 },
  { code: 'STN', name: 'London Stansted Airport', hotels: 98 },
  { code: 'EDI', name: 'Edinburgh Airport', hotels: 87 },
  { code: 'BHX', name: 'Birmingham Airport', hotels: 76 },
  { code: 'GLA', name: 'Glasgow Airport', hotels: 65 },
  { code: 'LTN', name: 'London Luton Airport', hotels: 54 },
  { code: 'BRS', name: 'Bristol Airport', hotels: 43 },
  { code: 'NCL', name: 'Newcastle Airport', hotels: 38 },
  { code: 'LPL', name: 'Liverpool John Lennon Airport', hotels: 32 },
  { code: 'LBA', name: 'Leeds Bradford Airport', hotels: 28 },
];

// Top picks for hotels
const topHotels = [
  {
    id: '1',
    name: 'The Savoy',
    location: 'London',
    rating: 10,
    ratingLabel: 'Exceptional',
    reviews: 3245,
    price: 450,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'The Balmoral',
    location: 'Edinburgh',
    rating: 9.8,
    ratingLabel: 'Exceptional',
    reviews: 2156,
    price: 380,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'The Lowry Hotel',
    location: 'Manchester',
    rating: 9.5,
    ratingLabel: 'Exceptional',
    reviews: 1876,
    price: 220,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Titanic Hotel Liverpool',
    location: 'Liverpool',
    rating: 9.2,
    ratingLabel: 'Superb',
    reviews: 1234,
    price: 175,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
  },
];

export default function UKHotelsPage() {
  const navigate = useNavigate();

  // Search form state
  const [destination, setDestination] = useState('United Kingdom');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [travellingWithPets, setTravellingWithPets] = useState(false);
  const [travellingForWork, setTravellingForWork] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('destination', destination || 'United Kingdom');
    if (checkInDate) params.set('checkin', checkInDate.toISOString().split('T')[0]);
    if (checkOutDate) params.set('checkout', checkOutDate.toISOString().split('T')[0]);
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());
    if (travellingWithPets) params.set('pets', 'true');
    if (travellingForWork) params.set('work', 'true');
    navigate(`/search?${params.toString()}`);
  };

  const handleCityClick = (cityId: string) => {
    navigate(`/city/gb/${cityId}`);
  };

  const handleRegionClick = (regionName: string) => {
    navigate(`/search?destination=${encodeURIComponent(regionName)}`);
  };

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleAirportClick = (airportName: string) => {
    navigate(`/search?destination=${encodeURIComponent(airportName)}&type=airport`);
  };

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

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

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
          backgroundImage: 'url(https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&h=600&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Hotels in the United Kingdom</h1>
          <p className="text-white/90 text-lg mb-8">172,713 hotels available</p>

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
                          <p className="text-sm text-neutral-500">Assistance animals aren&apos;t considered pets.</p>
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

            {/* Travelling for work checkbox */}
            <div className="mt-2 px-3">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-700">
                <input
                  type="checkbox"
                  checked={travellingForWork}
                  onChange={(e) => setTravellingForWork(e.target.checked)}
                  className="w-4 h-4 text-booking-blue rounded"
                />
                <span>I&apos;m travelling for work</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Map View */}
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-2 flex justify-between items-center">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/" className="text-booking-blue-light hover:underline">Hotels</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">United Kingdom</span>
          </nav>
          <Link
            to="/search?destination=United%20Kingdom&view=map"
            className="flex items-center gap-1 text-sm text-booking-blue-light hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z" />
            </svg>
            Map view
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-8">
        {/* Top Destinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Top destinations for United Kingdom city trips</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topDestinations.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCityClick(city.id)}
                className="rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group"
              >
                <div className="relative h-32">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-bold text-neutral-800">{city.name}</h3>
                  <p className="text-sm text-neutral-500">{city.characteristic}</p>
                  <p className="text-sm text-neutral-600 mt-1">{city.hotels.toLocaleString()} hotels</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Regions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Hotels in the most popular regions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularRegions.map((region) => (
              <button
                key={region.name}
                onClick={() => handleRegionClick(region.name)}
                className="text-left p-4 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
              >
                <p className="font-medium text-booking-blue-light hover:underline">{region.name}</p>
                <p className="text-sm text-neutral-500">{region.hotels.toLocaleString()} hotels</p>
              </button>
            ))}
          </div>
        </section>

        {/* Airport Hotels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Hotels near UK airports</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ukAirports.map((airport) => (
              <button
                key={airport.code}
                onClick={() => handleAirportClick(airport.name)}
                className="text-left p-4 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                  <span className="font-bold text-neutral-500">{airport.code}</span>
                </div>
                <p className="font-medium text-booking-blue-light hover:underline">{airport.name}</p>
                <p className="text-sm text-neutral-500">{airport.hotels} hotels</p>
              </button>
            ))}
          </div>
        </section>

        {/* Top Picks for Hotels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Top picks for hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => handleHotelClick(hotel.id)}
                className="rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#003580] text-white font-bold px-2 py-1 rounded">
                    {hotel.rating}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-neutral-800">{hotel.name}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{hotel.location}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium text-neutral-700">{hotel.ratingLabel}</span>
                    <span className="text-sm text-neutral-500">. {hotel.reviews.toLocaleString()} reviews</span>
                  </div>
                  <p className="text-neutral-800">
                    From <span className="font-bold">EUR {hotel.price}</span> <span className="text-sm text-neutral-500">per night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Most Booked Hotels */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Most booked hotels in the United Kingdom</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topHotels.slice().reverse().map((hotel) => (
              <div
                key={`booked-${hotel.id}`}
                onClick={() => handleHotelClick(hotel.id)}
                className="rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#003580] text-white font-bold px-2 py-1 rounded">
                    {hotel.rating}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-neutral-800">{hotel.name}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{hotel.location}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium text-neutral-700">{hotel.ratingLabel}</span>
                    <span className="text-sm text-neutral-500">. {hotel.reviews.toLocaleString()} reviews</span>
                  </div>
                  <p className="text-neutral-800">
                    From <span className="font-bold">EUR {hotel.price}</span> <span className="text-sm text-neutral-500">per night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
