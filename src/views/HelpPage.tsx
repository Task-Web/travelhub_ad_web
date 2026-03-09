import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
}

const helpArticles: HelpArticle[] = [
  {
    id: 'cancel-booking',
    title: 'How do I cancel my booking?',
    content: 'To cancel your booking, go to "Manage booking" and select your reservation. Click the "Cancel booking" button and follow the prompts. If your booking has free cancellation, you will receive a full refund. If you cancel after the free cancellation deadline, cancellation fees may apply based on the property\'s policy. You will receive a confirmation email once your cancellation is processed.',
    category: 'Manage your booking',
    keywords: ['cancel', 'cancellation', 'refund', 'reservation', 'booking'],
  },
  {
    id: 'refund-timing',
    title: 'When will I receive my refund?',
    content: 'Refunds are typically processed within 7-10 business days, depending on your payment method and bank. Credit card refunds may take an additional 3-5 business days to appear on your statement. If you paid with PayPal, refunds are usually faster (3-5 business days). If you haven\'t received your refund after 14 business days, please contact your bank first, then reach out to our customer service team.',
    category: 'Payment & receipts',
    keywords: ['refund', 'money back', 'payment', 'reimbursement', 'credit'],
  },
  {
    id: 'change-dates',
    title: 'How do I change my booking dates?',
    content: 'To change your booking dates, navigate to "Manage booking" and select your reservation. Click "Change dates" and enter your new check-in and check-out dates. The system will show you the price difference (if any) and whether your request can be accommodated. Note that date changes are subject to availability and the property\'s modification policy.',
    category: 'Manage your booking',
    keywords: ['change', 'modify', 'dates', 'reschedule', 'extend', 'shorten'],
  },
  {
    id: 'free-cancellation',
    title: 'What is free cancellation?',
    content: 'Free cancellation means you can cancel your booking without any penalty before a specified deadline. The deadline varies by property and is clearly shown during booking and in your confirmation email. After the free cancellation deadline, fees may apply. Look for the "Free cancellation" badge when searching for properties to find flexible options.',
    category: 'Manage your booking',
    keywords: ['free', 'cancellation', 'flexible', 'policy', 'deadline', 'penalty'],
  },
  {
    id: 'contact-service',
    title: 'How do I contact customer service?',
    content: 'You can contact our 24/7 customer service through several channels: 1) Use the "Contact Customer Service" button on this page. 2) Call our hotline at +44 20 3320 2609. 3) Use the in-app chat feature. 4) Email us at customer.service@booking.com. For fastest service, have your booking confirmation number ready.',
    category: 'Communication with the property',
    keywords: ['contact', 'customer service', 'support', 'help', 'phone', 'email', 'chat'],
  },
  {
    id: 'payment-methods',
    title: 'What payment methods are accepted?',
    content: 'TravelHub accepts various payment methods including: Visa, Mastercard, American Express, Discover, Diners Club, JCB, Maestro, UnionPay. Some properties also accept PayPal. Payment options may vary by property and country. Payment can be made directly to the property upon arrival or prepaid through our secure payment system.',
    category: 'Payment & receipts',
    keywords: ['payment', 'credit card', 'debit', 'visa', 'mastercard', 'paypal', 'pay'],
  },
  {
    id: 'special-request',
    title: 'How do I add a special request?',
    content: 'You can add special requests during booking in the "Special requests" field, or after booking through "Manage booking". Common requests include: early check-in, late check-out, room preferences (high floor, quiet room), dietary requirements, and accessibility needs. Note that special requests are subject to availability and cannot be guaranteed.',
    category: 'Manage your booking',
    keywords: ['special', 'request', 'preference', 'requirement', 'accessibility', 'early', 'late'],
  },
  {
    id: 'genius-programme',
    title: 'What is the Genius loyalty programme?',
    content: 'Genius is TravelHub\'s free loyalty programme. As a Genius member, you get access to exclusive discounts (10-20% off) at participating properties worldwide. There are three levels: Genius Level 1 (2 completed stays), Level 2 (5 completed stays), and Level 3 (15 completed stays). Higher levels unlock more benefits like free breakfast, room upgrades, and priority support.',
    category: 'Account settings',
    keywords: ['genius', 'loyalty', 'discount', 'programme', 'membership', 'rewards', 'level'],
  },
  {
    id: 'covid-travel',
    title: 'What are the current COVID-19 travel restrictions?',
    content: 'COVID-19 travel restrictions vary by destination and change frequently. Before travelling, check your destination\'s official government website for the latest entry requirements. Some countries may require proof of vaccination, negative tests, or quarantine. Properties may also have their own health and safety protocols. We recommend booking flexible options during this time.',
    category: 'Coronavirus (COVID-19) FAQs',
    keywords: ['covid', 'coronavirus', 'restrictions', 'travel', 'vaccination', 'test', 'quarantine'],
  },
  {
    id: 'covid-cancellation',
    title: 'Can I cancel due to COVID-19?',
    content: 'Many properties offer flexible cancellation policies due to COVID-19. Check your booking confirmation for the specific cancellation policy. If you\'re unable to travel due to government restrictions or illness, contact the property or our customer service to discuss your options. We recommend purchasing travel insurance that covers pandemic-related cancellations.',
    category: 'Coronavirus (COVID-19) FAQs',
    keywords: ['covid', 'coronavirus', 'cancel', 'pandemic', 'illness', 'restrictions'],
  },
  {
    id: 'contact-property',
    title: 'How do I contact my accommodation?',
    content: 'You can contact your accommodation through: 1) The messaging feature in "Manage booking". 2) The property\'s phone number in your confirmation email. 3) Direct email to the property. We recommend using the messaging feature for a record of your communications. The property should respond within 24 hours.',
    category: 'Communication with the property',
    keywords: ['contact', 'property', 'hotel', 'message', 'communicate', 'phone', 'email'],
  },
  {
    id: 'account-password',
    title: 'How do I change my password?',
    content: 'To change your password: 1) Sign in to your account. 2) Go to Account Settings. 3) Click on "Security". 4) Select "Change password". 5) Enter your current password and new password. For security, use a strong password with at least 8 characters, including numbers and special characters. If you\'ve forgotten your password, use the "Forgot password" link on the sign-in page.',
    category: 'Account settings',
    keywords: ['password', 'change', 'reset', 'security', 'account', 'login'],
  },
  {
    id: 'security-scam',
    title: 'How do I spot and report scams?',
    content: 'Be aware of phishing emails, fake websites, and scam calls. TravelHub will never ask for your password via email or phone. Always check that the website URL starts with "booking.com". Report suspicious activity to security@booking.com. Never share your login details or payment information outside of our secure platform.',
    category: 'Security & awareness',
    keywords: ['scam', 'phishing', 'security', 'fraud', 'fake', 'report', 'suspicious'],
  },
  {
    id: 'invoice-receipt',
    title: 'How do I get an invoice or receipt?',
    content: 'For invoices and receipts: 1) Go to "Manage booking". 2) Select your completed reservation. 3) Click "Get invoice" or "Download receipt". Invoices include all charges and VAT information. If you need a detailed invoice for business expenses, request it directly from the property or through our customer service.',
    category: 'Payment & receipts',
    keywords: ['invoice', 'receipt', 'payment', 'vat', 'tax', 'business', 'expenses'],
  },
];

