import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface PassengerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
}

export default function FlightCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get flight details from URL
  const flightId = searchParams.get('flight') || '';
  const price = parseInt(searchParams.get('price') || '500');
  const originCode = searchParams.get('origin') || 'LHR';
  const destCode = searchParams.get('destination') || 'JFK';
  const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');

  // Current step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
  useState<PassengerInfo[]>(
    Array(adults + children).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
    }))
  );

  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+852');

  // Ticket type
  const [ticketType, setTicketType] = useState<'standard' | 'flexible'>('standard');
  const flexibleTicketPrice = Math.round(price * 0.15);

  // Additional options
  const [extraBaggage, setExtraBaggage] = useState(false);
  const extraBaggagePrice = 50;
  const [seatSelection, setSeatSelection] = useState(false);
  const seatSelectionPrice = 35;
  const [travelInsurance, setTravelInsurance] = useState(false);
  const travelInsurancePrice = 25;

  // Calculate totals
  const totalPassengers = adults + children;
  const baseTotal = price * totalPassengers;
  const flexibleTotal = ticketType === 'flexible' ? flexibleTicketPrice * totalPassengers : 0;
  const extrasTotal = (extraBaggage ? extraBaggagePrice * totalPassengers : 0) +
                      (seatSelection ? seatSelectionPrice * totalPassengers : 0) +
                      (travelInsurance ? travelInsurancePrice * totalPassengers : 0);
  const discountAmount = Math.round(baseTotal * 0.01); // 1% TravelHub contribution
  const grandTotal = baseTotal + flexibleTotal + extrasTotal - discountAmount;

  // Validation
  const isStep1Valid = useMemo(() => {
    return contactEmail.includes('@') && contactPhone.length >= 8;
  }, [contactEmail, contactPhone]);

  const isStep2Valid = ticketType === 'standard' || ticketType === 'flexible';

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1); // Go back to search results
    }
  };

  const handleSubmit = () => {
    alert(`Booking confirmed!\n\nFlight: ${flightId}\nTotal: EUR ${grandTotal}\nPassengers: ${totalPassengers}\n\nConfirmation email will be sent to ${contactEmail}`);
    navigate('/');
  };

  const steps = [
    { number: 1, name: 'Your information' },
    { number: 2, name: 'Ticket type' },
    { number: 3, name: 'Additional options' },
    { number: 4, name: 'Review and pay' },
  ];

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Header */}
      <div className="bg-booking-blue py-4">
        <div className="max-w-container-lg mx-auto px-4">
          <h1 className="text-xl font-bold text-white">Complete your booking</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-2 ${step.number <= currentStep ? 'text-booking-blue' : 'text-neutral-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.number < currentStep ? 'bg-booking-blue text-white' :
                    step.number === currentStep ? 'border-2 border-booking-blue text-booking-blue' :
                    'border-2 border-neutral-300 text-neutral-400'
                  }`}>
                    {step.number < currentStep ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : step.number}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.name}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 ${step.number < currentStep ? 'bg-booking-blue' : 'bg-neutral-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Summary */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="font-bold text-lg text-neutral-800 mb-4">Trip summary</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-neutral-800">One-way flight</div>
                  <div className="text-sm text-neutral-500">{originCode} to {destCode}</div>
                  <div className="text-sm text-neutral-500">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</div>
                  <div className="text-sm text-neutral-500">{totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-bold text-lg text-neutral-800 mb-4">Contact information</h2>
                <p className="text-sm text-neutral-500 mb-6">Your booking confirmation will be sent to this email address.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light"
                      >
                        <option value="+852">+852 HK</option>
                        <option value="+44">+44 UK</option>
                        <option value="+1">+1 US</option>
                        <option value="+33">+33 FR</option>
                        <option value="+49">+49 DE</option>
                        <option value="+86">+86 CN</option>
                        <option value="+81">+81 JP</option>
                        <option value="+65">+65 SG</option>
                      </select>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Phone number"
                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Baggage Summary */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium text-neutral-800 mb-4">Baggage per passenger</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span>1 small personal item - Included</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span>1 cabin bag (23x36x56cm, 7kg) - Included</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span>1 checked bag (23kg) - Included</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Ticket Type */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-bold text-lg text-neutral-800 mb-4">Select ticket type</h2>

                <div className="space-y-4">
                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      ticketType === 'standard' ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="ticketType"
                        checked={ticketType === 'standard'}
                        onChange={() => setTicketType('standard')}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-800">Standard ticket</span>
                          <span className="font-bold text-neutral-800">Included</span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Changes allowed with fee. Partial refund on cancellation.</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      ticketType === 'flexible' ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="ticketType"
                        checked={ticketType === 'flexible'}
                        onChange={() => setTicketType('flexible')}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-800">Flexible ticket</span>
                          <span className="font-bold text-booking-blue">+ EUR {flexibleTicketPrice} /person</span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Change flight dates for free. Only pay fare difference if applicable.</p>
                        <ul className="mt-2 text-sm text-neutral-600 space-y-1">
                          <li className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            Free date changes
                          </li>
                          <li className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            Peace of mind
                          </li>
                        </ul>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Additional Options */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-bold text-lg text-neutral-800 mb-4">Additional options</h2>
                <p className="text-sm text-neutral-500 mb-6">These extras are optional. You can skip if you don&apos;t need them.</p>

                <div className="space-y-4">
                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${extraBaggage ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200 hover:border-neutral-300'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={extraBaggage}
                        onChange={(e) => setExtraBaggage(e.target.checked)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-800">Extra checked bag (23kg)</span>
                          <span className="font-bold text-neutral-800">+ EUR {extraBaggagePrice} /person</span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Add an additional 23kg checked bag to your booking.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${seatSelection ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200 hover:border-neutral-300'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={seatSelection}
                        onChange={(e) => setSeatSelection(e.target.checked)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-800">Seat selection</span>
                          <span className="font-bold text-neutral-800">+ EUR {seatSelectionPrice} /person</span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Choose your preferred seat before check-in.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${travelInsurance ? 'border-booking-blue bg-booking-blue/5' : 'border-neutral-200 hover:border-neutral-300'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={travelInsurance}
                        onChange={(e) => setTravelInsurance(e.target.checked)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-800">Travel insurance</span>
                          <span className="font-bold text-neutral-800">+ EUR {travelInsurancePrice} /person</span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Coverage for trip cancellation, medical emergencies, and lost baggage.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Review and Pay */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-bold text-lg text-neutral-800 mb-4">Review your booking</h2>

                <div className="space-y-6">
                  {/* Contact Info Summary */}
                  <div className="pb-4 border-b">
                    <h3 className="font-medium text-neutral-700 mb-2">Contact information</h3>
                    <p className="text-sm text-neutral-600">{contactEmail}</p>
                    <p className="text-sm text-neutral-600">{countryCode} {contactPhone}</p>
                  </div>

                  {/* Ticket Type Summary */}
                  <div className="pb-4 border-b">
                    <h3 className="font-medium text-neutral-700 mb-2">Ticket type</h3>
                    <p className="text-sm text-neutral-600">
                      {ticketType === 'flexible' ? 'Flexible ticket' : 'Standard ticket'}
                    </p>
                  </div>

                  {/* Extras Summary */}
                  {(extraBaggage || seatSelection || travelInsurance) && (
                    <div className="pb-4 border-b">
                      <h3 className="font-medium text-neutral-700 mb-2">Additional options</h3>
                      {extraBaggage && <p className="text-sm text-neutral-600">Extra checked bag</p>}
                      {seatSelection && <p className="text-sm text-neutral-600">Seat selection</p>}
                      {travelInsurance && <p className="text-sm text-neutral-600">Travel insurance</p>}
                    </div>
                  )}

                  {/* Terms */}
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      By completing this booking, you agree to the{' '}
                      <Link href="/terms" className="text-booking-blue hover:underline">Terms of Service</Link>,{' '}
                      <Link href="/privacy" className="text-booking-blue hover:underline">Privacy Policy</Link>, and the airline&apos;s conditions of carriage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-6 py-2 border border-neutral-300 rounded font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Back
              </button>
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="px-8 py-2 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Complete booking
                </button>
              )}
            </div>
          </div>

          {/* Price Breakdown Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-4">
              <h3 className="font-bold text-lg text-neutral-800 mb-4">Price breakdown</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Flight ({totalPassengers} passenger{totalPassengers > 1 ? 's' : ''})</span>
                  <span className="font-medium">EUR {baseTotal}</span>
                </div>

                {ticketType === 'flexible' && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Flexible ticket</span>
                    <span className="font-medium">EUR {flexibleTotal}</span>
                  </div>
                )}

                {extraBaggage && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Extra baggage</span>
                    <span className="font-medium">EUR {extraBaggagePrice * totalPassengers}</span>
                  </div>
                )}

                {seatSelection && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Seat selection</span>
                    <span className="font-medium">EUR {seatSelectionPrice * totalPassengers}</span>
                  </div>
                )}

                {travelInsurance && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Travel insurance</span>
                    <span className="font-medium">EUR {travelInsurancePrice * totalPassengers}</span>
                  </div>
                )}

                <div className="flex justify-between text-green-600">
                  <span>TravelHub contribution</span>
                  <span>- EUR {discountAmount}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg text-neutral-800">Total</span>
                    <span className="font-bold text-lg text-booking-blue">EUR {grandTotal}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Taxes and fees included</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-start gap-2 text-sm text-neutral-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  <span>No hidden fees - the price you see is the price you pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
