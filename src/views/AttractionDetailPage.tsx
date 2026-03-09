import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { attractionsApi } from '@/api/client';

interface TicketOption {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  perPerson: boolean;
}

interface AttractionDetail {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  images: string[];
  duration: string;
  freeCancellation: boolean;
  bestSeller: boolean;
  category: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  ticketOptions: TicketOption[];
  openingHours: string;
  languages: string[];
  meetingPoint: string;
}

const buildTicketOptions = (price: number): TicketOption[] => {
  const basePrice = Number.isFinite(price) && price > 0 ? price : 30;
  return [
    {
      id: 'standard',
      name: 'Standard Entry',
      description: 'Standard admission ticket',
      price: basePrice,
      perPerson: true,
    },
    {
      id: 'flex',
      name: 'Flexible Entry',
      description: 'Free cancellation up to 24 hours',
      price: Math.round(basePrice * 1.2),
      originalPrice: Math.round(basePrice * 1.4),
      perPerson: true,
    },
  ];
};

const buildAttractionDetail = (
  attraction: Record<string, unknown>,
  fallback: AttractionDetail
): AttractionDetail => {
  const location = attraction.location as { city?: string; country?: string } | undefined;
  const locationLabel = location
    ? `${location.city || ''}${location.city && location.country ? ', ' : ''}${location.country || ''}`
    : fallback.location;
  const includes = Array.isArray(attraction.includes)
    ? attraction.includes.map(String)
    : fallback.included;
  const images = Array.isArray(attraction.images)
    ? attraction.images.map(String)
    : attraction.image
      ? [String(attraction.image)]
      : fallback.images;
  const price = Number(attraction.price ?? fallback.price);
  const rating = Number(attraction.rating ?? fallback.rating);
  const reviews = Number(attraction.reviewCount ?? fallback.reviews);
  const description = String(attraction.description ?? fallback.description);
  const category = String(attraction.category ?? fallback.category);
  const duration = String(attraction.duration ?? fallback.duration);
  const freeCancellation = Boolean(attraction.freeCancellation ?? fallback.freeCancellation);

  return {
    id: String(attraction.id ?? fallback.id),
    name: String(attraction.name ?? fallback.name),
    description,
    fullDescription: String(attraction.fullDescription ?? description ?? fallback.fullDescription),
    location: locationLabel || fallback.location,
    address: String(attraction.address ?? fallback.address),
    rating: Number.isFinite(rating) ? rating : fallback.rating,
    reviews: Number.isFinite(reviews) ? reviews : fallback.reviews,
    price: Number.isFinite(price) ? price : fallback.price,
    currency: String(attraction.currency ?? fallback.currency),
    images: images.length > 0 ? images : fallback.images,
    duration,
    freeCancellation,
    bestSeller: Boolean(attraction.bestSeller ?? (rating >= 4.6 || reviews > 1000)),
    category,
    highlights: includes.length > 0 ? includes.slice(0, 4) : fallback.highlights,
    included: includes.length > 0 ? includes : fallback.included,
    notIncluded: Array.isArray(attraction.notIncluded)
      ? attraction.notIncluded.map(String)
      : fallback.notIncluded,
    ticketOptions: Array.isArray(attraction.ticketOptions)
      ? (attraction.ticketOptions as TicketOption[])
      : buildTicketOptions(price),
    openingHours: String(attraction.openingHours ?? fallback.openingHours),
    languages: Array.isArray(attraction.languages)
      ? attraction.languages.map(String)
      : fallback.languages,
    meetingPoint: String(attraction.meetingPoint ?? fallback.meetingPoint),
  };
};

