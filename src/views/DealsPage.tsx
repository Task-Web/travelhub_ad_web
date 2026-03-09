import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface DealCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  offers: number;
  startingPrice: number;
  currency: string;
}

const dealCategories: DealCategory[] = [
  {
    id: 'lunar-new-year',
    name: 'Lunar New Year',
    description: 'Celebrate the Year of the Dragon with special travel deals',
    image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=250&fit=crop',
    offers: 2450,
    startingPrice: 28,
    currency: 'EUR'
  },
  {
    id: 'spring',
    name: 'Spring Escapes',
    description: 'Blossom into adventure with our spring getaway deals',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=250&fit=crop',
    offers: 3200,
    startingPrice: 22,
    currency: 'EUR'
  },
  {
    id: 'easter',
    name: 'Easter Holidays',
    description: 'Family-friendly destinations for the Easter break',
    image: 'https://images.unsplash.com/photo-1457530378978-8bac673b8062?w=400&h=250&fit=crop',
    offers: 1850,
    startingPrice: 35,
    currency: 'EUR'
  },
  {
    id: 'golden-week',
    name: 'Golden Week',
    description: 'Explore Asia during the Golden Week holidays',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=250&fit=crop',
    offers: 1117,
    startingPrice: 45,
    currency: 'EUR'
  },
  {
    id: 'carnival',
    name: 'Carnival Season',
    description: 'Experience the world\'s most vibrant festivals',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=250&fit=crop',
    offers: 980,
    startingPrice: 32,
    currency: 'EUR'
  },
  {
    id: 'valentines',
    name: 'Valentine\'s Day',
    description: 'Romantic getaways for couples',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop',
    offers: 2100,
    startingPrice: 55,
    currency: 'EUR'
  },
  {
    id: 'christmas',
    name: 'Christmas Markets',
    description: 'Discover magical Christmas markets across Europe',
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=250&fit=crop',
    offers: 1560,
    startingPrice: 38,
    currency: 'EUR'
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    description: 'Gather with family for the holiday season',
    image: 'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?w=400&h=250&fit=crop',
    offers: 890,
    startingPrice: 42,
    currency: 'EUR'
  },
  {
    id: 'winter',
    name: 'Winter Escapes',
    description: 'Ski resorts and cozy mountain retreats',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop',
    offers: 2800,
    startingPrice: 15,
    currency: 'EUR'
  },
  {
    id: 'black-friday',
    name: 'Black Friday',
    description: 'The biggest travel deals of the year',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    offers: 5200,
    startingPrice: 19,
    currency: 'EUR'
  }
];

const featuredDestinations = [
  { name: 'Paris', country: 'France', discount: '25%', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop' },
  { name: 'Barcelona', country: 'Spain', discount: '30%', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=200&fit=crop' },
  { name: 'Rome', country: 'Italy', discount: '20%', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&h=200&fit=crop' },
  { name: 'Amsterdam', country: 'Netherlands', discount: '15%', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=200&fit=crop' },
];

export default function DealsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleViewDeals = (categoryId: string) => {
    navigate(`/search?deal=${categoryId}`);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = () => {
    // Reset previous state
    setSubscriptionStatus('idle');
    setErrorMessage('');

    // Validate email
    if (!email.trim()) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Simulate API call - in real app this would be an actual API request
    // For now, we'll just show success
    setSubscriptionStatus('success');
    setEmail(''); // Clear the input on success
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-orange-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Deals</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our seasonal and holiday deals</h1>
          <p className="text-xl text-orange-100 mb-8">
            Discover incredible savings on your next adventure. From festive getaways to seasonal escapes, find the perfect deal for every occasion.
          </p>

          {/* Sign in CTA */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-xl">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Sign in, save money</h3>
                <p className="text-orange-100">Genius members save an extra 10% on top of these deals</p>
              </div>
              <Link
                to="/sign-in"
                className="ml-auto bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Categories */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse deals by category</h2>
          <p className="text-gray-600 mb-8">Choose from our seasonal and holiday promotions</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.offers.toLocaleString()} Offers</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">From</span>
                      <span className="text-lg font-bold text-gray-900 ml-1">
                        {category.currency} {category.startingPrice}
                      </span>
                      <span className="text-sm text-gray-500"> per night</span>
                    </div>
                    <button
                      onClick={() => handleViewDeals(category.id)}
                      className="bg-booking-blue text-white px-4 py-2 rounded-md font-medium hover:bg-booking-blue-hover transition-colors"
                    >
                      View deals
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured destinations with deals</h2>
          <p className="text-gray-600 mb-8">Popular cities with the best savings right now</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination, index) => (
              <div
                key={index}
                onClick={() => navigate(`/search?destination=${destination.name.toLowerCase()}`)}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    Save {destination.discount}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{destination.name}</h3>
                  <p className="text-sm text-gray-600">{destination.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tips to get the best deals</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Book early</h3>
              <p className="text-gray-600">The best deals often sell out quickly. Book early to secure your preferred dates and accommodation.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Set alerts</h3>
              <p className="text-gray-600">Sign up for deal alerts to be notified when prices drop for your favorite destinations.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-booking-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Become a Genius member</h3>
              <p className="text-gray-600">Unlock additional 10-20% savings on top of deal prices with Genius membership.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Never miss a deal</h2>
          <p className="text-xl text-blue-100 mb-6">Subscribe to our newsletter and be the first to know about exclusive offers</p>

          {subscriptionStatus === 'success' ? (
            <div className="max-w-md mx-auto">
              <div className="bg-green-500 text-white px-6 py-4 rounded-md flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-bold">Thank you for subscribing! You&apos;ll receive the latest deals in your inbox.</span>
              </div>
              <button
                onClick={() => setSubscriptionStatus('idle')}
                className="mt-4 text-white/80 hover:text-white text-sm underline"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (subscriptionStatus === 'error') {
                      setSubscriptionStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 rounded-md text-gray-900 focus:ring-2 focus:ring-white ${
                    subscriptionStatus === 'error' ? 'ring-2 ring-red-500' : ''
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubscribe();
                    }
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-white text-booking-blue px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {subscriptionStatus === 'error' && (
                <p className="mt-2 text-red-200 text-sm text-left">{errorMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
