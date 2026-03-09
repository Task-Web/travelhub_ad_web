import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays } from 'date-fns';

interface FareClass {
  id: string;
  name: string;
  price: number;
  features: {
    carryOn: string;
    checkedBag: string;
    seatSelection: string;
    changes: string;
    cancellation: string;
    meals: string;
    priority: boolean;
    loungeAccess: boolean;
  };
}

interface FlightSegment {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
  departureAirport: string;
  departureCode: string;
  departureTime: string;
  departureDate: string;
  departureTimezone: string;
  arrivalAirport: string;
  arrivalCode: string;
  arrivalTime: string;
  arrivalDate: string;
  arrivalTimezone: string;
  duration: number;
  terminal?: string;
}

interface BaggageOption {
  id: string;
  type: 'carry-on' | 'checked';
  name: string;
  weight: string;
  dimensions?: string;
  price: number;
  included: boolean;
}

interface AlternativeFlight {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  airline: string;
  price: number;
}

interface AirlineReview {
  name: string;
  country: string;
  rating: number;
  comment: string;
  date: string;
}

export default function FlightDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get flight details from URL params
  const flightId = searchParams.get('flightId') || 'BA1234';
  const origin = searchParams.get('origin') || 'London';
  const originCode = searchParams.get('originCode') || 'LHR';
  const destination = searchParams.get('destination') || 'Paris';
  const destCode = searchParams.get('destCode') || 'CDG';
  const departDate = searchParams.get('depart') || format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const returnDate = searchParams.get('return') || '';
  const tripType = searchParams.get('tripType') || 'round-trip';
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');
  const cabin = searchParams.get('cabin') || 'economy';

  // State
  const [selectedFare, setSelectedFare] = useState<string>('standard');
  const [extraBaggage, setExtraBaggage] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['flight-details']);

  // Mock flight data
  const outboundFlight: FlightSegment = {
    airline: 'British Airways',
    airlineCode: 'BA',
    flightNumber: 'BA308',
    aircraft: 'Airbus A320',
    departureAirport: 'London Heathrow Airport',
    departureCode: originCode,
    departureTime: '10:30',
    departureDate: departDate,
    departureTimezone: 'GMT',
    arrivalAirport: 'Charles de Gaulle Airport',
    arrivalCode: destCode,
    arrivalTime: '12:50',
    arrivalDate: departDate,
    arrivalTimezone: 'CET',
    duration: 80,
    terminal: 'Terminal 5',
  };

  const returnFlight: FlightSegment | null = tripType === 'round-trip' && returnDate ? {
    airline: 'British Airways',
    airlineCode: 'BA',
    flightNumber: 'BA313',
    aircraft: 'Airbus A320',
    departureAirport: 'Charles de Gaulle Airport',
    departureCode: destCode,
    departureTime: '18:00',
    departureDate: returnDate,
    departureTimezone: 'CET',
    arrivalAirport: 'London Heathrow Airport',
    arrivalCode: originCode,
    arrivalTime: '18:20',
    arrivalDate: returnDate,
    arrivalTimezone: 'GMT',
    duration: 80,
    terminal: 'Terminal 2E',
  } : null;

  // Fare classes
  const fareClasses: FareClass[] = [
    {
      id: 'basic',
      name: 'Basic Economy',
      price: cabin === 'economy' ? 89 : cabin === 'premium-economy' ? 189 : 489,
      features: {
        carryOn: '1 personal item',
        checkedBag: 'Not included (EUR 35)',
        seatSelection: 'At check-in only',
        changes: 'Not permitted',
        cancellation: 'Non-refundable',
        meals: 'Buy on board',
        priority: false,
        loungeAccess: false,
      },
    },
    {
      id: 'standard',
      name: 'Standard',
      price: cabin === 'economy' ? 129 : cabin === 'premium-economy' ? 279 : 679,
      features: {
        carryOn: '1 cabin bag (8kg)',
        checkedBag: '1 x 23kg included',
        seatSelection: 'Select at booking',
        changes: 'EUR 50 fee',
        cancellation: 'EUR 100 fee',
        meals: 'Meal included',
        priority: false,
        loungeAccess: false,
      },
    },
    {
      id: 'flexible',
      name: 'Flexible',
      price: cabin === 'economy' ? 189 : cabin === 'premium-economy' ? 379 : 879,
      features: {
        carryOn: '1 cabin bag (8kg)',
        checkedBag: '2 x 32kg included',
        seatSelection: 'Free selection + extra legroom',
        changes: 'Free unlimited changes',
        cancellation: 'Full refund available',
        meals: 'Premium meal + drinks',
        priority: true,
        loungeAccess: cabin !== 'economy',
      },
    },
  ];

  const selectedFareData = fareClasses.find(f => f.id === selectedFare) || fareClasses[1];
  const totalPassengers = adults + children;

  // Baggage options
  const baggageOptions: BaggageOption[] = [
    { id: 'personal', type: 'carry-on', name: 'Personal item', weight: 'Under seat', included: true, price: 0 },
    { id: 'cabin', type: 'carry-on', name: 'Cabin bag', weight: '8 kg', dimensions: '55 x 40 x 23 cm', included: selectedFare !== 'basic', price: selectedFare === 'basic' ? 15 : 0 },
    { id: 'checked1', type: 'checked', name: '1st checked bag', weight: '23 kg', included: selectedFare !== 'basic', price: selectedFare === 'basic' ? 35 : 0 },
    { id: 'checked2', type: 'checked', name: '2nd checked bag', weight: '23 kg', included: selectedFare === 'flexible', price: selectedFare === 'flexible' ? 0 : 45 },
    { id: 'checked3', type: 'checked', name: 'Extra checked bag', weight: '32 kg', included: false, price: 65 },
  ];

  // Calculate price breakdown
  const baseFare = selectedFareData.price * totalPassengers;
  const extraBaggageCost = extraBaggage.reduce((sum, id) => {
    const bag = baggageOptions.find(b => b.id === id);
    return sum + (bag?.price || 0);
  }, 0);
  const taxes = Math.round(baseFare * 0.15);
  const totalPrice = baseFare + extraBaggageCost + taxes;

  // Alternative flights
  const alternativeFlights: AlternativeFlight[] = [
    { id: 'alt1', departureTime: '06:30', arrivalTime: '08:50', duration: 80, stops: 0, airline: 'British Airways', price: 79 },
    { id: 'alt2', departureTime: '14:45', arrivalTime: '17:05', duration: 80, stops: 0, airline: 'Air France', price: 99 },
    { id: 'alt3', departureTime: '19:20', arrivalTime: '21:40', duration: 80, stops: 0, airline: 'British Airways', price: 109 },
  ];

  // Airline reviews
  const airlineReviews: AirlineReview[] = [
    { name: 'John M.', country: 'United Kingdom', rating: 9, comment: 'Excellent service and comfortable seats. Will fly again!', date: '2026-01-05' },
    { name: 'Marie L.', country: 'France', rating: 8, comment: 'Good flight overall. Food was better than expected.', date: '2026-01-02' },
    { name: 'Thomas K.', country: 'Germany', rating: 7, comment: 'On-time departure and arrival. Crew was professional.', date: '2025-12-28' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleSave = () => {
    if (!isSaved) {
      setShowLoginPrompt(true);
    } else {
      setIsSaved(false);
    }
  };

  const handleSaveWithoutLogin = () => {
    setIsSaved(true);
    setShowLoginPrompt(false);
  };

  const handleShare = (method: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this flight: ${origin} to ${destination}`;

    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
    }
    setShowShareOptions(false);
  };

  const handleProceedToBooking = () => {
    const params = new URLSearchParams();
    params.set('flightId', flightId);
    params.set('origin', origin);
    params.set('originCode', originCode);
    params.set('destination', destination);
    params.set('destCode', destCode);
    params.set('depart', departDate);
    if (returnDate) params.set('return', returnDate);
    params.set('tripType', tripType);
    params.set('adults', String(adults));
    params.set('children', String(children));
    params.set('fare', selectedFare);
    params.set('total', String(totalPrice));
    navigate(`/flights/checkout?${params.toString()}`);
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-3">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/flights" className="text-booking-blue-light hover:underline">Flights</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link
              to={`/flights/search?origin=${origin}&destination=${destination}`}
              className="text-booking-blue-light hover:underline"
            >
              {origin} to {destination}
            </Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">Flight Details</span>
          </nav>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Header with Save/Share */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
                    {origin} to {destination}
                  </h1>
                  <p className="text-neutral-600">
                    {tripType === 'round-trip' ? 'Round trip' : 'One way'} - {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                      isSaved ? 'border-red-500 text-red-500' : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-neutral-600">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                      </svg>
                      <span className="text-sm font-medium text-neutral-600">Share</span>
                    </button>

                    {showShareOptions && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10">
                        <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9z" />
                          </svg>
                          Copy link
                        </button>
                        <button onClick={() => handleShare('email')} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" />
                          </svg>
                          Email
                        </button>
                        <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2">
                          <span className="w-4 h-4 bg-blue-600 text-white text-xs flex items-center justify-center rounded">f</span>
                          Facebook
                        </button>
                        <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2">
                          <span className="w-4 h-4 bg-black text-white text-xs flex items-center justify-center rounded">X</span>
                          X (Twitter)
                        </button>
                        <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2">
                          <span className="w-4 h-4 bg-green-500 text-white text-xs flex items-center justify-center rounded">W</span>
                          WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Outbound Flight Details */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="bg-booking-blue text-white px-4 py-2 font-medium">
                  Outbound - {format(parseISO(outboundFlight.departureDate), 'EEE, d MMM yyyy')}
                </div>
                <div className="p-4">
                  {/* Airline Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-600">
                      {outboundFlight.airlineCode}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-800">{outboundFlight.airline}</div>
                      <div className="text-sm text-neutral-500">{outboundFlight.flightNumber} - {outboundFlight.aircraft}</div>
                    </div>
                  </div>

                  {/* Flight Route */}
                  <div className="flex items-center gap-4">
                    {/* Departure */}
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-neutral-800">{outboundFlight.departureTime}</div>
                      <div className="font-medium text-neutral-700">{outboundFlight.departureCode}</div>
                      <div className="text-sm text-neutral-500">{outboundFlight.departureAirport}</div>
                      {outboundFlight.terminal && (
                        <div className="text-xs text-neutral-400">{outboundFlight.terminal}</div>
                      )}
                      <div className="text-xs text-neutral-400 mt-1">
                        {format(parseISO(outboundFlight.departureDate), 'd MMM yyyy')} ({outboundFlight.departureTimezone})
                      </div>
                    </div>

                    {/* Duration Line */}
                    <div className="flex-1 text-center">
                      <div className="text-sm text-neutral-500 mb-2">{formatDuration(outboundFlight.duration)}</div>
                      <div className="relative">
                        <div className="border-t-2 border-neutral-300"></div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue rotate-90">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-xs text-success mt-2 font-medium">Direct flight</div>
                    </div>

                    {/* Arrival */}
                    <div className="flex-1 text-right">
                      <div className="text-2xl font-bold text-neutral-800">{outboundFlight.arrivalTime}</div>
                      <div className="font-medium text-neutral-700">{outboundFlight.arrivalCode}</div>
                      <div className="text-sm text-neutral-500">{outboundFlight.arrivalAirport}</div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {format(parseISO(outboundFlight.arrivalDate), 'd MMM yyyy')} ({outboundFlight.arrivalTimezone})
                      </div>
                    </div>
                  </div>

                  {/* Onboard Services */}
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                      </svg>
                      {selectedFareData.features.meals}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                      </svg>
                      WiFi available
                    </span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8l7 4-7 4z" />
                      </svg>
                      Entertainment
                    </span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 16H4V8h16v12z" />
                      </svg>
                      USB charging
                    </span>
                  </div>
                </div>
              </div>

              {/* Return Flight Details */}
              {returnFlight && (
                <div className="border border-neutral-200 rounded-lg overflow-hidden mt-4">
                  <div className="bg-booking-blue text-white px-4 py-2 font-medium">
                    Return - {format(parseISO(returnFlight.departureDate), 'EEE, d MMM yyyy')}
                  </div>
                  <div className="p-4">
                    {/* Airline Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-600">
                        {returnFlight.airlineCode}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">{returnFlight.airline}</div>
                        <div className="text-sm text-neutral-500">{returnFlight.flightNumber} - {returnFlight.aircraft}</div>
                      </div>
                    </div>

                    {/* Flight Route */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-neutral-800">{returnFlight.departureTime}</div>
                        <div className="font-medium text-neutral-700">{returnFlight.departureCode}</div>
                        <div className="text-sm text-neutral-500">{returnFlight.departureAirport}</div>
                        {returnFlight.terminal && (
                          <div className="text-xs text-neutral-400">{returnFlight.terminal}</div>
                        )}
                        <div className="text-xs text-neutral-400 mt-1">
                          {format(parseISO(returnFlight.departureDate), 'd MMM yyyy')} ({returnFlight.departureTimezone})
                        </div>
                      </div>

                      <div className="flex-1 text-center">
                        <div className="text-sm text-neutral-500 mb-2">{formatDuration(returnFlight.duration)}</div>
                        <div className="relative">
                          <div className="border-t-2 border-neutral-300"></div>
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue rotate-90">
                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-xs text-success mt-2 font-medium">Direct flight</div>
                      </div>

                      <div className="flex-1 text-right">
                        <div className="text-2xl font-bold text-neutral-800">{returnFlight.arrivalTime}</div>
                        <div className="font-medium text-neutral-700">{returnFlight.arrivalCode}</div>
                        <div className="text-sm text-neutral-500">{returnFlight.arrivalAirport}</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {format(parseISO(returnFlight.arrivalDate), 'd MMM yyyy')} ({returnFlight.arrivalTimezone})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fare Classes Selection */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">Select your fare</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fareClasses.map((fare) => (
                  <div
                    key={fare.id}
                    onClick={() => setSelectedFare(fare.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedFare === fare.id
                        ? 'border-booking-blue bg-blue-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-neutral-800">{fare.name}</h3>
                      {selectedFare === fare.id && (
                        <div className="w-5 h-5 bg-booking-blue rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-booking-blue mb-4">
                      EUR {fare.price}
                      <span className="text-sm font-normal text-neutral-500">/person</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-success flex-shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                        <span>{fare.features.carryOn}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        {fare.features.checkedBag.includes('Not included') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-warning flex-shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-success flex-shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{fare.features.checkedBag}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5">
                          <path d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z" />
                        </svg>
                        <span>{fare.features.seatSelection}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        {fare.features.changes === 'Not permitted' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-error flex-shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                        ) : fare.features.changes.includes('Free') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-success flex-shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-warning flex-shrink-0 mt-0.5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                        )}
                        <span>{fare.features.changes}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        {fare.features.cancellation === 'Non-refundable' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-error flex-shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                        ) : fare.features.cancellation.includes('Full') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-success flex-shrink-0 mt-0.5">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-warning flex-shrink-0 mt-0.5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                        )}
                        <span>{fare.features.cancellation}</span>
                      </li>
                    </ul>
                    {fare.features.priority && (
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <span className="inline-flex items-center gap-1 text-xs text-booking-blue font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          Priority boarding
                        </span>
                      </div>
                    )}
                    {fare.features.loungeAccess && (
                      <span className="inline-flex items-center gap-1 text-xs text-booking-blue font-medium ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Lounge access
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Baggage Options */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <button
                onClick={() => toggleSection('baggage')}
                className="w-full flex items-center justify-between text-lg font-bold text-neutral-800"
              >
                <span>Baggage</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-transform ${expandedSections.includes('baggage') ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>

              {expandedSections.includes('baggage') && (
                <div className="mt-4 space-y-3">
                  {baggageOptions.map((bag) => (
                    <div key={bag.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                          {bag.type === 'carry-on' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                              <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 3h4v3h-4V3z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                              <path d="M17 6h-2V3c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM11 3h2v3h-2V3zm6 14H7V8h10v9z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-800">{bag.name}</div>
                          <div className="text-sm text-neutral-500">
                            {bag.weight}
                            {bag.dimensions && ` - ${bag.dimensions}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {bag.included ? (
                          <span className="text-success font-medium">Included</span>
                        ) : bag.price === 0 ? (
                          <span className="text-success font-medium">Free</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-800">EUR {bag.price}</span>
                            <button
                              onClick={() => {
                                if (extraBaggage.includes(bag.id)) {
                                  setExtraBaggage(extraBaggage.filter(id => id !== bag.id));
                                } else {
                                  setExtraBaggage([...extraBaggage, bag.id]);
                                }
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                extraBaggage.includes(bag.id)
                                  ? 'bg-booking-blue text-white'
                                  : 'border border-booking-blue text-booking-blue hover:bg-blue-50'
                              }`}
                            >
                              {extraBaggage.includes(bag.id) ? 'Added' : 'Add'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cancellation and Change Policies */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <button
                onClick={() => toggleSection('policies')}
                className="w-full flex items-center justify-between text-lg font-bold text-neutral-800"
              >
                <span>Cancellation and change policies</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-transform ${expandedSections.includes('policies') ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>

              {expandedSections.includes('policies') && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h4 className="font-medium text-neutral-800 mb-2">Cancellation policy - {selectedFareData.name}</h4>
                    <p className="text-neutral-600 text-sm">
                      {selectedFareData.features.cancellation === 'Non-refundable' ? (
                        <>This fare is non-refundable. If you need to cancel, no refund will be provided.</>
                      ) : selectedFareData.features.cancellation.includes('Full') ? (
                        <>Free cancellation up to 24 hours before departure. Full refund will be processed within 5-7 business days.</>
                      ) : (
                        <>Cancellation available with a fee of {selectedFareData.features.cancellation.replace('fee', '')}. Request must be made at least 24 hours before departure.</>
                      )}
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h4 className="font-medium text-neutral-800 mb-2">Change policy - {selectedFareData.name}</h4>
                    <p className="text-neutral-600 text-sm">
                      {selectedFareData.features.changes === 'Not permitted' ? (
                        <>Changes are not permitted for this fare. You will need to cancel and rebook if you need different dates.</>
                      ) : selectedFareData.features.changes.includes('Free') ? (
                        <>Free unlimited date and time changes. Name changes are not permitted. Changes must be made at least 2 hours before departure.</>
                      ) : (
                        <>Date and time changes available with a fee of {selectedFareData.features.changes.replace('fee', '')}. Name changes are not permitted.</>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Travel Requirements */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <button
                onClick={() => toggleSection('requirements')}
                className="w-full flex items-center justify-between text-lg font-bold text-neutral-800"
              >
                <span>Travel document requirements</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-transform ${expandedSections.includes('requirements') ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>

              {expandedSections.includes('requirements') && (
                <div className="mt-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium text-yellow-800">Important: Check travel requirements before you fly</p>
                        <p className="text-sm text-yellow-700 mt-1">Entry requirements vary and can change. Verify visa, passport, and health requirements for your destination.</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span><strong>Passport:</strong> Must be valid for at least 6 months beyond your travel date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span><strong>Visa:</strong> Check if you need a visa for {destination}. EU citizens do not need a visa for stays up to 90 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span><strong>Health:</strong> Check current health and vaccination requirements for {destination}.</span>
                    </li>
                  </ul>

                  <a href="#" className="inline-block mt-4 text-booking-blue-light hover:underline text-sm">
                    View detailed travel requirements &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Seat Selection Info */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <button
                onClick={() => toggleSection('seats')}
                className="w-full flex items-center justify-between text-lg font-bold text-neutral-800"
              >
                <span>Seat selection</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-transform ${expandedSections.includes('seats') ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>

              {expandedSections.includes('seats') && (
                <div className="mt-4">
                  <p className="text-neutral-600 text-sm mb-4">{selectedFareData.features.seatSelection}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 border border-neutral-200 rounded-lg text-center">
                      <div className="font-medium text-neutral-800">Standard seat</div>
                      <div className="text-sm text-neutral-500">Included with Standard & Flexible</div>
                    </div>
                    <div className="p-3 border border-neutral-200 rounded-lg text-center">
                      <div className="font-medium text-neutral-800">Extra legroom</div>
                      <div className="text-sm text-neutral-500">From EUR 25</div>
                    </div>
                    <div className="p-3 border border-neutral-200 rounded-lg text-center">
                      <div className="font-medium text-neutral-800">Front row</div>
                      <div className="text-sm text-neutral-500">From EUR 35</div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-4">Seat selection will be available after booking confirmation.</p>
                </div>
              )}
            </div>

            {/* Special Requirements */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <button
                onClick={() => toggleSection('special')}
                className="w-full flex items-center justify-between text-lg font-bold text-neutral-800"
              >
                <span>Special assistance & requests</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-transform ${expandedSections.includes('special') ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>

              {expandedSections.includes('special') && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                      <path d="M12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 13.5c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5zm4.5-9L13 11V4h-2v7l-3.5-2.5L6 10l6 4.5 6-4.5-1.5-1.5z" />
                    </svg>
                    <div>
                      <div className="font-medium text-neutral-800">Wheelchair assistance</div>
                      <div className="text-sm text-neutral-500">Free of charge - request after booking</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                    </svg>
                    <div>
                      <div className="font-medium text-neutral-800">Special meals</div>
                      <div className="text-sm text-neutral-500">Vegetarian, vegan, kosher, halal, and more - request after booking</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 5.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5z" />
                    </svg>
                    <div>
                      <div className="font-medium text-neutral-800">Travelling with infants</div>
                      <div className="text-sm text-neutral-500">Bassinets available on request for infants under 2 years</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Alternative Flights */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">Alternative flight options</h2>
              <div className="space-y-3">
                {alternativeFlights.map((alt) => (
                  <Link
                    key={alt.id}
                    to={`/flights/detail?flightId=${alt.id}&origin=${origin}&destination=${destination}&depart=${departDate}`}
                    className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:border-booking-blue-light transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium text-neutral-800">{alt.departureTime} - {alt.arrivalTime}</div>
                        <div className="text-sm text-neutral-500">{alt.airline} - {formatDuration(alt.duration)} - Direct</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-booking-blue">EUR {alt.price}</div>
                      <div className="text-xs text-neutral-500">per person</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Airline Reviews */}
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-800">Traveller reviews for {outboundFlight.airline}</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-booking-blue text-white font-bold px-2 py-1 rounded">8.5</div>
                  <span className="text-neutral-600 text-sm">Very good (1,234 reviews)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-800">8.7</div>
                  <div className="text-sm text-neutral-500">Service</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-800">8.2</div>
                  <div className="text-sm text-neutral-500">Comfort</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-800">8.4</div>
                  <div className="text-sm text-neutral-500">Food</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-800">8.6</div>
                  <div className="text-sm text-neutral-500">Punctuality</div>
                </div>
              </div>
              <div className="space-y-4">
                {airlineReviews.map((review, idx) => (
                  <div key={idx} className="border-t border-neutral-100 pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-booking-blue text-white rounded-full flex items-center justify-center font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">{review.name}</div>
                        <div className="text-sm text-neutral-500">{review.country} - {format(parseISO(review.date), 'MMM yyyy')}</div>
                      </div>
                      <div className="ml-auto bg-booking-blue text-white font-bold px-2 py-1 rounded text-sm">
                        {review.rating}
                      </div>
                    </div>
                    <p className="text-neutral-600 text-sm">&quot;{review.comment}&quot;</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-booking-blue-light hover:underline text-sm">
                View all 1,234 reviews &rarr;
              </button>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-neutral-800 mb-4">Price breakdown</h3>

              <div className="space-y-3 pb-4 border-b border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    {selectedFareData.name} x {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
                  </span>
                  <span className="text-neutral-800">EUR {baseFare.toFixed(2)}</span>
                </div>
                {extraBaggageCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Extra baggage</span>
                    <span className="text-neutral-800">EUR {extraBaggageCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Taxes and fees</span>
                  <span className="text-neutral-800">EUR {taxes.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-neutral-200">
                <span className="font-bold text-neutral-800">Total</span>
                <span className="text-2xl font-bold text-booking-blue">EUR {totalPrice.toFixed(2)}</span>
              </div>

              <p className="text-xs text-neutral-500 mt-2 mb-4">
                Includes taxes and fees. No hidden costs.
              </p>

              {/* Book Now Button */}
              <button
                onClick={handleProceedToBooking}
                className="w-full py-4 bg-booking-blue-light text-white font-bold text-lg rounded hover:bg-booking-blue transition-colors min-h-[48px]"
              >
                Book Now - EUR {totalPrice.toFixed(2)}
              </button>

              <p className="text-xs text-center text-neutral-500 mt-3">
                You will not be charged yet
              </p>

              {/* Back to Search */}
              <Link
                to={`/flights/search?origin=${origin}&originCode=${originCode}&destination=${destination}&destCode=${destCode}&depart=${departDate}${returnDate ? `&return=${returnDate}` : ''}&tripType=${tripType}&adults=${adults}&children=${children}`}
                className="block text-center mt-4 text-booking-blue-light hover:underline text-sm"
              >
                &larr; Back to search results
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal for Save */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-neutral-800 mb-4">Save this flight</h3>
            <p className="text-neutral-600 mb-6">
              Sign in to save this flight to your account and access it from any device.
            </p>
            <div className="space-y-3">
              <Link
                to="/sign-in"
                className="block w-full py-3 bg-booking-blue text-white font-bold text-center rounded hover:bg-booking-blue-hover transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block w-full py-3 border border-booking-blue text-booking-blue font-bold text-center rounded hover:bg-blue-50 transition-colors"
              >
                Create account
              </Link>
              <button
                onClick={handleSaveWithoutLogin}
                className="w-full py-3 text-neutral-600 hover:text-neutral-800 text-sm"
              >
                Save without signing in
              </button>
            </div>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-400">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
