import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import DestinationInput from './DestinationInput';
import DatePicker, { FlexibleDays } from './DatePicker';
import GuestSelector from './GuestSelector';

interface StaysSearchFormProps {
  compact?: boolean;
}

export default function StaysSearchForm({ compact = false }: StaysSearchFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize state from URL params if present
  const initialDestination = searchParams.get('destination') || '';
  const initialCheckin = searchParams.get('checkin');
  const initialCheckout = searchParams.get('checkout');
  const initialAdults = parseInt(searchParams.get('adults') || '2', 10);
  const initialChildren = parseInt(searchParams.get('children') || '0', 10);
  const initialRooms = parseInt(searchParams.get('rooms') || '1', 10);
  const initialEntireHome = searchParams.get('entire_home') === 'true';
  const initialAddFlights = searchParams.get('add_flights') === 'true';
  const initialFlexDays = parseInt(searchParams.get('flex_days') || '0', 10) as FlexibleDays;

  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState<Date | null>(
    initialCheckin ? parse(initialCheckin, 'yyyy-MM-dd', new Date()) : null
  );
  const [checkOut, setCheckOut] = useState<Date | null>(
    initialCheckout ? parse(initialCheckout, 'yyyy-MM-dd', new Date()) : null
  );
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [rooms, setRooms] = useState(initialRooms);
  const [entireHome, setEntireHome] = useState(initialEntireHome);
  const [addFlights, setAddFlights] = useState(initialAddFlights);
  const [travellingForWork, setTravellingForWork] = useState(false);
  const [flexibleDays, setFlexibleDays] = useState<FlexibleDays>(initialFlexDays);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkin', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkout', format(checkOut, 'yyyy-MM-dd'));
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());
    if (entireHome) params.set('entire_home', 'true');
    if (addFlights) params.set('add_flights', 'true');
    if (travellingForWork) params.set('work', 'true');
    if (flexibleDays > 0) params.set('flex_days', flexibleDays.toString());

    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <div className="bg-yellow-400 p-1 rounded-lg">
        <div className="flex flex-wrap gap-1">
          <DestinationInput value={destination} onChange={setDestination} />
          <DatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            flexibleDays={flexibleDays}
            onFlexibleDaysChange={setFlexibleDays}
          />
          <GuestSelector
            adults={adults}
            childrenCount={children}
            rooms={rooms}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
            onRoomsChange={setRooms}
          />
          <button
            onClick={handleSearch}
            className="bg-booking-blue-light text-white font-bold px-6 py-3 rounded hover:bg-booking-blue transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="bg-yellow-400 p-1 rounded-lg">
        <div className="flex flex-wrap gap-1 items-stretch">
          <DestinationInput value={destination} onChange={setDestination} />
          <DatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            flexibleDays={flexibleDays}
            onFlexibleDaysChange={setFlexibleDays}
          />
          <GuestSelector
            adults={adults}
            childrenCount={children}
            rooms={rooms}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
            onRoomsChange={setRooms}
          />
          <button
            onClick={handleSearch}
            className="bg-booking-blue-light text-white font-bold px-8 py-3 rounded hover:bg-booking-blue transition-colors text-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4 text-white">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entireHome}
            onChange={(e) => setEntireHome(e.target.checked)}
            className="w-5 h-5 rounded border-white/50 bg-transparent accent-booking-blue-light"
          />
          <span>I&apos;m looking for an entire home or apartment</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={addFlights}
            onChange={(e) => setAddFlights(e.target.checked)}
            className="w-5 h-5 rounded border-white/50 bg-transparent accent-booking-blue-light"
          />
          <span>Add flights to my search</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={travellingForWork}
            onChange={(e) => setTravellingForWork(e.target.checked)}
            className="w-5 h-5 rounded border-white/50 bg-transparent accent-booking-blue-light"
          />
          <span>I&apos;m travelling for work</span>
        </label>
      </div>
    </div>
  );
}
