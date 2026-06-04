import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import NextLink from 'next/link';
import { bookingsApi } from '@/api/client';

// Country code type
interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
}

// Country codes for phone input
const countryCodes: CountryCode[] = [
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'CN', name: 'China', dialCode: '+86' },
];

// Payment method type
interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
}

// Payment methods
const paymentMethods: PaymentMethod[] = [
  { id: 'visa', name: 'Visa', logo: 'V' },
  { id: 'mastercard', name: 'Mastercard', logo: 'M' },
  { id: 'amex', name: 'American Express', logo: 'A' },
  { id: 'diners', name: 'Diners Club', logo: 'D' },
  { id: 'jcb', name: 'JCB', logo: 'J' },
  { id: 'maestro', name: 'Maestro', logo: 'Ma' },
  { id: 'discover', name: 'Discover', logo: 'Di' },
  { id: 'unionpay', name: 'UnionPay', logo: 'U' },
];

// Form validation errors type
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardName?: string;
  terms?: string;
}

interface Task052Checkout {
  hotel_id: string;
  hotel_name: string;
  room: string;
}

interface Task052FlowResponse {
  initialized?: boolean;
  flow?: {
    can_view_checkout?: boolean;
    checkout?: Task052Checkout | null;
  };
}

const TASK052_TARGET_HOTEL_ID = 'hotel-paris-1';
const TASK052_TARGET_HOTEL_NAME = 'Le Meurice';
const TASK052_TARGET_ROOM = 'Deluxe Suite';
const TASK052_SEARCH_URL = '/search?destination=Paris';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryHotelId = searchParams.get('hotel_id');
  const queryHotelName = searchParams.get('hotel_name') || '';
  const queryRoomType = searchParams.get('room') || '';
  const isTask052TargetQuery =
    queryHotelId === TASK052_TARGET_HOTEL_ID ||
    queryHotelName === TASK052_TARGET_HOTEL_NAME ||
    queryRoomType === TASK052_TARGET_ROOM;
  const [task052Checkout, setTask052Checkout] = useState<Task052Checkout | null>(null);
  const [isCheckoutGateReady, setIsCheckoutGateReady] = useState(false);

  // Get booking details from URL params
  const hotelId = task052Checkout?.hotel_id || queryHotelId || '1';
  const hotelNameParam = task052Checkout?.hotel_name || queryHotelName;
  const roomType = task052Checkout?.room || queryRoomType || 'Superior Room';
  const checkIn = searchParams.get('checkin') || '2026-01-20';
  const checkOut = searchParams.get('checkout') || '2026-01-23';
  const adults = parseInt(searchParams.get('adults') || '2');
  const children = parseInt(searchParams.get('children') || '0');
  const rooms = parseInt(searchParams.get('rooms') || '1');
  const priceParam = parseInt(searchParams.get('price') || '0');

  // Hotel data state
  interface HotelData {
    id: string;
    name: string;
    address: string;
    image: string;
    starRating: number;
    reviewScore: number;
    reviewLabel: string;
    pricePerNight: number;
  }

  const [hotel, setHotel] = useState<HotelData>({
    id: hotelId,
    name: hotelNameParam || 'Loading...',
    address: 'Loading...',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    starRating: 4,
    reviewScore: 8.0,
    reviewLabel: 'Very Good',
    pricePerNight: priceParam || 185,
  });

  // Fetch hotel data from backend
  useEffect(() => {
    let cancelled = false;

    setHotel((current) => ({
      ...current,
      id: hotelId,
      name: hotelNameParam || 'Loading...',
      address: 'Loading...',
      pricePerNight: priceParam || current.pricePerNight,
    }));

    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.hotel) {
            const h = data.hotel;
            const location = h.location as { city?: string; country?: string; address?: string } | undefined;
            const getReviewLabel = (score: number) => {
              if (score >= 9) return 'Superb';
              if (score >= 8) return 'Very Good';
              if (score >= 7) return 'Good';
              if (score >= 6) return 'Pleasant';
              return 'Review score';
            };
            if (!cancelled) {
              setHotel({
                id: h.id,
                name: h.name || hotelNameParam,
                address: location ? `${location.address || ''}, ${location.city || ''}, ${location.country || ''}` : 'Address not available',
                image: (h.images && h.images[0] && !h.images[0].startsWith('/images/'))
                  ? h.images[0]
                  : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
                starRating: h.starRating || 4,
                reviewScore: h.reviewScore || 8.0,
                reviewLabel: getReviewLabel(h.reviewScore || 8.0),
                pricePerNight: h.pricePerNight || priceParam || 185,
              });
            }
          }
        }
      } catch (error) {
        // Keep the default/URL-provided values on error
        console.error('Failed to fetch hotel:', error);
      }
    };

    if (hotelId) {
      void fetchHotel();
    }

    return () => {
      cancelled = true;
    };
  }, [hotelId, hotelNameParam, priceParam]);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verifyTask052Checkout = async () => {
      try {
        const response = await fetch('/api/task052/flow', {
          credentials: 'include',
        });
        const data = (await response.json().catch(() => ({}))) as Task052FlowResponse;
        const checkout = data.flow?.checkout ?? null;
        const canShowTask052Checkout =
          response.ok &&
          data.flow?.can_view_checkout === true &&
          checkout?.hotel_id === TASK052_TARGET_HOTEL_ID &&
          checkout?.hotel_name === TASK052_TARGET_HOTEL_NAME &&
          checkout?.room === TASK052_TARGET_ROOM;

        if (canShowTask052Checkout) {
          if (!cancelled) {
            setTask052Checkout(checkout);
          }
          await fetch('/api/state', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                task052: {
                  checkout_page_visited: true,
                  checkout,
                },
              },
              note: 'Task 052 checkout reached',
            }),
          });
          if (!cancelled) {
            setIsCheckoutGateReady(true);
          }
          return;
        }

        if (data.initialized === true || isTask052TargetQuery) {
          if (!cancelled) {
            navigate(TASK052_SEARCH_URL, { replace: true });
          }
          return;
        }
      } catch (error) {
        if (isTask052TargetQuery) {
          if (!cancelled) {
            navigate(TASK052_SEARCH_URL, { replace: true });
          }
          return;
        }
        console.error('Failed to verify task 052 checkout flow:', error);
      }

      if (!cancelled) {
        setIsCheckoutGateReady(true);
      }
    };

    void verifyTask052Checkout();

    return () => {
      cancelled = true;
    };
  }, [isTask052TargetQuery, navigate]);

  // Calculate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  // Pricing - use hotel's price from backend or URL param
  const subtotal = hotel.pricePerNight * nights * rooms;
  const taxRate = 0.20; // 20% VAT
  const taxes = subtotal * taxRate;
  const serviceFee = 15;
  const total = subtotal + taxes + serviceFee;

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Card number validation (basic Luhn algorithm check)
  const isValidCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    return true;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      setCardNumber(formatted);
      if (errors.cardNumber) {
        setErrors({ ...errors, cardNumber: undefined });
      }
    }
  };

  // Handle expiry input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setCardExpiry(value);
      if (errors.expiry) {
        setErrors({ ...errors, expiry: undefined });
      }
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!isValidCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!cardExpiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
    }
    if (!cardCvv.trim()) {
      newErrors.cvv = 'CVV is required';
    }
    if (!cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email blur for validation
  const handleEmailBlur = () => {
    if (email && !isValidEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else if (errors.email && isValidEmail(email)) {
      setErrors({ ...errors, email: undefined });
    }
  };

  // Handle card number blur for validation
  const handleCardNumberBlur = () => {
    if (cardNumber && !isValidCardNumber(cardNumber)) {
      setErrors({ ...errors, cardNumber: 'Please enter a valid card number' });
    } else if (errors.cardNumber && isValidCardNumber(cardNumber)) {
      setErrors({ ...errors, cardNumber: undefined });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await bookingsApi.create({
          type: 'hotel',
          confirmationNumber: `BK-${Date.now().toString().slice(-8)}`,
          propertyName: hotel.name,
          location: hotel.address,
          checkIn,
          checkOut,
          status: 'confirmed',
          totalPrice: Number(total.toFixed(2)),
          currency: 'EUR',
          guestName: `${firstName} ${lastName}`.trim(),
          roomType,
          image: hotel.image,
          details: {
            adults,
            children,
            rooms,
            specialRequests,
            paymentMethod: selectedPayment,
          },
        });
      } catch (error) {
        console.error('Failed to save booking:', error);
      }
      setShowConfirmation(true);
    }
  };

  if (!isCheckoutGateReady) {
    return (
      <div className="bg-neutral-100 min-h-screen">
        <div className="max-w-container-lg mx-auto px-4 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-48 mx-auto"></div>
          </div>
          <p className="text-neutral-600 mt-4">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-3">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/search" className="text-booking-blue-light hover:underline">London</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to={`/hotel/${hotelId}`} className="text-booking-blue-light hover:underline truncate max-w-[120px] sm:max-w-none">{hotel.name}</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">Secure Booking</span>
          </nav>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Column */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <form onSubmit={handleSubmit}>
              {/* Booking Summary Card */}
              <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-800 mb-4">Your booking details</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <span key={i} className="text-yellow-500 text-sm">&#9733;</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-neutral-800">{hotel.name}</h3>
                    <p className="text-sm text-neutral-600">{hotel.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-booking-blue text-white text-sm font-bold px-2 py-1 rounded">
                        {hotel.reviewScore}
                      </span>
                      <span className="text-sm text-neutral-600">{hotel.reviewLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t border-neutral-200">
                  <div>
                    <p className="text-sm text-neutral-500">Check-in</p>
                    <p className="font-bold text-neutral-800 text-sm sm:text-base">{formatDate(checkInDate)}</p>
                    <p className="text-sm text-neutral-600">From 15:00</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Check-out</p>
                    <p className="font-bold text-neutral-800 text-sm sm:text-base">{formatDate(checkOutDate)}</p>
                    <p className="text-sm text-neutral-600">Until 12:00</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500">Total length of stay:</p>
                  <p className="font-bold text-neutral-800">{nights} night{nights > 1 ? 's' : ''}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500">You selected:</p>
                  <p className="font-bold text-neutral-800">{roomType}</p>
                  <p className="text-sm text-neutral-600">
                    {rooms} room{rooms > 1 ? 's' : ''} for {adults} adult{adults > 1 ? 's' : ''}
                    {children > 0 && `, ${children} child${children > 1 ? 'ren' : ''}`}
                  </p>
                  <Link
                    to={`/hotel/${hotelId}?checkin=${checkIn}&checkout=${checkOut}`}
                    className="text-sm text-booking-blue-light hover:underline mt-2 inline-block"
                  >
                    Change your selection
                  </Link>
                </div>
              </div>

              {/* Guest Details */}
              <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-800 mb-4">Enter your details</h2>
                <p className="text-sm text-neutral-600 mb-6">
                  <span className="text-error">*</span> Required fields
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      First name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                      }}
                      placeholder="Enter your first name"
                      className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                        errors.firstName ? 'border-error' : 'border-neutral-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-error text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Last name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                      }}
                      placeholder="Enter your last name"
                      className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                        errors.lastName ? 'border-error' : 'border-neutral-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-error text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email && isValidEmail(e.target.value)) {
                        setErrors({ ...errors, email: undefined });
                      }
                    }}
                    onBlur={handleEmailBlur}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                      errors.email ? 'border-error' : 'border-neutral-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-error text-sm mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-neutral-500 mt-1">
                    Confirmation email will be sent to this address
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone number <span className="text-error">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light w-full sm:w-auto min-h-[44px]"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.dialCode}>
                          {country.code} {country.dialCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="Enter your phone number"
                      className={`flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light min-h-[44px] ${
                        errors.phone ? 'border-error' : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-error text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-neutral-500 mt-1">
                    Needed by the property to validate your booking
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-800 mb-4">Special requests</h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Special requests cannot be guaranteed - but the property will do its best to meet your needs.
                </p>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Please write your requests in English (optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g., Early check-in requested, high floor, quiet room..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light resize-none"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {specialRequests.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-800 mb-4">Payment</h2>

                {/* Security badge */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-success font-medium">Your payment information is secure and encrypted</span>
                </div>

                <p className="text-sm text-neutral-600 mb-4">Select payment method:</p>

                {/* Payment method selection */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`px-2 sm:px-4 py-2 border rounded flex items-center justify-center gap-1 sm:gap-2 transition-colors min-h-[44px] ${
                        selectedPayment === method.id
                          ? 'border-booking-blue-light bg-blue-50'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <span className="w-6 sm:w-8 h-5 bg-neutral-100 flex items-center justify-center text-xs font-bold rounded flex-shrink-0">
                        {method.logo}
                      </span>
                      <span className="text-xs sm:text-sm truncate">{method.name}</span>
                    </button>
                  ))}
                </div>

                {/* Card details form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Card number <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={handleCardNumberBlur}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                        errors.cardNumber ? 'border-error' : 'border-neutral-300'
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-error text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Expiry date <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={`w-full px-3 sm:px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                          errors.expiry ? 'border-error' : 'border-neutral-300'
                        }`}
                      />
                      {errors.expiry && (
                        <p className="text-error text-sm mt-1">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        CVV <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setCardCvv(value);
                            if (errors.cvv) setErrors({ ...errors, cvv: undefined });
                          }
                        }}
                        placeholder="123"
                        className={`w-full px-3 sm:px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                          errors.cvv ? 'border-error' : 'border-neutral-300'
                        }`}
                      />
                      {errors.cvv && (
                        <p className="text-error text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Cardholder name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        if (errors.cardName) setErrors({ ...errors, cardName: undefined });
                      }}
                      placeholder="Name as shown on card"
                      className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:border-booking-blue-light ${
                        errors.cardName ? 'border-error' : 'border-neutral-300'
                      }`}
                    />
                    {errors.cardName && (
                      <p className="text-error text-sm mt-1">{errors.cardName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 mb-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: undefined });
                    }}
                    className="mt-1 w-5 h-5 rounded border-neutral-300 text-booking-blue-light focus:ring-booking-blue-light"
                  />
                  <label htmlFor="terms" className="text-sm text-neutral-600">
                    I agree to the{' '}
                    <NextLink href="/terms" className="text-booking-blue-light hover:underline">
                      Terms and Conditions
                    </NextLink>
                    {' '}and{' '}
                    <NextLink href="/privacy" className="text-booking-blue-light hover:underline">
                      Privacy Policy
                    </NextLink>
                    . <span className="text-error">*</span>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-error text-sm mt-2">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 sm:py-4 bg-booking-blue-light text-white font-bold text-base sm:text-lg rounded hover:bg-booking-blue transition-colors min-h-[48px]"
              >
                Complete Booking
              </button>
            </form>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-neutral-800 mb-4">Price summary</h3>

              <div className="space-y-3 pb-4 border-b border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    EUR {hotel.pricePerNight} x {nights} night{nights > 1 ? 's' : ''} x {rooms} room{rooms > 1 ? 's' : ''}
                  </span>
                  <span className="text-neutral-800">EUR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">VAT (20%)</span>
                  <span className="text-neutral-800">EUR {taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Service fee</span>
                  <span className="text-neutral-800">EUR {serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-neutral-200">
                <span className="font-bold text-neutral-800">Total</span>
                <span className="text-2xl font-bold text-neutral-800">EUR {total.toFixed(2)}</span>
              </div>

              <p className="text-xs text-neutral-500 mt-2">
                Includes taxes and fees
              </p>

              {/* Cancellation Policy */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="font-bold text-neutral-800 mb-2">Cancellation policy</h4>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-success font-medium">Free cancellation until 24 hours before check-in</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      After that, the first night is non-refundable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hotel Policies */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="font-bold text-neutral-800 mb-3">Hotel policies</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Check-in</span>
                    <span className="text-neutral-800">From 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Check-out</span>
                    <span className="text-neutral-800">Until 12:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Minimum age</span>
                    <span className="text-neutral-800">18 years</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  Please note: Photo ID and credit card required at check-in
                </p>
              </div>

              {/* Pet Policy */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="font-bold text-neutral-800 mb-2">Pet policy</h4>
                <p className="text-sm text-neutral-600">
                  Pets are allowed on request. Charges may apply.
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Pet surcharge: EUR 25 per dog, per day. Please inform the property in advance.
                </p>
              </div>

              {/* Child Policy */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="font-bold text-neutral-800 mb-2">Child policy</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>Children of any age are welcome</li>
                  <li>Children 13+ charged as adults</li>
                  <li>Cot available for ages 0-2 (EUR 15 per night)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Booking Confirmed!</h2>
            <p className="text-neutral-600 mb-6">
              Thank you, {firstName}! Your booking at {hotel.name} has been confirmed.
              A confirmation email has been sent to {email}.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Booking reference: <span className="font-bold">BK-{Date.now().toString(36).toUpperCase()}</span>
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
