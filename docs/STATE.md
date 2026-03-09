# State-Driven Content Architecture

This document describes the per-user state used by the TravelHub platform. The backend stores a `UserState` envelope with typed content categories that define **all displayable content**. Frontend reads from this state to render the UI.

## Core Principle: State as Single Source of Truth

**Backend state is the single source of truth for all displayable content** (flights, hotels, cars, attractions, etc.). This enables:
- Full customization via `/state-manage`
- Predictable, testable behavior
- User-defined content without code changes

Users can add, modify, or remove any data through the state management interface.

## State Envelope (UserState)

```typescript
interface UserState {
  meta: StateMeta;
  data: StateData;
  note: string | null;
}

interface StateMeta {
  created_at: string;    // ISO 8601 timestamp (UTC)
  updated_at: string;    // Last update time
  version: number;       // Incremented on each patch/merge
  type: "unrestricted";
}
```

## State Data Schema

The `data` field contains typed categories for domain content:

```typescript
interface StateData {
  // User preferences
  preferences: Preferences;

  // Content categories (single source of truth)
  airports: Airport[];
  flights: Flight[];
  hotels: Hotel[];
  cars: Car[];
  attractions: Attraction[];
  packages: Package[];

  // Booking state
  bookings: Booking[];
  cart: Cart;
  disputes: Dispute[];

  // Search state
  search: SearchState;

  // Saved user info
  travelers: Traveler[];
  savedContacts: Contact[];

  // Legacy compatibility
  examples: object;
  uploads: Upload[];

  // Free-form extension
  custom: object;
}
```

## Content Type Schemas

### Preferences

```typescript
interface Preferences {
  currency: string;       // "HKD", "USD", "GBP", etc.
  language: string;       // "en-gb", "zh-cn", etc.
  dateFormat?: string;    // "DD/MM/YYYY"
  measurementUnit?: string; // "metric" | "imperial"
}
```

### Airport

```typescript
interface Airport {
  code: string;           // IATA code: "HKG", "LHR"
  name: string;           // "Hong Kong International Airport"
  city: string;           // "Hong Kong"
  country: string;        // "Hong Kong"
  timezone?: string;      // "Asia/Hong_Kong"
}
```

### Flight

```typescript
interface Flight {
  id: string;             // Unique ID: "CX251"
  flightNumber: string;   // "CX251"
  airline: string;        // "Cathay Pacific"
  airlineCode: string;    // "CX"
  origin: string;         // Airport code: "HKG"
  destination: string;    // Airport code: "LHR"
  departureTime: string;  // "23:30"
  arrivalTime: string;    // "05:15+1" (+1 = next day)
  duration: string;       // "12h 45m"
  aircraft?: string;      // "Airbus A350-1000"
  cabinClasses: {
    [class: string]: {
      price: number;
      seatsAvailable: number;
    }
  };
  stops: number;          // 0 = direct
  amenities?: string[];   // ["WiFi", "Entertainment", "Meal"]
}
```

### Hotel

```typescript
interface Hotel {
  id: string;             // Unique ID: "hotel-001"
  name: string;           // "The Peninsula Hong Kong"
  location: {
    city: string;
    country: string;
    address?: string;
  };
  starRating: number;     // 1-5
  reviewScore: number;    // 0-10
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  images?: string[];
  amenities?: string[];
  roomTypes?: Array<{
    id: string;
    name: string;
    price: number;
    maxGuests: number;
  }>;
  description?: string;
}
```

### Car

```typescript
interface Car {
  id: string;             // Unique ID: "car-001"
  provider: string;       // "Hertz", "Avis"
  type: string;           // "Economy", "SUV", "Luxury"
  model: string;          // "Toyota Yaris"
  pricePerDay: number;
  currency: string;
  features?: string[];    // ["Air Conditioning", "Automatic"]
  locations?: string[];   // Airport codes where available
  image?: string;
}
```

### Attraction

```typescript
interface Attraction {
  id: string;             // Unique ID: "attr-001"
  name: string;           // "Victoria Peak Tour"
  location: {
    city: string;
    country: string;
  };
  category: string;       // "Tours", "Theme Parks", "Museums"
  price: number;
  currency: string;
  duration?: string;      // "3 hours"
  description?: string;
  rating?: number;        // 0-5
  reviewCount?: number;
  includes?: string[];
  image?: string;
}
```

### Package

```typescript
interface Package {
  id: string;
  origin: string;
  destination: string;
  flight: object;      // outbound/return flight details
  hotel: object;       // hotel summary
  packagePrice: number;
  currency: string;
}
```

### Booking

```typescript
interface Booking {
  id: string;             // Auto-generated: "BK12345678"
  type: string;           // "flight", "hotel", "car", "attraction"
  status: string;         // "confirmed", "cancelled", "pending"
  createdAt: string;      // ISO 8601 timestamp
  details?: object;       // Type-specific booking details
}
```

### Dispute

```typescript
interface Dispute {
  id: string;             // Auto-generated: "DSP12345678"
  userType: string;       // "guest" | "partner"
  topic: string;
  message: string;
  status: string;         // "submitted", "in_review", etc.
  submittedAt: string;    // ISO 8601 timestamp
}
```

### Cart

