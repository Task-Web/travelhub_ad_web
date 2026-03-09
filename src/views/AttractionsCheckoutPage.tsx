import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { attractionsApi, bookingsApi } from '@/api/client';
import Link from 'next/link';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
}

interface AttractionSummary {
  id: string;
  name: string;
  image: string;
  category: string;
  duration: string;
  location: string;
  price: number;
  currency: string;
}

const mapAttractionSummary = (attraction: Record<string, unknown>, fallback: AttractionSummary): AttractionSummary => {
  const location = attraction.location as { city?: string; country?: string } | undefined;
  return {
    id: String(attraction.id ?? fallback.id),
    name: String(attraction.name ?? fallback.name),
    image:
      String(attraction.image ?? '') ||
      fallback.image,
    category: String(attraction.category ?? fallback.category),
    duration: String(attraction.duration ?? fallback.duration),
    location: location
      ? `${location.city || ''}${location.city && location.country ? ', ' : ''}${location.country || ''}`
      : fallback.location,
    price: Number(attraction.price ?? fallback.price),
    currency: String(attraction.currency ?? fallback.currency),
  };
};

export default function AttractionsCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const attractionId = searchParams.get('attraction_id') || 'attr-001';
  const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const time = searchParams.get('time') || '10:00';
  const ticketType = searchParams.get('ticket_type') || 'Standard';
  const quantity = parseInt(searchParams.get('quantity') || '2');
  const attractionNameParam = searchParams.get('attraction_name') || 'Attraction';
  const categoryParam = searchParams.get('category') || 'Attraction';
  const durationParam = searchParams.get('duration') || '2 hours';
  const locationParam = searchParams.get('location') || 'City center';
  const currencyParam = searchParams.get('currency') || 'EUR';
  const priceParam = parseFloat(searchParams.get('price') || '');
  const [attractionDetails, setAttractionDetails] = useState<AttractionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fallbackAttraction = useMemo<AttractionSummary>(() => ({
    id: attractionId,
    name: attractionNameParam,
    image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=300&h=200&fit=crop',
    category: categoryParam,
    duration: durationParam,
    location: locationParam,
    price: Number.isFinite(priceParam) ? priceParam : 0,
    currency: currencyParam,
  }), [
    attractionId,
    attractionNameParam,
    categoryParam,
    durationParam,
    locationParam,
    priceParam,
    currencyParam,
  ]);

  const displayAttraction = attractionDetails ?? fallbackAttraction;
  const pricePerTicket = Number.isFinite(priceParam) && priceParam > 0
    ? priceParam
    : displayAttraction.price;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    attractionsApi
      .getById(attractionId)
      .then((response) => {
        if (cancelled) return;
        setAttractionDetails(mapAttractionSummary(response.attraction as unknown as Record<string, unknown>, fallbackAttraction));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load attraction:', error);
        setLoadError('Unable to load attraction details from state.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attractionId, fallbackAttraction]);

  const formattedDate = (() => {
    try {
      return format(parseISO(date), 'EEEE, d MMMM yyyy');
    } catch {
      return date;
    }
  })();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+44',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = async () => {
    try {
      await bookingsApi.create({
        type: 'attraction',
        confirmationNumber: `AT-${Date.now().toString().slice(-8)}`,
        propertyName: displayAttraction.name,
        location: displayAttraction.location,
        checkIn: date,
        checkOut: date,
        status: 'confirmed',
        totalPrice: Number(total.toFixed(2)),
        currency: displayAttraction.currency || 'EUR',
        guestName: `${formData.firstName} ${formData.lastName}`.trim(),
        image: displayAttraction.image,
        details: {
          time,
          ticketType,
          quantity,
          pricePerTicket,
          category: displayAttraction.category,
          duration: displayAttraction.duration,
        },
      });
    } catch (error) {
      console.error('Failed to save booking:', error);
    }
    setShowConfirmation(true);
  };

  const subtotal = pricePerTicket * quantity;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

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
              Back
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
              <span className="font-semibold">Visitor Details</span>
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
          {isLoading && !attractionDetails && (
            <div className="bg-neutral-100 text-neutral-700 rounded-lg px-4 py-3 text-sm">
              Loading attraction details...
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
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-2">Visitor details</h2>
                <p className="text-sm text-neutral-600 mb-6">Please enter the lead visitor&apos;s information. Tickets will be sent to the email provided.</p>

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
                  <p className="text-neutral-500 text-sm mt-1">Your tickets will be sent to this email</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Telephone *</label>
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

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Payment details
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Payment</h2>

                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-success">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-neutral-800">Secure payment</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    This is a demo - no actual payment will be processed. In a real implementation,
                    you would see payment options like credit card, PayPal, or other payment methods here.
                  </p>
                </div>

                {/* Order Summary */}
                <div className="border rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-neutral-800 mb-3">Order summary</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600">{ticketType} × {quantity}</span>
                    <span>EUR {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600">Service fee</span>
                    <span>EUR {serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>EUR {total}</span>
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-neutral-500 mb-6">
                  By completing this booking, you agree to the{' '}
                  <Link href="/terms" className="text-booking-blue hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-booking-blue hover:underline">Privacy Policy</Link>.
                </p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border border-booking-blue text-booking-blue font-bold py-3 rounded hover:bg-neutral-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
                  >
                    Complete booking
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card overflow-hidden sticky top-4">
              <img src={displayAttraction.image} alt={displayAttraction.name} className="w-full h-40 object-cover" />

              <div className="p-4">
                <span className="text-xs text-booking-blue font-semibold">{displayAttraction.category}</span>
                <h3 className="font-bold text-neutral-800 text-lg mb-2">{displayAttraction.name}</h3>

                <div className="space-y-2 text-sm text-neutral-600 border-b pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                      <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                      <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                      <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                    </svg>
                    <span>{ticketType} ticket × {quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                    </svg>
                    <span>{displayAttraction.location}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">{ticketType} × {quantity}</span>
                    <span>EUR {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Service fee</span>
                    <span>EUR {serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>EUR {total}</span>
                  </div>
                </div>

                {/* Free cancellation badge */}
                <div className="mt-4 flex items-center gap-2 text-success text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Free cancellation available
                </div>
              </div>
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
              Your tickets for {displayAttraction.name} have been booked successfully.
            </p>
            <div className="bg-neutral-50 rounded p-4 mb-4 text-left">
              <p className="text-sm text-neutral-600"><strong>Confirmation number:</strong> AT{Date.now().toString().slice(-8)}</p>
              <p className="text-sm text-neutral-600"><strong>Visitor:</strong> {formData.firstName} {formData.lastName}</p>
              <p className="text-sm text-neutral-600"><strong>Email:</strong> {formData.email}</p>
              <p className="text-sm text-neutral-600"><strong>Date:</strong> {formattedDate} at {time}</p>
              <p className="text-sm text-neutral-600"><strong>Tickets:</strong> {quantity} × {ticketType}</p>
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              Your tickets have been sent to {formData.email}
            </p>
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
