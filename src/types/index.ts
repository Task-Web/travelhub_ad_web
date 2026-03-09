// Core type definitions for the TravelHub clone

// User state and preferences
export interface UserPreferences {
  currency: string;
  language: string;
  isGeniusMember: boolean;
}

export interface UserState {
  userId: string;
  preferences: UserPreferences;
  searchHistory: SearchHistoryItem[];
  bookings: Booking[];
}

// Search types
export interface SearchHistoryItem {
  id: string;
  type: 'stays' | 'flights' | 'cars' | 'attractions';
  query: Record<string, unknown>;
  timestamp: string;
}

// Accommodation types
export interface Property {
  id: string;
  name: string;
  propertyType: PropertyType;
  starRating: number;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  images: PropertyImage[];
  amenities: Amenity[];
  reviewScore: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  isGeniusEligible: boolean;
  petFriendly: boolean;
}

export type PropertyType = 'hotel' | 'apartment' | 'house' | 'villa' | 'hostel' | 'resort';

export interface PropertyImage {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'room' | 'property' | 'general';
  icon?: string;
}

export interface Room {
  id: string;
  propertyId: string;
  roomType: string;
  maxAdults: number;
  maxChildren: number;
  basePrice: number;
  description: string;
  quantity: number;
}

// Flight types
export interface Flight {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  originAirport: Airport;
  destinationAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  cabinClass: CabinClass;
  price: number;
  currency: string;
  isDirect: boolean;
  stops: FlightStop[];
  baggageAllowance: BaggageAllowance;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightStop {
  airport: Airport;
  durationMinutes: number;
}

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface BaggageAllowance {
  personalItem: boolean;
  cabinBag: { included: boolean; dimensions?: string; weight?: string };
  checkedBag: { included: boolean; weight?: string };
}

// Car rental types
export interface CarRental {
  id: string;
  rentalCompany: string;
  companyLogo?: string;
  carModel: string;
  carType: CarType;
  pickupLocation: string;
  dropoffLocation: string;
  dailyRate: number;
  currency: string;
  imageUrl: string;
  features: string[];
}

export type CarType = 'economy' | 'compact' | 'midsize' | 'fullsize' | 'suv' | 'luxury' | 'minivan';

// Attraction types
export interface Attraction {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  category: AttractionCategory;
  durationMinutes: number;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  freeCancellation: boolean;
  imageUrl: string;
}

export type AttractionCategory = 'tour' | 'museum' | 'entertainment' | 'food_drinks' | 'travel_services';

// Booking types
export interface Booking {
  id: string;
  type: 'property' | 'flight' | 'car' | 'attraction';
  status: BookingStatus;
  totalPrice: number;
  currency: string;
  createdAt: string;
  details: PropertyBooking | FlightBooking | CarBooking | AttractionBooking;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface PropertyBooking {
  propertyId: string;
  propertyName: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numAdults: number;
  numChildren: number;
  numRooms: number;
}

export interface FlightBooking {
  flightId: string;
  flightNumber: string;
  numAdults: number;
  numChildren: number;
  numInfants: number;
  passengerDetails: PassengerDetails[];
}

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
}

export interface CarBooking {
  carRentalId: string;
  pickupDatetime: string;
  dropoffDatetime: string;
  driverAge: number;
}

export interface AttractionBooking {
  attractionId: string;
  attractionName: string;
  bookingDate: string;
  numParticipants: number;
}

// Destination types
export interface Destination {
  id: string;
  name: string;
  type: 'city' | 'region' | 'country' | 'airport';
  parentId?: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  propertyCount: number;
  imageUrl?: string;
  description?: string;
  isTrending: boolean;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  text: string;
  stayDate: string;
  createdAt: string;
}

// Search parameters
export interface StaysSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  filters?: StaysFilters;
  sort?: StaysSort;
}

export interface StaysFilters {
  starRating?: number[];
  reviewScore?: number;
  priceMin?: number;
  priceMax?: number;
  propertyTypes?: PropertyType[];
  amenities?: string[];
  geniusOnly?: boolean;
  petFriendly?: boolean;
}

export type StaysSort = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance';

export interface FlightsSearchParams {
  tripType: 'round_trip' | 'one_way' | 'multi_city';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
  directOnly?: boolean;
}

export interface CarsSearchParams {
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  driverAge?: number;
}

export interface AttractionsSearchParams {
  destination: string;
  date?: string;
  category?: AttractionCategory;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    totalCount?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// State management types (for basesite compatibility)
export interface StateEnvelope {
  meta: {
    created_at: string;
    updated_at: string;
    version: number;
    type: string;
  };
  data: Record<string, unknown>;
  note?: string;
}
