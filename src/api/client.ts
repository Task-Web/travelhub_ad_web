/**
 * API Client for the TravelHub Clone
 *
 * This client handles all API calls with proper cookie management
 * as required by the constitution (Cookie-Scoped State Isolation).
 *
 * The cookie override via query parameter mechanism is preserved
 * from the basesite implementation.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || 'user_id';
const COOKIE_MAX_AGE = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 60 * 60 * 24 * 30);

/**
 * Apply cookie from query parameter
 * This function checks the URL for a "cookie" query parameter,
 * sets the cookie accordingly, and reloads the page without the query parameter.
 *
 * IMPORTANT: This must remain unchanged per constitution requirements.
 */
export const applyCookieFromQuery = (): boolean => {
  if (typeof window === 'undefined') return false;

  const url = new URL(window.location.href);
  const override = url.searchParams.get('cookie');
  if (!override) return false;

  let cookie = `${COOKIE_NAME}=${encodeURIComponent(override)}; Path=/; SameSite=Lax`;
  if (Number.isFinite(COOKIE_MAX_AGE) && COOKIE_MAX_AGE > 0) {
    cookie += `; Max-Age=${Math.floor(COOKIE_MAX_AGE)}`;
  }
  document.cookie = cookie;

  // Remove the cookie param and redirect
  url.searchParams.delete('cookie');
  const redirectUrl = url.toString();
  if (window.location.href !== redirectUrl) {
    window.location.replace(redirectUrl);
    return true;
  }
  return false;
};

/**
 * Get current user ID from cookie
 */
export const getUserId = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Make an API request with credentials (cookies) included
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }

  return response.json();
}

// Re-export the base URL for debugging
export const baseUrl = API_BASE;

/**
 * State management API (preserves basesite compatibility)
 */
export const stateApi = {
  getState: () => request<{ user_id: string; state: Record<string, unknown> }>('/state'),

  replaceState: (data: Record<string, unknown>, note?: string, meta?: Record<string, unknown>) =>
    request<{ user_id: string; state: Record<string, unknown> }>('/state', {
      method: 'PUT',
      body: { data, note, meta },
    }),

  patchState: (data: Record<string, unknown>, note?: string) =>
    request<{ user_id: string; state: Record<string, unknown> }>('/state', {
      method: 'PATCH',
      body: { data, note },
    }),

  resetState: () =>
    request<{ user_id: string; state: Record<string, unknown> }>('/state', {
      method: 'DELETE',
    }),
};

/**
 * System API
 */
export const systemApi = {
  getHealth: () => request<{ status: string }>('/health'),
  getInfo: () => request<Record<string, unknown>>('/info'),
};

// =============================================================================
// STATE-DRIVEN DOMAIN APIs
// All data is read from and written to user state (single source of truth)
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

/**
 * Airports API (state-driven)
 */
export const airportsApi = {
  getAll: (query?: string) => {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return request<{ airports: Airport[]; count: number }>(`/airports${params}`);
  },

  search: (query: string) =>
    request<{ airports: Airport[]; count: number }>(`/airports?q=${encodeURIComponent(query)}`),
};

/**
 * Flights API (state-driven)
 */
