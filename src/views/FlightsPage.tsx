import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay, isAfter, getDay } from 'date-fns';

type TripType = 'round-trip' | 'one-way' | 'multi-city';
type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  distance?: string;
}

// Comprehensive list of airports for autocomplete
const airports: Airport[] = [
  // London airports
  { code: 'LON', name: 'All London Airports', city: 'London', country: 'United Kingdom' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', distance: '24 km from city centre' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', distance: '40 km from city centre' },
  { code: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom', distance: '56 km from city centre' },
  { code: 'LTN', name: 'Luton Airport', city: 'London', country: 'United Kingdom', distance: '48 km from city centre' },
  { code: 'LCY', name: 'London City Airport', city: 'London', country: 'United Kingdom', distance: '9 km from city centre' },
  // New York airports
  { code: 'NYC', name: 'All New York Airports', city: 'New York', country: 'United States' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', distance: '26 km from city centre' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States', distance: '13 km from city centre' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'United States', distance: '18 km from city centre' },
  // Paris airports
  { code: 'PAR', name: 'All Paris Airports', city: 'Paris', country: 'France' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', distance: '25 km from city centre' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', distance: '14 km from city centre' },
  // Other major airports
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', distance: '15 km from city centre' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', distance: '12 km from city centre' },
  { code: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain', distance: '12 km from city centre' },
  { code: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy', distance: '32 km from city centre' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', distance: '12 km from city centre' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', distance: '28 km from city centre' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates', distance: '5 km from city centre' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', distance: '20 km from city centre' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', distance: '34 km from city centre' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', distance: '60 km from city centre' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', distance: '15 km from city centre' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', distance: '18 km from city centre' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', distance: '21 km from city centre' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States', distance: '27 km from city centre' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States', distance: '13 km from city centre' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', distance: '8 km from city centre' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', distance: '23 km from city centre' },
];

const popularRoutes = [
  { from: 'London', to: 'New York', price: 329 },
  { from: 'London', to: 'Paris', price: 45 },
  { from: 'London', to: 'Barcelona', price: 62 },
  { from: 'London', to: 'Amsterdam', price: 52 },
  { from: 'London', to: 'Dubai', price: 285 },
];

// Top flights data organized by category
const topFlightsData = {
  'Popular routes': [
    'London to New York', 'London to Paris', 'London to Dubai', 'London to Barcelona',
    'London to Amsterdam', 'London to Rome', 'London to Lisbon', 'London to Madrid',
    'London to Athens', 'London to Berlin', 'London to Dublin', 'London to Milan',
    'London to Prague', 'London to Vienna', 'London to Zurich', 'London to Geneva',
  ],
  'Cities': [
    'New York', 'Paris', 'Dubai', 'Barcelona', 'Amsterdam', 'Rome', 'Lisbon', 'Madrid',
    'Athens', 'Berlin', 'Dublin', 'Milan', 'Prague', 'Vienna', 'Zurich', 'Geneva',
    'Bangkok', 'Singapore', 'Tokyo', 'Sydney', 'Los Angeles', 'Miami', 'Toronto', 'Istanbul',
  ],
  'Countries': [
    'United States', 'France', 'United Arab Emirates', 'Spain', 'Netherlands', 'Italy',
    'Portugal', 'Greece', 'Germany', 'Ireland', 'Czech Republic', 'Austria', 'Switzerland',
    'Thailand', 'Japan', 'Australia', 'Canada', 'Turkey', 'Mexico', 'Brazil',
  ],
  'Regions': [
    'Western Europe', 'Eastern Europe', 'Mediterranean', 'Middle East', 'North America',
    'Caribbean', 'South America', 'Southeast Asia', 'East Asia', 'Oceania',
    'Northern Europe', 'Scandinavia', 'Central America', 'Southern Africa', 'Indian Ocean',
  ],
  'Airports': [
    'Heathrow (LHR)', 'Gatwick (LGW)', 'Stansted (STN)', 'Luton (LTN)', 'City (LCY)',
    'JFK New York (JFK)', 'Charles de Gaulle (CDG)', 'Dubai (DXB)', 'Barcelona (BCN)',
    'Amsterdam Schiphol (AMS)', 'Rome Fiumicino (FCO)', 'Frankfurt (FRA)', 'Madrid (MAD)',
    'Munich (MUC)', 'Athens (ATH)', 'Lisbon (LIS)', 'Dublin (DUB)', 'Milan Malpensa (MXP)',
  ],
};

type TopFlightsTab = keyof typeof topFlightsData;

const destinationCards = [
  { country: 'Anywhere', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop', isAnywhere: true },
  { country: 'Spain', image: 'https://images.unsplash.com/photo-1512753360435-329c4535a9a7?w=400&h=300&fit=crop' },
  { country: 'France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop' },
  { country: 'Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop' },
  { country: 'Portugal', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop' },
  { country: 'Greece', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop' },
  { country: 'Germany', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop' },
  { country: 'Netherlands', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop' },
];

// Benefits for the flights page
const flightBenefits = [
  {
    icon: 'search',
    title: 'Search a huge selection',
    description: 'Easily compare flights, airlines and prices - all in one place'
  },
  {
    icon: 'money',
    title: 'Pay no hidden fees',
    description: 'Get a clear price breakdown every step of the way'
  },
  {
    icon: 'flexible',
    title: 'Get more flexibility',
    description: 'Change your travel dates with the Flexible ticket option'
  },
];

interface FlightSegment {
  from: string;
  fromAirport: Airport | null;
  to: string;
  toAirport: Airport | null;
  date: Date | null;
}

// Airport Autocomplete Modal Component
function AirportAutocomplete({
  isOpen,
  onClose,
  onSelect,
  title,
  initialValue
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: Airport) => void;
  title: string;
  initialValue: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchTerm(initialValue);
    }
  }, [isOpen, initialValue]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const term = searchTerm.toLowerCase();
      const filtered = airports.filter(
        (a) =>
          a.code.toLowerCase().includes(term) ||
          a.name.toLowerCase().includes(term) ||
          a.city.toLowerCase().includes(term) ||
          a.country.toLowerCase().includes(term)
      );
      setFilteredAirports(filtered);
    } else {
      // Show popular airports when no search term
      setFilteredAirports(airports.slice(0, 10));
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[70vh] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for airport or city"
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-booking-blue-light"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filteredAirports.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">
              No airports found
            </div>
          ) : (
            filteredAirports.map((airport) => (
              <button
                key={airport.code}
                onClick={() => {
                  onSelect(airport);
                  onClose();
                }}
                className="w-full p-4 text-left hover:bg-neutral-50 border-b border-neutral-100 flex items-start gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 mt-0.5">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
                <div className="flex-1">
                  <div className="font-medium text-neutral-800">
                    {airport.city} ({airport.code})
                  </div>
                  <div className="text-sm text-neutral-500">
                    {airport.name}
                  </div>
                  {airport.distance && (
                    <div className="text-xs text-neutral-400 mt-1">
                      {airport.distance}
                    </div>
                  )}
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                  {airport.country}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Calendar Date Picker Component
function CalendarPicker({
  isOpen,
  onClose,
  departDate,
  returnDate,
  onSelectDates,
  isOneWay = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  departDate: Date | null;
  returnDate: Date | null;
  onSelectDates: (depart: Date, returnD: Date | null) => void;
  isOneWay?: boolean;
}) {
  const [selectedDepart, setSelectedDepart] = useState<Date | null>(departDate);
  const [selectedReturn, setSelectedReturn] = useState<Date | null>(returnDate);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const today = startOfDay(new Date());

  useEffect(() => {
    if (isOpen) {
      setSelectedDepart(departDate);
      setSelectedReturn(returnDate);
    }
  }, [isOpen, departDate, returnDate]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (isOneWay) {
      setSelectedDepart(date);
      onSelectDates(date, null);
      onClose();
      return;
    }

    if (!selectedDepart || (selectedDepart && selectedReturn)) {
      // Start new selection
      setSelectedDepart(date);
      setSelectedReturn(null);
    } else if (selectedDepart && !selectedReturn) {
      // Select return date
      if (isBefore(date, selectedDepart)) {
        setSelectedDepart(date);
        setSelectedReturn(null);
      } else {
        setSelectedReturn(date);
        onSelectDates(selectedDepart, date);
        onClose();
      }
    }
  };

  const renderMonth = (monthStart: Date) => {
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);

    // Pad beginning of month
    const paddingDays = Array(startDay).fill(null);

    return (
      <div className="flex-1">
        <div className="text-center font-bold text-neutral-800 mb-4">
          {format(monthStart, 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-xs text-neutral-500 font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} />
          ))}
          {days.map((day) => {
            const isDisabled = isBefore(day, today);
            const isSelected = (selectedDepart && isSameDay(day, selectedDepart)) ||
                               (selectedReturn && isSameDay(day, selectedReturn));
            const isInRange = selectedDepart && selectedReturn &&
                              isAfter(day, selectedDepart) && isBefore(day, selectedReturn);
            const isToday = isSameDay(day, today);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={`
                  p-2 text-sm rounded transition-colors
                  ${isDisabled ? 'text-neutral-300 cursor-not-allowed' : 'hover:bg-booking-blue-light/10'}
                  ${isSelected ? 'bg-booking-blue text-white hover:bg-booking-blue' : ''}
                  ${isInRange ? 'bg-booking-blue/10' : ''}
                  ${isToday && !isSelected ? 'ring-1 ring-booking-blue' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-800">
            {isOneWay ? 'Select departure date' : 'Select dates'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            disabled={isSameMonth(currentMonth, today)}
            className="p-2 hover:bg-neutral-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-neutral-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>

        {/* Two Month Display */}
        <div className="flex gap-8">
          {renderMonth(currentMonth)}
          {renderMonth(addMonths(currentMonth, 1))}
        </div>

        {/* Selected dates display */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {selectedDepart && (
              <span>
                <strong>Depart:</strong> {format(selectedDepart, 'EEE, d MMM yyyy')}
              </span>
            )}
            {selectedReturn && (
              <span className="ml-4">
                <strong>Return:</strong> {format(selectedReturn, 'EEE, d MMM yyyy')}
              </span>
            )}
          </div>
          {!isOneWay && selectedDepart && !selectedReturn && (
            <span className="text-sm text-booking-blue-light">Click another date for return</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Traveller Selector Modal
function TravellerSelector({
  isOpen,
  onClose,
  adults,
  childrenCount,
  infants,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  adults: number;
  childrenCount: number;
  infants: number;
  onUpdate: (adults: number, children: number, infants: number) => void;
}) {
  const [localAdults, setLocalAdults] = useState(adults);
  const [localChildren, setLocalChildren] = useState(childrenCount);
  const [localInfants, setLocalInfants] = useState(infants);

  useEffect(() => {
    if (isOpen) {
      setLocalAdults(adults);
      setLocalChildren(childrenCount);
      setLocalInfants(infants);
    }
  }, [isOpen, adults, childrenCount, infants]);

  const handleDone = () => {
    onUpdate(localAdults, localChildren, localInfants);
    onClose();
  };

  if (!isOpen) return null;

  const CounterButton = ({ value, onIncrement, onDecrement, min = 0, max = 9 }: {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
  }) => (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-booking-blue-light disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M19 13H5v-2h14v2z" />
        </svg>
      </button>
      <span className="w-8 text-center font-medium">{value}</span>
      <button
        onClick={onIncrement}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-booking-blue-light disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-800">Travellers</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-800">Adults</div>
              <div className="text-sm text-neutral-500">Age 16+</div>
            </div>
            <CounterButton
              value={localAdults}
              onIncrement={() => setLocalAdults(localAdults + 1)}
              onDecrement={() => setLocalAdults(localAdults - 1)}
              min={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-800">Children</div>
              <div className="text-sm text-neutral-500">Age 0-15</div>
            </div>
            <CounterButton
              value={localChildren}
              onIncrement={() => setLocalChildren(localChildren + 1)}
              onDecrement={() => setLocalChildren(localChildren - 1)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-800">Infants</div>
              <div className="text-sm text-neutral-500">Under 2, on lap</div>
            </div>
            <CounterButton
              value={localInfants}
              onIncrement={() => setLocalInfants(localInfants + 1)}
              onDecrement={() => setLocalInfants(localInfants - 1)}
              max={localAdults}
            />
          </div>
        </div>

        <button
          onClick={handleDone}
          className="w-full mt-6 bg-booking-blue text-white font-bold py-3 rounded hover:bg-booking-blue-hover transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [origin, setOrigin] = useState('');
  const [originAirport, setOriginAirport] = useState<Airport | null>(null);
  const [destination, setDestination] = useState('');
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState<Date | null>(addDays(new Date(), 7));
  const [returnDate, setReturnDate] = useState<Date | null>(addDays(new Date(), 14));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [directFlights, setDirectFlights] = useState(false);
  const [multiCitySegments, setMultiCitySegments] = useState<FlightSegment[]>([
    { from: '', fromAirport: null, to: '', toAirport: null, date: addDays(new Date(), 7) },
    { from: '', fromAirport: null, to: '', toAirport: null, date: addDays(new Date(), 10) },
  ]);

  // Modal states
  const [showOriginSearch, setShowOriginSearch] = useState(false);
  const [showDestSearch, setShowDestSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTravellers, setShowTravellers] = useState(false);

  // Top flights tab state
  const [topFlightsTab, setTopFlightsTab] = useState<TopFlightsTab>('Popular routes');

  const addSegment = () => {
    if (multiCitySegments.length < 5) {
      setMultiCitySegments([
        ...multiCitySegments,
        { from: '', fromAirport: null, to: '', toAirport: null, date: addDays(new Date(), multiCitySegments.length * 3 + 7) },
      ]);
    }
  };

  const removeSegment = (index: number) => {
    if (multiCitySegments.length > 2) {
      setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index));
    }
  };

  const updateSegment = (index: number, field: keyof FlightSegment, value: string | Date | null | Airport) => {
    const updated = [...multiCitySegments];
    updated[index] = { ...updated[index], [field]: value };
    setMultiCitySegments(updated);
  };

  const swapOriginDestination = () => {
    const tempOrigin = origin;
    const tempOriginAirport = originAirport;
    setOrigin(destination);
    setOriginAirport(destinationAirport);
    setDestination(tempOrigin);
    setDestinationAirport(tempOriginAirport);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (origin) params.set('origin', origin);
    if (originAirport) params.set('originCode', originAirport.code);
    if (destination) params.set('destination', destination);
    if (destinationAirport) params.set('destCode', destinationAirport.code);
    if (departDate) params.set('depart', format(departDate, 'yyyy-MM-dd'));
    if (tripType === 'round-trip' && returnDate) params.set('return', format(returnDate, 'yyyy-MM-dd'));
    params.set('tripType', tripType);
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('infants', infants.toString());
    params.set('cabin', cabinClass);
    if (directFlights) params.set('direct', 'true');

    navigate(`/flights/search?${params.toString()}`);
  };

  const getTravellerText = () => {
    const total = adults + children + infants;
    const parts = [];
    if (adults > 0) parts.push(`${adults} adult${adults !== 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} child${children !== 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} infant${infants !== 1 ? 's' : ''}`);
    return `${total} traveller${total !== 1 ? 's' : ''}`;
  };

  const formatDateRange = () => {
    if (!departDate) return 'Select dates';
    if (tripType === 'one-way') {
      return format(departDate, 'EEE, d MMM');
    }
    if (!returnDate) return format(departDate, 'EEE, d MMM') + ' - Select return';
    return `${format(departDate, 'EEE, d MMM')} - ${format(returnDate, 'EEE, d MMM')}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Compare and book flights with ease
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover your next dream destination
          </p>

          {/* Flight Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Trip Type Selection */}
            <div className="flex gap-4 mb-6">
              {(['round-trip', 'one-way', 'multi-city'] as TripType[]).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value={type}
                    checked={tripType === type}
                    onChange={() => setTripType(type)}
                    className="w-4 h-4 text-booking-blue"
                  />
                  <span className="capitalize text-neutral-800">
                    {type.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>

            {/* Search Fields - Standard */}
            {tripType !== 'multi-city' && (
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Origin */}
                <button
                  onClick={() => setShowOriginSearch(true)}
                  className="flex-1 min-w-[200px] text-left px-4 py-3 border border-neutral-200 rounded hover:border-booking-blue-light focus:outline-none focus:border-booking-blue-light"
                >
                  <div className="text-xs text-neutral-500 mb-1">Leaving from</div>
                  <div className="text-neutral-800 font-medium truncate">
                    {originAirport ? `${originAirport.city} (${originAirport.code})` : 'City or airport'}
                  </div>
                </button>

                {/* Swap Button */}
                <button
                  onClick={swapOriginDestination}
                  className="self-center w-10 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-100 hover:border-booking-blue-light transition-colors"
                  title="Switch origin and return destinations"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
                  </svg>
                </button>

                {/* Destination */}
                <button
                  onClick={() => setShowDestSearch(true)}
                  className="flex-1 min-w-[200px] text-left px-4 py-3 border border-neutral-200 rounded hover:border-booking-blue-light focus:outline-none focus:border-booking-blue-light"
                >
                  <div className="text-xs text-neutral-500 mb-1">Going to</div>
                  <div className="text-neutral-800 font-medium truncate">
                    {destinationAirport ? `${destinationAirport.city} (${destinationAirport.code})` : 'City or airport'}
                  </div>
                </button>

                {/* Travel Dates */}
                <button
                  onClick={() => setShowCalendar(true)}
                  className="flex-1 min-w-[200px] text-left px-4 py-3 border border-neutral-200 rounded hover:border-booking-blue-light focus:outline-none focus:border-booking-blue-light"
                >
                  <div className="text-xs text-neutral-500 mb-1">Travel dates</div>
                  <div className="text-neutral-800 font-medium">
                    {formatDateRange()}
                  </div>
                </button>

                {/* Travellers */}
                <button
                  onClick={() => setShowTravellers(true)}
                  className="min-w-[150px] text-left px-4 py-3 border border-neutral-200 rounded hover:border-booking-blue-light focus:outline-none focus:border-booking-blue-light"
                >
                  <div className="text-xs text-neutral-500 mb-1">Travellers</div>
                  <div className="text-neutral-800 font-medium">
                    {getTravellerText()}
                  </div>
                </button>
              </div>
            )}

            {/* Multi-city Flight Segments */}
            {tripType === 'multi-city' && (
              <div className="space-y-4 mb-4">
                {multiCitySegments.map((segment, index) => (
                  <div key={index} className="flex items-end gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="font-medium text-neutral-500 w-8">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-neutral-500 mb-1">From</label>
                      <input
                        type="text"
                        value={segment.from}
                        onChange={(e) => updateSegment(index, 'from', e.target.value)}
                        placeholder="City or airport"
                        className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-neutral-500 mb-1">To</label>
                      <input
                        type="text"
                        value={segment.to}
                        onChange={(e) => updateSegment(index, 'to', e.target.value)}
                        placeholder="City or airport"
                        className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-xs text-neutral-500 mb-1">Date</label>
                      <input
                        type="date"
                        value={segment.date ? format(segment.date, 'yyyy-MM-dd') : ''}
                        onChange={(e) => updateSegment(index, 'date', e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                      />
                    </div>
                    {multiCitySegments.length > 2 && (
                      <button
                        onClick={() => removeSegment(index)}
                        className="p-2 text-neutral-400 hover:text-error transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {multiCitySegments.length < 5 && (
                  <button
                    onClick={addSegment}
                    className="flex items-center gap-2 text-booking-blue-light hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Add another flight
                  </button>
                )}
              </div>
            )}

            {/* Cabin Class and Direct Flights Selection */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Cabin class</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                  className="px-4 py-2 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                >
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium economy</option>
                  <option value="business">Business</option>
                  <option value="first">First class</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer self-end">
                <input
                  type="checkbox"
                  checked={directFlights}
                  onChange={(e) => setDirectFlights(e.target.checked)}
                  className="w-4 h-4 text-booking-blue"
                />
                <span className="text-neutral-800">Direct flights only</span>
              </label>
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

      {/* Destination Inspiration / Explore by Country */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Get inspiration for your next trip
        </h2>
        <div className="relative">
          {/* Left Arrow */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
            onClick={() => {
              const container = document.getElementById('destination-carousel');
              if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-700">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div
            id="destination-carousel"
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {destinationCards.map((dest) => (
              <div
                key={dest.country}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (!('isAnywhere' in dest)) {
                    params.set('destination', dest.country);
                  }
                  if (departDate) params.set('depart', format(departDate, 'yyyy-MM-dd'));
                  if (returnDate) params.set('return', format(returnDate, 'yyyy-MM-dd'));
                  params.set('tripType', tripType);
                  params.set('adults', adults.toString());
                  params.set('cabin', cabinClass);
                  navigate(`/flights/search?${params.toString()}`);
                }}
                className={`group relative rounded-lg overflow-hidden flex-shrink-0 shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
                  'isAnywhere' in dest ? 'w-48 h-48 ring-2 ring-booking-blue-light' : 'w-40 h-40'
                }`}
              >
                <img
                  src={dest.image}
                  alt={dest.country}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className={`font-bold ${'isAnywhere' in dest ? 'text-booking-blue-light text-lg' : 'text-white'}`}>
                    {dest.country}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
            onClick={() => {
              const container = document.getElementById('destination-carousel');
              if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-700">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Popular flights near you
          </h2>
          <div className="relative">
            {/* Left Arrow */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
              onClick={() => {
                const container = document.getElementById('routes-carousel');
                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-700">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div
              id="routes-carousel"
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularRoutes.map((route) => (
                <div
                  key={`${route.from}-${route.to}`}
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set('origin', route.from);
                    params.set('destination', route.to);
                    if (departDate) params.set('depart', format(departDate, 'yyyy-MM-dd'));
                    if (returnDate) params.set('return', format(returnDate, 'yyyy-MM-dd'));
                    params.set('tripType', tripType);
                    params.set('adults', adults.toString());
                    params.set('cabin', cabinClass);
                    navigate(`/flights/search?${params.toString()}`);
                  }}
                  className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex-shrink-0 min-w-[200px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-neutral-800">{route.from}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                    <span className="font-medium text-neutral-800">{route.to}</span>
                  </div>
                  <p className="text-booking-blue-light font-bold">
                    From EUR {route.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
              onClick={() => {
                const container = document.getElementById('routes-carousel');
                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-700">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {flightBenefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-booking-blue-light/10 rounded-lg flex items-center justify-center">
                {benefit.icon === 'search' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue-light">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                )}
                {benefit.icon === 'money' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue-light">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                )}
                {benefit.icon === 'flexible' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-booking-blue-light">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">{benefit.title}</h3>
                <p className="text-neutral-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Flights from London Section */}
      <div className="bg-neutral-50">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Top flights from London
          </h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(topFlightsData) as TopFlightsTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTopFlightsTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  topFlightsTab === tab
                    ? 'bg-booking-blue text-white shadow-md'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg p-6 shadow-card">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-3">
              {topFlightsData[topFlightsTab].map((item) => (
                <a
                  key={item}
                  href={`/flights/search?destination=${encodeURIComponent(item)}`}
                  className="text-booking-blue-light hover:underline text-sm py-1 flex items-center gap-1 group"
                >
                  <span>{item}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Frequently asked questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { q: 'How do I find the cheapest flights?', a: 'Use our search filters to compare prices across multiple airlines and dates. Booking in advance and being flexible with dates can help you find better deals.' },
            { q: 'Can I cancel my flight booking?', a: 'Cancellation policies vary by airline and ticket type. Check the fare conditions before booking for details on cancellations and refunds.' },
            { q: 'What is a flexible ticket?', a: 'Flexible tickets allow you to change your travel dates without additional fees (subject to fare difference). They offer more peace of mind for uncertain travel plans.' },
            { q: 'Can I book flights for other people?', a: 'Yes, you can book flights for others. Just enter the correct passenger details during the booking process. The ticket will be issued in their name.' },
            { q: 'How far in advance should I book?', a: 'For the best prices, try to book domestic flights 1-3 months ahead and international flights 2-8 months ahead. Prices tend to rise closer to the departure date.' },
            { q: 'What does cabin class mean?', a: 'Cabin class refers to the level of service you receive on the flight. Options typically include Economy, Premium Economy, Business, and First Class, each offering different amenities and comfort levels.' },
          ].map((faq, index) => (
            <details key={index} className="group border border-neutral-200 rounded-lg bg-white">
              <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-neutral-800 hover:bg-neutral-50 rounded-lg transition-colors">
                {faq.q}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </summary>
              <div className="border-t border-neutral-100">
                <p className="px-4 py-3 text-neutral-600 text-sm">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AirportAutocomplete
        isOpen={showOriginSearch}
        onClose={() => setShowOriginSearch(false)}
        onSelect={(airport) => {
          setOrigin(`${airport.city} (${airport.code})`);
          setOriginAirport(airport);
        }}
        title="Leaving from"
        initialValue={origin}
      />

      <AirportAutocomplete
        isOpen={showDestSearch}
        onClose={() => setShowDestSearch(false)}
        onSelect={(airport) => {
          setDestination(`${airport.city} (${airport.code})`);
          setDestinationAirport(airport);
        }}
        title="Going to"
        initialValue={destination}
      />

      <CalendarPicker
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        departDate={departDate}
        returnDate={returnDate}
        onSelectDates={(depart, returnD) => {
          setDepartDate(depart);
          setReturnDate(returnD);
        }}
        isOneWay={tripType === 'one-way'}
      />

      <TravellerSelector
        isOpen={showTravellers}
        onClose={() => setShowTravellers(false)}
        adults={adults}
        childrenCount={children}
        infants={infants}
        onUpdate={(a, c, i) => {
          setAdults(a);
          setChildren(c);
          setInfants(i);
        }}
      />
    </div>
  );
}