const mockAttractionDetails: Record<string, AttractionDetail> = {
  '1': {
    id: '1',
    name: 'The London Eye',
    description: 'Experience breathtaking 360-degree views of London from the iconic London Eye.',
    fullDescription: `The London Eye is a giant Ferris wheel on the South Bank of the River Thames in London. The structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft). When it opened to the public in 2000 it was the world's tallest Ferris wheel.

Its official name was originally the British Airways London Eye, then the Merlin Entertainments London Eye, then the EDF Energy London Eye and then, starting in January 2015, the Coca-Cola London Eye; since January 2020, the wheel has had no title sponsor and is known simply as the London Eye.

The London Eye can carry 800 passengers each rotation, which lasts about 30 minutes. The wheel rotates at 26 cm (10 in) per second (about 0.9 km/h or 0.6 mph) so that one revolution takes about 30 minutes.`,
    location: 'South Bank, London',
    address: 'Riverside Building, County Hall, Westminster Bridge Rd, London SE1 7PB',
    rating: 4.5,
    reviews: 12543,
    price: 32.00,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
    ],
    duration: '30 minutes',
    freeCancellation: true,
    bestSeller: true,
    category: 'Tours',
    highlights: [
      '360-degree panoramic views of London',
      'See Big Ben, Westminster Abbey, and Buckingham Palace',
      'Climate-controlled capsules',
      'Audio guide available in 12 languages',
    ],
    included: [
      'Standard London Eye ticket',
      'Access to the 4D Experience',
      'Free WiFi in the capsule',
    ],
    notIncluded: [
      'Fast Track entry',
      'Champagne Experience',
      'Hotel pick-up and drop-off',
    ],
    ticketOptions: [
      { id: 'standard', name: 'Standard Entry', description: 'Skip the ticket queue with pre-booked entry', price: 32.00, perPerson: true },
      { id: 'fast-track', name: 'Fast Track Entry', description: 'Skip all queues and board immediately', price: 47.00, originalPrice: 55.00, perPerson: true },
      { id: 'champagne', name: 'Champagne Experience', description: 'Includes a glass of Pommery Brut Royal champagne', price: 52.00, perPerson: true },
    ],
    openingHours: '10:00 - 20:30 (last admission 20:00)',
    languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese'],
    meetingPoint: 'London Eye, South Bank, next to County Hall',
  },
  '2': {
    id: '2',
    name: 'Tower of London',
    description: 'Explore over 1000 years of history at the Tower of London.',
    fullDescription: `The Tower of London, officially Her Majesty's Royal Palace and Fortress of the Tower of London, is a historic castle located on the north bank of the River Thames in central London. It lies within the London Borough of Tower Hamlets, which is separated from the eastern edge of the square mile of the City of London by the open space known as Tower Hill.

The Tower of London has served variously as an armoury, a treasury, a menagerie, the home of the Royal Mint, a public record office, and the home of the Crown Jewels of England.`,
    location: 'Tower Hill, London',
    address: 'St Katharine\'s & Wapping, London EC3N 4AB',
    rating: 4.7,
    reviews: 8932,
    price: 29.90,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    ],
    duration: '2-3 hours',
    freeCancellation: true,
    bestSeller: false,
    category: 'Museums',
    highlights: [
      'See the Crown Jewels',
      'Meet the Yeoman Warders (Beefeaters)',
      'Explore the White Tower',
      'Learn about prisoners and executions',
    ],
    included: [
      'Entry to the Tower of London',
      'Access to all public areas',
      'Yeoman Warder guided tour',
    ],
    notIncluded: [
      'Audio guide (available for additional fee)',
      'Food and drinks',
    ],
    ticketOptions: [
      { id: 'standard', name: 'Standard Entry', description: 'Full access to the Tower of London', price: 29.90, perPerson: true },
      { id: 'family', name: 'Family Ticket', description: '2 adults + 3 children (5-15 years)', price: 89.00, perPerson: false },
    ],
    openingHours: '09:00 - 17:30 (Tue-Sat), 10:00 - 17:30 (Sun-Mon)',
    languages: ['English'],
    meetingPoint: 'Tower of London entrance, Tower Hill',
  },
  '3': {
    id: '3',
    name: 'Westminster Abbey',
    description: 'Visit one of the most famous churches in the world.',
    fullDescription: `Westminster Abbey, formally titled the Collegiate Church of Saint Peter at Westminster, is a large, mainly Gothic abbey church in the City of Westminster, London, England. It is the traditional place of coronation and burial site for English and, later, British monarchs.

The building itself is the third church that has stood on this site in the precincts of the medieval Palace of Westminster. The present church was begun in 1245 by Henry III.`,
    location: 'Westminster, London',
    address: '20 Deans Yd, Westminster, London SW1P 3PA',
    rating: 4.6,
    reviews: 5421,
    price: 24.00,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&h=600&fit=crop',
    ],
    duration: '1-2 hours',
    freeCancellation: true,
    bestSeller: false,
    category: 'Tours',
    highlights: [
      'See the Coronation Chair',
      'Visit Poets\' Corner',
      'Explore the Royal tombs',
      'View stunning Gothic architecture',
    ],
    included: [
      'Entry to Westminster Abbey',
      'Multimedia guide',
    ],
    notIncluded: [
      'Photography inside the Abbey',
    ],
    ticketOptions: [
      { id: 'standard', name: 'Standard Entry', description: 'Full access with multimedia guide', price: 24.00, perPerson: true },
    ],
    openingHours: '09:30 - 15:30 (Mon-Sat)',
    languages: ['English', 'Spanish', 'French', 'German', 'Italian'],
    meetingPoint: 'Westminster Abbey North Door entrance',
  },
  '4': {
    id: '4',
    name: 'Harry Potter Studio Tour',
    description: 'Go behind the scenes of the Harry Potter films.',
    fullDescription: `Warner Bros. Studio Tour London - The Making of Harry Potter is a public attraction in Leavesden, England, which showcases authentic sets, costumes and props used in the Harry Potter films.

The tour is housed in the studios where all eight Harry Potter films were shot, and provides an opportunity to explore sets from the films, including the Great Hall and Diagon Alley.`,
    location: 'Watford',
    address: 'Studio Tour Drive, Leavesden WD25 7LR',
    rating: 4.9,
    reviews: 23456,
    price: 51.50,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop',
    ],
    duration: '4-5 hours',
    freeCancellation: false,
    bestSeller: true,
    category: 'Entertainment',
    highlights: [
      'Walk through the Great Hall',
      'See original costumes and props',
      'Try Butterbeer',
      'Walk down Diagon Alley',
      'Platform 9 3/4 photo opportunity',
    ],
    included: [
      'Entry to the Studio Tour',
      'Access to all exhibits',
      'Digital guide app',
    ],
    notIncluded: [
      'Transportation from London',
      'Food and drinks',
      'Souvenir photos',
    ],
    ticketOptions: [
      { id: 'standard', name: 'Studio Tour Ticket', description: 'Timed entry to the studio tour', price: 51.50, perPerson: true },
      { id: 'transport', name: 'Tour + Transport', description: 'Includes return coach from London Victoria', price: 99.00, perPerson: true },
    ],
    openingHours: '08:30 - 22:00 (varies by date)',
    languages: ['English'],
    meetingPoint: 'Warner Bros. Studio Tour London entrance',
  },
  '5': {
    id: '5',
    name: 'Thames River Cruise',
    description: 'Enjoy a relaxing cruise along the River Thames.',
    fullDescription: `Experience London from a unique perspective with a Thames River Cruise. Glide past iconic landmarks including the Houses of Parliament, Tower Bridge, and the London Eye while enjoying informative commentary about the city's rich history.`,
    location: 'Westminster Pier, London',
    address: 'Westminster Pier, Victoria Embankment, London SW1A 2JH',
    rating: 4.4,
    reviews: 6789,
    price: 18.00,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    ],
    duration: '1 hour',
    freeCancellation: true,
    bestSeller: false,
    category: 'Tours',
    highlights: [
      'Pass by Big Ben and the Houses of Parliament',
      'See Tower Bridge and the Tower of London',
      'Live commentary on board',
      'Indoor and outdoor seating',
    ],
    included: [
      'One-way or round-trip boat ticket',
      'Live commentary',
    ],
    notIncluded: [
      'Food and drinks (available for purchase)',
    ],
    ticketOptions: [
      { id: 'single', name: 'Single Journey', description: 'One-way cruise', price: 12.00, perPerson: true },
      { id: 'return', name: 'Return Journey', description: 'Round-trip cruise', price: 18.00, perPerson: true },
    ],
    openingHours: '10:00 - 18:00 (departures every 30 minutes)',
    languages: ['English'],
    meetingPoint: 'Westminster Pier',
  },
  '6': {
    id: '6',
    name: 'British Museum Tour',
    description: 'Discover world-famous collections including the Rosetta Stone.',
    fullDescription: `The British Museum is a public museum dedicated to human history, art and culture located in the Bloomsbury area of London. Its permanent collection of some eight million works is among the largest and most comprehensive in existence.`,
    location: 'Bloomsbury, London',
    address: 'Great Russell St, London WC1B 3DG',
    rating: 4.8,
    reviews: 4532,
    price: 35.00,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1574366631929-c9bcf93f0829?w=800&h=600&fit=crop',
    ],
    duration: '2 hours',
    freeCancellation: true,
    bestSeller: true,
    category: 'Museums',
    highlights: [
      'See the Rosetta Stone',
      'Explore Egyptian mummies',
      'View the Parthenon sculptures',
      'Expert guide included',
    ],
    included: [
      'Guided tour',
      'Skip-the-line entry',
      'Expert guide',
    ],
    notIncluded: [
      'Museum general admission (free)',
    ],
    ticketOptions: [
      { id: 'guided', name: 'Guided Tour', description: '2-hour expert-led tour', price: 35.00, perPerson: true },
      { id: 'private', name: 'Private Tour', description: 'Private guide for your group', price: 150.00, perPerson: false },
    ],
    openingHours: '10:00 - 17:00 (Sat-Thu), 10:00 - 20:30 (Fri)',
    languages: ['English', 'Spanish', 'French'],
    meetingPoint: 'British Museum main entrance, Great Court',
  },
  '7': {
    id: '7',
    name: 'London Ghost Walk',
    description: 'Experience the darker side of London on this spine-chilling walking tour.',
    fullDescription: `Discover London's haunted history on this evening ghost walk through the city's most haunted streets and alleyways. Your expert guide will share tales of murder, mystery, and the supernatural as you explore locations associated with ghosts and ghouls.`,
    location: 'City of London',
    address: 'Monument Station, London EC3R 8AH',
    rating: 4.3,
    reviews: 2156,
    price: 15.00,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=600&fit=crop',
    ],
    duration: '2 hours',
    freeCancellation: true,
    bestSeller: false,
    category: 'Tours',
    highlights: [
      'Visit haunted locations',
      'Hear spine-chilling stories',
      'Expert ghost tour guide',
      'Small group experience',
    ],
    included: [
      'Guided walking tour',
      'Stories and legends',
    ],
    notIncluded: [
      'Food and drinks',
      'Gratuities',
    ],
    ticketOptions: [
      { id: 'standard', name: 'Ghost Walk', description: '2-hour evening walking tour', price: 15.00, perPerson: true },
    ],
    openingHours: 'Tours at 19:30 daily',
    languages: ['English'],
    meetingPoint: 'Monument Station, Fish Street Hill exit',
  },
  '8': {
    id: '8',
    name: 'London Food Tour',
    description: 'Sample the best of British cuisine on this guided food tour.',
    fullDescription: `Discover the flavours of London on this culinary adventure through Borough Market and the surrounding food district. Sample artisan cheeses, fresh baked goods, traditional British pies, and much more while learning about the history of London's oldest food market.`,
    location: 'Borough Market, London',
    address: '8 Southwark St, London SE1 1TL',
    rating: 4.7,
    reviews: 1834,
    price: 65.00,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    ],
    duration: '3 hours',
    freeCancellation: true,
    bestSeller: false,
    category: 'Food & drinks',
    highlights: [
      'Visit Borough Market',
      'Sample 8+ food tastings',
      'Learn about British cuisine',
      'Small group size (max 12)',
    ],
    included: [
      'Guided food tour',
      '8+ food tastings',
      'Local drinks',
    ],
    notIncluded: [
      'Additional food purchases',
      'Gratuities',
    ],
    ticketOptions: [
      { id: 'standard', name: 'Food Tour', description: '3-hour guided food tour', price: 65.00, perPerson: true },
      { id: 'private', name: 'Private Food Tour', description: 'Exclusive tour for your group', price: 350.00, perPerson: false },
    ],
    openingHours: 'Tours at 10:00 and 14:00 (Wed-Sat)',
    languages: ['English'],
    meetingPoint: 'Borough Market, Stoney Street entrance',
  },
};

