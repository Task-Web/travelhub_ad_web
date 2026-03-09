import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { packagesApi, bookingsApi } from '../api/client';

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  specialRequests: string;
}

interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
}

interface Hotel {
  name: string;
  stars: number;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
}

interface Package {
  id: string;
  origin?: string;
  destination?: string;
  flight: {
    outbound: Flight;
    return: Flight;
  };
  hotel: Hotel;
  flightPrice: number;
  hotelPrice: number;
  packagePrice: number;
  savings: number;
  roomType: string;
  boardBasis: string;
  freeCancellation: boolean;
  currency?: string;
}

export default function FlightHotelCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const packageId = searchParams.get('package_id') || 'pkg1';
  const origin = searchParams.get('origin') || 'London';
  const destination = searchParams.get('destination') || 'Barcelona';
  const checkin = searchParams.get('checkin') || format(new Date(), 'yyyy-MM-dd');
  const checkout = searchParams.get('checkout') || format(new Date(), 'yyyy-MM-dd');
  const adults = parseInt(searchParams.get('adults') || '2');
  const rooms = parseInt(searchParams.get('rooms') || '1');

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fallbackPackage: Package = {
    id: packageId,
    origin,
    destination,
    flight: {
      outbound: {
        airline: 'TBD',
        flightNumber: 'TBD',
        departure: origin,
        arrival: destination,
        departureTime: '',
        arrivalTime: '',
        duration: '',
        stops: 0,
      },
      return: {
        airline: 'TBD',
        flightNumber: 'TBD',
        departure: destination,
        arrival: origin,
        departureTime: '',
        arrivalTime: '',
        duration: '',
        stops: 0,
      },
    },
    hotel: {
      name: destination ? `${destination} Hotel` : 'Hotel',
      stars: 4,
      location: destination,
      rating: 0,
      reviews: 0,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
      amenities: [],
    },
    flightPrice: 0,
    hotelPrice: 0,
    packagePrice: Number(searchParams.get('price') || 0),
    savings: 0,
    roomType: searchParams.get('room_type') || 'Standard Room',
    boardBasis: searchParams.get('board_basis') || 'Room only',
    freeCancellation: true,
    currency: searchParams.get('currency') || 'EUR',
  };

  const displayPackage = packageData ?? fallbackPackage;

  const nights = (() => {
    try {
      return differenceInDays(parseISO(checkout), parseISO(checkin));
    } catch {
      return 7;
    }
  })();

  const formattedCheckin = (() => {
    try {
      return format(parseISO(checkin), 'EEE, d MMM yyyy');
    } catch {
      return checkin;
    }
  })();

  const formattedCheckout = (() => {
    try {
      return format(parseISO(checkout), 'EEE, d MMM yyyy');
    } catch {
      return checkout;
    }
  })();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    packagesApi
      .getById(packageId)
      .then((response) => {
        if (cancelled) return;
        setPackageData(response.package);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load package:', error);
        setLoadError('Unable to load package details from state.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [packageId]);

  const [formData, setFormData] = useState<FormData>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+44',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'Invalid CVV';
    if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      try {
        await bookingsApi.create({
          type: 'hotel',
          confirmationNumber: `PK-${Date.now().toString().slice(-8)}`,
          propertyName: `Package: ${displayPackage.hotel.name}`,
          location: `${origin} → ${destination}`,
          checkIn: checkin,
          checkOut: checkout,
          status: 'confirmed',
          totalPrice: Number(totalPrice.toFixed(2)),
          currency: displayPackage.currency || 'EUR',
          guestName: `${formData.firstName} ${formData.lastName}`.trim(),
          image: displayPackage.hotel.image,
          details: {
            origin,
            destination,
            flight: displayPackage.flight,
            roomType: displayPackage.roomType,
            boardBasis: displayPackage.boardBasis,
            travelers: adults,
            rooms,
          },
        });
      } catch (error) {
        console.error('Failed to save booking:', error);
      }
      setShowConfirmation(true);
    }
  };

  const serviceFee = Math.round(displayPackage.packagePrice * 0.02);
  const totalPrice = displayPackage.packagePrice + serviceFee;

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
              </svg>
              Back to search results
            </button>
            <div className="text-white text-sm">
              Step {step} of 2
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-booking-blue' : 'text-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-booking-blue text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="font-semibold">Passenger Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-neutral-200">
              <div className={`h-full bg-booking-blue transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-booking-blue' : 'text-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-booking-blue text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                2
              </div>
              <span className="font-semibold">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {(isLoading || loadError) && (
        <div className="max-w-container-lg mx-auto px-4 py-4">
          {isLoading && !packageData && (
            <div className="bg-neutral-100 text-neutral-700 rounded-lg px-4 py-3 text-sm">
              Loading package details...
            </div>
          )}
          {loadError && (
            <div className="bg-amber-50 text-amber-800 rounded-lg px-4 py-3 text-sm mt-3">
              {loadError}
            </div>
          )}
        </div>
      )}

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                  <h2 className="text-xl font-bold text-neutral-800 mb-6">Passenger Details</h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
                      <select
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-booking-blue"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">First name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.firstName ? 'border-error' : 'border-neutral-300'}`}
                      />
                      {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Last name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.lastName ? 'border-error' : 'border-neutral-300'}`}
                      />
                      {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.email ? 'border-error' : 'border-neutral-300'}`}
                    />
                    {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                    <p className="text-neutral-500 text-sm mt-1">Confirmation will be sent to this email</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone number *</label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-24 px-2 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-booking-blue"
                      >
                        <option value="+44">+44</option>
                        <option value="+1">+1</option>
                        <option value="+33">+33</option>
                        <option value="+49">+49</option>
                        <option value="+34">+34</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className={`flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.phone ? 'border-error' : 'border-neutral-300'}`}
                      />
                    </div>
                    {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Special requests (optional)</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Any special requests for your trip?"
                      rows={3}
                      className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-booking-blue"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                  <h2 className="text-xl font-bold text-neutral-800 mb-6">Payment Details</h2>

                  <div className="flex items-center gap-2 mb-4 p-3 bg-neutral-50 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-neutral-600">Your payment information is secure</span>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Card number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.cardNumber ? 'border-error' : 'border-neutral-300'}`}
                    />
                    {errors.cardNumber && <p className="text-error text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Expiry date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.expiryDate ? 'border-error' : 'border-neutral-300'}`}
                      />
                      {errors.expiryDate && <p className="text-error text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.cvv ? 'border-error' : 'border-neutral-300'}`}
                      />
                      {errors.cvv && <p className="text-error text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Cardholder name *</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      placeholder="Name as shown on card"
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-booking-blue ${errors.cardholderName ? 'border-error' : 'border-neutral-300'}`}
                    />
                    {errors.cardholderName && <p className="text-error text-sm mt-1">{errors.cardholderName}</p>}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 border border-booking-blue text-booking-blue font-bold py-3 rounded hover:bg-neutral-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
                    >
                      Complete Booking
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-4">
              <h3 className="font-bold text-neutral-800 mb-4">Booking Summary</h3>

              {/* Package Details */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(displayPackage.hotel.stars)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <h4 className="font-semibold text-neutral-800">{displayPackage.hotel.name}</h4>
                <p className="text-sm text-neutral-500">{displayPackage.hotel.location}</p>
                <p className="text-sm text-neutral-600 mt-2">{displayPackage.roomType} - {displayPackage.boardBasis}</p>
              </div>

              {/* Trip Details */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-booking-blue">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                  <span className="text-sm font-semibold text-neutral-800">Flights included</span>
                </div>
                <p className="text-sm text-neutral-600">
                  {origin} → {destination}
                </p>
                <p className="text-sm text-neutral-500">
                  Outbound: {displayPackage.flight.outbound.airline} {displayPackage.flight.outbound.flightNumber}
                </p>
                <p className="text-sm text-neutral-500">
                  Return: {displayPackage.flight.return.airline} {displayPackage.flight.return.flightNumber}
                </p>
              </div>

              {/* Dates */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-600">{formattedCheckin} - {formattedCheckout}</span>
                </div>
                <p className="text-sm text-neutral-500">{nights} nights, {adults} adults, {rooms} room</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Flight</span>
                  <span>EUR {displayPackage.flightPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Hotel ({nights} nights)</span>
                  <span>EUR {displayPackage.hotelPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-success">
                  <span>Package discount</span>
                  <span>-EUR {displayPackage.savings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Service fee</span>
                  <span>EUR {serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>EUR {totalPrice}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 text-center">Taxes and fees included</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Booking Confirmed!</h2>
            <p className="text-neutral-600 mb-4">
              Your Flight + Hotel package to {destination} has been booked successfully.
            </p>
            <div className="bg-neutral-50 rounded p-4 mb-4 text-left">
              <p className="text-sm text-neutral-600"><strong>Confirmation number:</strong> BK{Date.now().toString().slice(-8)}</p>
              <p className="text-sm text-neutral-600"><strong>Guest:</strong> {formData.title} {formData.firstName} {formData.lastName}</p>
              <p className="text-sm text-neutral-600"><strong>Email:</strong> {formData.email}</p>
              <p className="text-sm text-neutral-600"><strong>Hotel:</strong> {displayPackage.hotel.name}</p>
              <p className="text-sm text-neutral-600"><strong>Dates:</strong> {formattedCheckin} - {formattedCheckout}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
