import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import {
  createTask052ClickProofForEvent,
  prepareTask052ClickSession,
  updateTask052ClickChallenge,
} from '../lib/task052-client';
import { createTask052JsonHeaders } from '../lib/task052-protocol';

// Category ratings type
interface CategoryRating {
  name: string;
  score: number;
}

// Guest review type
interface GuestReview {
  id: string;
  guestName: string;
  country: string;
  score: number;
  date: string;
  title: string;
  positive: string;
  negative: string;
  roomType: string;
  stayDuration: string;
}

// FAQ type
interface FAQ {
  question: string;
  answer: string;
}

// Room type with more details
interface RoomType {
  id: string;
  name: string;
  price: number;
  description: string;
  bedConfig: string;
  maxAdults: number;
  maxChildren: number;
  size: string;
  amenities: string[];
}

// Surroundings type
interface SurroundingItem {
  name: string;
  distance: string;
}

interface HotelSurroundings {
  attractions: SurroundingItem[];
  restaurantsCafes: SurroundingItem[];
  publicTransport: SurroundingItem[];
  closestAirports: SurroundingItem[];
}

const TASK052_TARGET_HOTEL_ID = 'hotel-paris-1';
const TASK052_TARGET_HOTEL_NAME = 'Le Meurice';

// Mock property data (same as SearchResultsPage for consistency)
const mockProperties: Record<string, {
  id: string;
  name: string;
  type: string;
  starRating: number | null;
  location: string;
  address: string;
  distance: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  reviewScore: number;
  reviewCount: number;
  reviewLabel: string;
  price: number;
  originalPrice: number | null;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  geniusDiscount: boolean;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  categoryRatings: CategoryRating[];
  guestReviews: GuestReview[];
  faqs: FAQ[];
  roomTypes: RoomType[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  childrenPolicy: string;
  petsPolicy: string;
  paymentMethods: string[];
  surroundings: HotelSurroundings;
}> = {
  '1': {
    id: '1',
    name: 'The Savoy',
    type: 'Hotel',
    starRating: 5,
    location: 'Westminster Borough, London',
    address: 'Strand, London WC2R 0EZ, United Kingdom',
    distance: '0.5 km from centre',
    description: 'Iconic luxury hotel on the Strand with Art Deco interiors, Thames views, and world-class dining.',
    fullDescription: 'The Savoy is one of London\'s most iconic hotels, located on the Strand with breathtaking views of the Thames. This legendary 5-star property features stunning Art Deco interiors, multiple award-winning restaurants, a world-class spa, and impeccable service. Guests enjoy elegant rooms with period furnishings, marble bathrooms, and modern amenities. The hotel offers direct access to Covent Garden and the West End theatres.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    ],
    reviewScore: 9.2,
    reviewCount: 3245,
    reviewLabel: 'Superb',
    price: 450,
    originalPrice: 520,
    freeCancellation: true,
    breakfastIncluded: true,
    geniusDiscount: true,
    amenities: ['Free WiFi', 'Spa', 'Fitness centre', 'Restaurant', 'Room service', 'Concierge', 'Laundry', 'Airport shuttle', 'Bar', 'Swimming pool', 'Non-smoking rooms', 'Family rooms'],
    coordinates: { lat: 51.5101, lng: -0.1197 },
    categoryRatings: [
      { name: 'Staff', score: 9.4 },
      { name: 'Facilities', score: 9.3 },
      { name: 'Cleanliness', score: 9.5 },
      { name: 'Comfort', score: 9.3 },
      { name: 'Value for money', score: 8.6 },
      { name: 'Location', score: 9.7 },
      { name: 'Free WiFi', score: 9.1 },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'John',
        country: 'United States',
        score: 10,
        date: '2024-01-15',
        title: 'Exceptional experience',
        positive: 'The service was impeccable. Staff went above and beyond to make our anniversary special. The room was stunning with beautiful Thames views. The Art Deco interiors are breathtaking and the spa was world-class.',
        negative: '',
        roomType: 'Deluxe Room',
        stayDuration: '3 nights',
      },
      {
        id: 'r2',
        guestName: 'Sophie',
        country: 'France',
        score: 9,
        date: '2024-01-10',
        title: 'Wonderful stay',
        positive: 'Beautiful historic hotel with excellent location. The breakfast was exceptional with a great variety. The concierge was very helpful arranging theatre tickets.',
        negative: 'The rooms could use some soundproofing from the street noise.',
        roomType: 'Standard Room',
        stayDuration: '2 nights',
      },
      {
        id: 'r3',
        guestName: 'Marcus',
        country: 'Germany',
        score: 9,
        date: '2024-01-05',
        title: 'Iconic luxury hotel',
        positive: 'Everything about this hotel screams luxury. The attention to detail is remarkable. The restaurant offers amazing cuisine.',
        negative: 'Quite expensive but you get what you pay for.',
        roomType: 'Junior Suite',
        stayDuration: '4 nights',
      },
    ],
    faqs: [
      { question: 'What are the check-in and check-out times at The Savoy?', answer: 'Check-in at The Savoy is from 3:00 PM, and check-out is until 12:00 PM.' },
      { question: 'Does The Savoy have a pool?', answer: 'Yes, The Savoy has an indoor swimming pool available for guests.' },
      { question: 'How far is The Savoy from the centre of London?', answer: 'The Savoy is located just 0.5 km from the centre of London.' },
      { question: 'Does The Savoy have a restaurant?', answer: 'Yes, The Savoy has several restaurants and bars including Kaspar\'s Seafood Bar & Grill and Simpson\'s in the Strand.' },
      { question: 'Is parking available at The Savoy?', answer: 'Yes, valet parking is available at The Savoy for an additional charge.' },
      { question: 'What kind of breakfast is served at The Savoy?', answer: 'The Savoy offers a full English breakfast, continental breakfast, and an extensive buffet with a wide variety of options.' },
    ],
    roomTypes: [
      { id: 'superior', name: 'Superior Room', price: 0, description: 'Elegant room with period furnishings and modern amenities.', bedConfig: '1 large double bed', maxAdults: 2, maxChildren: 1, size: '28 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe', 'Tea/coffee maker'] },
      { id: 'deluxe', name: 'Deluxe Room', price: 50, description: 'Spacious room with river views and luxury amenities.', bedConfig: '1 extra-large double bed', maxAdults: 2, maxChildren: 2, size: '35 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe', 'Tea/coffee maker', 'River view'] },
      { id: 'junior-suite', name: 'Junior Suite', price: 150, description: 'Elegant suite with separate living area and panoramic views.', bedConfig: '1 extra-large double bed', maxAdults: 3, maxChildren: 2, size: '45 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe', 'Tea/coffee maker', 'Separate living room', 'River view'] },
      { id: 'savoy-suite', name: 'Savoy Suite', price: 350, description: 'Luxurious suite with Art Deco design and butler service.', bedConfig: '1 extra-large double bed or 2 single beds', maxAdults: 3, maxChildren: 2, size: '65 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe', 'Tea/coffee maker', 'Butler service', 'Separate dining area', 'River view'] },
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation until 24 hours before arrival. After that, the first night is non-refundable.',
    childrenPolicy: 'Children of all ages are welcome. Children under 12 stay free when using existing bedding.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard', 'American Express', 'Diners Club'],
    surroundings: {
      attractions: [
        { name: 'Covent Garden', distance: '450 m' },
        { name: 'Trafalgar Square', distance: '600 m' },
        { name: 'National Gallery', distance: '650 m' },
        { name: 'Somerset House', distance: '300 m' },
        { name: 'London Eye', distance: '1.2 km' },
        { name: 'British Museum', distance: '1.5 km' },
      ],
      restaurantsCafes: [
        { name: 'Gordon\'s Wine Bar', distance: '200 m' },
        { name: 'The Ivy', distance: '350 m' },
        { name: 'Rules Restaurant', distance: '400 m' },
        { name: 'Balthazar', distance: '500 m' },
      ],
      publicTransport: [
        { name: 'Embankment Underground Station', distance: '150 m' },
        { name: 'Charing Cross Station', distance: '400 m' },
        { name: 'Covent Garden Underground Station', distance: '500 m' },
        { name: 'Waterloo Station', distance: '1 km' },
      ],
      closestAirports: [
        { name: 'London City Airport', distance: '11 km' },
        { name: 'London Heathrow Airport', distance: '25 km' },
        { name: 'London Gatwick Airport', distance: '45 km' },
        { name: 'London Stansted Airport', distance: '55 km' },
      ],
    },
  },
  '2': {
    id: '2',
    name: 'Premier Inn London City',
    type: 'Hotel',
    starRating: 3,
    location: 'City of London, London',
    address: '1 Aldersgate Street, London EC1A 4EJ, United Kingdom',
    distance: '1.2 km from centre',
    description: 'Modern hotel with comfortable rooms, restaurant, and excellent transport links.',
    fullDescription: 'Premier Inn London City offers modern, comfortable accommodation in the heart of the City of London. The hotel features spacious rooms with comfortable beds, en-suite bathrooms, and all essential amenities. Guests can enjoy breakfast at the on-site restaurant and benefit from excellent transport links to explore London\'s attractions.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
    ],
    reviewScore: 8.1,
    reviewCount: 5678,
    reviewLabel: 'Very good',
    price: 95,
    originalPrice: null,
    freeCancellation: true,
    breakfastIncluded: false,
    geniusDiscount: false,
    amenities: ['Free WiFi', 'Restaurant', 'Air conditioning', '24-hour front desk', 'Non-smoking rooms'],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    categoryRatings: [
      { name: 'Staff', score: 8.3 },
      { name: 'Facilities', score: 7.9 },
      { name: 'Cleanliness', score: 8.5 },
      { name: 'Comfort', score: 8.2 },
      { name: 'Value for money', score: 8.0 },
      { name: 'Location', score: 8.4 },
      { name: 'Free WiFi', score: 7.8 },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'Emma',
        country: 'United Kingdom',
        score: 8,
        date: '2024-01-12',
        title: 'Great value for London',
        positive: 'Clean and comfortable room. Great location near St Pauls. Staff were friendly and helpful.',
        negative: 'Breakfast could be better.',
        roomType: 'Double Room',
        stayDuration: '2 nights',
      },
    ],
    faqs: [
      { question: 'What are the check-in and check-out times?', answer: 'Check-in from 2:00 PM, check-out until 12:00 PM.' },
      { question: 'Is breakfast included?', answer: 'Breakfast is available at an additional charge.' },
    ],
    roomTypes: [
      { id: 'double', name: 'Double Room', price: 0, description: 'Comfortable room with double bed.', bedConfig: '1 double bed', maxAdults: 2, maxChildren: 1, size: '20 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Tea/coffee maker'] },
      { id: 'twin', name: 'Twin Room', price: 0, description: 'Room with two single beds.', bedConfig: '2 single beds', maxAdults: 2, maxChildren: 0, size: '20 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Tea/coffee maker'] },
      { id: 'family', name: 'Family Room', price: 25, description: 'Spacious room for families.', bedConfig: '1 double bed + 1 sofa bed', maxAdults: 2, maxChildren: 2, size: '25 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Tea/coffee maker'] },
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation until 1 day before arrival.',
    childrenPolicy: 'Children of all ages are welcome.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard'],
    surroundings: {
      attractions: [
        { name: 'St Paul\'s Cathedral', distance: '400 m' },
        { name: 'Museum of London', distance: '350 m' },
        { name: 'Barbican Centre', distance: '500 m' },
        { name: 'Tower of London', distance: '1.5 km' },
      ],
      restaurantsCafes: [
        { name: 'Thyme', distance: '100 m' },
        { name: 'Bread Street Kitchen', distance: '350 m' },
        { name: 'The Barbican Kitchen', distance: '500 m' },
      ],
      publicTransport: [
        { name: 'Barbican Underground Station', distance: '300 m' },
        { name: 'St Paul\'s Underground Station', distance: '400 m' },
        { name: 'Moorgate Station', distance: '500 m' },
      ],
      closestAirports: [
        { name: 'London City Airport', distance: '9 km' },
        { name: 'London Heathrow Airport', distance: '28 km' },
        { name: 'London Gatwick Airport', distance: '48 km' },
      ],
    },
  },
  '3': {
    id: '3',
    name: 'Luxury Apartment Covent Garden',
    type: 'Apartment',
    starRating: null,
    location: 'Covent Garden, London',
    address: 'Long Acre, Covent Garden, London WC2E 9LY, United Kingdom',
    distance: '0.3 km from centre',
    description: 'Stylish 2-bedroom apartment with modern amenities in the heart of London\'s theatre district.',
    fullDescription: 'This stylish 2-bedroom apartment is located in the vibrant Covent Garden area, perfect for families or groups. The apartment features a fully equipped kitchen, spacious living area, and modern bathrooms. Enjoy the convenience of being within walking distance to West End theatres, restaurants, and shops.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ],
    reviewScore: 9.0,
    reviewCount: 234,
    reviewLabel: 'Superb',
    price: 180,
    originalPrice: null,
    freeCancellation: true,
    breakfastIncluded: false,
    geniusDiscount: true,
    amenities: ['Free WiFi', 'Kitchen', 'Washing machine', 'Air conditioning', 'City view', 'Non-smoking'],
    coordinates: { lat: 51.5117, lng: -0.1240 },
    categoryRatings: [
      { name: 'Staff', score: 9.2 },
      { name: 'Facilities', score: 8.9 },
      { name: 'Cleanliness', score: 9.3 },
      { name: 'Comfort', score: 9.0 },
      { name: 'Value for money', score: 8.7 },
      { name: 'Location', score: 9.5 },
      { name: 'Free WiFi', score: 8.8 },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'Anna',
        country: 'Italy',
        score: 9,
        date: '2024-01-08',
        title: 'Perfect location',
        positive: 'Amazing location in the heart of Covent Garden. The apartment was spacious and well-equipped. Perfect for our family.',
        negative: 'Stairs to the apartment are steep.',
        roomType: 'Entire Apartment',
        stayDuration: '5 nights',
      },
    ],
    faqs: [
      { question: 'Is self check-in available?', answer: 'Yes, self check-in is available with a key lockbox.' },
      { question: 'How many bedrooms are there?', answer: 'The apartment has 2 bedrooms.' },
    ],
    roomTypes: [
      { id: 'entire', name: 'Entire Apartment', price: 0, description: '2-bedroom apartment with full kitchen.', bedConfig: '1 double bed + 2 single beds', maxAdults: 4, maxChildren: 2, size: '75 m²', amenities: ['Kitchen', 'Washing machine', 'Air conditioning', 'City view', 'Living room'] },
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation until 7 days before arrival.',
    childrenPolicy: 'Children of all ages are welcome.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard', 'PayPal'],
    surroundings: {
      attractions: [
        { name: 'Covent Garden Market', distance: '150 m' },
        { name: 'Royal Opera House', distance: '200 m' },
        { name: 'London Transport Museum', distance: '100 m' },
        { name: 'Leicester Square', distance: '450 m' },
        { name: 'West End Theatres', distance: '300 m' },
      ],
      restaurantsCafes: [
        { name: 'Ivy Market Grill', distance: '100 m' },
        { name: 'Flat Iron Square', distance: '200 m' },
        { name: 'Dishoom', distance: '150 m' },
      ],
      publicTransport: [
        { name: 'Covent Garden Underground Station', distance: '100 m' },
        { name: 'Leicester Square Station', distance: '400 m' },
        { name: 'Holborn Station', distance: '500 m' },
      ],
      closestAirports: [
        { name: 'London City Airport', distance: '12 km' },
        { name: 'London Heathrow Airport', distance: '26 km' },
        { name: 'London Gatwick Airport', distance: '46 km' },
      ],
    },
  },
  '4': {
    id: '4',
    name: 'Hilton London Tower Bridge',
    type: 'Hotel',
    starRating: 4,
    location: 'Southwark, London',
    address: '5 More London Place, London SE1 2BY, United Kingdom',
    distance: '2.1 km from centre',
    description: 'Contemporary hotel near Tower Bridge with rooftop bar and stunning city views.',
    fullDescription: 'Hilton London Tower Bridge is a contemporary 4-star hotel offering stunning views of Tower Bridge and the River Thames. The hotel features a rooftop bar with panoramic city views, an on-site restaurant, fitness centre, and spacious modern rooms. Ideal for both business and leisure travellers.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    ],
    reviewScore: 8.5,
    reviewCount: 4521,
    reviewLabel: 'Very good',
    price: 175,
    originalPrice: 210,
    freeCancellation: true,
    breakfastIncluded: true,
    geniusDiscount: false,
    amenities: ['Free WiFi', 'Rooftop bar', 'Restaurant', 'Fitness centre', 'Business centre', 'Room service', 'Air conditioning'],
    coordinates: { lat: 51.5055, lng: -0.0754 },
    categoryRatings: [
      { name: 'Staff', score: 8.7 },
      { name: 'Facilities', score: 8.5 },
      { name: 'Cleanliness', score: 8.8 },
      { name: 'Comfort', score: 8.4 },
      { name: 'Value for money', score: 7.9 },
      { name: 'Location', score: 9.0 },
      { name: 'Free WiFi', score: 8.2 },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'Peter',
        country: 'Australia',
        score: 9,
        date: '2024-01-10',
        title: 'Great hotel near Tower Bridge',
        positive: 'Fantastic views of Tower Bridge. The rooftop bar is amazing. Staff were very helpful.',
        negative: 'Parking is expensive.',
        roomType: 'King Guest Room',
        stayDuration: '3 nights',
      },
    ],
    faqs: [
      { question: 'Does the hotel have a gym?', answer: 'Yes, there is a fitness centre open 24 hours.' },
      { question: 'Is there parking available?', answer: 'Yes, valet parking is available for an additional fee.' },
    ],
    roomTypes: [
      { id: 'guest', name: 'King Guest Room', price: 0, description: 'Modern room with city views.', bedConfig: '1 large double bed', maxAdults: 2, maxChildren: 1, size: '26 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe', 'Tea/coffee maker'] },
      { id: 'executive', name: 'Executive Room', price: 45, description: 'Room with executive lounge access.', bedConfig: '1 large double bed', maxAdults: 2, maxChildren: 2, size: '30 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe', 'Executive lounge access'] },
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation until 24 hours before arrival.',
    childrenPolicy: 'Children of all ages are welcome. One child under 2 stays free in a crib.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard', 'American Express'],
    surroundings: {
      attractions: [
        { name: 'Tower Bridge', distance: '200 m' },
        { name: 'Tower of London', distance: '500 m' },
        { name: 'HMS Belfast', distance: '400 m' },
        { name: 'The Shard', distance: '600 m' },
        { name: 'Borough Market', distance: '800 m' },
      ],
      restaurantsCafes: [
        { name: 'Oblix Restaurant', distance: '600 m' },
        { name: 'Fish! Restaurant', distance: '500 m' },
        { name: 'Roast', distance: '800 m' },
      ],
      publicTransport: [
        { name: 'London Bridge Station', distance: '400 m' },
        { name: 'Tower Hill Underground', distance: '600 m' },
        { name: 'Borough Underground', distance: '700 m' },
      ],
      closestAirports: [
        { name: 'London City Airport', distance: '8 km' },
        { name: 'London Heathrow Airport', distance: '30 km' },
        { name: 'London Gatwick Airport', distance: '42 km' },
      ],
    },
  },
  '5': {
    id: '5',
    name: 'Budget Hostel Kings Cross',
    type: 'Hostel',
    starRating: null,
    location: 'Kings Cross, London',
    address: 'Gray\'s Inn Road, London WC1X 8NP, United Kingdom',
    distance: '3.5 km from centre',
    description: 'Affordable hostel with private and shared rooms, perfect for budget travellers.',
    fullDescription: 'Budget Hostel Kings Cross offers affordable accommodation near King\'s Cross Station. The hostel features both private and shared dormitory rooms, a communal kitchen, lounge area, and free WiFi. Perfect for budget-conscious travellers and backpackers exploring London.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
    ],
    reviewScore: 7.2,
    reviewCount: 1876,
    reviewLabel: 'Good',
    price: 35,
    originalPrice: null,
    freeCancellation: false,
    breakfastIncluded: false,
    geniusDiscount: false,
    amenities: ['Free WiFi', 'Shared kitchen', 'Luggage storage', 'Laundry facilities', '24-hour reception'],
    coordinates: { lat: 51.5309, lng: -0.1233 },
    categoryRatings: [
      { name: 'Staff', score: 7.5 },
      { name: 'Facilities', score: 6.8 },
      { name: 'Cleanliness', score: 7.3 },
      { name: 'Comfort', score: 6.9 },
      { name: 'Value for money', score: 8.2 },
      { name: 'Location', score: 8.5 },
      { name: 'Free WiFi', score: 7.0 },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'Alex',
        country: 'Canada',
        score: 7,
        date: '2024-01-05',
        title: 'Good budget option',
        positive: 'Great location near Kings Cross. Good value for money. Friendly staff.',
        negative: 'Shared bathrooms can be busy in the morning.',
        roomType: 'Bed in 6-Bed Dorm',
        stayDuration: '4 nights',
      },
    ],
    faqs: [
      { question: 'Are lockers provided?', answer: 'Yes, lockers are available in each dormitory room.' },
      { question: 'Is there a curfew?', answer: 'No, the hostel is open 24 hours.' },
    ],
    roomTypes: [
      { id: 'dorm6', name: 'Bed in 6-Bed Mixed Dormitory', price: 0, description: 'Bed in a shared dormitory room.', bedConfig: '1 single bed', maxAdults: 1, maxChildren: 0, size: 'Shared', amenities: ['Locker', 'Shared bathroom'] },
      { id: 'dorm4', name: 'Bed in 4-Bed Mixed Dormitory', price: 5, description: 'Bed in a smaller shared room.', bedConfig: '1 single bed', maxAdults: 1, maxChildren: 0, size: 'Shared', amenities: ['Locker', 'Shared bathroom'] },
      { id: 'private', name: 'Private Double Room', price: 30, description: 'Private room with double bed.', bedConfig: '1 double bed', maxAdults: 2, maxChildren: 0, size: '12 m²', amenities: ['Shared bathroom', 'Towels included'] },
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '10:00 AM',
    cancellationPolicy: 'Non-refundable. No cancellation.',
    childrenPolicy: 'Children under 16 are not allowed.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard'],
    surroundings: {
      attractions: [
        { name: 'British Library', distance: '500 m' },
        { name: 'St Pancras International', distance: '400 m' },
        { name: 'Kings Place', distance: '300 m' },
        { name: 'Granary Square', distance: '600 m' },
      ],
      restaurantsCafes: [
        { name: 'Caravan Kings Cross', distance: '400 m' },
        { name: 'The Gilbert Scott', distance: '350 m' },
        { name: 'Dishoom Kings Cross', distance: '500 m' },
      ],
      publicTransport: [
        { name: 'Kings Cross Station', distance: '300 m' },
        { name: 'St Pancras Station', distance: '350 m' },
        { name: 'Russell Square Underground', distance: '700 m' },
      ],
      closestAirports: [
        { name: 'London City Airport', distance: '14 km' },
        { name: 'London Heathrow Airport', distance: '30 km' },
        { name: 'London Luton Airport', distance: '45 km' },
      ],
    },
  },
  '6': {
    id: '6',
    name: 'Shangri-La The Shard',
    type: 'Hotel',
    starRating: 5,
    location: 'Southwark, London',
    address: '31 St Thomas Street, London SE1 9QU, United Kingdom',
    distance: '2.5 km from centre',
    description: 'Ultra-luxury hotel in The Shard with breathtaking views of London from floors 34-52.',
    fullDescription: 'Shangri-La The Shard, London occupies floors 34 to 52 of Western Europe\'s tallest building. This ultra-luxury hotel offers unrivalled panoramic views of London, with opulent rooms featuring floor-to-ceiling windows, marble bathrooms, and the finest amenities. The hotel features TING restaurant serving modern British-Asian cuisine, GŌNG bar, and an infinity pool with stunning city views.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    ],
    reviewScore: 9.5,
    reviewCount: 2876,
    reviewLabel: 'Exceptional',
    price: 650,
    originalPrice: 780,
    freeCancellation: true,
    breakfastIncluded: true,
    geniusDiscount: true,
    amenities: ['Free WiFi', 'Infinity Pool', 'Spa', 'Fitness centre', 'Restaurant', 'Bar', 'Room service', 'Concierge', 'City view'],
    coordinates: { lat: 51.5045, lng: -0.0865 },
    categoryRatings: [
      { name: 'Staff', score: 9.6 },
      { name: 'Facilities', score: 9.5 },
      { name: 'Cleanliness', score: 9.7 },
      { name: 'Comfort', score: 9.5 },
      { name: 'Value for money', score: 8.8 },
      { name: 'Location', score: 9.3 },
      { name: 'Free WiFi', score: 9.4 },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'Catherine',
        country: 'United Kingdom',
        score: 10,
        date: '2024-01-18',
        title: 'Absolutely spectacular',
        positive: 'The views are absolutely unreal. The room was immaculate and the service was impeccable. The infinity pool is a must-visit. Breakfast was exceptional.',
        negative: '',
        roomType: 'Deluxe City View Room',
        stayDuration: '2 nights',
      },
      {
        id: 'r2',
        guestName: 'James',
        country: 'United States',
        score: 10,
        date: '2024-01-12',
        title: 'World-class luxury',
        positive: 'Everything about this hotel exceeded expectations. The GŌNG bar has the best views in London. Staff remembered our names and preferences.',
        negative: 'Slightly difficult to navigate on first arrival.',
        roomType: 'Premier City View Room',
        stayDuration: '3 nights',
      },
    ],
    faqs: [
      { question: 'What floors is the hotel on?', answer: 'The hotel occupies floors 34 to 52 of The Shard.' },
      { question: 'Does the hotel have a pool?', answer: 'Yes, there is a stunning infinity pool on the 52nd floor with panoramic London views.' },
      { question: 'What dining options are available?', answer: 'The hotel features TING restaurant (British-Asian cuisine), LANG restaurant, and GŌNG bar.' },
    ],
    roomTypes: [
      { id: 'deluxe', name: 'Deluxe City View Room', price: 0, description: 'Elegant room with floor-to-ceiling windows and city views.', bedConfig: '1 extra-large double bed', maxAdults: 2, maxChildren: 1, size: '45 m²', amenities: ['Floor-to-ceiling windows', 'Marble bathroom', 'Nespresso machine', 'Bose sound system'] },
      { id: 'premier', name: 'Premier City View Room', price: 150, description: 'Larger room with enhanced views and premium amenities.', bedConfig: '1 extra-large double bed', maxAdults: 2, maxChildren: 2, size: '52 m²', amenities: ['Panoramic views', 'Rain shower', 'Soaking tub', 'Butler service'] },
      { id: 'iconic', name: 'Iconic City View Suite', price: 400, description: 'Luxurious suite with separate living area and landmark views.', bedConfig: '1 extra-large double bed', maxAdults: 3, maxChildren: 2, size: '72 m²', amenities: ['Living room', '270-degree views', 'Butler service', 'Welcome champagne'] },
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation until 48 hours before arrival. After that, the first night is non-refundable.',
    childrenPolicy: 'Children of all ages are welcome. Extra beds available on request.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard', 'American Express', 'Diners Club'],
    surroundings: {
      attractions: [
        { name: 'The View from The Shard', distance: 'Same building' },
        { name: 'Borough Market', distance: '250 m' },
        { name: 'London Bridge', distance: '400 m' },
        { name: 'Tower Bridge', distance: '800 m' },
        { name: 'HMS Belfast', distance: '650 m' },
      ],
      restaurantsCafes: [
        { name: 'Borough Market', distance: '250 m' },
        { name: 'Oblix at The Shard', distance: 'Same building' },
        { name: 'Roast Restaurant', distance: '300 m' },
      ],
      publicTransport: [
        { name: 'London Bridge Station', distance: '150 m' },
        { name: 'Borough Underground', distance: '400 m' },
        { name: 'Tower Gateway DLR', distance: '1 km' },
      ],
      closestAirports: [
        { name: 'London City Airport', distance: '10 km' },
        { name: 'London Heathrow Airport', distance: '30 km' },
        { name: 'London Gatwick Airport', distance: '42 km' },
      ],
    },
  },
};

