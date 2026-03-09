/**
 * Global State Management using Zustand
 *
 * STATE-DRIVEN ARCHITECTURE:
 * - Backend state is the single source of truth for ALL displayable content
 * - Frontend reads from state and displays accordingly
 * - Users can customize all data via /state-manage
 *
 * This store syncs with backend state and provides:
 * - User preferences (currency, language)
 * - Content data (flights, hotels, cars, attractions, airports)
 * - Booking and cart state
 * - Search state
 * - UI state (modals, loading)
 */

import { create } from 'zustand';
import { stateApi } from '@/api/client';

// Currency options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '\u00A5', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

// Language options
export const LANGUAGES = [
  { code: 'en-gb', name: 'English (UK)', flag: 'gb' },
  { code: 'en-us', name: 'English (US)', flag: 'us' },
  { code: 'fr', name: 'Francais', flag: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'es', name: 'Espanol', flag: 'es' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'pt', name: 'Portugues', flag: 'pt' },
  { code: 'nl', name: 'Nederlands', flag: 'nl' },
  { code: 'ja', name: 'Japanese', flag: 'jp' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', flag: 'cn' },
  { code: 'zh-tw', name: 'Chinese (Traditional)', flag: 'tw' },
  { code: 'ko', name: 'Korean', flag: 'kr' },
];

interface UserPreferences {
  currency: string;
  language: string;
  dateFormat?: string;
  measurementUnit?: string;
}

// =============================================================================
// STATE-DRIVEN CONTENT TYPES
// These match the backend state schema defined in models.py
// =============================================================================

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone?: string;
}

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft?: string;
  cabinClasses: Record<string, { price: number; seatsAvailable: number }>;
  stops: number;
  amenities?: string[];
}

interface Hotel {
  id: string;
  name: string;
  location: { city: string; country: string; address?: string };
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  images?: string[];
  amenities?: string[];
  roomTypes?: Array<{ id: string; name: string; price: number; maxGuests: number }>;
  description?: string;
}

interface Car {
  id: string;
  provider: string;
  type: string;
  model: string;
  pricePerDay: number;
  currency: string;
  features?: string[];
  locations?: string[];
  image?: string;
}

interface Attraction {
  id: string;
  name: string;
  location: { city: string; country: string };
  category: string;
  price: number;
  currency: string;
  duration?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  includes?: string[];
  image?: string;
}

interface Booking {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  details?: Record<string, unknown>;
}

interface CartItem {
  id: string;
  type: string;
  name: string;
  price: number;
  details?: Record<string, unknown>;
}

interface Cart {
  items: CartItem[];
  total: number;
}

interface StaysSearch {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  rooms: number;
}

interface FlightsSearch {
  tripType: 'round_trip' | 'one_way' | 'multi_city';
  origin: string;
  destination: string;
  departureDate: string | null;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  directOnly: boolean;
}

interface CarsSearch {
  pickupLocation: string;
  dropoffLocation: string;
  sameDropoff: boolean;
  pickupDate: string | null;
  pickupTime: string;
  dropoffDate: string | null;
  dropoffTime: string;
  driverAge: number;
}

interface AppState {
  // User state
  userId: string | null;
  preferences: UserPreferences;
  isAuthenticated: boolean;

  // STATE-DRIVEN CONTENT (single source of truth from backend)
  airports: Airport[];
  flights: Flight[];
  hotels: Hotel[];
  cars: Car[];
  attractions: Attraction[];
  bookings: Booking[];
  cart: Cart;

  // Search state
  staysSearch: StaysSearch;
  flightsSearch: FlightsSearch;
  carsSearch: CarsSearch;

  // UI state
  isLoading: boolean;
  isSyncing: boolean;  // True when syncing with backend
  lastSyncedAt: string | null;
  activeModal: string | null;

  // Actions
  setUserId: (userId: string) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;

  setStaysSearch: (search: Partial<StaysSearch>) => void;
  setFlightsSearch: (search: Partial<FlightsSearch>) => void;
  setCarsSearch: (search: Partial<CarsSearch>) => void;

