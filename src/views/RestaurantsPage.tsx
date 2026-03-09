import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';

const popularCuisines = [
  { id: 'italian', name: 'Italian', icon: '🍝', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&h=300&fit=crop', restaurants: 2450 },
  { id: 'japanese', name: 'Japanese', icon: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', restaurants: 1820 },
  { id: 'chinese', name: 'Chinese', icon: '🥡', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', restaurants: 2180 },
  { id: 'indian', name: 'Indian', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', restaurants: 1560 },
  { id: 'mexican', name: 'Mexican', icon: '🌮', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop', restaurants: 1340 },
  { id: 'thai', name: 'Thai', icon: '🍜', image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop', restaurants: 980 },
  { id: 'french', name: 'French', icon: '🥐', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', restaurants: 1120 },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🫒', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', restaurants: 1650 },
];

const featuredRestaurants = [
  {
    id: '1',
    name: 'La Petite Maison',
    cuisine: 'French',
    rating: 4.8,
    reviews: 1245,
    priceLevel: '££££',
    location: 'Mayfair, London',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '2',
    name: 'Nobu London',
    cuisine: 'Japanese',
    rating: 4.7,
    reviews: 2156,
    priceLevel: '££££',
    location: 'Old Park Lane, London',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '3',
    name: 'Dishoom',
    cuisine: 'Indian',
    rating: 4.6,
    reviews: 3421,
    priceLevel: '££',
    location: 'Covent Garden, London',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    featured: false,
  },
  {
    id: '4',
    name: 'Padella',
    cuisine: 'Italian',
    rating: 4.5,
    reviews: 2890,
    priceLevel: '££',
    location: 'Borough Market, London',
    image: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=400&h=300&fit=crop',
    featured: false,
  },
  {
    id: '5',
    name: 'The Ivy',
    cuisine: 'British',
    rating: 4.4,
    reviews: 1876,
    priceLevel: '£££',
    location: 'West Street, London',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '6',
    name: 'Barrafina',
    cuisine: 'Spanish',
    rating: 4.6,
    reviews: 1543,
    priceLevel: '£££',
    location: 'Dean Street, London',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop',
    featured: false,
  },
];

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function RestaurantsPage() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search results
    console.log('Searching for restaurants:', { location, date, time, partySize });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">Restaurant Reservations</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Restaurant Reservations
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Discover and book the best restaurants through our partnership with OpenTable.
            Find the perfect table for any occasion, from casual dining to fine cuisine.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-yellow-400 rounded-lg p-1">
            <div className="bg-white rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Location Input */}
                <div className="lg:col-span-2">
                  <label className="block text-xs text-neutral-500 mb-1">Location or restaurant</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, neighborhood, or restaurant"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                    />
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Date</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2">
                      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                    />
                  </div>
                </div>

                {/* Time Dropdown */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Time</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light appearance-none bg-white"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Party Size Dropdown */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Party size</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2">
                      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                      <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                    </svg>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light appearance-none bg-white"
                    >
                      {partySizes.map((size) => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-booking-blue text-white font-bold px-8 py-3 rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Find a table
                </button>
              </div>
            </div>
          </form>

          {/* OpenTable Partnership Badge */}
          <div className="mt-6 flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">Powered by OpenTable</span>
            </div>
            <span className="text-white/70 text-sm">Over 60,000 restaurants worldwide</span>
          </div>
        </div>
      </div>

      {/* Popular Cuisines Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Popular cuisines
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularCuisines.map((cuisine) => (
            <button
              key={cuisine.id}
              className="group relative rounded-lg overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-shadow"
            >
              <img
                src={cuisine.image}
                alt={cuisine.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{cuisine.icon}</span>
                  <h3 className="text-white font-bold text-lg">{cuisine.name}</h3>
                </div>
                <p className="text-white/80 text-sm">{cuisine.restaurants.toLocaleString()} restaurants</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Featured restaurants
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {restaurant.featured && (
                    <span className="absolute top-3 left-3 bg-booking-blue text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-neutral-800 text-lg hover:text-booking-blue cursor-pointer">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-neutral-500">{restaurant.cuisine} cuisine</p>
                    </div>
                    <span className="text-neutral-600 font-medium">{restaurant.priceLevel}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-3 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {restaurant.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="bg-booking-blue text-white text-sm font-bold px-2 py-1 rounded">
                        {restaurant.rating}
                      </span>
                      <span className="text-sm text-neutral-500">
                        ({restaurant.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    <button className="bg-booking-blue text-white font-medium px-4 py-2 rounded hover:bg-booking-blue-hover transition-colors text-sm">
                      Book now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OpenTable Partnership Info */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <div className="bg-booking-blue/5 border border-booking-blue/20 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-booking-blue rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-neutral-800 mb-2">
            OpenTable Partnership
          </h3>
          <p className="text-neutral-600 max-w-2xl mx-auto mb-4">
            We have partnered with OpenTable to bring you access to over 60,000 restaurants worldwide.
            Enjoy seamless reservations, verified reviews, and exclusive dining experiences all in one place.
          </p>
          <div className="flex justify-center gap-8 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Free cancellation
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Instant confirmation
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Verified reviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