export default function AttractionDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fallbackAttraction = useMemo<AttractionDetail>(() => {
    if (id && mockAttractionDetails[id]) {
      return mockAttractionDetails[id];
    }
    return {
      id: id || 'attr-001',
      name: 'Attraction',
      description: 'Attraction details are loading.',
      fullDescription: 'Attraction details are loading.',
      location: 'City center',
      address: 'Address available on voucher',
      rating: 4.5,
      reviews: 0,
      price: 0,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop'],
      duration: '2 hours',
      freeCancellation: true,
      bestSeller: false,
      category: 'Attraction',
      highlights: [],
      included: [],
      notIncluded: [],
      ticketOptions: buildTicketOptions(0),
      openingHours: 'Varies by date',
      languages: ['English'],
      meetingPoint: 'Check voucher',
    };
  }, [id]);

  const [attractionDetails, setAttractionDetails] = useState<AttractionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const attraction = attractionDetails ?? fallbackAttraction;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    attractionsApi
      .getById(id)
      .then((response) => {
        if (cancelled) return;
        setAttractionDetails(buildAttractionDetail(response.attraction as unknown as Record<string, unknown>, fallbackAttraction));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load attraction:', error);
        setLoadError('Unable to load attraction details from state.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, fallbackAttraction]);

  // Show booking modal if coming from "See availability" button
  useEffect(() => {
    const showAvailability = searchParams.get('show_availability');
    if (showAvailability === 'true') {
      setShowBookingModal(true);
    }
  }, [searchParams]);

  if (!attraction) {
    return (
      <div className="max-w-container-lg mx-auto px-4 py-8">
        <p className="text-neutral-600">Attraction not found.</p>
        <button
          onClick={() => navigate('/attractions')}
          className="text-booking-blue hover:underline mt-4"
        >
          Back to attractions
        </button>
      </div>
    );
  }

  const today = new Date();
  const nextMonth = addMonths(currentMonth, 1);

  const getDaysInMonth = (monthDate: Date) => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const isDateDisabled = (dateToCheck: Date) => {
    return isBefore(dateToCheck, today) && !isSameDay(dateToCheck, today);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleBookNow = () => {
    if (!selectedDate || !selectedTicket) {
      setShowBookingModal(true);
      return;
    }

    const ticketOption = attraction.ticketOptions.find(t => t.id === selectedTicket);

    // Navigate to checkout
    const params = new URLSearchParams();
    params.set('attraction_id', attraction.id);
    params.set('attraction_name', attraction.name);
    params.set('date', format(selectedDate, 'yyyy-MM-dd'));
    params.set('ticket_type', selectedTicket);
    params.set('quantity', quantity.toString());
    params.set('price', String(ticketOption?.price ?? attraction.price));
    params.set('category', attraction.category);
    params.set('duration', attraction.duration);
    params.set('location', attraction.location);
    params.set('currency', attraction.currency);

    navigate(`/attractions/checkout?${params.toString()}`);
  };

  const selectedTicketOption = selectedTicket ? attraction.ticketOptions.find(t => t.id === selectedTicket) : null;
  const totalPrice = selectedTicketOption
    ? (selectedTicketOption.perPerson ? selectedTicketOption.price * quantity : selectedTicketOption.price)
    : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-neutral-100 border-b">
        <div className="max-w-container-lg mx-auto px-4 py-3">
          <nav className="text-sm">
            <span className="text-booking-blue hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2 text-neutral-400">&gt;</span>
            <span className="text-booking-blue hover:underline cursor-pointer" onClick={() => navigate('/attractions')}>Attractions</span>
            <span className="mx-2 text-neutral-400">&gt;</span>
            <span className="text-booking-blue hover:underline cursor-pointer" onClick={() => navigate('/attractions/searchresults.en-gb.html?dest_name=London')}>{attraction.location}</span>
            <span className="mx-2 text-neutral-400">&gt;</span>
            <span className="text-neutral-600">{attraction.name}</span>
          </nav>
        </div>
      </div>

      {(isLoading || loadError) && (
        <div className="max-w-container-lg mx-auto px-4 py-4">
          {isLoading && !attractionDetails && (
            <div className="bg-neutral-100 text-neutral-700 rounded-lg px-4 py-3 text-sm">
              Loading attraction details...
            </div>
          )}
          {loadError && (
            <div className="bg-amber-50 text-amber-800 rounded-lg px-4 py-3 text-sm mt-3">
              {loadError}
            </div>
          )}
        </div>
      )}

      <div className="max-w-container-lg mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <img
                src={attraction.images[currentImageIndex]}
                alt={attraction.name}
                className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                onClick={() => setShowGallery(true)}
              />
              {attraction.bestSeller && (
                <span className="absolute top-4 left-4 bg-booking-blue text-white text-sm font-bold px-3 py-1 rounded">
                  Best seller
                </span>
              )}
              {attraction.images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {attraction.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                  <button
                    onClick={() => setShowGallery(true)}
                    className="bg-white/90 text-neutral-800 text-sm px-3 py-1 rounded ml-2"
                  >
                    +{attraction.images.length} photos
                  </button>
                </div>
              )}
            </div>

            {/* Title and Rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">{attraction.name}</h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="font-bold text-lg">{attraction.rating}</span>
                  <span className="text-neutral-500">({attraction.reviews.toLocaleString()} reviews)</span>
                </div>
                <span className="text-neutral-400">|</span>
                <span className="text-neutral-600">{attraction.category}</span>
              </div>
              <p className="text-neutral-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {attraction.address}
              </p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-500">Duration</div>
                <div className="font-medium">{attraction.duration}</div>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-500">Languages</div>
                <div className="font-medium">{attraction.languages[0]}</div>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-500">Meeting point</div>
                <div className="font-medium text-sm">{attraction.meetingPoint.substring(0, 20)}...</div>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-500">Hours</div>
                <div className="font-medium text-sm">{attraction.openingHours.substring(0, 15)}...</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">About this activity</h2>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-600 whitespace-pre-line">{attraction.fullDescription}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Highlights</h2>
              <ul className="space-y-2">
                {attraction.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Included / Not Included */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-4">What&apos;s included</h2>
                <ul className="space-y-2">
                  {attraction.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-4">What&apos;s not included</h2>
                <ul className="space-y-2">
                  {attraction.notIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-error flex-shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Meeting Point */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Meeting point</h2>
              <p className="text-neutral-600 mb-2">{attraction.meetingPoint}</p>
              <p className="text-neutral-600">{attraction.address}</p>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Cancellation policy</h2>
              {attraction.freeCancellation ? (
                <div className="flex items-start gap-2 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium">Free cancellation</p>
                    <p className="text-sm text-neutral-600">Cancel up to 24 hours before your activity starts for a full refund.</p>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-600">This activity is non-refundable. Please check the cancellation policy before booking.</p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-neutral-200 p-6 sticky top-4">
              <div className="text-sm text-neutral-500 mb-1">From</div>
              <div className="text-3xl font-bold text-neutral-800 mb-4">
                {attraction.currency} {attraction.price.toFixed(2)}
                <span className="text-sm font-normal text-neutral-500"> per person</span>
              </div>

              {attraction.freeCancellation && (
                <div className="flex items-center gap-1 text-success text-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Free cancellation available
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Select date</label>
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-left flex items-center gap-2 hover:border-booking-blue"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  <span className={selectedDate ? 'text-neutral-800' : 'text-neutral-400'}>
                    {selectedDate ? format(selectedDate, 'EEE, d MMM yyyy') : 'Choose a date'}
                  </span>
                </button>
              </div>

              {/* Ticket Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Select ticket</label>
                <div className="space-y-2">
                  {attraction.ticketOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTicket(option.id)}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        selectedTicket === option.id
                          ? 'border-booking-blue bg-booking-blue/5'
                          : 'border-neutral-300 hover:border-booking-blue'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-neutral-800">{option.name}</div>
                          <div className="text-sm text-neutral-500">{option.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-neutral-800">
                            {attraction.currency} {option.price.toFixed(2)}
                          </div>
                          {option.originalPrice && (
                            <div className="text-sm text-neutral-400 line-through">
                              {attraction.currency} {option.originalPrice.toFixed(2)}
                            </div>
                          )}
                          {option.perPerson && (
                            <div className="text-xs text-neutral-500">per person</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              {selectedTicketOption?.perPerson && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Number of tickets</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:border-booking-blue"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:border-booking-blue"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {selectedTicket && (
                <div className="border-t border-neutral-200 pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total</span>
                    <span className="text-2xl font-bold text-neutral-800">
                      {attraction.currency} {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full bg-booking-blue text-white font-bold py-3 rounded-lg hover:bg-booking-blue-hover transition-colors"
              >
                {selectedDate && selectedTicket ? 'Next' : 'Check availability'}
              </button>

              <p className="text-xs text-neutral-500 text-center mt-4">
                Reserve now, pay later - secure your spot
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowDatePicker(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-[700px] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-800">Select a date</h3>
              <button onClick={() => setShowDatePicker(false)} className="text-neutral-400 hover:text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Current Month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                    className="p-1 hover:bg-neutral-100 rounded"
                    disabled={isSameMonth(currentMonth, today)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isSameMonth(currentMonth, today) ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <h4 className="font-bold text-neutral-800">{format(currentMonth, 'MMMM yyyy')}</h4>
                  <div className="w-5"></div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-xs text-neutral-500 font-medium py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((day, idx) => {
                    const disabled = isDateDisabled(day) || !isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, today);

                    return (
                      <button
                        key={idx}
                        onClick={() => !disabled && handleDateSelect(day)}
                        disabled={disabled}
                        className={`py-2 text-sm rounded transition-colors ${
                          !isSameMonth(day, currentMonth)
                            ? 'text-transparent cursor-default'
                            : disabled
                            ? 'text-neutral-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-booking-blue text-white'
                            : isToday
                            ? 'bg-booking-blue-light text-white'
                            : 'text-neutral-800 hover:bg-booking-blue/10'
                        }`}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-5"></div>
                  <h4 className="font-bold text-neutral-800">{format(nextMonth, 'MMMM yyyy')}</h4>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1 hover:bg-neutral-100 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-600">
                      <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-xs text-neutral-500 font-medium py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(nextMonth).map((day, idx) => {
                    const disabled = isDateDisabled(day) || !isSameMonth(day, nextMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, today);

                    return (
                      <button
                        key={idx}
                        onClick={() => !disabled && handleDateSelect(day)}
                        disabled={disabled}
                        className={`py-2 text-sm rounded transition-colors ${
                          !isSameMonth(day, nextMonth)
                            ? 'text-transparent cursor-default'
                            : disabled
                            ? 'text-neutral-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-booking-blue text-white'
                            : isToday
                            ? 'bg-booking-blue-light text-white'
                            : 'text-neutral-800 hover:bg-booking-blue/10'
                        }`}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-[500px] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-800">Select your options</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <img src={attraction.images[0]} alt={attraction.name} className="w-full h-32 object-cover rounded-lg mb-4" />
              <h4 className="font-bold text-neutral-800 mb-1">{attraction.name}</h4>
              <p className="text-sm text-neutral-500">{attraction.location}</p>
            </div>

            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Select date</label>
              <button
                onClick={() => { setShowBookingModal(false); setShowDatePicker(true); }}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-left flex items-center gap-2 hover:border-booking-blue"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                </svg>
                <span className={selectedDate ? 'text-neutral-800' : 'text-neutral-400'}>
                  {selectedDate ? format(selectedDate, 'EEE, d MMM yyyy') : 'Choose a date'}
                </span>
              </button>
            </div>

            {/* Ticket Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Select ticket type</label>
              <div className="space-y-2">
                {attraction.ticketOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedTicket(option.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      selectedTicket === option.id
                        ? 'border-booking-blue bg-booking-blue/5'
                        : 'border-neutral-300 hover:border-booking-blue'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-neutral-800">{option.name}</span>
                      <span className="font-bold">{attraction.currency} {option.price.toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {selectedTicketOption?.perPerson && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Number of tickets</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:border-booking-blue"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:border-booking-blue"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Total and Book */}
            {selectedTicket && (
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-600">Total</span>
                  <span className="text-xl font-bold">{attraction.currency} {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleBookNow}
                  disabled={!selectedDate || !selectedTicket}
                  className={`w-full font-bold py-3 rounded-lg transition-colors ${
                    selectedDate && selectedTicket
                      ? 'bg-booking-blue text-white hover:bg-booking-blue-hover'
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {selectedDate && selectedTicket ? 'Book now' : 'Select date to continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-neutral-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + attraction.images.length) % attraction.images.length)}
            className="absolute left-4 text-white hover:text-neutral-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
          </button>

          <img
            src={attraction.images[currentImageIndex]}
            alt={attraction.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          <button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % attraction.images.length)}
            className="absolute right-4 text-white hover:text-neutral-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {attraction.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
