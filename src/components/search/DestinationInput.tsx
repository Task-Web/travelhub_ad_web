import { useState, useRef, useEffect } from 'react';

interface DestinationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const popularDestinations = [
  { name: 'London', country: 'United Kingdom', type: 'City' },
  { name: 'Paris', country: 'France', type: 'City' },
  { name: 'New York', country: 'United States', type: 'City' },
  { name: 'Tokyo', country: 'Japan', type: 'City' },
  { name: 'Barcelona', country: 'Spain', type: 'City' },
  { name: 'Rome', country: 'Italy', type: 'City' },
  { name: 'Amsterdam', country: 'Netherlands', type: 'City' },
  { name: 'Dubai', country: 'United Arab Emirates', type: 'City' },
  { name: 'Singapore', country: 'Singapore', type: 'City' },
  { name: 'Hong Kong', country: 'China', type: 'City' },
  { name: 'Manchester', country: 'United Kingdom', type: 'City' },
  { name: 'Liverpool', country: 'United Kingdom', type: 'City' },
];

export default function DestinationInput({ value, onChange, placeholder = 'Where are you going?' }: DestinationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(popularDestinations);
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

  useEffect(() => {
    if (value) {
      const filtered = popularDestinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(value.toLowerCase()) ||
          dest.country.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.length > 0 ? filtered : popularDestinations);
    } else {
      setSuggestions(popularDestinations);
    }
  }, [value]);

  const handleSelect = (dest: typeof popularDestinations[0]) => {
    onChange(dest.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[200px]">
      <div className="flex items-center gap-2 bg-white rounded px-4 py-3 border-2 border-transparent focus-within:border-booking-blue-light">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 flex-shrink-0">
          <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full outline-none text-neutral-800 placeholder:text-neutral-500"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="destination-suggestions"
          aria-autocomplete="list"
        />
      </div>

      {isOpen && (
        <div
          id="destination-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-dropdown z-dropdown max-h-80 overflow-auto"
        >
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase">Popular destinations</p>
            {suggestions.map((dest) => (
              <button
                key={`${dest.name}-${dest.country}`}
                onClick={() => handleSelect(dest)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 rounded transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <p className="font-medium text-neutral-800">{dest.name}</p>
                  <p className="text-sm text-neutral-500">{dest.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
