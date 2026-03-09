import { useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';

interface ArticleContent {
  heading: string;
  text: string;
  image?: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  subcategory?: string;
  readTime: number;
  date: string;
  featured: boolean;
  content: ArticleContent[];
  tags: string[];
}

const articles: Article[] = [
  {
    id: 'top-10-european-cities',
    title: 'Top 10 European Cities for a City Break in 2026',
    excerpt: 'From the romantic streets of Paris to the vibrant nightlife of Berlin, discover the best European cities for your next urban adventure.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    category: 'Trip experience',
    subcategory: 'City breaks',
    readTime: 8,
    date: '15 January 2026',
    featured: true,
    tags: ['Europe', 'Cities', 'Weekend breaks'],
    content: [
      { heading: 'Paris, France', text: 'The City of Light needs no introduction. From the Eiffel Tower to the Louvre, Paris offers an unparalleled blend of culture, history, and gastronomy. Wander through Montmartre, enjoy a croissant at a sidewalk café, or take a romantic cruise along the Seine.', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800' },
      { heading: 'Barcelona, Spain', text: 'Gaudí\'s architectural masterpieces, golden beaches, and vibrant nightlife make Barcelona a must-visit. Don\'t miss La Sagrada Família, stroll down Las Ramblas, and sample tapas in the Gothic Quarter.' },
      { heading: 'Amsterdam, Netherlands', text: 'Canals, bicycles, and tulips define this charming city. Visit world-class museums like the Rijksmuseum and Anne Frank House, then explore the cozy brown cafés.', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800' },
      { heading: 'Rome, Italy', text: 'The Eternal City is a living museum. From the Colosseum to the Vatican, ancient wonders await around every corner. Throw a coin in the Trevi Fountain and indulge in authentic Italian cuisine.' },
      { heading: 'Prague, Czech Republic', text: 'One of Europe\'s most affordable capitals, Prague enchants with its medieval Old Town, Charles Bridge, and castle complex. The beer is exceptional and incredibly cheap!' },
    ]
  },
  {
    id: 'budget-travel-tips',
    title: 'Budget Travel: 15 Tips to Save Money on Your Next Trip',
    excerpt: 'Learn how to stretch your travel budget further with these expert money-saving tips, from booking hacks to local dining secrets.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    category: 'Trip experience',
    subcategory: 'Travel tips',
    readTime: 6,
    date: '12 January 2026',
    featured: true,
    tags: ['Budget', 'Tips', 'Money saving'],
    content: [
      { heading: 'Book flights on Tuesdays', text: 'Airlines often release discounts on Monday nights, making Tuesday the best day to book. Use price comparison tools and set up alerts for your desired routes.' },
      { heading: 'Travel during shoulder season', text: 'Avoid peak summer and holiday periods. Spring and autumn often offer better weather, fewer crowds, and significantly lower prices for accommodation and flights.' },
      { heading: 'Use local transportation', text: 'Skip expensive taxis and use public transport like locals do. Many cities offer tourist passes that include unlimited travel and attraction discounts.' },
      { heading: 'Eat where locals eat', text: 'Avoid tourist traps near major attractions. Walk a few streets away to find authentic restaurants with better food at fraction of the price.' },
      { heading: 'Stay in apartments', text: 'Booking an apartment instead of a hotel gives you access to a kitchen, saving money on meals. It\'s also great for experiencing local neighborhoods.' },
    ]
  },
  {
    id: 'best-beach-destinations',
    title: 'The 20 Best Beach Destinations for 2026',
    excerpt: 'Whether you\'re seeking tropical paradise or Mediterranean charm, these stunning beaches should be on your bucket list.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    category: 'Destinations',
    subcategory: 'Beaches',
    readTime: 10,
    date: '10 January 2026',
    featured: true,
    tags: ['Beach', 'Summer', 'Tropical'],
    content: [
      { heading: 'Maldives', text: 'Crystal-clear waters, overwater bungalows, and world-class diving make the Maldives the ultimate tropical paradise. Each resort occupies its own private island.', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800' },
      { heading: 'Bali, Indonesia', text: 'From the surf breaks of Kuta to the serene shores of Nusa Dua, Bali offers something for every beach lover. Combine your beach time with temple visits and rice terrace hikes.' },
      { heading: 'Amalfi Coast, Italy', text: 'Dramatic cliffs, colorful villages, and pebble beaches make this Italian coastline unforgettable. Stay in Positano and take boat trips to hidden coves.' },
      { heading: 'Phuket, Thailand', text: 'Thailand\'s largest island boasts beautiful beaches, excellent food, and vibrant nightlife. Patong is lively, while Kata and Kamala are more relaxed.' },
    ]
  },
  {
    id: 'solo-travel-guide',
    title: 'The Ultimate Guide to Solo Travel',
    excerpt: 'Embarking on your first solo trip? Here\'s everything you need to know about traveling alone, from safety tips to making friends on the road.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
    category: 'Who\'s going',
    subcategory: 'Solo travel',
    readTime: 12,
    date: '8 January 2026',
    featured: false,
    tags: ['Solo', 'Safety', 'Adventure'],
    content: [
      { heading: 'Why travel solo?', text: 'Solo travel offers complete freedom to explore at your own pace. You\'ll discover more about yourself, meet interesting people, and create unforgettable memories.' },
      { heading: 'Staying safe', text: 'Share your itinerary with family, keep digital copies of documents, and trust your instincts. Choose well-reviewed accommodations and stay aware of your surroundings.' },
      { heading: 'Meeting people', text: 'Stay in hostels, join walking tours, or use apps like Meetup to connect with travelers and locals. Solo travel doesn\'t mean being alone!' },
    ]
  },
  {
    id: 'sustainable-travel',
    title: 'How to Travel More Sustainably',
    excerpt: 'Reduce your environmental impact while exploring the world with these eco-friendly travel practices and destinations.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    category: 'Trip experience',
    subcategory: 'Eco travel',
    readTime: 7,
    date: '5 January 2026',
    featured: false,
    tags: ['Sustainable', 'Eco', 'Environment'],
    content: [
      { heading: 'Choose eco-friendly accommodations', text: 'Look for hotels with sustainability certifications. Many properties now use renewable energy, minimize plastic, and support local communities.' },
      { heading: 'Reduce flight emissions', text: 'Take direct flights when possible, as takeoff and landing produce the most emissions. Consider train travel for shorter distances.' },
      { heading: 'Support local businesses', text: 'Eat at local restaurants, buy from local artisans, and book local guides. Your tourism dollars will directly benefit the community.' },
    ]
  },
  {
    id: 'family-travel-destinations',
    title: '10 Best Family-Friendly Destinations in Europe',
    excerpt: 'Planning a family holiday? These destinations offer the perfect mix of adventure, culture, and kid-friendly activities.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    category: 'Who\'s going',
    subcategory: 'Family travel',
    readTime: 9,
    date: '3 January 2026',
    featured: false,
    tags: ['Family', 'Kids', 'Europe'],
    content: [
      { heading: 'London, UK', text: 'Free museums, royal palaces, and Harry Potter experiences make London magical for kids. Don\'t miss the Natural History Museum and the changing of the guard.' },
      { heading: 'Copenhagen, Denmark', text: 'Home to the original Legoland and Tivoli Gardens, Copenhagen is designed for families. The city is bike-friendly and full of playgrounds.' },
      { heading: 'Costa Brava, Spain', text: 'Beautiful beaches, water parks, and medieval villages keep the whole family entertained. The region is known for its family-friendly resorts.' },
    ]
  },
  {
    id: 'winter-getaways',
    title: 'Best Winter Getaways: From Ski Slopes to Tropical Escapes',
    excerpt: 'Whether you prefer snow sports or escaping the cold, we\'ve got the perfect winter destinations for every type of traveler.',
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=600',
    category: 'Trip experience',
    subcategory: 'Active trips',
    readTime: 8,
    date: '1 January 2026',
    featured: false,
    tags: ['Winter', 'Ski', 'Tropical'],
    content: [
      { heading: 'The Alps', text: 'From Chamonix to Zermatt, the Alps offer world-class skiing and charming mountain villages. après-ski scene is legendary.' },
      { heading: 'Canary Islands', text: 'Just a few hours from Europe, enjoy year-round sunshine and beach weather while your friends freeze at home.' },
    ]
  },
  {
    id: 'food-tourism',
    title: 'Culinary Adventures: Top Destinations for Food Lovers',
    excerpt: 'From Italian trattorias to Japanese ramen bars, explore the world through its flavors with our guide to food tourism.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    category: 'Trip experience',
    subcategory: 'Food & drink',
    readTime: 7,
    date: '28 December 2025',
    featured: false,
    tags: ['Food', 'Culinary', 'Gastronomy'],
    content: [
      { heading: 'Tokyo, Japan', text: 'From Michelin-starred sushi to humble ramen shops, Tokyo is a food lover\'s paradise. Don\'t miss Tsukiji Outer Market for the freshest seafood.' },
      { heading: 'Bologna, Italy', text: 'The gastronomic capital of Italy is home to tagliatelle al ragù, mortadella, and Parmigiano-Reggiano. Take a cooking class to learn the secrets.' },
      { heading: 'Lyon, France', text: 'Traditional bouchons serve hearty Lyonnaise cuisine. The city has more restaurants per capita than any other in France.' },
    ]
  },
  {
    id: 'hidden-gems-europe',
    title: 'Hidden Gems: 15 Underrated European Destinations',
    excerpt: 'Skip the crowds and discover these lesser-known but equally stunning European destinations that deserve a spot on your itinerary.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600',
    category: 'Destinations',
    subcategory: 'Hidden gems',
    readTime: 11,
    date: '25 December 2025',
    featured: false,
    tags: ['Europe', 'Hidden gems', 'Off the beaten path'],
    content: [
      { heading: 'Ghent, Belgium', text: 'Often overshadowed by Bruges, Ghent is a lively university city with stunning medieval architecture, excellent food, and a vibrant cultural scene.' },
      { heading: 'Kotor, Montenegro', text: 'A dramatic bay surrounded by mountains, Kotor feels like discovering Croatia 20 years ago—before the cruise ships arrived.' },
      { heading: 'Matera, Italy', text: 'The city of caves, once Italy\'s shame, is now a UNESCO World Heritage Site with boutique cave hotels and ancient churches.' },
    ]
  },
  {
    id: 'packing-guide',
    title: 'The Perfect Packing Guide: Travel Light, Travel Right',
    excerpt: 'Master the art of packing with our comprehensive guide to traveling with just carry-on luggage, no matter the destination.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    category: 'Trip experience',
    subcategory: 'Travel tips',
    readTime: 6,
    date: '22 December 2025',
    featured: false,
    tags: ['Packing', 'Tips', 'Luggage'],
    content: [
      { heading: 'Choose versatile clothing', text: 'Pack items that can be mixed and matched. Stick to a neutral color palette and bring layers for temperature changes.' },
      { heading: 'Roll, don\'t fold', text: 'Rolling clothes saves space and reduces wrinkles. Use packing cubes to stay organized.' },
      { heading: 'Limit shoes', text: 'Shoes take up the most space. Bring one pair of comfortable walking shoes, one pair for evenings, and wear your bulkiest pair on the plane.' },
    ]
  },
];

// Categories matching TravelHub structure
const mainCategories = [
  { id: 'destinations', name: 'Destinations', icon: '🗺️' },
  { id: 'trip-experience', name: 'Trip experience', icon: '✨' },
  { id: 'whos-going', name: 'Who\'s going', icon: '👥' },
];

const subCategories: Record<string, string[]> = {
  'destinations': ['All', 'Beaches', 'Cities', 'Hidden gems', 'Mountains'],
  'trip-experience': ['All', 'Active trips', 'City breaks', 'Eco travel', 'Food & drink', 'Travel tips'],
  'whos-going': ['All', 'Couples', 'Family travel', 'Groups', 'Solo travel'],
};

export default function TravelArticlesPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategoryParam);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  // Find article if viewing detail
  const article = articleId ? articles.find(a => a.id === articleId) : null;

  // Filter articles based on selected category/subcategory
  const filteredArticles = articles.filter(a => {
    if (!selectedCategory) return true;

    const categoryMatch = a.category.toLowerCase().replace(/['\s]/g, '-') === selectedCategory.toLowerCase() ||
                          a.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!categoryMatch) return false;
    if (!selectedSubcategory || selectedSubcategory === 'all') return true;

    return a.subcategory?.toLowerCase().replace(/['\s&]/g, '-') === selectedSubcategory.toLowerCase() ||
           a.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
  });

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      navigate('/articles');
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
      navigate(`/articles?category=${categoryId}`);
    }
  };

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategoryId: string) => {
    if (subcategoryId === 'all') {
      setSelectedSubcategory(null);
      navigate(`/articles?category=${selectedCategory}`);
    } else {
      setSelectedSubcategory(subcategoryId);
      navigate(`/articles?category=${selectedCategory}&subcategory=${subcategoryId}`);
    }

    // Scroll to section if it exists
    const sectionId = subcategoryId.toLowerCase().replace(/['\s&]/g, '-');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!newsletterEmail.trim()) {
      setNewsletterError('Please enter your email address');
      setNewsletterStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address');
      setNewsletterStatus('error');
      return;
    }

    // Simulate submission
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setNewsletterError('');
  };

  // If viewing individual article
  if (article) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-booking-blue text-white py-6">
          <div className="max-w-container-lg mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-blue-100">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>&gt;</span>
              <Link to="/articles" className="hover:text-white">Travel Articles</Link>
              <span>&gt;</span>
              <span className="text-white">{article.category}</span>
            </nav>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-4 py-8">
          {/* Category and reading info */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm bg-booking-blue text-white px-3 py-1 rounded-full">
              {article.category}
            </span>
            {article.subcategory && (
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {article.subcategory}
              </span>
            )}
            <span className="text-sm text-gray-500">{article.readTime} min read</span>
            <span className="text-sm text-gray-500">{article.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>

          {/* Hero image */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-80 object-cover rounded-lg mb-8"
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map(tag => (
              <span key={tag} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Excerpt as intro */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.excerpt}</p>

          {/* Article sections */}
          <div className="space-y-8">
            {article.content.map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.heading}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-700 leading-relaxed">{section.text}</p>
              </section>
            ))}
          </div>

          {/* Back to articles */}
          <div className="mt-12 pt-8 border-t">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-booking-blue hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Travel Articles
            </Link>
          </div>
        </article>
      </div>
    );
  }

  // Articles list view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Travel Articles</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold mb-2">Travel Articles</h1>
          <p className="text-xl text-blue-100">
            Inspiration, tips, and guides for your next adventure
          </p>
        </div>
      </div>

      {/* Main Categories */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex items-center gap-1 py-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                navigate('/articles');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-booking-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Articles
            </button>
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-booking-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subcategories (shown when category is selected) */}
      {selectedCategory && subCategories[selectedCategory] && (
        <div className="bg-gray-100 border-b">
          <div className="max-w-container-lg mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {subCategories[selectedCategory].map((subcat) => {
                const subcatId = subcat.toLowerCase().replace(/['\s&]/g, '-');
                return (
                  <button
                    key={subcat}
                    onClick={() => handleSubcategoryClick(subcatId)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedSubcategory === subcatId || (!selectedSubcategory && subcat === 'All')
                        ? 'bg-booking-blue text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subcat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Articles */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {featuredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.id}`}
                    className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-booking-blue text-white px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.readTime} min read</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-booking-blue transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                      <p className="text-xs text-gray-400 mt-3">{article.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* All/Regular Articles */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')} Articles` : 'All Articles'}
          </h2>

          {regularArticles.length > 0 ? (
            <div className="space-y-4">
              {regularArticles.map((article) => (
                <div key={article.id} id={article.subcategory?.toLowerCase().replace(/['\s&]/g, '-')}>
                  <Link
                    to={`/articles/${article.id}`}
                    className="group flex bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="w-48 flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        {article.subcategory && (
                          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                            {article.subcategory}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{article.readTime} min read</span>
                        <span className="text-xs text-gray-400">{article.date}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-booking-blue transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No articles found in this category.</p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  navigate('/articles');
                }}
                className="mt-4 text-booking-blue hover:underline"
              >
                View all articles
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-booking-blue py-12">
        <div className="max-w-container-lg mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay inspired</h2>
          <p className="text-blue-100 mb-6">Get the latest travel tips and destination guides delivered to your inbox.</p>

          {newsletterStatus === 'success' ? (
            <div className="max-w-md mx-auto">
              <div className="bg-green-500 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Thank you for subscribing!</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterError('');
                      setNewsletterStatus('idle');
                    }}
                    placeholder="Your email address"
                    className={`w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      newsletterStatus === 'error' ? 'ring-2 ring-red-400' : ''
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {newsletterError && (
                <p className="text-red-300 text-sm mt-2 text-left">{newsletterError}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Popular Topics */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular topics</h2>
          <div className="flex flex-wrap gap-2">
            {['City Breaks', 'Beach Holidays', 'Solo Travel', 'Family Travel', 'Budget Travel', 'Luxury Travel', 'Adventure', 'Food & Wine', 'Culture', 'Road Trips', 'Weekend Getaways', 'Honeymoon', 'Backpacking', 'Eco Travel'].map((topic) => (
              <Link
                key={topic}
                to={`/search?interest=${encodeURIComponent(topic.toLowerCase())}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-gray-200 transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