```typescript
interface Cart {
  items: Array<{
    id: string;
    type: string;         // "flight", "hotel", etc.
    name: string;
    price: number;
    details?: object;
  }>;
  total: number;
}
```

## API Endpoints

All domain APIs read from and write to user state:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/airports?q=` | Search airports from state |
| GET | `/api/flights?origin=&destination=` | Search flights from state |
| GET | `/api/flights/{id}` | Get specific flight |
| GET | `/api/hotels?city=&country=` | Search hotels from state |
| GET | `/api/hotels/{id}` | Get specific hotel |
| GET | `/api/cars?location=&type=` | Search cars from state |
| GET | `/api/attractions?city=&category=` | Search attractions from state |
| GET | `/api/bookings?status=` | Get user's bookings |
| POST | `/api/bookings` | Create booking (saves to state) |
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/items` | Add item to cart |
| DELETE | `/api/cart/items/{id}` | Remove item from cart |
| DELETE | `/api/cart` | Clear cart |
| GET | `/api/preferences` | Get user preferences |
| PATCH | `/api/preferences` | Update preferences |

## State Management Endpoints

Core state APIs (from basesite):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/state` | Get full user state |
| PUT | `/api/state` | Replace entire state |
| PATCH | `/api/state` | Merge into state |
| DELETE | `/api/state` | Reset to default state |

## Full Example (UserState)

```json
{
  "meta": {
    "created_at": "2024-04-01T12:00:00+00:00",
    "updated_at": "2024-04-01T12:30:00+00:00",
    "version": 2,
    "type": "unrestricted"
  },
  "data": {
    "preferences": {
      "currency": "HKD",
      "language": "en-gb",
      "dateFormat": "DD/MM/YYYY"
    },
    "airports": [
      {
        "code": "HKG",
        "name": "Hong Kong International Airport",
        "city": "Hong Kong",
        "country": "Hong Kong",
        "timezone": "Asia/Hong_Kong"
      },
      {
        "code": "LHR",
        "name": "Heathrow Airport",
        "city": "London",
        "country": "United Kingdom",
        "timezone": "Europe/London"
      }
    ],
    "flights": [
      {
        "id": "CX251",
        "flightNumber": "CX251",
        "airline": "Cathay Pacific",
        "airlineCode": "CX",
        "origin": "HKG",
        "destination": "LHR",
        "departureTime": "23:30",
        "arrivalTime": "05:15+1",
        "duration": "12h 45m",
        "aircraft": "Airbus A350-1000",
        "cabinClasses": {
          "economy": { "price": 5200, "seatsAvailable": 120 },
          "premium_economy": { "price": 8500, "seatsAvailable": 40 },
          "business": { "price": 28000, "seatsAvailable": 24 },
          "first": { "price": 65000, "seatsAvailable": 6 }
        },
        "stops": 0,
        "amenities": ["WiFi", "Entertainment", "Meal", "USB Power"]
      }
    ],
    "hotels": [
      {
        "id": "hotel-001",
        "name": "The Peninsula Hong Kong",
        "location": {
          "city": "Hong Kong",
          "country": "Hong Kong",
          "address": "Salisbury Road, Tsim Sha Tsui"
        },
        "starRating": 5,
        "reviewScore": 9.4,
        "reviewCount": 2847,
        "pricePerNight": 4500,
        "currency": "HKD",
        "amenities": ["Pool", "Spa", "Gym", "Restaurant"],
        "roomTypes": [
          { "id": "deluxe", "name": "Deluxe Room", "price": 4500, "maxGuests": 2 },
          { "id": "suite", "name": "Suite", "price": 8500, "maxGuests": 3 }
        ]
      }
    ],
    "cars": [
      {
        "id": "car-001",
        "provider": "Hertz",
        "type": "Economy",
        "model": "Toyota Yaris",
        "pricePerDay": 45,
        "currency": "USD",
        "features": ["Air Conditioning", "Automatic"],
        "locations": ["LHR", "HKG"]
      }
    ],
    "attractions": [
      {
        "id": "attr-001",
        "name": "Victoria Peak Tour",
        "location": { "city": "Hong Kong", "country": "Hong Kong" },
        "category": "Tours",
        "price": 350,
        "currency": "HKD",
        "duration": "3 hours"
      }
    ],
    "bookings": [],
    "cart": { "items": [], "total": 0 },
    "search": {
      "lastQuery": null,
      "filters": {},
      "history": []
    },
    "travelers": [],
    "savedContacts": [],
    "custom": {}
  },
  "note": "State-driven content - customizable via /state-manage"
}
```

## Customization via /state-manage

Users can fully customize displayed content through the `/state-manage` page:

1. **Add custom flights**: Add new flight entries to `data.flights[]`
2. **Add custom hotels**: Add hotel entries to `data.hotels[]`
3. **Modify prices**: Change prices in existing entries
4. **Remove content**: Delete entries from arrays
5. **Add new categories**: Use `data.custom` for custom extensions

Changes take effect immediately after saving - the frontend reads from state on each render.

## Frontend Sync

The frontend uses optimistic rendering:
1. Show default UI immediately
2. Sync state from backend in background
3. Update UI when state arrives
4. Backend state wins on conflicts

Zustand store syncs with backend:
```typescript
const { syncWithBackend } = useAppStore();

// On app load
useEffect(() => {
  syncWithBackend();
}, []);
```