export const flightsApi = {
  getAll: (params?: { origin?: string; destination?: string; cabinClass?: string; directOnly?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.origin) searchParams.append('origin', params.origin);
    if (params?.destination) searchParams.append('destination', params.destination);
    if (params?.cabinClass) searchParams.append('cabin_class', params.cabinClass);
    if (params?.directOnly) searchParams.append('direct_only', 'true');
    const query = searchParams.toString();
    return request<{ flights: Flight[]; count: number }>(`/flights${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<{ flight: Flight }>(`/flights/${id}`),

  search: (params: { origin?: string; destination?: string; cabinClass?: string; directOnly?: boolean }) =>
    flightsApi.getAll(params),

  // Legacy compatibility - alias for airports search
  getAirports: (query: string) =>
    airportsApi.search(query).then(res => res.airports),
};

/**
 * Hotels API (state-driven)
 */
export const hotelsApi = {
  getAll: (params?: { city?: string; country?: string; minRating?: number; maxPrice?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.minRating) searchParams.append('min_rating', params.minRating.toString());
    if (params?.maxPrice) searchParams.append('max_price', params.maxPrice.toString());
    const query = searchParams.toString();
    return request<{ hotels: Hotel[]; count: number }>(`/hotels${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<{ hotel: Hotel }>(`/hotels/${id}`),

  search: (params: { city?: string; country?: string; minRating?: number; maxPrice?: number }) =>
    hotelsApi.getAll(params),
};

/**
 * Properties API (alias for hotels, for legacy compatibility)
 */
export const propertiesApi = {
  search: (params: Record<string, unknown>) =>
    hotelsApi.getAll({
      city: params.destination as string | undefined,
    }).then(res => ({ data: res.hotels, meta: { totalCount: res.count } })),

  getById: (id: string) => hotelsApi.getById(id).then(res => res.hotel),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAvailability: (id: string, checkIn: string, checkOut: string) =>
    Promise.resolve({ available: true }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getReviews: (id: string, page = 1, limit = 10) =>
    Promise.resolve([]),
};

/**
 * Destinations API (derived from hotels)
 */
export const destinationsApi = {
  autocomplete: async (query: string) => {
    const { hotels } = await hotelsApi.getAll();
    const cities = [...new Set(hotels.map(h => h.location.city))];
    return cities.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  },

  getTrending: async () => {
    const { hotels } = await hotelsApi.getAll();
    return [...new Set(hotels.map(h => h.location.city))];
  },

  getById: (id: string) => Promise.resolve({ id, name: id }),

  getByCountry: async (countryCode: string) => {
    const { hotels } = await hotelsApi.getAll({ country: countryCode });
    return [...new Set(hotels.map(h => h.location.city))];
  },
};

/**
 * Car Rentals API (state-driven)
 */
export const carsApi = {
  getAll: (params?: { location?: string; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.append('location', params.location);
    if (params?.type) searchParams.append('car_type', params.type);
    const query = searchParams.toString();
    return request<{ cars: Car[]; count: number }>(`/cars${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<{ car: Car }>(`/cars/${id}`),

  search: (params: Record<string, unknown>) =>
    carsApi.getAll({
      location: params.pickupLocation as string | undefined,
      type: params.type as string | undefined,
    }).then(res => ({ data: res.cars, meta: { totalCount: res.count } })),

  getLocations: async (query: string) => {
    const { airports } = await airportsApi.search(query);
    return airports.map(a => ({ code: a.code, name: a.name, city: a.city }));
  },

  getPopularDestinations: async () => {
    const { airports } = await airportsApi.getAll();
    return airports.slice(0, 10);
  },

  getBrands: () => Promise.resolve(['Hertz', 'Avis', 'Enterprise', 'Budget', 'National']),
};

/**
 * Attractions API (state-driven)
 */
export const attractionsApi = {
  getAll: (params?: { city?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.category) searchParams.append('category', params.category);
    const query = searchParams.toString();
    return request<{ attractions: Attraction[]; count: number }>(`/attractions${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<{ attraction: Attraction }>(`/attractions/${id}`),

  search: (params: Record<string, unknown>) =>
    attractionsApi.getAll({
      city: params.city as string | undefined,
      category: params.category as string | undefined,
    }).then(res => ({ data: res.attractions, meta: { totalCount: res.count } })),

  getPopular: () => attractionsApi.getAll().then(res => res.attractions),

  getCategories: () => Promise.resolve(['Tours', 'Attractions', 'Theme Parks', 'Museums', 'Activities']),
};

/**
 * Flight+Hotel Package interface
 */
interface Package {
  id: string;
  origin: string;
  destination: string;
  flight: {
    outbound: {
      airline: string;
      flightNumber: string;
      departure: string;
      arrival: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      stops: number;
    };
    return: {
      airline: string;
      flightNumber: string;
      departure: string;
      arrival: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      stops: number;
    };
  };
  hotel: {
    name: string;
    stars: number;
    location: string;
    rating: number;
    reviews: number;
    image: string;
    amenities: string[];
  };
  flightPrice: number;
  hotelPrice: number;
  packagePrice: number;
  savings: number;
  roomType: string;
  boardBasis: string;
  freeCancellation: boolean;
  currency?: string;
}

/**
 * Packages API (state-driven)
 */
export const packagesApi = {
  getAll: (params?: { origin?: string; destination?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.origin) searchParams.append('origin', params.origin);
    if (params?.destination) searchParams.append('destination', params.destination);
    const query = searchParams.toString();
    return request<{ packages: Package[]; count: number }>(`/packages${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<{ package: Package }>(`/packages/${id}`),

  search: (params: { origin?: string; destination?: string }) =>
    packagesApi.getAll(params),
};

/**
 * Bookings API (state-driven)
 */
export const bookingsApi = {
  getAll: (status?: string) => {
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<{ bookings: Booking[]; count: number }>(`/bookings${params}`);
  },

  getById: (id: string) =>
    request<{ booking: Booking }>(`/bookings/${id}`),

  create: (booking: Record<string, unknown>) =>
    request<{ booking: Booking; message: string }>('/bookings', {
      method: 'POST',
      body: booking,
    }),

  getUserBookings: () => bookingsApi.getAll().then(res => res.bookings),

  update: (id: string, updates: Record<string, unknown>) =>
    request<{ booking: Booking; message: string }>(`/bookings/${id}`, {
      method: 'PATCH',
      body: updates,
    }),

  cancel: (id: string) =>
    request<{ booking: Booking; message: string }>(`/bookings/${id}`, {
      method: 'PATCH',
      body: { status: 'cancelled' },
    }),
};

/**
 * Cart API (state-driven)
 */
export const cartApi = {
  get: () => request<{ cart: Cart }>('/cart'),

  addItem: (item: Omit<CartItem, 'id'>) =>
    request<{ cart: Cart; message: string }>('/cart/items', {
      method: 'POST',
      body: item,
    }),

  removeItem: (itemId: string) =>
    request<{ cart: Cart; message: string }>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),

  clear: () =>
    request<{ cart: Cart; message: string }>('/cart', {
      method: 'DELETE',
    }),
};

/**
 * Preferences API (state-driven)
 */
export const preferencesApi = {
  get: () => request<{ preferences: Record<string, unknown> }>('/preferences'),

  update: (preferences: Record<string, unknown>) =>
    request<{ preferences: Record<string, unknown>; message: string }>('/preferences', {
      method: 'PATCH',
      body: preferences,
    }),
};

/**
 * Search state interface
 */
interface SearchQuery {
  type: 'flights' | 'hotels' | 'cars' | 'attractions';
  origin?: string;
  originCode?: string;
  destination?: string;
  destCode?: string;
  departDate?: string;
  returnDate?: string;
  travelers?: number;
  cabinClass?: string;
  tripType?: string;
  timestamp?: string;
  [key: string]: unknown;
}

interface SearchState {
  lastQuery: SearchQuery | null;
  filters: Record<string, unknown>;
  history: SearchQuery[];
}

/**
 * Search API (state-driven)
 */
export const searchApi = {
  getState: () => request<{ search: SearchState }>('/search'),

  updateState: (searchData: { lastQuery?: SearchQuery; filters?: Record<string, unknown> }) =>
    request<{ search: SearchState; message: string }>('/search', {
      method: 'PATCH',
      body: searchData,
    }),

  saveFlightSearch: (params: {
    origin: string;
    originCode?: string;
    destination: string;
    destCode?: string;
    departDate: string;
    returnDate?: string;
    travelers: number;
    cabinClass: string;
    tripType: string;
  }) =>
    searchApi.updateState({
      lastQuery: {
        type: 'flights',
        ...params,
      },
    }),
};

/**
 * Dispute interface
 */
interface Dispute {
  id: string;
  userType: 'guest' | 'partner';
  confirmationNumber?: string;
  fullName: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  status: string;
  submittedAt: string;
}

/**
 * Disputes API (state-driven)
 */
export const disputesApi = {
  getAll: () => request<{ disputes: Dispute[]; count: number }>('/disputes'),

  submit: (dispute: Omit<Dispute, 'id' | 'status' | 'submittedAt'>) =>
    request<{ dispute: Dispute; message: string }>('/disputes', {
      method: 'POST',
      body: dispute,
    }),
};

/**
 * Files API (preserves basesite compatibility)
 */
export const filesApi = {
  upload: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.detail || error.message || 'Upload failed');
    }

    return response.json();
  },

  list: () => request<unknown[]>('/files'),

  getUrl: (filename: string) => `${API_BASE}/files/${filename}`,
};

// Backward compatible api object for legacy code
export const api = {
  baseUrl: API_BASE,
  getState: stateApi.getState,
  replaceState: stateApi.replaceState,
  patchState: stateApi.patchState,
  resetState: stateApi.resetState,
  getInfo: systemApi.getInfo,
  uploadFiles: filesApi.upload,
  // New state-driven APIs
  airports: airportsApi,
  flights: flightsApi,
  hotels: hotelsApi,
  cars: carsApi,
  attractions: attractionsApi,
  packages: packagesApi,
  bookings: bookingsApi,
  cart: cartApi,
  preferences: preferencesApi,
  search: searchApi,
  disputes: disputesApi,
};
