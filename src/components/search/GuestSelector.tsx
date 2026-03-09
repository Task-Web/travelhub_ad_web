import { useState, useRef, useEffect } from 'react';

interface GuestSelectorProps {
  adults: number;
  childrenCount: number;
  rooms: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onRoomsChange: (value: number) => void;
}

export default function GuestSelector({
  adults,
  childrenCount,
  rooms,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSummary = () => {
    const parts = [];
    parts.push(`${adults} adult${adults !== 1 ? 's' : ''}`);
    if (childrenCount > 0) {
      parts.push(`${childrenCount} child${childrenCount !== 1 ? 'ren' : ''}`);
    }
    parts.push(`${rooms} room${rooms !== 1 ? 's' : ''}`);
    return parts.join(' \u00B7 ');
  };

  const Counter = ({
    label,
    value,
    onChange,
    min = 0,
    max = 30,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-neutral-800">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
            value <= min
              ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              : 'border-booking-blue text-booking-blue hover:bg-booking-blue hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </button>
        <span className="w-8 text-center font-medium text-neutral-800">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
            value >= max
              ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              : 'border-booking-blue text-booking-blue hover:bg-booking-blue hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white rounded px-4 py-3 border-2 border-transparent hover:border-booking-blue-light min-w-[200px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        <div className="text-left">
          <p className="text-xs text-neutral-500">Guests</p>
          <p className="font-medium text-neutral-800">{getSummary()}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-dropdown z-dropdown min-w-[280px] p-4">
          <Counter label="Adults" value={adults} onChange={onAdultsChange} min={1} />
          <Counter label="Children" value={childrenCount} onChange={onChildrenChange} />
          <Counter label="Rooms" value={rooms} onChange={onRoomsChange} min={1} />
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2 bg-booking-blue text-white font-medium rounded hover:bg-booking-blue-hover transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
