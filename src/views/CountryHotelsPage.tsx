import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Country data with destinations, regions, airports, and hotels
interface CountryData {
  code: string;
  name: string;
  totalHotels: number;
  heroImage: string;
  destinations: Array<{
    id: string;
    name: string;
    characteristic: string;
    hotels: number;
    image: string;
  }>;
  regions: Array<{
    name: string;
    slug: string;
    hotels: number;
  }>;
  airports: Array<{
    code: string;
    name: string;
    hotels: number;
  }>;
  topHotels: Array<{
    id: string;
    name: string;
    location: string;
    rating: number;
    ratingLabel: string;
    reviews: number;
    price: number;
    image: string;
  }>;
}

// Country-specific data
const countryDatabase: Record<string, CountryData> = {
  gb: {
    code: 'gb',
    name: 'United Kingdom',
    totalHotels: 172713,
    heroImage: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'london', name: 'London', characteristic: 'Historic landmarks', hotels: 16513, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
      { id: 'manchester', name: 'Manchester', characteristic: 'Sports & nightlife', hotels: 1245, image: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=400&h=300&fit=crop' },
      { id: 'edinburgh', name: 'Edinburgh', characteristic: 'Castle & culture', hotels: 2134, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop' },
      { id: 'liverpool', name: 'Liverpool', characteristic: 'Music & museums', hotels: 876, image: 'https://images.unsplash.com/photo-1558459654-c430be0ae1d9?w=400&h=300&fit=crop' },
      { id: 'birmingham', name: 'Birmingham', characteristic: 'Cultural diversity', hotels: 1456, image: 'https://images.unsplash.com/photo-1567359781514-3b964ea46b79?w=400&h=300&fit=crop' },
      { id: 'bristol', name: 'Bristol', characteristic: 'Street art & harbours', hotels: 654, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'England', slug: 'england', hotels: 125678 },
      { name: 'Greater London', slug: 'greater-london', hotels: 16513 },
      { name: 'Scotland', slug: 'scotland', hotels: 12456 },
      { name: 'Wales', slug: 'wales', hotels: 8765 },
      { name: 'Northern Ireland', slug: 'northern-ireland', hotels: 3456 },
      { name: 'South East England', slug: 'south-east-england', hotels: 18234 },
      { name: 'North West England', slug: 'north-west-england', hotels: 14567 },
      { name: 'Yorkshire', slug: 'yorkshire', hotels: 11234 },
    ],
    airports: [
      { code: 'LHR', name: 'London Heathrow Airport', hotels: 245 },
      { code: 'LGW', name: 'London Gatwick Airport', hotels: 189 },
      { code: 'MAN', name: 'Manchester Airport', hotels: 156 },
      { code: 'STN', name: 'London Stansted Airport', hotels: 98 },
      { code: 'EDI', name: 'Edinburgh Airport', hotels: 87 },
      { code: 'BHX', name: 'Birmingham Airport', hotels: 76 },
      { code: 'GLA', name: 'Glasgow Airport', hotels: 65 },
      { code: 'LTN', name: 'London Luton Airport', hotels: 54 },
      { code: 'BRS', name: 'Bristol Airport', hotels: 43 },
      { code: 'NCL', name: 'Newcastle Airport', hotels: 38 },
      { code: 'LPL', name: 'Liverpool John Lennon Airport', hotels: 32 },
      { code: 'LBA', name: 'Leeds Bradford Airport', hotels: 28 },
    ],
    topHotels: [
      { id: '1', name: 'The Savoy', location: 'London', rating: 10, ratingLabel: 'Exceptional', reviews: 3245, price: 450, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: '2', name: 'The Balmoral', location: 'Edinburgh', rating: 9.8, ratingLabel: 'Exceptional', reviews: 2156, price: 380, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: '3', name: 'The Lowry Hotel', location: 'Manchester', rating: 9.5, ratingLabel: 'Exceptional', reviews: 1876, price: 220, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: '4', name: 'Titanic Hotel Liverpool', location: 'Liverpool', rating: 9.2, ratingLabel: 'Superb', reviews: 1234, price: 175, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  es: {
    code: 'es',
    name: 'Spain',
    totalHotels: 234567,
    heroImage: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'madrid', name: 'Madrid', characteristic: 'Art & culture', hotels: 12456, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop' },
      { id: 'barcelona', name: 'Barcelona', characteristic: 'Beach & architecture', hotels: 15678, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop' },
      { id: 'malaga', name: 'Malaga', characteristic: 'Costa del Sol', hotels: 8765, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
      { id: 'sevilla', name: 'Seville', characteristic: 'Flamenco & history', hotels: 5432, image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop' },
      { id: 'valencia', name: 'Valencia', characteristic: 'Paella & beaches', hotels: 6543, image: 'https://images.unsplash.com/photo-1599491142108-973ee529f5c8?w=400&h=300&fit=crop' },
      { id: 'granada', name: 'Granada', characteristic: 'Alhambra palace', hotels: 3456, image: 'https://images.unsplash.com/photo-1592399796411-41e914095a34?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'Costa Blanca', slug: 'costa-blanca', hotels: 45678 },
      { name: 'Andalucia', slug: 'andalucia', hotels: 34567 },
      { name: 'Catalonia', slug: 'catalonia', hotels: 28765 },
      { name: 'Balearic Islands', slug: 'balearic-islands', hotels: 23456 },
      { name: 'Canary Islands', slug: 'canary-islands', hotels: 19876 },
      { name: 'Costa del Sol', slug: 'costa-del-sol', hotels: 18765 },
      { name: 'Costa Brava', slug: 'costa-brava', hotels: 7935 },
      { name: 'Madrid Region', slug: 'madrid-region', hotels: 15432 },
    ],
    airports: [
      { code: 'MAD', name: 'Madrid Barajas Airport', hotels: 345 },
      { code: 'BCN', name: 'Barcelona El Prat Airport', hotels: 289 },
      { code: 'AGP', name: 'Malaga Costa del Sol Airport', hotels: 198 },
      { code: 'PMI', name: 'Palma de Mallorca Airport', hotels: 176 },
      { code: 'ALC', name: 'Alicante Airport', hotels: 145 },
      { code: 'TFS', name: 'Tenerife South Airport', hotels: 132 },
      { code: 'SVQ', name: 'Seville Airport', hotels: 87 },
      { code: 'VLC', name: 'Valencia Airport', hotels: 76 },
    ],
    topHotels: [
      { id: 'es1', name: 'Hotel Ritz Madrid', location: 'Madrid', rating: 9.8, ratingLabel: 'Exceptional', reviews: 4567, price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'es2', name: 'Hotel Arts Barcelona', location: 'Barcelona', rating: 9.6, ratingLabel: 'Exceptional', reviews: 3987, price: 480, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'es3', name: 'Gran Hotel Miramar', location: 'Malaga', rating: 9.4, ratingLabel: 'Superb', reviews: 2345, price: 350, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'es4', name: 'Hotel Alfonso XIII', location: 'Seville', rating: 9.2, ratingLabel: 'Superb', reviews: 1987, price: 320, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  fr: {
    code: 'fr',
    name: 'France',
    totalHotels: 198765,
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'paris', name: 'Paris', characteristic: 'City of lights', hotels: 18765, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
      { id: 'nice', name: 'Nice', characteristic: 'French Riviera', hotels: 7654, image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&h=300&fit=crop' },
      { id: 'lyon', name: 'Lyon', characteristic: 'Gastronomy capital', hotels: 5432, image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop' },
      { id: 'marseille', name: 'Marseille', characteristic: 'Port city', hotels: 4567, image: 'https://images.unsplash.com/photo-1590501951151-c9b69778da6c?w=400&h=300&fit=crop' },
      { id: 'bordeaux', name: 'Bordeaux', characteristic: 'Wine region', hotels: 3456, image: 'https://images.unsplash.com/photo-1565791380713-e10e9a12cd66?w=400&h=300&fit=crop' },
      { id: 'strasbourg', name: 'Strasbourg', characteristic: 'Alsace charm', hotels: 2345, image: 'https://images.unsplash.com/photo-1608099269227-82de5da1e4a8?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'Ile-de-France', slug: 'ile-de-france', hotels: 27624 },
      { name: 'Provence-Alpes-Cote d\'Azur', slug: 'provence-alpes-cote-azur', hotels: 23456 },
      { name: 'French Riviera', slug: 'french-riviera', hotels: 18765 },
      { name: 'Normandy', slug: 'normandy', hotels: 12345 },
      { name: 'Brittany', slug: 'brittany', hotels: 9876 },
      { name: 'Loire Valley', slug: 'loire-valley', hotels: 8765 },
      { name: 'Alsace', slug: 'alsace', hotels: 6543 },
      { name: 'Burgundy', slug: 'burgundy', hotels: 5432 },
    ],
    airports: [
      { code: 'CDG', name: 'Paris Charles de Gaulle Airport', hotels: 456 },
      { code: 'ORY', name: 'Paris Orly Airport', hotels: 234 },
      { code: 'NCE', name: 'Nice Cote d\'Azur Airport', hotels: 198 },
      { code: 'LYS', name: 'Lyon Saint-Exupery Airport', hotels: 123 },
      { code: 'MRS', name: 'Marseille Provence Airport', hotels: 98 },
      { code: 'BOD', name: 'Bordeaux Merignac Airport', hotels: 87 },
      { code: 'TLS', name: 'Toulouse Blagnac Airport', hotels: 76 },
      { code: 'SXB', name: 'Strasbourg Airport', hotels: 54 },
    ],
    topHotels: [
      { id: 'fr1', name: 'Le Bristol Paris', location: 'Paris', rating: 9.9, ratingLabel: 'Exceptional', reviews: 5678, price: 850, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'fr2', name: 'Hotel Negresco', location: 'Nice', rating: 9.5, ratingLabel: 'Exceptional', reviews: 3456, price: 450, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'fr3', name: 'InterContinental Lyon', location: 'Lyon', rating: 9.3, ratingLabel: 'Superb', reviews: 2345, price: 280, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'fr4', name: 'Grand Hotel Beauvau', location: 'Marseille', rating: 9.1, ratingLabel: 'Superb', reviews: 1876, price: 220, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  jp: {
    code: 'jp',
    name: 'Japan',
    totalHotels: 156789,
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'tokyo', name: 'Tokyo', characteristic: 'Modern metropolis', hotels: 23456, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
      { id: 'osaka', name: 'Osaka', characteristic: 'Food & nightlife', hotels: 12345, image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=300&fit=crop' },
      { id: 'kyoto', name: 'Kyoto', characteristic: 'Temples & gardens', hotels: 9876, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop' },
      { id: 'hiroshima', name: 'Hiroshima', characteristic: 'Peace & history', hotels: 3456, image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=400&h=300&fit=crop' },
      { id: 'fukuoka', name: 'Fukuoka', characteristic: 'Ramen capital', hotels: 4567, image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop' },
      { id: 'nara', name: 'Nara', characteristic: 'Deer & temples', hotels: 2345, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'Kanto', slug: 'kanto', hotels: 34567 },
      { name: 'Kansai', slug: 'kansai', hotels: 28765 },
      { name: 'Hokkaido', slug: 'hokkaido', hotels: 12345 },
      { name: 'Okinawa', slug: 'okinawa', hotels: 8765 },
      { name: 'Chubu', slug: 'chubu', hotels: 9876 },
      { name: 'Kyushu', slug: 'kyushu', hotels: 7654 },
      { name: 'Tohoku', slug: 'tohoku', hotels: 5432 },
      { name: 'Chugoku', slug: 'chugoku', hotels: 4321 },
    ],
    airports: [
      { code: 'NRT', name: 'Tokyo Narita Airport', hotels: 345 },
      { code: 'HND', name: 'Tokyo Haneda Airport', hotels: 289 },
      { code: 'KIX', name: 'Osaka Kansai Airport', hotels: 198 },
      { code: 'ITM', name: 'Osaka Itami Airport', hotels: 145 },
      { code: 'FUK', name: 'Fukuoka Airport', hotels: 123 },
      { code: 'CTS', name: 'New Chitose Airport (Sapporo)', hotels: 98 },
      { code: 'OKA', name: 'Naha Airport (Okinawa)', hotels: 87 },
      { code: 'NGO', name: 'Chubu Centrair Airport', hotels: 76 },
    ],
    topHotels: [
      { id: 'jp1', name: 'Park Hyatt Tokyo', location: 'Tokyo', rating: 9.7, ratingLabel: 'Exceptional', reviews: 5678, price: 680, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'jp2', name: 'The Ritz-Carlton Kyoto', location: 'Kyoto', rating: 9.6, ratingLabel: 'Exceptional', reviews: 4321, price: 720, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'jp3', name: 'Conrad Osaka', location: 'Osaka', rating: 9.4, ratingLabel: 'Superb', reviews: 3456, price: 450, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'jp4', name: 'Sheraton Grand Hiroshima', location: 'Hiroshima', rating: 9.1, ratingLabel: 'Superb', reviews: 2345, price: 280, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  it: {
    code: 'it',
    name: 'Italy',
    totalHotels: 187654,
    heroImage: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'rome', name: 'Rome', characteristic: 'Eternal city', hotels: 15678, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
      { id: 'florence', name: 'Florence', characteristic: 'Renaissance art', hotels: 8765, image: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=400&h=300&fit=crop' },
      { id: 'venice', name: 'Venice', characteristic: 'Canals & romance', hotels: 7654, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop' },
      { id: 'milan', name: 'Milan', characteristic: 'Fashion & design', hotels: 9876, image: 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=400&h=300&fit=crop' },
      { id: 'naples', name: 'Naples', characteristic: 'Pizza & Pompeii', hotels: 5432, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop' },
      { id: 'amalfi', name: 'Amalfi', characteristic: 'Coastal beauty', hotels: 3456, image: 'https://images.unsplash.com/photo-1603399587513-da0b3dc9ddec?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'Tuscany', slug: 'tuscany', hotels: 23456 },
      { name: 'Lazio', slug: 'lazio', hotels: 18765 },
      { name: 'Lombardy', slug: 'lombardy', hotels: 15678 },
      { name: 'Veneto', slug: 'veneto', hotels: 14567 },
      { name: 'Amalfi Coast', slug: 'amalfi-coast', hotels: 8765 },
      { name: 'Sicily', slug: 'sicily', hotels: 12345 },
      { name: 'Sardinia', slug: 'sardinia', hotels: 9876 },
      { name: 'Lake Como', slug: 'lake-como', hotels: 5432 },
    ],
    airports: [
      { code: 'FCO', name: 'Rome Fiumicino Airport', hotels: 345 },
      { code: 'MXP', name: 'Milan Malpensa Airport', hotels: 289 },
      { code: 'VCE', name: 'Venice Marco Polo Airport', hotels: 198 },
      { code: 'FLR', name: 'Florence Peretola Airport', hotels: 145 },
      { code: 'NAP', name: 'Naples Capodichino Airport', hotels: 123 },
      { code: 'BGY', name: 'Milan Bergamo Airport', hotels: 98 },
      { code: 'CIA', name: 'Rome Ciampino Airport', hotels: 87 },
      { code: 'PMO', name: 'Palermo Airport', hotels: 76 },
    ],
    topHotels: [
      { id: 'it1', name: 'Hotel de Russie', location: 'Rome', rating: 9.8, ratingLabel: 'Exceptional', reviews: 5432, price: 650, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'it2', name: 'Four Seasons Firenze', location: 'Florence', rating: 9.7, ratingLabel: 'Exceptional', reviews: 4321, price: 720, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'it3', name: 'The Gritti Palace', location: 'Venice', rating: 9.5, ratingLabel: 'Exceptional', reviews: 3456, price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'it4', name: 'Armani Hotel Milano', location: 'Milan', rating: 9.3, ratingLabel: 'Superb', reviews: 2876, price: 490, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  us: {
    code: 'us',
    name: 'United States',
    totalHotels: 456789,
    heroImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'new-york', name: 'New York', characteristic: 'City that never sleeps', hotels: 45678, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
      { id: 'los-angeles', name: 'Los Angeles', characteristic: 'Hollywood glamour', hotels: 23456, image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=300&fit=crop' },
      { id: 'las-vegas', name: 'Las Vegas', characteristic: 'Entertainment capital', hotels: 18765, image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400&h=300&fit=crop' },
      { id: 'miami', name: 'Miami', characteristic: 'Beach & nightlife', hotels: 12345, image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=300&fit=crop' },
      { id: 'san-francisco', name: 'San Francisco', characteristic: 'Golden Gate', hotels: 9876, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop' },
      { id: 'chicago', name: 'Chicago', characteristic: 'Architecture & food', hotels: 8765, image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'California', slug: 'california', hotels: 67890 },
      { name: 'Florida', slug: 'florida', hotels: 56789 },
      { name: 'New York State', slug: 'new-york-state', hotels: 45678 },
      { name: 'Nevada', slug: 'nevada', hotels: 23456 },
      { name: 'Hawaii', slug: 'hawaii', hotels: 12345 },
      { name: 'Texas', slug: 'texas', hotels: 34567 },
      { name: 'Arizona', slug: 'arizona', hotels: 15678 },
      { name: 'Illinois', slug: 'illinois', hotels: 18765 },
    ],
    airports: [
      { code: 'JFK', name: 'John F. Kennedy International Airport', hotels: 567 },
      { code: 'LAX', name: 'Los Angeles International Airport', hotels: 456 },
      { code: 'LAS', name: 'Harry Reid International Airport (Las Vegas)', hotels: 345 },
      { code: 'MIA', name: 'Miami International Airport', hotels: 289 },
      { code: 'SFO', name: 'San Francisco International Airport', hotels: 234 },
      { code: 'ORD', name: 'Chicago O\'Hare Airport', hotels: 198 },
      { code: 'EWR', name: 'Newark Liberty Airport', hotels: 176 },
      { code: 'DFW', name: 'Dallas/Fort Worth Airport', hotels: 145 },
    ],
    topHotels: [
      { id: 'us1', name: 'The Plaza', location: 'New York', rating: 9.6, ratingLabel: 'Exceptional', reviews: 8765, price: 750, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'us2', name: 'The Beverly Hills Hotel', location: 'Los Angeles', rating: 9.5, ratingLabel: 'Exceptional', reviews: 6543, price: 680, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'us3', name: 'Bellagio', location: 'Las Vegas', rating: 9.4, ratingLabel: 'Superb', reviews: 12345, price: 320, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'us4', name: 'Fontainebleau Miami Beach', location: 'Miami', rating: 9.2, ratingLabel: 'Superb', reviews: 5678, price: 420, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  de: {
    code: 'de',
    name: 'Germany',
    totalHotels: 145678,
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&h=600&fit=crop',
    destinations: [
      { id: 'berlin', name: 'Berlin', characteristic: 'History & nightlife', hotels: 12345, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=300&fit=crop' },
      { id: 'munich', name: 'Munich', characteristic: 'Beer & culture', hotels: 8765, image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400&h=300&fit=crop' },
      { id: 'hamburg', name: 'Hamburg', characteristic: 'Port city', hotels: 5678, image: 'https://images.unsplash.com/photo-1570883794131-e5ea0a68ba24?w=400&h=300&fit=crop' },
      { id: 'frankfurt', name: 'Frankfurt', characteristic: 'Financial hub', hotels: 6543, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop' },
      { id: 'cologne', name: 'Cologne', characteristic: 'Cathedral city', hotels: 4567, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
      { id: 'dusseldorf', name: 'Dusseldorf', characteristic: 'Fashion & art', hotels: 3456, image: 'https://images.unsplash.com/photo-1577416437777-6e8e4e0fae33?w=400&h=300&fit=crop' },
    ],
    regions: [
      { name: 'Bavaria', slug: 'bavaria', hotels: 34567 },
      { name: 'Berlin', slug: 'berlin-region', hotels: 12345 },
      { name: 'North Rhine-Westphalia', slug: 'north-rhine-westphalia', hotels: 23456 },
      { name: 'Baden-Wurttemberg', slug: 'baden-wurttemberg', hotels: 18765 },
      { name: 'Black Forest', slug: 'black-forest', hotels: 8765 },
      { name: 'Saxony', slug: 'saxony', hotels: 7654 },
      { name: 'Rhineland', slug: 'rhineland', hotels: 9876 },
      { name: 'Hamburg Region', slug: 'hamburg-region', hotels: 5678 },
    ],
    airports: [
      { code: 'FRA', name: 'Frankfurt Airport', hotels: 345 },
      { code: 'MUC', name: 'Munich Airport', hotels: 289 },
      { code: 'BER', name: 'Berlin Brandenburg Airport', hotels: 234 },
      { code: 'DUS', name: 'Dusseldorf Airport', hotels: 178 },
      { code: 'HAM', name: 'Hamburg Airport', hotels: 145 },
      { code: 'CGN', name: 'Cologne/Bonn Airport', hotels: 123 },
      { code: 'STR', name: 'Stuttgart Airport', hotels: 98 },
      { code: 'TXL', name: 'Berlin Tegel Airport', hotels: 87 },
    ],
    topHotels: [
      { id: 'de1', name: 'Hotel Adlon Kempinski', location: 'Berlin', rating: 9.7, ratingLabel: 'Exceptional', reviews: 5678, price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'de2', name: 'Bayerischer Hof', location: 'Munich', rating: 9.5, ratingLabel: 'Exceptional', reviews: 4321, price: 480, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'de3', name: 'Fairmont Hotel Vier Jahreszeiten', location: 'Hamburg', rating: 9.4, ratingLabel: 'Superb', reviews: 3456, price: 380, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'de4', name: 'Jumeirah Frankfurt', location: 'Frankfurt', rating: 9.2, ratingLabel: 'Superb', reviews: 2876, price: 320, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
};

// Default/fallback country data
const defaultCountryData: CountryData = {
  code: 'unknown',
  name: 'Unknown Country',
  totalHotels: 10000,
  heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=600&fit=crop',
  destinations: [
    { id: 'city1', name: 'Capital City', characteristic: 'Historic center', hotels: 5000, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop' },
    { id: 'city2', name: 'Second City', characteristic: 'Cultural hub', hotels: 2500, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop' },
  ],
  regions: [
    { name: 'Central Region', slug: 'central', hotels: 5000 },
    { name: 'Northern Region', slug: 'northern', hotels: 2500 },
  ],
  airports: [
    { code: 'INT', name: 'International Airport', hotels: 100 },
  ],
  topHotels: [
    { id: 'h1', name: 'Grand Hotel', location: 'Capital City', rating: 9.0, ratingLabel: 'Superb', reviews: 1000, price: 200, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  ],
};

export default function CountryHotelsPage() {
  const navigate = useNavigate();
  const { countryCode } = useParams<{ countryCode: string }>();

  // Get country data based on URL param
  const countryData = useMemo(() => {
    const code = countryCode?.toLowerCase() || 'gb';
    return countryDatabase[code] || { ...defaultCountryData, code, name: `Country ${code.toUpperCase()}` };
  }, [countryCode]);

  // Search form state
  const [destination, setDestination] = useState(countryData.name);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [travellingWithPets, setTravellingWithPets] = useState(false);
  const [travellingForWork, setTravellingForWork] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('destination', destination || countryData.name);
    if (checkInDate) params.set('checkin', checkInDate.toISOString().split('T')[0]);
    if (checkOutDate) params.set('checkout', checkOutDate.toISOString().split('T')[0]);
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());
    if (travellingWithPets) params.set('pets', 'true');
    if (travellingForWork) params.set('work', 'true');
    navigate(`/search?${params.toString()}`);
  };

  const handleCityClick = (cityId: string) => {
    navigate(`/city/${countryData.code}/${cityId}`);
  };

  const handleRegionClick = (regionSlug: string) => {
    navigate(`/region/${countryData.code}/${regionSlug}`);
  };

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleAirportClick = (airportName: string) => {
    navigate(`/search?destination=${encodeURIComponent(airportName)}&type=airport`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getDateDisplay = () => {
    if (checkInDate && checkOutDate) {
      return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
    }
    return 'Check-in - Check-out';
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const isSelectedDate = (date: Date) => {
    if (checkInDate && date.toDateString() === checkInDate.toDateString()) return true;
    if (checkOutDate && date.toDateString() === checkOutDate.toDateString()) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (date > checkInDate) {
      setCheckOutDate(date);
      setShowCalendar(false);
    } else {
      setCheckInDate(date);
    }
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const renderCalendarMonth = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = getFirstDayOfMonth(monthDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const isPast = isPastDate(date);
      const isSelected = isSelectedDate(date);
      const isRange = isInRange(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={isPast}
          className={`h-10 w-10 rounded-full text-sm transition-colors ${
            isPast
              ? 'text-neutral-300 cursor-not-allowed'
              : isSelected
              ? 'bg-booking-blue text-white'
              : isRange
              ? 'bg-booking-blue/20 text-booking-blue'
              : 'hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[400px]"
        style={{
          backgroundImage: `url(${countryData.heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Hotels in {countryData.name}</h1>
          <p className="text-white/90 text-lg mb-8">{countryData.totalHotels.toLocaleString()} hotels available</p>

          {/* Search Form */}
          <div className="bg-[#ffb700] p-1 rounded-lg">
            <div className="bg-white rounded-md p-3 flex flex-wrap gap-2 items-center">
              {/* Destination */}
              <div className="flex-1 min-w-[200px] relative">
                <div className="flex items-center gap-2 border border-neutral-300 rounded px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm-10 8H5v-2h4v2zm2-8H5V5h6v2z" />
                  </svg>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="flex-1 outline-none text-neutral-800"
                  />
                  {destination && (
                    <button
                      onClick={() => setDestination('')}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Date Picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowCalendar(!showCalendar); setShowGuests(false); }}
                  className="flex items-center gap-2 border border-neutral-300 rounded px-3 py-2 min-w-[250px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                  </svg>
                  <span className="text-neutral-700">{getDateDisplay()}</span>
                </button>

                {/* Calendar Modal */}
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[600px]">
                    {/* Calendar Navigation */}
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="p-2 hover:bg-neutral-100 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                      </button>
                      <span className="font-medium">
                        {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        {' - '}
                        {nextMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="p-2 hover:bg-neutral-100 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </button>
                    </div>

                    {/* Two Month Calendar */}
                    <div className="flex gap-8">
                      {/* Current Month */}
                      <div className="flex-1">
                        <h3 className="text-center font-medium mb-2">
                          {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-neutral-500 mb-2">
                          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {renderCalendarMonth(currentMonth)}
                        </div>
                      </div>

                      {/* Next Month */}
                      <div className="flex-1">
                        <h3 className="text-center font-medium mb-2">
                          {nextMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-neutral-500 mb-2">
                          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {renderCalendarMonth(nextMonth)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowGuests(!showGuests); setShowCalendar(false); }}
                  className="flex items-center gap-2 border border-neutral-300 rounded px-3 py-2 min-w-[200px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span className="text-neutral-700">{adults} adults . {children} children . {rooms} room</span>
                </button>

                {/* Guest Modal */}
                {showGuests && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
                    {/* Adults */}
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-800">Adults</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            adults <= 1 ? 'border-neutral-200 text-neutral-300' : 'border-booking-blue text-booking-blue hover:bg-booking-blue/10'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <button
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full border border-booking-blue text-booking-blue hover:bg-booking-blue/10 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-800">Children</p>
                        <p className="text-sm text-neutral-500">Ages 0-17</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            children <= 0 ? 'border-neutral-200 text-neutral-300' : 'border-booking-blue text-booking-blue hover:bg-booking-blue/10'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <button
                          onClick={() => setChildren(children + 1)}
                          className="w-8 h-8 rounded-full border border-booking-blue text-booking-blue hover:bg-booking-blue/10 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-800">Rooms</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setRooms(Math.max(1, rooms - 1))}
                          disabled={rooms <= 1}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            rooms <= 1 ? 'border-neutral-200 text-neutral-300' : 'border-booking-blue text-booking-blue hover:bg-booking-blue/10'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{rooms}</span>
                        <button
                          onClick={() => setRooms(rooms + 1)}
                          className="w-8 h-8 rounded-full border border-booking-blue text-booking-blue hover:bg-booking-blue/10 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Pets Toggle */}
                    <div className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-800">Travelling with pets?</p>
                          <p className="text-sm text-neutral-500">Assistance animals aren&apos;t considered pets.</p>
                        </div>
                        <button
                          onClick={() => setTravellingWithPets(!travellingWithPets)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            travellingWithPets ? 'bg-booking-blue' : 'bg-neutral-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                              travellingWithPets ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowGuests(false)}
                      className="w-full mt-4 px-4 py-2 bg-booking-blue text-white rounded font-medium hover:bg-booking-blue-hover transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-booking-blue text-white font-medium rounded hover:bg-booking-blue-hover transition-colors"
              >
                Search
              </button>
            </div>

            {/* Travelling for work checkbox */}
            <div className="mt-2 px-3">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-700">
                <input
                  type="checkbox"
                  checked={travellingForWork}
                  onChange={(e) => setTravellingForWork(e.target.checked)}
                  className="w-4 h-4 text-booking-blue rounded"
                />
                <span>I&apos;m travelling for work</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Map View */}
      <div className="bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-2 flex justify-between items-center">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">Home</Link>
            <span className="text-neutral-400">&gt;</span>
            <Link to="/" className="text-booking-blue-light hover:underline">Hotels</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">{countryData.name}</span>
          </nav>
          <Link
            to={`/search?destination=${encodeURIComponent(countryData.name)}&view=map`}
            className="flex items-center gap-1 text-sm text-booking-blue-light hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z" />
            </svg>
            Map view
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-8">
        {/* Top Destinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Top destinations for {countryData.name} city trips</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {countryData.destinations.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCityClick(city.id)}
                className="rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group"
              >
                <div className="relative h-32">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-bold text-neutral-800">{city.name}</h3>
                  <p className="text-sm text-neutral-500">{city.characteristic}</p>
                  <p className="text-sm text-neutral-600 mt-1">{city.hotels.toLocaleString()} hotels</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Regions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Hotels in the most popular regions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countryData.regions.map((region) => (
              <button
                key={region.slug}
                onClick={() => handleRegionClick(region.slug)}
                className="text-left p-4 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
              >
                <p className="font-medium text-booking-blue-light hover:underline">{region.name}</p>
                <p className="text-sm text-neutral-500">{region.hotels.toLocaleString()} hotels</p>
              </button>
            ))}
          </div>
        </section>

        {/* Airport Hotels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Hotels near {countryData.name} airports</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {countryData.airports.map((airport) => (
              <button
                key={airport.code}
                onClick={() => handleAirportClick(airport.name)}
                className="text-left p-4 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                  <span className="font-bold text-neutral-500">{airport.code}</span>
                </div>
                <p className="font-medium text-booking-blue-light hover:underline">{airport.name}</p>
                <p className="text-sm text-neutral-500">{airport.hotels} hotels</p>
              </button>
            ))}
          </div>
        </section>

        {/* Top Picks for Hotels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Top picks for hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {countryData.topHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => handleHotelClick(hotel.id)}
                className="rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#003580] text-white font-bold px-2 py-1 rounded">
                    {hotel.rating}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-neutral-800">{hotel.name}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{hotel.location}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium text-neutral-700">{hotel.ratingLabel}</span>
                    <span className="text-sm text-neutral-500">. {hotel.reviews.toLocaleString()} reviews</span>
                  </div>
                  <p className="text-neutral-800">
                    From <span className="font-bold">EUR {hotel.price}</span> <span className="text-sm text-neutral-500">per night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Most Booked Hotels */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Most booked hotels in {countryData.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {countryData.topHotels.slice().reverse().map((hotel) => (
              <div
                key={`booked-${hotel.id}`}
                onClick={() => handleHotelClick(hotel.id)}
                className="rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#003580] text-white font-bold px-2 py-1 rounded">
                    {hotel.rating}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-neutral-800">{hotel.name}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{hotel.location}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium text-neutral-700">{hotel.ratingLabel}</span>
                    <span className="text-sm text-neutral-500">. {hotel.reviews.toLocaleString()} reviews</span>
                  </div>
                  <p className="text-neutral-800">
                    From <span className="font-bold">EUR {hotel.price}</span> <span className="text-sm text-neutral-500">per night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
