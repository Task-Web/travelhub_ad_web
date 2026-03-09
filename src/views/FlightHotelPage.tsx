import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';

export default function FlightHotelPage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState<Date>(addDays(new Date(), 7));
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 14));
  const [adults, setAdults] = useState(2);
  const [children] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (origin) params.set('origin', origin);
    if (destination) params.set('destination', destination);
    params.set('checkin', format(checkIn, 'yyyy-MM-dd'));
    params.set('checkout', format(checkOut, 'yyyy-MM-dd'));
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());

    navigate(`/flight-hotel/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Flight + Hotel packages
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Book together to save on your dream trip
          </p>

          {/* Combined Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Flying from</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="City or airport"
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Flying to</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="City or airport"
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Check-in</label>
                <input
                  type="date"
                  value={format(checkIn, 'yyyy-MM-dd')}
                  onChange={(e) => setCheckIn(new Date(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Check-out</label>
                <input
                  type="date"
                  value={format(checkOut, 'yyyy-MM-dd')}
                  onChange={(e) => setCheckOut(new Date(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Rooms</label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
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

      {/* Benefits */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
          Why book Flight + Hotel together?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-booking-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Save money</h3>
            <p className="text-neutral-600">
              Bundling your flight and hotel often costs less than booking separately
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-booking-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Save time</h3>
            <p className="text-neutral-600">
              Book everything in one place and manage your trip with a single confirmation
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-booking-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Stay protected</h3>
            <p className="text-neutral-600">
              Enjoy full peace of mind with our package protection and 24/7 support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
