import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore, CURRENCIES, LANGUAGES } from '@/store';

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "user_id";
const COOKIE_MAX_AGE = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 60 * 60 * 24 * 30);

// Cookie override from query parameter - preserving basesite functionality
const applyCookieFromQuery = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const override = url.searchParams.get("cookie");
  if (!override) return false;
  let cookie = `${COOKIE_NAME}=${encodeURIComponent(override)}; Path=/; SameSite=Lax`;
  if (Number.isFinite(COOKIE_MAX_AGE) && COOKIE_MAX_AGE > 0) {
    cookie += `; Max-Age=${Math.floor(COOKIE_MAX_AGE)}`;
  }
  document.cookie = cookie;
  url.searchParams.delete("cookie");
  const redirectUrl = url.toString();
  if (window.location.href !== redirectUrl) {
    window.location.replace(redirectUrl);
    return true;
  }
  return false;
};

// Initialize cookie from query on load
if (typeof window !== "undefined") {
  applyCookieFromQuery();
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'stays',
    label: 'Stays',
    path: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z" />
      </svg>
    ),
  },
  {
    id: 'flights',
    label: 'Flights',
    path: '/flights',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
  },
  {
    id: 'flight-hotel',
    label: 'Flight + Hotel',
    path: '/flight-hotel',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        <path d="M7 14H2v7h5v-7z" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'cars',
    label: 'Car rental',
    path: '/cars',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
  {
    id: 'attractions',
    label: 'Attractions',
    path: '/attractions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    id: 'airport-taxis',
    label: 'Airport taxis',
    path: '/airport-taxis',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
];

export default function Header() {
  const location = useLocation();

  // Use Zustand store for currency/language - syncs to backend (constitution.md Section VI)
  const { preferences, setCurrency, setLanguage, syncWithBackend } = useAppStore();
  const currency = preferences.currency;
  const language = preferences.language;

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Sync with backend on mount to restore preferences
  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="bg-booking-blue sticky top-0 z-sticky">
        {/* Top bar */}
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-white text-2xl font-bold">TravelHub</span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-1">
              {/* Currency selector */}
              <button
                onClick={() => setShowCurrencyModal(true)}
                className="flex items-center gap-1 px-3 py-2 text-white hover:bg-booking-blue-hover rounded transition-colors"
                aria-label="Select currency"
              >
                <span className="font-medium">{currency}</span>
              </button>

              {/* Language selector */}
              <button
                onClick={() => setShowLanguageModal(true)}
                className="flex items-center gap-1 px-3 py-2 text-white hover:bg-booking-blue-hover rounded transition-colors"
                aria-label="Select language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </button>

              {/* Customer support */}
              <Link
                to="/help"
                className="hidden md:flex items-center gap-1 px-3 py-2 text-white hover:bg-booking-blue-hover rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                </svg>
                <span className="text-sm">Customer support</span>
              </Link>

              {/* List your property */}
              <Link
                to="/list-property"
                className="hidden md:flex items-center gap-1 px-3 py-2 text-white hover:bg-booking-blue-hover rounded transition-colors"
              >
                <span className="text-sm">List your property</span>
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="px-3 py-2 text-white hover:bg-booking-blue-hover rounded transition-colors"
              >
                <span className="text-sm">Register</span>
              </Link>

              {/* Sign in */}
              <Link
                to="/sign-in"
                className="px-4 py-2 bg-white text-booking-blue font-medium rounded hover:bg-neutral-100 transition-colors"
              >
                <span className="text-sm">Sign in</span>
              </Link>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1 pb-2 -mb-[1px] overflow-x-auto" role="menubar">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                role="menuitem"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? 'bg-white/10 text-white border border-white'
                    : 'text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-modal-backdrop bg-black/50 flex items-center justify-center" onClick={() => setShowCurrencyModal(false)}>
          <div className="bg-white rounded-lg shadow-modal max-w-md w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Select your currency</h2>
              <button onClick={() => setShowCurrencyModal(false)} className="p-1 hover:bg-neutral-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrencyModal(false);
                  }}
                  className={`p-3 rounded text-left hover:bg-neutral-100 transition-colors ${
                    currency === c.code ? 'bg-booking-blue text-white hover:bg-booking-blue' : ''
                  }`}
                >
                  <span className="font-medium">{c.code}</span>
                  <span className="ml-1 text-sm opacity-75">{c.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-modal-backdrop bg-black/50 flex items-center justify-center" onClick={() => setShowLanguageModal(false)}>
          <div className="bg-white rounded-lg shadow-modal max-w-md w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Select your language</h2>
              <button onClick={() => setShowLanguageModal(false)} className="p-1 hover:bg-neutral-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`p-3 rounded text-left hover:bg-neutral-100 transition-colors ${
                    language === lang.code ? 'bg-booking-blue text-white hover:bg-booking-blue' : ''
                  }`}
                >
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
