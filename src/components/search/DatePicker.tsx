import { useState, useRef, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';

export type FlexibleDays = 0 | 1 | 2 | 3 | 7;

interface DatePickerProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onCheckInChange: (date: Date | null) => void;
  onCheckOutChange: (date: Date | null) => void;
  flexibleDays?: FlexibleDays;
  onFlexibleDaysChange?: (days: FlexibleDays) => void;
}

export default function DatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  flexibleDays = 0,
  onFlexibleDaysChange
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const flexibleOptions: { value: FlexibleDays; label: string }[] = [
    { value: 0, label: 'Exact dates' },
    { value: 1, label: '\u00B1 1 day' },
    { value: 2, label: '\u00B1 2 days' },
    { value: 3, label: '\u00B1 3 days' },
    { value: 7, label: '\u00B1 7 days' },
  ];

  const today = startOfDay(new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!selectingCheckOut || !checkIn) {
      onCheckInChange(date);
      onCheckOutChange(null);
      setSelectingCheckOut(true);
    } else {
      if (isBefore(date, checkIn)) {
        onCheckInChange(date);
        onCheckOutChange(null);
      } else {
        onCheckOutChange(date);
        setSelectingCheckOut(false);
        setIsOpen(false);
      }
    }
  };

  const renderCalendar = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    const startDay = start.getDay();

    return (
      <div className="p-4">
        <div className="text-center font-bold text-neutral-800 mb-4">
          {format(month, 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          {days.map((day) => {
            const isPast = isBefore(day, today);
            const isCheckIn = checkIn && isSameDay(day, checkIn);
            const isCheckOut = checkOut && isSameDay(day, checkOut);
            const isInRange = checkIn && checkOut && day > checkIn && day < checkOut;

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className={`p-2 text-sm rounded transition-colors ${
                  isPast
                    ? 'text-neutral-300 cursor-not-allowed'
                    : isCheckIn || isCheckOut
                    ? 'bg-booking-blue text-white'
                    : isInRange
                    ? 'bg-booking-blue/10'
                    : 'hover:bg-neutral-100'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative flex gap-2">
      {/* Check-in */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSelectingCheckOut(false);
        }}
        className="flex items-center gap-2 bg-white rounded px-4 py-3 border-2 border-transparent hover:border-booking-blue-light min-w-[150px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
        </svg>
        <div className="text-left">
          <p className="text-xs text-neutral-500">Check-in</p>
          <p className="font-medium text-neutral-800">
            {checkIn ? format(checkIn, 'EEE d MMM') : 'Add date'}
          </p>
        </div>
      </button>

      {/* Check-out */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSelectingCheckOut(true);
        }}
        className="flex items-center gap-2 bg-white rounded px-4 py-3 border-2 border-transparent hover:border-booking-blue-light min-w-[150px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
        </svg>
        <div className="text-left">
          <p className="text-xs text-neutral-500">Check-out</p>
          <p className="font-medium text-neutral-800">
            {checkOut ? format(checkOut, 'EEE d MMM') : 'Add date'}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dropdown z-dropdown">
          {/* Flexible dates options */}
          {onFlexibleDaysChange && (
            <div className="px-4 pt-4 pb-2 border-b border-neutral-200">
              <p className="text-sm font-medium text-neutral-700 mb-2">Date flexibility</p>
              <div className="flex flex-wrap gap-2">
                {flexibleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onFlexibleDaysChange(option.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      flexibleDays === option.value
                        ? 'bg-booking-blue text-white border-booking-blue'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-booking-blue-light'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {flexibleDays > 0 && (
                <p className="text-xs text-neutral-500 mt-2">
                  Search will include dates {flexibleDays} day{flexibleDays > 1 ? 's' : ''} before or after your selected dates
                </p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between px-4 pt-4">
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="p-2 hover:bg-neutral-100 rounded"
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
          <div className="flex">
            {renderCalendar(currentMonth)}
            {renderCalendar(addMonths(currentMonth, 1))}
          </div>
        </div>
      )}
    </div>
  );
}