  setLoading: (loading: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Content actions (local updates before syncing to backend)
  setAirports: (airports: Airport[]) => void;
  setFlights: (flights: Flight[]) => void;
  setHotels: (hotels: Hotel[]) => void;
  setCars: (cars: Car[]) => void;
  setAttractions: (attractions: Attraction[]) => void;
  setBookings: (bookings: Booking[]) => void;
  setCart: (cart: Cart) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;

  // Sync with backend (state-driven)
  syncWithBackend: () => Promise<void>;
  saveToBackend: () => Promise<void>;
}

const defaultStaysSearch: StaysSearch = {
  destination: '',
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  rooms: 1,
};

const defaultFlightsSearch: FlightsSearch = {
  tripType: 'round_trip',
  origin: '',
  destination: '',
  departureDate: null,
  returnDate: null,
  adults: 1,
  children: 0,
  infants: 0,
  cabinClass: 'economy',
  directOnly: false,
};

const defaultCarsSearch: CarsSearch = {
  pickupLocation: '',
  dropoffLocation: '',
  sameDropoff: true,
  pickupDate: null,
  pickupTime: '10:00',
  dropoffDate: null,
  dropoffTime: '10:00',
  driverAge: 30,
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  userId: null,
  preferences: {
    currency: 'HKD',
    language: 'en-gb',
  },
  isAuthenticated: false,

  // STATE-DRIVEN CONTENT (populated from backend on sync)
  airports: [],
  flights: [],
  hotels: [],
  cars: [],
  attractions: [],
  bookings: [],
  cart: { items: [], total: 0 },

  staysSearch: defaultStaysSearch,
  flightsSearch: defaultFlightsSearch,
  carsSearch: defaultCarsSearch,

  isLoading: false,
  isSyncing: false,
  lastSyncedAt: null,
  activeModal: null,

  // User actions
  setUserId: (userId) => set({ userId }),

  setPreferences: (preferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    })),

  setCurrency: (currency) => {
    set((state) => ({
      preferences: { ...state.preferences, currency },
    }));
    // Save to backend
    get().saveToBackend();
  },

  setLanguage: (language) => {
    set((state) => ({
      preferences: { ...state.preferences, language },
    }));
    // Save to backend
    get().saveToBackend();
  },

  // Search actions
  setStaysSearch: (search) =>
    set((state) => ({
      staysSearch: { ...state.staysSearch, ...search },
    })),

  setFlightsSearch: (search) =>
    set((state) => ({
      flightsSearch: { ...state.flightsSearch, ...search },
    })),

  setCarsSearch: (search) =>
    set((state) => ({
      carsSearch: { ...state.carsSearch, ...search },
    })),

  // UI actions
  setLoading: (isLoading) => set({ isLoading }),

  openModal: (modalId) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),

  // Content actions (for local state updates)
  setAirports: (airports) => set({ airports }),
  setFlights: (flights) => set({ flights }),
  setHotels: (hotels) => set({ hotels }),
  setCars: (cars) => set({ cars }),
  setAttractions: (attractions) => set({ attractions }),
  setBookings: (bookings) => set({ bookings }),
  setCart: (cart) => set({ cart }),

  addToCart: (item) => {
    const cart = get().cart;
    const newItem = { ...item, id: `item-${Date.now()}` } as CartItem;
    const newCart = {
      items: [...cart.items, newItem],
      total: cart.total + (item.price || 0),
    };
    set({ cart: newCart });
    get().saveToBackend();
  },

  removeFromCart: (itemId) => {
    const cart = get().cart;
    const itemToRemove = cart.items.find(i => i.id === itemId);
    const newCart = {
      items: cart.items.filter(i => i.id !== itemId),
      total: cart.total - (itemToRemove?.price || 0),
    };
    set({ cart: newCart });
    get().saveToBackend();
  },

  clearCart: () => {
    set({ cart: { items: [], total: 0 } });
    get().saveToBackend();
  },

  // Backend sync - SINGLE SOURCE OF TRUTH
  syncWithBackend: async () => {
    try {
      set({ isSyncing: true });
      const response = await stateApi.getState();
      const { user_id, state } = response;

      set({ userId: user_id });

      // Extract all data from backend state (single source of truth)
      const data = state?.data as Record<string, unknown> | undefined;
      if (data) {
        // Preferences
        if (data.preferences) {
          const prefs = data.preferences as Partial<UserPreferences>;
          set((s) => ({
            preferences: { ...s.preferences, ...prefs },
          }));
        }

        // State-driven content categories
        if (data.airports) {
          set({ airports: data.airports as Airport[] });
        }
        if (data.flights) {
          set({ flights: data.flights as Flight[] });
        }
        if (data.hotels) {
          set({ hotels: data.hotels as Hotel[] });
        }
        if (data.cars) {
          set({ cars: data.cars as Car[] });
        }
        if (data.attractions) {
          set({ attractions: data.attractions as Attraction[] });
        }
        if (data.bookings) {
          set({ bookings: data.bookings as Booking[] });
        }
        if (data.cart) {
          set({ cart: data.cart as Cart });
        }

        // Search state
        if (data.search) {
          const search = data.search as Record<string, unknown>;
          if (search.staysSearch) {
            set((s) => ({
              staysSearch: { ...s.staysSearch, ...(search.staysSearch as Partial<StaysSearch>) },
            }));
          }
          if (search.flightsSearch) {
            set((s) => ({
              flightsSearch: { ...s.flightsSearch, ...(search.flightsSearch as Partial<FlightsSearch>) },
            }));
          }
          if (search.carsSearch) {
            set((s) => ({
              carsSearch: { ...s.carsSearch, ...(search.carsSearch as Partial<CarsSearch>) },
            }));
          }
        }
      }

      set({ lastSyncedAt: new Date().toISOString(), isSyncing: false });
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      set({ isSyncing: false });
    }
  },

  saveToBackend: async () => {
    try {
      const state = get();
      await stateApi.patchState({
        preferences: state.preferences,
        cart: state.cart,
        bookings: state.bookings,
        search: {
          staysSearch: state.staysSearch,
          flightsSearch: state.flightsSearch,
          carsSearch: state.carsSearch,
        },
      });
    } catch (error) {
      console.error('Failed to save to backend:', error);
    }
  },
}));