const helpCategories = [
  {
    id: 'covid',
    title: 'Coronavirus (COVID-19) FAQs',
    description: 'Get information about travel restrictions, cancellations, and more',
    icon: '🦠',
  },
  {
    id: 'booking',
    title: 'Manage your booking',
    description: 'View, change, or cancel your reservations',
    icon: '📋',
  },
  {
    id: 'payment',
    title: 'Payment & receipts',
    description: 'Questions about payments, refunds, and invoices',
    icon: '💳',
  },
  {
    id: 'communication',
    title: 'Communication with the property',
    description: 'How to contact your accommodation before or during your stay',
    icon: '💬',
  },
  {
    id: 'account',
    title: 'Account settings',
    description: 'Update your personal details, password, and preferences',
    icon: '⚙️',
  },
  {
    id: 'security',
    title: 'Security & awareness',
    description: 'Learn how to protect your account and spot scams',
    icon: '🔒',
  },
];

const popularArticles = [
  'How do I cancel my booking?',
  'When will I receive my refund?',
  'How do I change my booking dates?',
  'What is free cancellation?',
  'How do I contact customer service?',
  'What payment methods are accepted?',
  'How do I add a special request?',
  'What is the Genius loyalty programme?',
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = helpArticles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(query);
      const contentMatch = article.content.toLowerCase().includes(query);
      const keywordMatch = article.keywords.some(keyword =>
        keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase())
      );
      return titleMatch || contentMatch || keywordMatch;
    });

    setSearchResults(results);
    setShowSearchResults(true);
    setSelectedCategory(null);
    setExpandedArticle(null);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setShowSearchResults(false);
    setExpandedArticle(null);
    setSearchQuery('');
  };

  const handleArticleClick = (articleTitle: string) => {
    const article = helpArticles.find(a => a.title === articleTitle);
    if (article) {
      setExpandedArticle(expandedArticle === article.id ? null : article.id);
      setSelectedCategory(null);
      setShowSearchResults(false);
    }
  };

  const getCategoryArticles = (categoryTitle: string) => {
    return helpArticles.filter(article => article.category === categoryTitle);
  };

  const handleBackToHelp = () => {
    setSelectedCategory(null);
    setExpandedArticle(null);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 pt-4 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-white/80 hover:text-white">Home</Link>
            <span className="text-white/60">&gt;</span>
            <span className="text-white">Help Centre</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Help Centre
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Find answers to your questions and get support
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Search for help (e.g., cancellation, refund, payment)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-booking-blue text-white rounded font-medium hover:bg-booking-blue-hover transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showSearchResults && (
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">
              Search results for &quot;{searchQuery}&quot;
            </h2>
            <button
              onClick={handleBackToHelp}
              className="text-booking-blue-light hover:underline"
            >
              Back to Help Centre
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50"
                  >
                    <div>
                      <h3 className="font-bold text-neutral-800">{article.title}</h3>
                      <p className="text-sm text-neutral-500">{article.category}</p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-5 h-5 text-neutral-400 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`}
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </button>
                  {expandedArticle === article.id && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t pt-4">
                        <p className="text-neutral-700 leading-relaxed">{article.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-card p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-neutral-300 mx-auto mb-4">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">No results found</h3>
              <p className="text-neutral-600">
                We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;. Try a different search term or browse our help topics below.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Category Articles View */}
      {selectedCategory && (
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">{selectedCategory}</h2>
            <button
              onClick={handleBackToHelp}
              className="text-booking-blue-light hover:underline"
            >
              Back to Help Centre
            </button>
          </div>
          <div className="space-y-4">
            {getCategoryArticles(selectedCategory).map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50"
                >
                  <h3 className="font-bold text-neutral-800">{article.title}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 text-neutral-400 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`}
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </button>
                {expandedArticle === article.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t pt-4">
                      <p className="text-neutral-700 leading-relaxed">{article.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {getCategoryArticles(selectedCategory).length === 0 && (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <p className="text-neutral-600">No articles found in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Categories - only show when not viewing search results or category */}
      {!showSearchResults && !selectedCategory && (
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Browse by topic
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.title)}
                className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer text-left"
              >
                <span className="text-3xl mb-4 block">{category.icon}</span>
                <h3 className="font-bold text-neutral-800 mb-2">{category.title}</h3>
                <p className="text-neutral-600 text-sm">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Articles - only show when not viewing search results or category */}
      {!showSearchResults && !selectedCategory && (
        <div className="bg-neutral-100">
          <div className="max-w-container-lg mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Popular articles
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {popularArticles.map((articleTitle) => {
                const article = helpArticles.find(a => a.title === articleTitle);
                return (
                  <div key={articleTitle} className="bg-white rounded-lg shadow-card overflow-hidden">
                    <button
                      onClick={() => handleArticleClick(articleTitle)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50"
                    >
                      <span className="text-neutral-800">{articleTitle}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-5 h-5 text-neutral-400 transition-transform ${article && expandedArticle === article.id ? 'rotate-180' : ''}`}
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                      </svg>
                    </button>
                    {article && expandedArticle === article.id && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t pt-4">
                          <p className="text-neutral-700 leading-relaxed">{article.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 shadow-card text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            Still need help?
          </h2>
          <p className="text-neutral-600 mb-6">
            Our customer service team is available 24/7 to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors"
            >
              Contact Customer Service
            </button>
            <Link
              to="/trips"
              className="px-6 py-3 border border-booking-blue-light text-booking-blue-light font-bold rounded hover:bg-booking-blue-light hover:text-white transition-colors"
            >
              Manage your trips
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Resource Centre */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <Link to="/help/safety" className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 bg-booking-blue rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-neutral-800 mb-1">Safety resource centre</h3>
              <p className="text-neutral-600 text-sm">
                Learn about staying safe while travelling and how to report concerns
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-400">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Contact Customer Service Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-800">Contact Customer Service</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-600">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>

              <p className="text-neutral-600 mb-6">
                Choose how you&apos;d like to contact us. Our customer service team is available 24/7.
              </p>

              <div className="space-y-4">
                {/* Phone Contact */}
                <div className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-booking-blue-light rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800">Call us</h3>
                      <p className="text-sm text-neutral-600">+44 20 3320 2609</p>
                      <p className="text-xs text-neutral-500">Available 24/7</p>
                    </div>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-booking-blue-light rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800">Email us</h3>
                      <p className="text-sm text-neutral-600">customer.service@booking.com</p>
                      <p className="text-xs text-neutral-500">Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Live Chat */}
                <div className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-booking-blue-light rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800">Live chat</h3>
                      <p className="text-sm text-neutral-600">Chat with a support agent</p>
                      <p className="text-xs text-neutral-500">Usually replies within minutes</p>
                    </div>
                  </div>
                </div>

                {/* Submit a request */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-neutral-800 mb-3">Or submit a support request</h4>
                  <form className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Booking confirmation number (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 123456789"
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Your message *
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe your issue..."
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-booking-blue-light focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="w-full py-3 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
                    >
                      Submit request
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
