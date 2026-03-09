import { useState } from 'react';
import { Link } from 'react-router-dom';
import StaysSearchForm from '../components/search/StaysSearchForm';

const trendingDestinations = [
  { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop', flag: 'GB' },
  { name: 'Manchester', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=300&fit=crop', flag: 'GB' },
  { name: 'Liverpool', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=300&fit=crop', flag: 'GB' },
  { name: 'Birmingham', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=400&h=300&fit=crop', flag: 'GB' },
  { name: 'Edinburgh', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400&h=300&fit=crop', flag: 'GB' },
];

const propertyTypes = [
  { name: 'Hotels', count: '820,876', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Apartments', count: '840,435', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop' },
  { name: 'Resorts', count: '17,843', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop' },
  { name: 'Villas', count: '434,237', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop' },
  { name: 'Cabins', count: '34,012', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop' },
];

const popularDestinationTabs = [
  { id: 'domestic', label: 'Domestic cities' },
  { id: 'international', label: 'International cities' },
  { id: 'regions', label: 'Regions' },
  { id: 'countries', label: 'Countries' },
  { id: 'places', label: 'Places to stay' },
];

const domesticCities = [
  'London', 'Manchester', 'Liverpool', 'Birmingham', 'Edinburgh', 'Glasgow',
  'Bristol', 'Leeds', 'Brighton', 'Oxford', 'Cambridge', 'York',
  'Bath', 'Newcastle', 'Nottingham', 'Cardiff', 'Belfast', 'Southampton',
];

const internationalCities = [
  'Paris', 'Amsterdam', 'Barcelona', 'Rome', 'Dublin', 'Berlin',
  'New York', 'Dubai', 'Istanbul', 'Bangkok', 'Tokyo', 'Singapore',
  'Lisbon', 'Prague', 'Vienna', 'Budapest', 'Copenhagen', 'Athens',
];

const regions = [
  'Cornwall', 'Scottish Highlands', 'Lake District', 'Cotswolds', 'Devon', 'Yorkshire',
  'Peak District', 'Welsh Valleys', 'Norfolk Broads', 'Isle of Wight', 'Kent Coast', 'Dorset',
];

const countries = [
  'Spain', 'France', 'Italy', 'Portugal', 'Greece', 'Netherlands',
  'Germany', 'United States', 'Thailand', 'Japan', 'Australia', 'Mexico',
];

const placesToStay = [
  'Hotels', 'Apartments', 'Holiday Homes', 'Villas', 'Resorts', 'B&Bs',
  'Guest Houses', 'Hostels', 'Glamping', 'Cabins', 'Cottages', 'Chalets',
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('domestic');

  const getTabContent = () => {
    switch (activeTab) {
      case 'international':
        return internationalCities.map((city) => (
          <Link
            key={city}
            to={`/search?destination=${encodeURIComponent(city)}`}
            className="text-booking-blue hover:underline"
          >
            {city}
          </Link>
        ));
      case 'regions':
        return regions.map((region) => (
          <Link
            key={region}
            to={`/search?destination=${encodeURIComponent(region)}`}
            className="text-booking-blue hover:underline"
          >
            {region}
          </Link>
        ));
      case 'countries':
        return countries.map((country) => (
          <Link
            key={country}
            to={`/search?destination=${encodeURIComponent(country)}`}
            className="text-booking-blue hover:underline"
          >
            {country}
          </Link>
        ));
      case 'places':
        return placesToStay.map((place) => (
          <Link
            key={place}
            to={`/search?type=${encodeURIComponent(place.toLowerCase())}`}
            className="text-booking-blue hover:underline"
          >
            {place}
          </Link>
        ));
      default:
        return domesticCities.map((city) => (
          <Link
            key={city}
            to={`/search?destination=${encodeURIComponent(city)}`}
            className="text-booking-blue hover:underline"
          >
            {city}
          </Link>
        ));
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Find your next stay
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Search low prices on hotels, homes and much more...
          </p>

          <StaysSearchForm />
        </div>
      </div>

      {/* Genius Banner */}
      <div className="max-w-container-lg mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-booking-blue to-booking-blue-light rounded-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Get instant discounts
              </h2>
              <p className="text-white/90">
                Simply sign in to your TravelHub account and you can look for the blue Genius labels to save 10% or more on participating properties.
              </p>
            </div>
            <div className="hidden md:block">
              <Link
                to="/sign-in"
                className="inline-block px-6 py-3 bg-white text-booking-blue font-bold rounded hover:bg-neutral-100 transition-colors"
              >
                Sign in or create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="max-w-container-lg mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Trending destinations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trendingDestinations.map((dest) => (
            <Link
              key={dest.name}
              to={`/search?destination=${encodeURIComponent(dest.name)}`}
              className="group relative rounded-lg overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-shadow"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                <p className="text-white/80 text-sm">{dest.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Property Types */}
      <div className="max-w-container-lg mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Browse by property type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {propertyTypes.map((type) => (
            <Link
              key={type.name}
              to={`/search?type=${encodeURIComponent(type.name.toLowerCase())}`}
              className="group"
            >
              <div className="rounded-lg overflow-hidden aspect-[4/3] mb-2 shadow-card group-hover:shadow-card-hover transition-shadow">
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-neutral-800 group-hover:text-booking-blue-light transition-colors">
                {type.name}
              </h3>
              <p className="text-sm text-neutral-500">{type.count} properties</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Value Propositions */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-booking-blue rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Book now, pay at property</h3>
                <p className="text-neutral-600 text-sm">
                  FREE cancellation on most bookings
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-booking-blue rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">300M+ reviews</h3>
                <p className="text-neutral-600 text-sm">
                  Trusted by millions of travellers
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-booking-blue rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">24/7 Customer Service</h3>
                <p className="text-neutral-600 text-sm">
                  Get support whenever you need it
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular with travellers */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Popular with travellers from the United Kingdom
        </h2>
        <div className="border-b border-neutral-200 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {popularDestinationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-booking-blue border-b-2 border-booking-blue'
                    : 'text-neutral-600 hover:text-booking-blue'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {getTabContent()}
        </div>
      </div>
    </div>
  );
}
