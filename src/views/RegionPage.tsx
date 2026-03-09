import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Region data structure
interface RegionData {
  slug: string;
  name: string;
  countryCode: string;
  countryName: string;
  totalHotels: number;
  heroImage: string;
  subRegions: Array<{
    name: string;
    slug: string;
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

// Region database keyed by countryCode/regionSlug
const regionDatabase: Record<string, RegionData> = {
  // UK Regions
  'gb/greater-london': {
    slug: 'greater-london',
    name: 'Greater London',
    countryCode: 'gb',
    countryName: 'United Kingdom',
    totalHotels: 16513,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Central London', slug: 'central-london', hotels: 5234 },
      { name: 'Westminster', slug: 'westminster', hotels: 1456 },
      { name: 'Kensington', slug: 'kensington', hotels: 987 },
      { name: 'Camden', slug: 'camden', hotels: 654 },
      { name: 'Greenwich', slug: 'greenwich', hotels: 432 },
      { name: 'Shoreditch', slug: 'shoreditch', hotels: 543 },
      { name: 'Islington', slug: 'islington', hotels: 234 },
      { name: 'Southwark', slug: 'southwark', hotels: 389 },
    ],
    topHotels: [
      { id: '1', name: 'The Savoy', location: 'Strand, London', rating: 10, ratingLabel: 'Exceptional', reviews: 3245, price: 450, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: '2', name: 'The Ritz London', location: 'Piccadilly, London', rating: 9.8, ratingLabel: 'Exceptional', reviews: 2156, price: 520, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: '3', name: 'Claridges', location: 'Mayfair, London', rating: 9.5, ratingLabel: 'Exceptional', reviews: 1876, price: 480, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: '4', name: 'The Langham London', location: 'Marylebone, London', rating: 9.2, ratingLabel: 'Superb', reviews: 1234, price: 320, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  'gb/scotland': {
    slug: 'scotland',
    name: 'Scotland',
    countryCode: 'gb',
    countryName: 'United Kingdom',
    totalHotels: 12456,
    heroImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Edinburgh', slug: 'edinburgh', hotels: 2134 },
      { name: 'Glasgow', slug: 'glasgow', hotels: 1567 },
      { name: 'Highlands', slug: 'highlands', hotels: 1234 },
      { name: 'Loch Lomond', slug: 'loch-lomond', hotels: 456 },
      { name: 'Aberdeen', slug: 'aberdeen', hotels: 543 },
      { name: 'Inverness', slug: 'inverness', hotels: 321 },
      { name: 'Isle of Skye', slug: 'isle-of-skye', hotels: 234 },
      { name: 'St Andrews', slug: 'st-andrews', hotels: 189 },
    ],
    topHotels: [
      { id: 'sc1', name: 'The Balmoral', location: 'Edinburgh', rating: 9.8, ratingLabel: 'Exceptional', reviews: 2156, price: 380, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'sc2', name: 'Gleneagles', location: 'Perthshire', rating: 9.6, ratingLabel: 'Exceptional', reviews: 1876, price: 520, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'sc3', name: 'Cameron House', location: 'Loch Lomond', rating: 9.3, ratingLabel: 'Superb', reviews: 1234, price: 290, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
      { id: 'sc4', name: 'Kimpton Blythswood Square', location: 'Glasgow', rating: 9.1, ratingLabel: 'Superb', reviews: 987, price: 220, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
    ],
  },
  // Spain Regions
  'es/costa-brava': {
    slug: 'costa-brava',
    name: 'Costa Brava',
    countryCode: 'es',
    countryName: 'Spain',
    totalHotels: 7935,
    heroImage: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Lloret de Mar', slug: 'lloret-de-mar', hotels: 1067 },
      { name: 'Platja d\'Aro', slug: 'platja-daro', hotels: 633 },
      { name: 'Roses', slug: 'roses', hotels: 2166 },
      { name: 'Tossa de Mar', slug: 'tossa-de-mar', hotels: 456 },
      { name: 'Cadaqués', slug: 'cadaques', hotels: 234 },
      { name: 'Blanes', slug: 'blanes', hotels: 543 },
      { name: 'L\'Estartit', slug: 'lestartit', hotels: 321 },
      { name: 'Palamós', slug: 'palamos', hotels: 189 },
    ],
    topHotels: [
      { id: 'cb1', name: 'Boutique Hotel Comtal Empuries', location: 'L\'Escala', rating: 9.4, ratingLabel: 'Superb', reviews: 1876, price: 180, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'cb2', name: 'Hotel Vistabella', location: 'Roses', rating: 9.2, ratingLabel: 'Superb', reviews: 1567, price: 220, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'cb3', name: 'Gran Hotel Monterrey', location: 'Lloret de Mar', rating: 8.9, ratingLabel: 'Excellent', reviews: 2345, price: 150, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'cb4', name: 'Hotel Diana', location: 'Tossa de Mar', rating: 8.7, ratingLabel: 'Excellent', reviews: 1234, price: 140, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  'es/andalucia': {
    slug: 'andalucia',
    name: 'Andalucia',
    countryCode: 'es',
    countryName: 'Spain',
    totalHotels: 34567,
    heroImage: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Seville', slug: 'seville', hotels: 5432 },
      { name: 'Granada', slug: 'granada', hotels: 3456 },
      { name: 'Malaga', slug: 'malaga', hotels: 8765 },
      { name: 'Cordoba', slug: 'cordoba', hotels: 1234 },
      { name: 'Cadiz', slug: 'cadiz', hotels: 2345 },
      { name: 'Marbella', slug: 'marbella', hotels: 3456 },
      { name: 'Ronda', slug: 'ronda', hotels: 567 },
      { name: 'Nerja', slug: 'nerja', hotels: 876 },
    ],
    topHotels: [
      { id: 'an1', name: 'Hotel Alfonso XIII', location: 'Seville', rating: 9.5, ratingLabel: 'Exceptional', reviews: 3456, price: 420, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'an2', name: 'Parador de Granada', location: 'Granada', rating: 9.3, ratingLabel: 'Superb', reviews: 2876, price: 350, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'an3', name: 'Marbella Club Hotel', location: 'Marbella', rating: 9.4, ratingLabel: 'Superb', reviews: 2345, price: 550, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'an4', name: 'Hotel Hospes Palacio del Bailio', location: 'Cordoba', rating: 9.1, ratingLabel: 'Superb', reviews: 1567, price: 280, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  // France Regions
  'fr/ile-de-france': {
    slug: 'ile-de-france',
    name: 'Ile de France',
    countryCode: 'fr',
    countryName: 'France',
    totalHotels: 27624,
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Paris', slug: 'paris', hotels: 18765 },
      { name: 'Versailles', slug: 'versailles', hotels: 234 },
      { name: 'Disneyland Paris', slug: 'disneyland-paris', hotels: 456 },
      { name: 'La Défense', slug: 'la-defense', hotels: 543 },
      { name: 'Fontainebleau', slug: 'fontainebleau', hotels: 123 },
      { name: 'Saint-Denis', slug: 'saint-denis', hotels: 234 },
      { name: 'Roissy', slug: 'roissy', hotels: 345 },
      { name: 'Orly', slug: 'orly', hotels: 189 },
    ],
    topHotels: [
      { id: 'idf1', name: 'Le Bristol Paris', location: 'Paris', rating: 9.9, ratingLabel: 'Exceptional', reviews: 5678, price: 850, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'idf2', name: 'Four Seasons Hotel George V', location: 'Paris', rating: 9.7, ratingLabel: 'Exceptional', reviews: 4321, price: 920, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'idf3', name: 'Hotel Le Meurice', location: 'Paris', rating: 9.5, ratingLabel: 'Exceptional', reviews: 3456, price: 780, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'idf4', name: 'Trianon Palace Versailles', location: 'Versailles', rating: 9.2, ratingLabel: 'Superb', reviews: 1234, price: 450, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  'fr/french-riviera': {
    slug: 'french-riviera',
    name: 'French Riviera',
    countryCode: 'fr',
    countryName: 'France',
    totalHotels: 18765,
    heroImage: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Nice', slug: 'nice', hotels: 7654 },
      { name: 'Cannes', slug: 'cannes', hotels: 2345 },
      { name: 'Monaco', slug: 'monaco', hotels: 1234 },
      { name: 'Saint-Tropez', slug: 'saint-tropez', hotels: 567 },
      { name: 'Antibes', slug: 'antibes', hotels: 876 },
      { name: 'Menton', slug: 'menton', hotels: 432 },
      { name: 'Eze', slug: 'eze', hotels: 123 },
      { name: 'Cap Ferrat', slug: 'cap-ferrat', hotels: 89 },
    ],
    topHotels: [
      { id: 'fr1', name: 'Hotel Negresco', location: 'Nice', rating: 9.5, ratingLabel: 'Exceptional', reviews: 3456, price: 450, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'fr2', name: 'Hotel du Cap-Eden-Roc', location: 'Antibes', rating: 9.8, ratingLabel: 'Exceptional', reviews: 2876, price: 1200, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'fr3', name: 'Hotel Martinez', location: 'Cannes', rating: 9.3, ratingLabel: 'Superb', reviews: 2345, price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'fr4', name: 'Hotel de Paris Monte-Carlo', location: 'Monaco', rating: 9.6, ratingLabel: 'Exceptional', reviews: 1987, price: 950, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  // Italy Regions
  'it/tuscany': {
    slug: 'tuscany',
    name: 'Tuscany',
    countryCode: 'it',
    countryName: 'Italy',
    totalHotels: 23456,
    heroImage: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Florence', slug: 'florence', hotels: 8765 },
      { name: 'Siena', slug: 'siena', hotels: 2345 },
      { name: 'Pisa', slug: 'pisa', hotels: 1234 },
      { name: 'Lucca', slug: 'lucca', hotels: 876 },
      { name: 'San Gimignano', slug: 'san-gimignano', hotels: 345 },
      { name: 'Chianti', slug: 'chianti', hotels: 567 },
      { name: 'Cortona', slug: 'cortona', hotels: 234 },
      { name: 'Montepulciano', slug: 'montepulciano', hotels: 189 },
    ],
    topHotels: [
      { id: 'tu1', name: 'Four Seasons Firenze', location: 'Florence', rating: 9.7, ratingLabel: 'Exceptional', reviews: 4321, price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'tu2', name: 'Belmond Villa San Michele', location: 'Fiesole', rating: 9.5, ratingLabel: 'Exceptional', reviews: 2876, price: 850, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'tu3', name: 'Grand Hotel Continental Siena', location: 'Siena', rating: 9.3, ratingLabel: 'Superb', reviews: 1987, price: 420, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'tu4', name: 'Relais La Corte dei Papi', location: 'Cortona', rating: 9.1, ratingLabel: 'Superb', reviews: 1234, price: 280, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  // Japan Regions
  'jp/kansai': {
    slug: 'kansai',
    name: 'Kansai',
    countryCode: 'jp',
    countryName: 'Japan',
    totalHotels: 28765,
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Osaka', slug: 'osaka', hotels: 12345 },
      { name: 'Kyoto', slug: 'kyoto', hotels: 9876 },
      { name: 'Nara', slug: 'nara', hotels: 2345 },
      { name: 'Kobe', slug: 'kobe', hotels: 1567 },
      { name: 'Wakayama', slug: 'wakayama', hotels: 876 },
      { name: 'Himeji', slug: 'himeji', hotels: 543 },
      { name: 'Arashiyama', slug: 'arashiyama', hotels: 432 },
      { name: 'Gion', slug: 'gion', hotels: 321 },
    ],
    topHotels: [
      { id: 'kn1', name: 'The Ritz-Carlton Kyoto', location: 'Kyoto', rating: 9.6, ratingLabel: 'Exceptional', reviews: 4321, price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'kn2', name: 'Conrad Osaka', location: 'Osaka', rating: 9.4, ratingLabel: 'Superb', reviews: 3456, price: 450, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'kn3', name: 'Park Hyatt Kyoto', location: 'Kyoto', rating: 9.5, ratingLabel: 'Exceptional', reviews: 2345, price: 680, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'kn4', name: 'Nara Hotel', location: 'Nara', rating: 9.0, ratingLabel: 'Superb', reviews: 1876, price: 320, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
  // US Regions
  'us/california': {
    slug: 'california',
    name: 'California',
    countryCode: 'us',
    countryName: 'United States',
    totalHotels: 67890,
    heroImage: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1600&h=600&fit=crop',
    subRegions: [
      { name: 'Los Angeles', slug: 'los-angeles', hotels: 23456 },
      { name: 'San Francisco', slug: 'san-francisco', hotels: 9876 },
      { name: 'San Diego', slug: 'san-diego', hotels: 8765 },
      { name: 'Santa Monica', slug: 'santa-monica', hotels: 2345 },
      { name: 'Napa Valley', slug: 'napa-valley', hotels: 1234 },
      { name: 'Palm Springs', slug: 'palm-springs', hotels: 1567 },
      { name: 'Santa Barbara', slug: 'santa-barbara', hotels: 1876 },
      { name: 'Monterey', slug: 'monterey', hotels: 987 },
    ],
    topHotels: [
      { id: 'ca1', name: 'The Beverly Hills Hotel', location: 'Los Angeles', rating: 9.5, ratingLabel: 'Exceptional', reviews: 6543, price: 680, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
      { id: 'ca2', name: 'Fairmont San Francisco', location: 'San Francisco', rating: 9.3, ratingLabel: 'Superb', reviews: 4567, price: 420, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop' },
      { id: 'ca3', name: 'Hotel del Coronado', location: 'San Diego', rating: 9.2, ratingLabel: 'Superb', reviews: 5678, price: 380, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
      { id: 'ca4', name: 'Meadowood Napa Valley', location: 'Napa Valley', rating: 9.6, ratingLabel: 'Exceptional', reviews: 2345, price: 950, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' },
    ],
  },
};

// Default region data when not found
const defaultRegionData: RegionData = {
  slug: 'unknown',
  name: 'Unknown Region',
  countryCode: 'xx',
  countryName: 'Unknown Country',
  totalHotels: 1000,
  heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=600&fit=crop',
  subRegions: [
    { name: 'Area 1', slug: 'area-1', hotels: 500 },
    { name: 'Area 2', slug: 'area-2', hotels: 300 },
  ],
  topHotels: [
    { id: 'def1', name: 'Hotel Example', location: 'Unknown Region', rating: 8.5, ratingLabel: 'Very Good', reviews: 500, price: 150, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  ],
};

// Flexible date options
const flexibleOptions = [
  { label: 'Exact dates', value: 0 },
  { label: '+/- 1 day', value: 1 },
  { label: '+/- 2 days', value: 2 },
  { label: '+/- 3 days', value: 3 },
  { label: '+/- 7 days', value: 7 },
];

export default function RegionPage() {
  const navigate = useNavigate();
  const { countryCode, regionSlug } = useParams<{ countryCode: string; regionSlug: string }>();

  // Get region data based on URL params
  const regionData = useMemo(() => {
    const key = `${countryCode?.toLowerCase()}/${regionSlug?.toLowerCase()}`;
    return regionDatabase[key] || {
      ...defaultRegionData,
      slug: regionSlug || 'unknown',
      name: (regionSlug || 'unknown').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      countryCode: countryCode || 'xx',
      countryName: countryCode?.toUpperCase() || 'Unknown'
    };
  }, [countryCode, regionSlug]);

  // Search form state
  const [destination, setDestination] = useState(regionData.name);
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
  const [flexibleDays, setFlexibleDays] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('destination', destination || regionData.name);
    if (checkInDate) params.set('checkin', checkInDate.toISOString().split('T')[0]);
    if (checkOutDate) params.set('checkout', checkOutDate.toISOString().split('T')[0]);
    params.set('adults', adults.toString());
    params.set('children', children.toString());
    params.set('rooms', rooms.toString());
    if (travellingWithPets) params.set('pets', 'true');
    if (travellingForWork) params.set('work', 'true');
    if (flexibleDays > 0) params.set('flex_days', flexibleDays.toString());
    navigate(`/search?${params.toString()}`);
  };

  const handleSubRegionClick = (subRegionName: string) => {
    navigate(`/search?destination=${encodeURIComponent(subRegionName)}`);
  };

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
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
          backgroundImage: `url(${regionData.heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Search hotels in {regionData.name}, {regionData.countryName}</h1>
          <p className="text-white/90 text-lg mb-8">{regionData.totalHotels.toLocaleString()} hotels available</p>

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
                    {/* Flexible Date Options */}
                    <div className="mb-4 pb-4 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-700 mb-2">Date flexibility</p>
                      <div className="flex gap-2">
                        {flexibleOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFlexibleDays(option.value)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                              flexibleDays === option.value
                                ? 'bg-booking-blue text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
            <Link to={`/country/${regionData.countryCode}`} className="text-booking-blue-light hover:underline">{regionData.countryName}</Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">{regionData.name}</span>
          </nav>
          <Link
            to={`/search?destination=${encodeURIComponent(regionData.name)}&view=map`}
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
        {/* Sub-Regions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Popular destinations in {regionData.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regionData.subRegions.map((subRegion) => (
              <button
                key={subRegion.slug}
                onClick={() => handleSubRegionClick(subRegion.name)}
                className="text-left p-4 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
              >
                <p className="font-medium text-booking-blue-light hover:underline">{subRegion.name}</p>
                <p className="text-sm text-neutral-500">{subRegion.hotels.toLocaleString()} hotels</p>
              </button>
            ))}
          </div>
        </section>

        {/* Top Picks for Hotels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Top picks for hotels in {regionData.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionData.topHotels.map((hotel) => (
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
      </div>
    </div>
  );
}