// Transform backend hotel data to the format expected by the page
function transformBackendHotel(hotel: Record<string, unknown>): typeof mockProperties[string] {
  const getReviewLabel = (score: number) => {
    if (score >= 9) return 'Superb';
    if (score >= 8) return 'Very good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Pleasant';
    return 'Review score';
  };

  const location = hotel.location as { city?: string; country?: string; address?: string } | undefined;
  const roomTypes = (hotel.roomTypes as Array<{ id: string; name: string; price: number; maxGuests: number }>) || [];
  const amenities = (hotel.amenities as string[]) || [];
  const images = (hotel.images as string[]) || [];
  const reviewScore = (hotel.reviewScore as number) || 7.5;
  const pricePerNight = (hotel.pricePerNight as number) || 100;

  // Generate placeholder images if none provided or if they're local paths
  const placeholderImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  ];

  const resolvedImages = images.length > 0 && !images[0].startsWith('/images/')
    ? images
    : placeholderImages;

  return {
    id: hotel.id as string,
    name: (hotel.name as string) || 'Unknown Hotel',
    type: (hotel.type as string) || 'Hotel',
    starRating: (hotel.starRating as number) || null,
    location: location ? `${location.city || ''}, ${location.country || ''}` : 'Unknown Location',
    address: location?.address || 'Address not available',
    distance: '0.5 km from centre',
    description: (hotel.description as string) || 'No description available',
    fullDescription: (hotel.description as string) || 'No description available',
    image: resolvedImages[0],
    images: resolvedImages,
    reviewScore,
    reviewCount: (hotel.reviewCount as number) || 100,
    reviewLabel: getReviewLabel(reviewScore),
    price: pricePerNight,
    originalPrice: Math.round(pricePerNight * 1.15),
    freeCancellation: true,
    breakfastIncluded: amenities.some(a => a.toLowerCase().includes('breakfast')),
    geniusDiscount: reviewScore >= 9,
    amenities: amenities.length > 0 ? amenities : ['WiFi', 'Restaurant', 'Room Service'],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    categoryRatings: [
      { name: 'Staff', score: Math.min(10, reviewScore + 0.2) },
      { name: 'Facilities', score: Math.min(10, reviewScore + 0.1) },
      { name: 'Cleanliness', score: Math.min(10, reviewScore + 0.3) },
      { name: 'Comfort', score: Math.min(10, reviewScore + 0.1) },
      { name: 'Value for money', score: Math.max(6, reviewScore - 0.6) },
      { name: 'Location', score: Math.min(10, reviewScore + 0.5) },
      { name: 'Free WiFi', score: Math.min(10, reviewScore - 0.1) },
    ],
    guestReviews: [
      {
        id: 'r1',
        guestName: 'John',
        country: 'United States',
        score: 10,
        date: '2024-01-15',
        title: 'Excellent stay',
        positive: 'Great location, friendly staff, and clean rooms. Would definitely recommend!',
        negative: '',
        roomType: roomTypes[0]?.name || 'Standard Room',
        stayDuration: '3 nights',
      },
      {
        id: 'r2',
        guestName: 'Sophie',
        country: 'France',
        score: 9,
        date: '2024-01-10',
        title: 'Very comfortable',
        positive: 'Beautiful hotel with excellent service. The breakfast was wonderful.',
        negative: 'Some street noise at night.',
        roomType: roomTypes[0]?.name || 'Standard Room',
        stayDuration: '2 nights',
      },
    ],
    faqs: [
      { question: `What are the check-in and check-out times?`, answer: 'Check-in is from 3:00 PM, and check-out is until 12:00 PM.' },
      { question: `Does the hotel have parking?`, answer: 'Parking availability varies. Please contact the hotel for details.' },
      { question: `Is breakfast included?`, answer: amenities.some(a => a.toLowerCase().includes('breakfast')) ? 'Yes, breakfast is included with your stay.' : 'Breakfast is available for an additional charge.' },
    ],
    roomTypes: roomTypes.length > 0 ? roomTypes.map(rt => ({
      id: rt.id,
      name: rt.name,
      price: rt.price - pricePerNight, // Price difference from base
      description: `Comfortable ${rt.name.toLowerCase()} with modern amenities.`,
      bedConfig: rt.maxGuests > 2 ? '1 extra-large double bed or 2 single beds' : '1 large double bed',
      maxAdults: rt.maxGuests,
      maxChildren: Math.max(1, rt.maxGuests - 1),
      size: `${20 + rt.maxGuests * 5} m²`,
      amenities: ['Air conditioning', 'Flat-screen TV', 'Safe', 'Tea/coffee maker'],
    })) : [
      { id: 'standard', name: 'Standard Room', price: 0, description: 'Comfortable room with modern amenities.', bedConfig: '1 large double bed', maxAdults: 2, maxChildren: 1, size: '25 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Safe'] },
      { id: 'deluxe', name: 'Deluxe Room', price: 50, description: 'Spacious room with premium amenities.', bedConfig: '1 extra-large double bed', maxAdults: 2, maxChildren: 2, size: '32 m²', amenities: ['Air conditioning', 'Flat-screen TV', 'Minibar', 'Safe'] },
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation until 24 hours before arrival. After that, the first night is non-refundable.',
    childrenPolicy: 'Children of all ages are welcome. Children under 12 stay free when using existing bedding.',
    petsPolicy: 'Pets are not allowed.',
    paymentMethods: ['Visa', 'Mastercard', 'American Express'],
    surroundings: {
      attractions: [
        { name: 'City Centre', distance: '500 m' },
        { name: 'Main Square', distance: '600 m' },
        { name: 'Museum', distance: '800 m' },
      ],
      restaurantsCafes: [
        { name: 'Local Restaurant', distance: '100 m' },
        { name: 'Café', distance: '150 m' },
      ],
      publicTransport: [
        { name: 'Bus Stop', distance: '50 m' },
        { name: 'Metro Station', distance: '300 m' },
      ],
      closestAirports: [
        { name: 'City Airport', distance: '15 km' },
      ],
    },
  };
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDatePrompt, setShowDatePrompt] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showRoomSelectionModal, setShowRoomSelectionModal] = useState(false);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set());
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    prepareTask052ClickSession();
  }, []);

  // State for fetching hotel from backend
  const [property, setProperty] = useState<typeof mockProperties[string] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hotel data from backend API
  useEffect(() => {
    let cancelled = false;

    const fetchHotel = async () => {
      if (!id) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
      }

      if (id === TASK052_TARGET_HOTEL_ID) {
        try {
          const flowResponse = await fetch('/api/task052/flow', {
            credentials: 'include',
          });
          const flowData = await flowResponse.json().catch(() => ({}));
          if (!flowResponse.ok || flowData.flow?.can_view_target_hotel !== true) {
            if (!cancelled) {
              navigate('/search?destination=Paris', { replace: true });
            }
            return;
          }
        } catch {
          if (!cancelled) {
            navigate('/search?destination=Paris', { replace: true });
          }
          return;
        }
      }

      try {
        const response = await fetch(`/api/hotels/${id}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hotel) {
            if (!cancelled) {
              setProperty(transformBackendHotel(data.hotel));
              setError(null);
            }
            return;
          }
        }

        if (mockProperties[id]) {
          if (!cancelled) {
            setProperty(mockProperties[id]);
            setError(null);
          }
        } else {
          if (!cancelled) {
            setError('Property not found');
            setProperty(null);
          }
        }
      } catch {
        if (mockProperties[id]) {
          if (!cancelled) {
            setProperty(mockProperties[id]);
            setError(null);
          }
        } else {
          if (!cancelled) {
            setError('Failed to load property');
            setProperty(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchHotel();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  // Navigation tabs for the property page
  const navTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Info & prices' },
    { id: 'amenities', label: 'Facilities' },
    { id: 'reviews', label: 'Guest reviews' },
    { id: 'surroundings', label: 'Hotel surroundings' },
    { id: 'house-rules', label: 'House rules' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky header/nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSave = () => {
    // In a real app, this would check if user is logged in
    // For now, we'll show the login prompt first time, then toggle saved state
    if (!isSaved) {
      setShowLoginPrompt(true);
    } else {
      setIsSaved(false);
    }
  };

  const handleSaveWithoutLogin = () => {
    setIsSaved(true);
    setShowLoginPrompt(false);
  };

  // Check if dates are provided in URL
  const checkIn = searchParams.get('checkin');
  const checkOut = searchParams.get('checkout');
  const hasDates = !!(checkIn && checkOut);

  // Handle keyboard for gallery modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showGalleryModal || !property) return;
      if (e.key === 'Escape') setShowGalleryModal(false);
      if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev + 1) % property.images.length);
      if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGalleryModal, property]);

  const toggleFAQ = (index: number) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFAQs(newExpanded);
  };

  const toggleReview = (id: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedReviews(newExpanded);
  };

  const handleShowPrices = () => {
    if (!hasDates) {
      setShowDatePrompt(true);
    } else {
      const element = document.getElementById('rooms');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContinueToBooking = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!selectedRoom || !property) {
      return;
    }

    const selectedRoomData = property.roomTypes.find(r => r.id === selectedRoom);
    if (!selectedRoomData) {
      return;
    }

    if (property.id === TASK052_TARGET_HOTEL_ID) {
      if (!event.nativeEvent.isTrusted) {
        return;
      }

      try {
        const clickProof = await createTask052ClickProofForEvent('open_checkout', {
          hotel_id: property.id,
          room: selectedRoomData.name,
        }, event);
        const response = await fetch('/api/task052/open-checkout', {
          method: 'POST',
          credentials: 'include',
          headers: createTask052JsonHeaders(),
          body: JSON.stringify({
            hotel_id: property.id,
            hotel_name: TASK052_TARGET_HOTEL_NAME,
            room: selectedRoomData.name,
            click_proof: clickProof,
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.allowed !== true) {
          throw new Error('Checkout is not available for this room');
        }
        updateTask052ClickChallenge(data.next_click_challenge);
        navigate(typeof data.next === 'string' ? data.next : '/checkout');
      } catch (err) {
        console.error('Failed to open task 052 checkout:', err);
        navigate('/search?destination=Paris', { replace: true });
      }
      return;
    }

    const checkIn = searchParams.get('checkin') || new Date().toISOString().split('T')[0];
    const checkOut = searchParams.get('checkout') || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const adults = searchParams.get('adults') || '2';
    const children = searchParams.get('children') || '0';
    const rooms = searchParams.get('rooms') || '1';
    navigate(`/checkout?hotel_id=${property.id}&hotel_name=${encodeURIComponent(property.name)}&room=${encodeURIComponent(selectedRoomData.name)}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}&price=${property.price + selectedRoomData.price}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-container-lg mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-48 mx-auto"></div>
        </div>
        <p className="text-neutral-600 mt-4">Loading property details...</p>
      </div>
    );
  }

  // Error or not found state
  if (!property || error) {
    return (
      <div className="max-w-container-lg mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Property Not Found</h1>
        <p className="text-neutral-600 mb-6">Sorry, we couldn&apos;t find the property you&apos;re looking for.</p>
        <Link to="/search" className="text-booking-blue-light hover:underline">
          Back to search results
        </Link>
      </div>
    );
  }

  const selectedTask052Room =
    property.roomTypes.find((room) => room.id === selectedRoom)?.name ?? "";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-2">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/search" className="text-booking-blue-light hover:underline">London</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">{property.name}</span>
          </nav>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-[68px] z-40">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className="px-4 py-3 text-sm font-medium text-neutral-600 hover:text-booking-blue-light hover:bg-blue-50 whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-booking-blue-light"
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6" id="overview">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {property.starRating && (
                <span className="flex">
                  {Array.from({ length: property.starRating }).map((_, i) => (
                    <span key={i} className="text-yellow-500">&#9733;</span>
                  ))}
                </span>
              )}
              <span className="text-xs bg-neutral-200 px-2 py-0.5 rounded">{property.type}</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800">{property.name}</h1>
            <p className="text-booking-blue-light hover:underline cursor-pointer flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {property.location} - {property.distance}
            </p>
          </div>
          <div className="flex items-start gap-4">
            {/* Save/Share buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`flex items-center gap-1 px-3 py-2 rounded border transition-colors ${
                  isSaved
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save property'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isSaved ? 0 : 2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="text-sm font-medium">Save</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center gap-1 px-3 py-2 rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors"
                  title="Share property"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </button>
                {/* Share dropdown */}
                {showShareOptions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShowShareOptions(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      Copy link
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      onClick={() => {
                        window.open(`mailto:?subject=Check out ${property.name}&body=${window.location.href}`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Email
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out ${property.name}`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X (Twitter)
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      onClick={() => {
                        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${property.name}: ${window.location.href}`)}`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-neutral-800">{property.reviewLabel}</p>
                  <p className="text-xs text-neutral-500">{property.reviewCount.toLocaleString()} reviews</p>
                </div>
                <span className="bg-booking-blue text-white font-bold px-3 py-2 rounded text-lg">
                  {property.reviewScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-6 relative">
          <div className="col-span-2 row-span-2">
            <img
              src={property.images[0]}
              alt={property.name}
              className="w-full h-80 object-cover rounded-l-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => { setSelectedImageIndex(0); setShowGalleryModal(true); }}
            />
          </div>
          {property.images.slice(1, 5).map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`${property.name} ${index + 2}`}
                className={`w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity ${index === 1 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}
                onClick={() => { setSelectedImageIndex(index + 1); setShowGalleryModal(true); }}
              />
              {/* Show +N photos button on the last visible image */}
              {index === 3 && property.images.length > 5 && (
                <button
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg rounded-br-lg hover:bg-black/60 transition-colors"
                  onClick={() => { setSelectedImageIndex(4); setShowGalleryModal(true); }}
                >
                  +{property.images.length - 4} photos
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Full-screen Photo Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 bg-black z-modal flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-lg font-medium">{property.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">{selectedImageIndex + 1} / {property.images.length}</span>
                <button
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => setShowGalleryModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center relative px-16">
              <button
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                </svg>
              </button>
              <img
                src={property.images[selectedImageIndex]}
                alt={`${property.name} - Photo ${selectedImageIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain"
              />
              <button
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % property.images.length)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="p-4 flex justify-center gap-2 overflow-x-auto">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">About this property</h2>
              <p className="text-neutral-600 mb-4">{property.fullDescription}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {property.freeCancellation && (
                  <span className="text-sm text-success font-medium bg-green-50 px-3 py-1 rounded-full">
                    Free cancellation
                  </span>
                )}
                {property.breakfastIncluded && (
                  <span className="text-sm text-success font-medium bg-green-50 px-3 py-1 rounded-full">
                    Breakfast included
                  </span>
                )}
                {property.geniusDiscount && (
                  <span className="text-sm text-booking-blue font-medium bg-blue-50 px-3 py-1 rounded-full">
                    Genius discount available
                  </span>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6" id="amenities">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Most popular amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-neutral-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Room Selection / Availability Table */}
            <div className="bg-white rounded-lg shadow-card p-6" id="rooms">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Availability</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-booking-blue text-white text-sm">
                      <th className="px-4 py-3 text-left font-medium">Room type</th>
                      <th className="px-4 py-3 text-left font-medium">Sleeps</th>
                      <th className="px-4 py-3 text-left font-medium">Price for 1 night</th>
                      <th className="px-4 py-3 text-left font-medium">Your choices</th>
                      <th className="px-4 py-3 text-left font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.roomTypes.map((room, index) => {
                      const roomPrice = property.price + room.price;
                      return (
                        <tr
                          key={room.id}
                          className={`border-b border-neutral-200 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
                        >
                          <td className="px-4 py-4">
                            <h3 className="font-bold text-booking-blue-light text-base mb-1">{room.name}</h3>
                            <p className="text-sm text-neutral-600 mb-2">{room.description}</p>
                            <div className="flex items-center gap-1 text-sm text-neutral-600 mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                              </svg>
                              <span>{room.size}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-neutral-600">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zm13.5 0c0-.621.504-1.125 1.125-1.125h3c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3a1.125 1.125 0 01-1.125-1.125v-3.75zM2.25 17.625c0-.621.504-1.125 1.125-1.125h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zm13.5 0c0-.621.504-1.125 1.125-1.125h3c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3a1.125 1.125 0 01-1.125-1.125v-3.75z" />
                              </svg>
                              <span>{room.bedConfig}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: room.maxAdults }).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                              ))}
                              {room.maxChildren > 0 && (
                                <>
                                  {Array.from({ length: Math.min(room.maxChildren, 2) }).map((_, i) => (
                                    <svg key={`child-${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400">
                                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                  ))}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-lg font-bold text-neutral-800">EUR {roomPrice}</p>
                            <p className="text-xs text-neutral-500">includes taxes and fees</p>
                          </td>
                          <td className="px-4 py-4">
                            {property.freeCancellation && (
                              <p className="text-sm text-success flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                Free cancellation
                              </p>
                            )}
                            {property.breakfastIncluded && (
                              <p className="text-sm text-success flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                Breakfast included
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              className="px-4 py-2 bg-booking-blue-light text-white font-medium rounded hover:bg-booking-blue transition-colors whitespace-nowrap"
                              onClick={handleShowPrices}
                            >
                              Show prices
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Guest Reviews Section */}
            <div className="bg-white rounded-lg shadow-card p-6 mt-6" id="reviews">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Guest reviews</h2>

              {/* Overall Score */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
                <div className="bg-booking-blue text-white font-bold px-4 py-3 rounded-lg text-2xl">
                  {property.reviewScore}
                </div>
                <div>
                  <p className="font-bold text-neutral-800 text-lg">{property.reviewLabel}</p>
                  <p className="text-sm text-neutral-500">{property.reviewCount.toLocaleString()} reviews</p>
                </div>
              </div>

              {/* Category Ratings */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-neutral-200">
                {property.categoryRatings.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-booking-blue rounded-full"
                          style={{ width: `${(category.score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-800 w-8">{category.score}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {property.guestReviews.map((review) => {
                  const isExpanded = expandedReviews.has(review.id);
                  const needsExpansion = review.positive.length > 150;
                  return (
                    <div key={review.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-booking-blue-light rounded-full flex items-center justify-center text-white font-bold">
                            {review.guestName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800">{review.guestName}</p>
                            <p className="text-sm text-neutral-500">{review.country}</p>
                          </div>
                        </div>
                        <div className="bg-booking-blue text-white font-bold px-2 py-1 rounded text-sm">
                          {review.score}
                        </div>
                      </div>
                      <p className="font-medium text-neutral-800 mb-2">{review.title}</p>
                      <div className="mb-2">
                        {review.positive && (
                          <div className="flex gap-2 mb-2">
                            <span className="text-success text-lg">+</span>
                            <p className={`text-sm text-neutral-600 ${!isExpanded && needsExpansion ? 'line-clamp-2' : ''}`}>
                              {review.positive}
                            </p>
                          </div>
                        )}
                        {review.negative && (
                          <div className="flex gap-2">
                            <span className="text-error text-lg">-</span>
                            <p className="text-sm text-neutral-600">{review.negative}</p>
                          </div>
                        )}
                      </div>
                      {needsExpansion && (
                        <button
                          className="text-booking-blue-light text-sm font-medium hover:underline"
                          onClick={() => toggleReview(review.id)}
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                      <div className="mt-3 pt-3 border-t border-neutral-100 flex gap-4 text-xs text-neutral-500">
                        <span>{review.roomType}</span>
                        <span>{review.stayDuration}</span>
                        <span>{new Date(review.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className="mt-4 text-booking-blue-light font-medium hover:underline"
                onClick={() => setShowReviewsModal(true)}
              >
                Read all reviews
              </button>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-card p-6 mt-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">FAQs about {property.name}</h2>
              <div className="space-y-2">
                {property.faqs.map((faq, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="font-medium text-neutral-800 pr-4">{faq.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-5 h-5 text-neutral-500 transition-transform ${expandedFAQs.has(index) ? 'rotate-180' : ''}`}
                      >
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {expandedFAQs.has(index) && (
                      <div className="px-4 pb-4 text-neutral-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Surroundings Section */}
            <div className="bg-white rounded-lg shadow-card p-6 mt-6" id="surroundings">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Hotel surroundings</h2>
              <div className="grid grid-cols-2 gap-8">
                {/* Attractions */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-bold text-neutral-800">Top attractions</h3>
                  </div>
                  <ul className="space-y-2">
                    {property.surroundings.attractions.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-700">{item.name}</span>
                        <span className="text-neutral-500">{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Restaurants & Cafes */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-bold text-neutral-800">Restaurants & cafes</h3>
                  </div>
                  <ul className="space-y-2">
                    {property.surroundings.restaurantsCafes.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-700">{item.name}</span>
                        <span className="text-neutral-500">{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Public Transport */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                      <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                    </svg>
                    <h3 className="font-bold text-neutral-800">Public transport</h3>
                  </div>
                  <ul className="space-y-2">
                    {property.surroundings.publicTransport.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-700">{item.name}</span>
                        <span className="text-neutral-500">{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Closest Airports */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                    <h3 className="font-bold text-neutral-800">Closest airports</h3>
                  </div>
                  <ul className="space-y-2">
                    {property.surroundings.closestAirports.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-700">{item.name}</span>
                        <span className="text-neutral-500">{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* House Rules Section */}
            <div className="bg-white rounded-lg shadow-card p-6 mt-6" id="house-rules">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">House rules</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-600">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                    </svg>
                    <div>
                      <p className="font-medium text-neutral-800">Check-in</p>
                      <p className="text-neutral-600">From {property.checkInTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-600">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                    </svg>
                    <div>
                      <p className="font-medium text-neutral-800">Check-out</p>
                      <p className="text-neutral-600">Until {property.checkOutTime}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Cancellation / prepayment</p>
                    <p className="text-sm text-neutral-600">{property.cancellationPolicy}</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Children and beds</p>
                    <p className="text-sm text-neutral-600">{property.childrenPolicy}</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Pets</p>
                    <p className="text-sm text-neutral-600">{property.petsPolicy}</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Cards accepted at this property</p>
                    <div className="flex gap-2 mt-1">
                      {property.paymentMethods.map((method, index) => (
                        <span key={index} className="px-2 py-1 bg-neutral-100 text-xs text-neutral-600 rounded">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
              <h3 className="font-bold text-neutral-800 mb-4">Property highlights</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Top location: Highly rated by recent guests</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  <span className="text-sm">Guests love the breakfast</span>
                </div>
              </div>

              {/* Show on map button */}
              <button
                className="w-full mb-4 py-2 border border-booking-blue-light text-booking-blue-light font-medium rounded hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowMapModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                </svg>
                Show on map
              </button>

              <div className="border-t border-neutral-200 pt-4 mb-4">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm text-neutral-500">Price for 1 night, 2 adults</span>
                </div>
                {property.originalPrice && (
                  <p className="text-neutral-500 line-through">EUR {property.originalPrice}</p>
                )}
                <p className="text-2xl font-bold text-neutral-800">EUR {property.price}</p>
                <p className="text-xs text-neutral-500">Includes taxes and fees</p>
              </div>

              <button
                className="w-full py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors mb-3"
                onClick={() => {
                  // Navigate to checkout with room selection modal
                  setShowRoomSelectionModal(true);
                }}
              >
                Reserve
              </button>

              <button
                className="w-full py-3 border-2 border-booking-blue-light text-booking-blue-light font-bold rounded hover:bg-blue-50 transition-colors mb-3"
                onClick={() => {
                  // Show room availability section or modal
                  setShowRoomSelectionModal(true);
                }}
              >
                See availability
              </button>

              <p className="text-xs text-center text-neutral-500">
                Choose a room type to proceed
              </p>
            </div>
          </div>
        </div>

        {/* Map Modal */}
        {showMapModal && (
          <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h3 className="font-bold text-neutral-800">{property.name} - Location</h3>
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  onClick={() => setShowMapModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-500">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="h-96 bg-neutral-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simple map representation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                    {/* Grid lines to simulate map */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    {/* Hotel marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#003580" className="w-12 h-12">
                          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-sm font-medium whitespace-nowrap">
                          {property.name}
                        </div>
                      </div>
                    </div>
                    {/* Nearby hotels */}
                    <div className="absolute top-1/3 left-1/3">
                      <div className="bg-booking-blue text-white px-2 py-1 rounded text-xs font-medium shadow">
                        EUR 180
                      </div>
                    </div>
                    <div className="absolute top-2/3 right-1/3">
                      <div className="bg-booking-blue text-white px-2 py-1 rounded text-xs font-medium shadow">
                        EUR 220
                      </div>
                    </div>
                    <div className="absolute top-1/4 right-1/4">
                      <div className="bg-booking-blue text-white px-2 py-1 rounded text-xs font-medium shadow">
                        EUR 150
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium text-neutral-800">{property.address}</p>
                  <p className="text-sm text-neutral-600">{property.distance}</p>
                  <p className="text-sm text-booking-blue-light mt-2 cursor-pointer hover:underline">
                    Open in Google Maps
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date prompt dialog */}
        {showDatePrompt && (
          <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="font-bold text-neutral-800 text-lg mb-4">Select your dates</h3>
              <p className="text-neutral-600 mb-6">
                Please select your check-in and check-out dates to see prices and availability for this room.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 border border-neutral-300 text-neutral-700 font-medium rounded hover:bg-neutral-50 transition-colors"
                  onClick={() => setShowDatePrompt(false)}
                >
                  Cancel
                </button>
                <Link
                  to={`/search?destination=London`}
                  className="flex-1 py-3 bg-booking-blue-light text-white font-medium rounded hover:bg-booking-blue transition-colors text-center"
                >
                  Select dates
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Login prompt for saving */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-neutral-800 text-lg">Save this property</h3>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-neutral-600 mb-6">
                Sign in to save {property.name} to your saved properties list and access it from any device.
              </p>
              <div className="space-y-3">
                <Link
                  to="/sign-in"
                  className="block w-full py-3 bg-booking-blue-light text-white font-medium rounded hover:bg-booking-blue transition-colors text-center"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-in"
                  className="block w-full py-3 border border-booking-blue-light text-booking-blue-light font-medium rounded hover:bg-blue-50 transition-colors text-center"
                >
                  Create account
                </Link>
                <button
                  onClick={handleSaveWithoutLogin}
                  className="block w-full py-3 text-neutral-600 font-medium hover:text-neutral-800 transition-colors text-center"
                >
                  Save without signing in
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close share dropdown */}
        {showShareOptions && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareOptions(false)}
          />
        )}

        {/* Room Selection Modal */}
        {showRoomSelectionModal && (
          <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h3 className="font-bold text-neutral-800 text-lg">Select a room</h3>
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  onClick={() => setShowRoomSelectionModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-500">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                <p className="text-neutral-600 mb-4">Choose a room type and proceed to booking:</p>
                <div className="space-y-4">
                  {property.roomTypes.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? 'border-booking-blue-light bg-blue-50'
                          : 'border-neutral-200 hover:border-booking-blue-light'
                      }`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-800">{room.name}</h4>
                          <p className="text-sm text-neutral-600 mt-1">{room.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                                <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                              </svg>
                              {room.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                              </svg>
                              {room.bedConfig}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {[...Array(room.maxAdults)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-500">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                              </svg>
                            ))}
                            <span className="text-xs text-neutral-500">Max {room.maxAdults} adults</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-neutral-800">EUR {property.price + room.price}</p>
                          <p className="text-xs text-neutral-500">per night</p>
                        </div>
                      </div>
                      {selectedRoom === room.id && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          <div className="flex items-center gap-2 text-sm text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            {property.freeCancellation && <span>Free cancellation</span>}
                            {property.breakfastIncluded && <span>Breakfast included</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                <button
                  className="w-full py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedRoom}
                  onClick={(event) => void handleContinueToBooking(event)}
                  data-task052-action="open_checkout"
                  data-task052-hotel-id={property.id}
                  data-task052-room={selectedTask052Room}
                >
                  {selectedRoom ? 'Continue to booking' : 'Select a room to continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Reviews Modal */}
        {showReviewsModal && (
          <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-neutral-800 text-lg">Guest reviews</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-booking-blue text-white px-2 py-1 rounded font-bold">{property.reviewScore}</span>
                    <span className="text-neutral-600">{property.reviewLabel} ({property.reviewCount} reviews)</span>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  onClick={() => setShowReviewsModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-500">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Category Ratings */}
              <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                <div className="grid grid-cols-4 gap-4">
                  {property.categoryRatings.map((rating, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">{rating.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-booking-blue rounded-full"
                            style={{ width: `${(rating.score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-neutral-800">{rating.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-220px)]">
                <div className="space-y-4">
                  {property.guestReviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-100 pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-booking-blue text-white flex items-center justify-center font-bold">
                            {review.guestName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800">{review.guestName}</p>
                            <p className="text-sm text-neutral-500">{review.country}</p>
                          </div>
                        </div>
                        <div className="bg-booking-blue text-white px-2 py-1 rounded font-bold text-sm">
                          {review.score}
                        </div>
                      </div>
                      <p className="font-medium text-neutral-800 mb-2">{review.title}</p>
                      {review.positive && (
                        <div className="flex gap-2 mb-2">
                          <span className="text-success font-bold">+</span>
                          <p className="text-neutral-600">{review.positive}</p>
                        </div>
                      )}
                      {review.negative && (
                        <div className="flex gap-2 mb-2">
                          <span className="text-error font-bold">-</span>
                          <p className="text-neutral-600">{review.negative}</p>
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-neutral-500 mt-2">
                        <span>{review.roomType}</span>
                        <span>{review.stayDuration}</span>
                        <span>{new Date(review.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}

                  {/* Additional mock reviews to show "more" */}
                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-booking-blue text-white flex items-center justify-center font-bold">E</div>
                        <div>
                          <p className="font-medium text-neutral-800">Emma</p>
                          <p className="text-sm text-neutral-500">Australia</p>
                        </div>
                      </div>
                      <div className="bg-booking-blue text-white px-2 py-1 rounded font-bold text-sm">10</div>
                    </div>
                    <p className="font-medium text-neutral-800 mb-2">Absolutely stunning!</p>
                    <div className="flex gap-2 mb-2">
                      <span className="text-success font-bold">+</span>
                      <p className="text-neutral-600">The location is unbeatable. Staff were incredibly attentive and the room was spotless. The afternoon tea was a highlight!</p>
                    </div>
                    <div className="flex gap-4 text-xs text-neutral-500 mt-2">
                      <span>Savoy Suite</span>
                      <span>5 nights</span>
                      <span>December 2025</span>
                    </div>
                  </div>

                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-booking-blue text-white flex items-center justify-center font-bold">L</div>
                        <div>
                          <p className="font-medium text-neutral-800">Luca</p>
                          <p className="text-sm text-neutral-500">Italy</p>
                        </div>
                      </div>
                      <div className="bg-booking-blue text-white px-2 py-1 rounded font-bold text-sm">9</div>
                    </div>
                    <p className="font-medium text-neutral-800 mb-2">Classic British elegance</p>
                    <div className="flex gap-2 mb-2">
                      <span className="text-success font-bold">+</span>
                      <p className="text-neutral-600">Perfect blend of history and modern comfort. The riverside view from our room was magical. Highly recommend the spa.</p>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="text-error font-bold">-</span>
                      <p className="text-neutral-600">Parking can be tricky in the area.</p>
                    </div>
                    <div className="flex gap-4 text-xs text-neutral-500 mt-2">
                      <span>Deluxe Room</span>
                      <span>3 nights</span>
                      <span>November 2025</span>
                    </div>
                  </div>

                  <div className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-booking-blue text-white flex items-center justify-center font-bold">K</div>
                        <div>
                          <p className="font-medium text-neutral-800">Kenji</p>
                          <p className="text-sm text-neutral-500">Japan</p>
                        </div>
                      </div>
                      <div className="bg-booking-blue text-white px-2 py-1 rounded font-bold text-sm">9</div>
                    </div>
                    <p className="font-medium text-neutral-800 mb-2">World-class hospitality</p>
                    <div className="flex gap-2 mb-2">
                      <span className="text-success font-bold">+</span>
                      <p className="text-neutral-600">Exceptional service from check-in to check-out. The concierge arranged theatre tickets and restaurant reservations effortlessly. Breakfast buffet was excellent.</p>
                    </div>
                    <div className="flex gap-4 text-xs text-neutral-500 mt-2">
                      <span>Junior Suite</span>
                      <span>4 nights</span>
                      <span>October 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-center">
                <p className="text-sm text-neutral-600">Showing all {property.reviewCount.toLocaleString()} reviews</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
