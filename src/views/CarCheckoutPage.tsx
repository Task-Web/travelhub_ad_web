import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { carsApi, bookingsApi } from '../api/client';

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  flightNumber: string;
  licenseCountry: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface CarDetails {
  name: string;
  category: string;
  supplier: string;
  seats: number;
  doors: number;
  transmission: string;
  pricePerDay: number;
  image: string;
  features: string[];
}

const extractNumber = (features: string[], keyword: string, fallback: number) => {
  for (const feature of features) {
    const match = feature.match(new RegExp(`(\\d+)\\s+${keyword}`, 'i'));
    if (match) return Number(match[1]);
  }
  return fallback;
};

const mapCarDetails = (car: Record<string, unknown>, fallbackName: string, fallbackPrice: number): CarDetails => {
  const features = Array.isArray(car.features) ? car.features.map(String) : [];
  const transmission =
    features.find((feature) => /automatic/i.test(feature)) ||
    features.find((feature) => /manual/i.test(feature));

  return {
    name: String(car.model ?? car.name ?? fallbackName),
    category: String(car.type ?? car.category ?? 'Standard'),
    supplier: String(car.provider ?? car.supplier ?? 'Partner'),
    seats: extractNumber(features, 'Seats', 5),
    doors: extractNumber(features, 'Doors', 4),
    transmission: transmission ? transmission : 'Automatic',
    pricePerDay: Number(car.pricePerDay ?? car.price ?? fallbackPrice ?? 0),
    image:
      String(car.image ?? '') ||
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&h=200&fit=crop',
    features: features.length > 0 ? features : ['Free cancellation', 'Unlimited mileage'],
  };
};

