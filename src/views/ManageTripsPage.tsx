import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { stateApi, bookingsApi } from '@/api/client';

interface Trip {
  id: string;
  confirmationNumber: string;
  type: 'hotel' | 'flight' | 'car' | 'attraction';
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  currency: string;
  guestName: string;
  roomType?: string;
  flightNumber?: string;
  image?: string;
}


export default function ManageTripsPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modifyData, setModifyData] = useState({
    checkIn: '',
    checkOut: '',
    guestName: '',
    specialRequests: ''
  });

  // Load auth state and trips from backend
  useEffect(() => {
    const loadFromBackend = async () => {
      setIsLoading(true);
      try {
        const { state } = await stateApi.getState();
        const data = state?.data as Record<string, unknown> | undefined;

        // Check auth state from backend
        const auth = data?.auth as { isAuthenticated?: boolean; email?: string } | undefined;
        if (auth?.isAuthenticated) {
          setIsLoggedIn(true);
          setEmail(auth.email || '');

          // Load trips/bookings from backend state
          const bookingsResponse = await bookingsApi.getAll();
          const bookings = Array.isArray(bookingsResponse.bookings)
            ? (bookingsResponse.bookings as unknown as Trip[])
            : [];
          setTrips(bookings);
        }
      } catch (error) {
        console.error('Failed to load state from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromBackend();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        // Save auth state to backend
        await stateApi.patchState({
          auth: {
            isAuthenticated: true,
            email: email,
            authenticatedAt: new Date().toISOString(),
          },
        }, 'User signed in via email on trips page');
        setIsLoggedIn(true);
        const bookingsResponse = await bookingsApi.getAll();
        const bookings = Array.isArray(bookingsResponse.bookings)
          ? (bookingsResponse.bookings as unknown as Trip[])
          : [];
        setTrips(bookings);
      } catch (error) {
        console.error('Failed to save auth state:', error);
      }
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    const userEmail = `user@${provider}.com`;
    try {
      // Save auth state to backend
      await stateApi.patchState({
        auth: {
          isAuthenticated: true,
          provider: provider,
          email: userEmail,
          authenticatedAt: new Date().toISOString(),
        },
      }, `User signed in via ${provider} OAuth on trips page`);
      setIsLoggedIn(true);
      const bookingsResponse = await bookingsApi.getAll();
      const bookings = Array.isArray(bookingsResponse.bookings)
        ? (bookingsResponse.bookings as unknown as Trip[])
        : [];
      setTrips(bookings);
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (selectedTrip) {
      try {
        const response = await bookingsApi.update(selectedTrip.id, { status: 'cancelled' });
        const updated = response.booking as unknown as Trip;
        setTrips(trips.map(trip => (trip.id === updated.id ? { ...trip, ...updated } : trip)));
        setShowCancelModal(false);
        setSelectedTrip(null);
      } catch (error) {
        console.error('Failed to save cancellation to backend:', error);
      }
    }
  };

  const handleOpenModifyModal = (trip: Trip) => {
    setSelectedTrip(trip);
    setModifyData({
      checkIn: trip.checkIn,
      checkOut: trip.checkOut,
      guestName: trip.guestName,
      specialRequests: ''
    });
    setShowModifyModal(true);
  };

  const handleModifyBooking = async () => {
    if (selectedTrip) {
      try {
        const updates = {
          checkIn: modifyData.checkIn,
          checkOut: modifyData.checkOut,
          guestName: modifyData.guestName,
          specialRequests: modifyData.specialRequests,
        };
        const response = await bookingsApi.update(selectedTrip.id, updates);
        const updated = response.booking as unknown as Trip;
        setTrips(trips.map(trip => (trip.id === updated.id ? { ...trip, ...updated } : trip)));
        setShowModifyModal(false);
        setSelectedTrip(null);
      } catch (error) {
        console.error('Failed to save modification to backend:', error);
      }
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return trip.status === 'confirmed' || trip.status === 'pending';
    if (activeFilter === 'completed') return trip.status === 'completed';
    if (activeFilter === 'cancelled') return trip.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: Trip['status']) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return badges[status];
  };

  // Get the correct route based on trip type for "View details" button
  const getBookingDetailRoute = (trip: Trip) => {
    switch (trip.type) {
      case 'hotel':
        return `/booking/${trip.id}`;
      case 'flight':
        return `/flight-booking/${trip.id}`;
      case 'car':
        return `/car-booking/${trip.id}`;
      case 'attraction':
        return `/attraction-booking/${trip.id}`;
      default:
        return `/booking/${trip.id}`;
    }
  };

  const getTypeIcon = (type: Trip['type']) => {
    const icons = {
      hotel: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      flight: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l4.5 1.5L12 3l2.5 1.5L19 3v18l-4.5-1.5L12 21l-2.5-1.5L5 21V3z" />
        </svg>
      ),
      car: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m0 0l3.5-3.5L10 16M17 16v-5a1 1 0 00-1-1h-2" />
        </svg>
      ),
      attraction: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    };
    return icons[type];
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-booking-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  // Sign-in prompt for non-authenticated users
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-booking-blue py-4">
          <div className="max-w-container-lg mx-auto px-4">
            <Link to="/" className="text-white text-2xl font-bold">TravelHub</Link>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to manage your trips</h1>
            <p className="text-gray-600 mb-6">Access your bookings and manage your upcoming trips</p>

            {/* Email sign-in form */}
            <form onSubmit={handleSignIn} className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-booking-blue text-white py-3 rounded-md font-medium hover:bg-booking-blue-hover transition-colors"
              >
                Continue with email
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or use one of these options</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              <button
                onClick={() => handleOAuthLogin('apple')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Apple</span>
              </button>

              <button
                onClick={() => handleOAuthLogin('facebook')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Facebook</span>
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-booking-blue hover:underline">Terms & Conditions</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-booking-blue hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Trips list for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-container-lg mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-booking-blue hover:underline">Home</Link></li>
            <li className="text-gray-500">&gt;</li>
            <li className="text-gray-600">Manage Trips</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage your trips</h1>
        <p className="text-gray-600 mb-8">View and manage all your bookings in one place</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-booking-blue text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Trips list */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h2>
            <p className="text-gray-600 mb-6">You don&apos;t have any {activeFilter === 'all' ? '' : activeFilter} trips yet.</p>
            <Link
              to="/"
              className="inline-block bg-booking-blue text-white px-6 py-3 rounded-md font-medium hover:bg-booking-blue-hover transition-colors"
            >
              Start planning your next trip
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {trip.image && (
                    <div className="md:w-48 h-32 md:h-auto">
                      <img
                        src={trip.image}
                        alt={trip.propertyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-booking-blue">{getTypeIcon(trip.type)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(trip.status)}`}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{trip.propertyName}</h3>
                        <p className="text-gray-600 text-sm mb-2">{trip.location}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>
                            <strong>Confirmation:</strong> {trip.confirmationNumber}
                          </span>
                          {trip.roomType && (
                            <span>
                              <strong>Room:</strong> {trip.roomType}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                          <span>
                            <strong>{trip.type === 'flight' ? 'Date' : 'Check-in'}:</strong> {trip.checkIn}
                          </span>
                          {trip.type !== 'flight' && (
                            <span>
                              <strong>Check-out:</strong> {trip.checkOut}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price and actions */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {trip.currency} {trip.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Total price</p>

                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            onClick={() => navigate(getBookingDetailRoute(trip))}
                            className="px-4 py-2 text-sm font-medium text-booking-blue border border-booking-blue rounded hover:bg-booking-blue/5 transition-colors"
                          >
                            View details
                          </button>
                          {(trip.status === 'confirmed' || trip.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleOpenModifyModal(trip)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Modify booking
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTrip(trip);
                                  setShowCancelModal(true);
                                }}
                                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                              >
                                Cancel booking
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel confirmation modal */}
        {showCancelModal && selectedTrip && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel booking?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your booking at <strong>{selectedTrip.propertyName}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Confirmation: {selectedTrip.confirmationNumber}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedTrip(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Keep booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Cancel booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modify booking modal */}
        {showModifyModal && selectedTrip && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
            <div className="bg-white rounded-lg max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modify booking</h3>
              <p className="text-gray-600 mb-4">
                Update your booking at <strong>{selectedTrip.propertyName}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Confirmation: {selectedTrip.confirmationNumber}
              </p>

              <div className="space-y-4">
                {selectedTrip.type !== 'flight' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in date
                      </label>
                      <input
                        type="date"
                        value={modifyData.checkIn}
                        onChange={(e) => setModifyData({ ...modifyData, checkIn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out date
                      </label>
                      <input
                        type="date"
                        value={modifyData.checkOut}
                        onChange={(e) => setModifyData({ ...modifyData, checkOut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest name
                  </label>
                  <input
                    type="text"
                    value={modifyData.guestName}
                    onChange={(e) => setModifyData({ ...modifyData, guestName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special requests (optional)
                  </label>
                  <textarea
                    value={modifyData.specialRequests}
                    onChange={(e) => setModifyData({ ...modifyData, specialRequests: e.target.value })}
                    rows={3}
                    placeholder="e.g., Late check-in, early check-out, room preferences..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-booking-blue focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Any date changes may result in price adjustments. You will be notified of any price differences before confirming the modification.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModifyModal(false);
                    setSelectedTrip(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModifyBooking}
                  className="flex-1 px-4 py-2 bg-booking-blue text-white rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