export default function CarCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const carId = searchParams.get('car_id') || 'car-001';
  const pickupLocation = searchParams.get('pickup_location') || 'London Heathrow Airport';
  const dropoffLocation = searchParams.get('dropoff_location') || pickupLocation;
  const pickupDate = searchParams.get('pickup_date') || format(new Date(), 'yyyy-MM-dd');
  const dropoffDate = searchParams.get('dropoff_date') || format(new Date(), 'yyyy-MM-dd');
  const pickupTime = searchParams.get('pickup_time') || '10:00';
  const dropoffTime = searchParams.get('dropoff_time') || '10:00';
  const totalParam = Number(searchParams.get('total') || 0);
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const days = (() => {
    try {
      return Math.max(1, differenceInDays(parseISO(dropoffDate), parseISO(pickupDate)));
    } catch {
      return 3;
    }
  })();

  const fallbackPricePerDay = days > 0 ? Math.round(totalParam / days) : 0;
  const fallbackCar: CarDetails = {
    name: 'Selected car',
    category: 'Standard',
    supplier: 'Partner',
    seats: 5,
    doors: 4,
    transmission: 'Automatic',
    pricePerDay: fallbackPricePerDay,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop',
    features: ['Free cancellation', 'Unlimited mileage'],
  };

  const displayCar = carDetails ?? fallbackCar;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    carsApi
      .getById(carId)
      .then((response) => {
        if (cancelled) return;
        setCarDetails(mapCarDetails(response.car as unknown as Record<string, unknown>, fallbackCar.name, fallbackCar.pricePerDay));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load car:', error);
        setLoadError('Unable to load car details from state.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [carId, fallbackCar.name, fallbackCar.pricePerDay]);

  const formattedPickupDate = (() => {
    try {
      return format(parseISO(pickupDate), 'EEE, d MMM yyyy');
    } catch {
      return pickupDate;
    }
  })();

  const formattedDropoffDate = (() => {
    try {
      return format(parseISO(dropoffDate), 'EEE, d MMM yyyy');
    } catch {
      return dropoffDate;
    }
  })();

  const [formData, setFormData] = useState<FormData>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+44',
    flightNumber: '',
    licenseCountry: 'United Kingdom',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<'basic' | 'full'>('basic');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'Invalid CVV';
    if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await bookingsApi.create({
          type: 'car',
          confirmationNumber: `CR-${Date.now().toString().slice(-8)}`,
          propertyName: `${displayCar.supplier} - ${displayCar.name}`,
          location: pickupLocation,
          checkIn: pickupDate,
          checkOut: dropoffDate,
          status: 'confirmed',
          totalPrice: Number(totalPrice.toFixed(2)),
          currency: 'EUR',
          guestName: `${formData.firstName} ${formData.lastName}`.trim(),
          image: displayCar.image,
          details: {
            pickupLocation,
            dropoffLocation,
            pickupTime,
            dropoffTime,
            transmission: displayCar.transmission,
            seats: displayCar.seats,
            doors: displayCar.doors,
            insurance: selectedInsurance,
          },
        });
      } catch (error) {
        console.error('Failed to save booking:', error);
      }
      setShowConfirmation(true);
    }
  };

  const rentalPrice = displayCar.pricePerDay * days;
  const insurancePrice = selectedInsurance === 'full' ? 15 * days : 0;
  const serviceFee = 5;
  const totalPrice = rentalPrice + insurancePrice + serviceFee;

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Back to search results
          </button>
        </div>
      </div>

      {(isLoading || loadError) && (
        <div className="max-w-container-lg mx-auto px-4 py-4">
          {isLoading && !carDetails && (
            <div className="bg-neutral-100 text-neutral-700 rounded-lg px-4 py-3 text-sm">
              Loading car details...
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
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">Complete your car rental booking</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Driver Details */}
              <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Driver Details</h2>
                <p className="text-sm text-neutral-600 mb-4">The main driver must be present at pickup with their driving license.</p>

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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Driving license country *</label>
                    <select
                      name="licenseCountry"
                      value={formData.licenseCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-booking-blue"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Spain">Spain</option>
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
                      placeholder="As shown on license"
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
                      placeholder="As shown on license"
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

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Flight number (optional)</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    placeholder="e.g., BA1234"
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-booking-blue"
                  />
                  <p className="text-neutral-500 text-sm mt-1">If arriving by plane, we&apos;ll monitor your flight for delays</p>
                </div>
              </div>

              {/* Insurance Options */}
              <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Insurance Options</h2>

                <div className="space-y-4">
                  <label className={`block p-4 border rounded-lg cursor-pointer ${selectedInsurance === 'basic' ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="insurance"
                        checked={selectedInsurance === 'basic'}
                        onChange={() => setSelectedInsurance('basic')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Basic Protection</span>
                          <span className="text-success font-semibold">Included</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Standard damage waiver with EUR 800 excess
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 border rounded-lg cursor-pointer ${selectedInsurance === 'full' ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="insurance"
                        checked={selectedInsurance === 'full'}
                        onChange={() => setSelectedInsurance('full')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Full Protection</span>
                          <span className="font-semibold">EUR 15/day</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Zero excess, covers tyres, glass, roof, and undercarriage
                        </p>
                        <ul className="text-sm text-neutral-600 mt-2 space-y-1">
                          <li className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-success">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            No excess to pay
                          </li>
                          <li className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-success">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            Covers all damage
                          </li>
                        </ul>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment */}
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

                <button
                  type="submit"
                  className="w-full bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Complete Booking
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-4">
              <h3 className="font-bold text-neutral-800 mb-4">Booking Summary</h3>

              {/* Car Details */}
              <div className="border-b pb-4 mb-4">
                <img src={displayCar.image} alt={displayCar.name} className="w-full h-32 object-cover rounded mb-3" />
                <h4 className="font-semibold text-neutral-800">{displayCar.name}</h4>
                <p className="text-sm text-neutral-500">{displayCar.category} • {displayCar.supplier}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    {displayCar.seats}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 15h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 18a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9z" clipRule="evenodd" />
                    </svg>
                    {displayCar.doors} doors
                  </span>
                  <span>{displayCar.transmission}</span>
                </div>
              </div>

              {/* Rental Details */}
              <div className="border-b pb-4 mb-4 text-sm">
                <div className="flex items-start gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-success mt-0.5">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-neutral-800">Pick-up</p>
                    <p className="text-neutral-600">{pickupLocation}</p>
                    <p className="text-neutral-500">{formattedPickupDate} at {pickupTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-error mt-0.5">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-neutral-800">Drop-off</p>
                    <p className="text-neutral-600">{dropoffLocation}</p>
                    <p className="text-neutral-500">{formattedDropoffDate} at {dropoffTime}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-b pb-4 mb-4">
                <h4 className="font-semibold text-neutral-800 mb-2">Included</h4>
                <ul className="space-y-1">
                  {displayCar.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-success">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Car rental ({days} days × EUR {displayCar.pricePerDay})</span>
                  <span>EUR {rentalPrice}</span>
                </div>
                {selectedInsurance === 'full' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Full protection ({days} days × EUR 15)</span>
                    <span>EUR {insurancePrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Service fee</span>
                  <span>EUR {serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>EUR {totalPrice}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 text-center">Pay at pickup • Free cancellation</p>
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
              Your car rental has been booked successfully.
            </p>
            <div className="bg-neutral-50 rounded p-4 mb-4 text-left">
              <p className="text-sm text-neutral-600"><strong>Confirmation number:</strong> CR{Date.now().toString().slice(-8)}</p>
              <p className="text-sm text-neutral-600"><strong>Driver:</strong> {formData.title} {formData.firstName} {formData.lastName}</p>
              <p className="text-sm text-neutral-600"><strong>Car:</strong> {displayCar.name} ({displayCar.category})</p>
              <p className="text-sm text-neutral-600"><strong>Pick-up:</strong> {formattedPickupDate} at {pickupTime}</p>
              <p className="text-sm text-neutral-600"><strong>Location:</strong> {pickupLocation}</p>
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
