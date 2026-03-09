import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  articles: string[];
}

export default function PartnerHelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Set up your property, complete registration, and get started on TravelHub',
      articles: [
        'How to create your property listing',
        'Completing your property registration',
        'Setting up your rooms and rates',
        'Adding photos to your listing',
        'Verifying your property details',
      ],
    },
    {
      id: 'managing-reservations',
      title: 'Managing Reservations',
      description: 'Handle bookings, cancellations, and guest communications',
      articles: [
        'How to confirm reservations',
        'Processing cancellations and refunds',
        'Handling no-shows',
        'Communicating with guests before arrival',
        'Managing special requests',
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Invoicing',
      description: 'Understand payments, commissions, and invoices',
      articles: [
        'Understanding your commission structure',
        'When and how you get paid',
        'Reading your invoice',
        'Setting up payment preferences',
        'Handling chargebacks and disputes',
      ],
    },
    {
      id: 'extranet',
      title: 'Using the Extranet',
      description: 'Navigate and use the Partner Extranet effectively',
      articles: [
        'Extranet dashboard overview',
        'Updating your availability calendar',
        'Setting up promotions and deals',
        'Using the analytics tools',
        'Managing multiple properties',
      ],
    },
    {
      id: 'policies',
      title: 'Policies & Rates',
      description: 'Set up cancellation policies, house rules, and pricing',
      articles: [
        'Setting your cancellation policy',
        'Creating rate plans',
        'Setting up length of stay restrictions',
        'Managing seasonal pricing',
        'Offering early booking discounts',
      ],
    },
    {
      id: 'reviews',
      title: 'Guest Reviews',
      description: 'Manage and respond to guest reviews',
      articles: [
        'How the review system works',
        'Responding to guest reviews',
        'Improving your review score',
        'Reporting inappropriate reviews',
        'Understanding review scoring',
      ],
    },
    {
      id: 'visibility',
      title: 'Visibility & Performance',
      description: 'Improve your property visibility and booking performance',
      articles: [
        'How search ranking works',
        'Boosting your visibility',
        'Understanding your performance dashboard',
        'Genius programme for partners',
        'Mobile rate optimization',
      ],
    },
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your account, users, and security',
      articles: [
        'Adding and managing users',
        'Updating account information',
        'Setting up two-factor authentication',
        'Managing notification preferences',
        'Closing or suspending your listing',
      ],
    },
  ];

  const frequentlyAskedQuestions = [
    {
      question: 'How do I update my availability?',
      answer: 'Log in to the Extranet, go to "Rates & Availability", select the dates you want to update, and modify the availability for each room type.',
    },
    {
      question: 'When will I receive my payment?',
      answer: 'Payments are processed monthly after guests check out. The exact timing depends on your location and payment preferences, typically within 7-14 days after the end of each month.',
    },
    {
      question: 'How can I change my cancellation policy?',
      answer: 'Go to "Property" in the Extranet, then "Policies". You can modify your cancellation policy for new bookings. Note that existing bookings keep their original policy.',
    },
    {
      question: 'How do I respond to a guest review?',
      answer: 'In the Extranet, go to "Guest Reviews". Find the review you want to respond to and click "Reply". Your response will be visible to all future guests.',
    },
  ];

  const filteredTopics = searchQuery
    ? helpTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.articles.some(article => article.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : helpTopics;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Partner Help</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner Help Centre</h1>
          <p className="text-xl text-blue-100 max-w-2xl mb-8">
            Find answers, resources, and support for managing your property on TravelHub.
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="relative">
              <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-booking-blue-light"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border-b">
        <div className="max-w-container-lg mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4">
            <a
              href="https://admin.booking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Go to Extranet
            </a>
            <Link
              to="/list-property"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List Your Property
            </Link>
            <Link
              to="/extranet"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Partner Resources
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Help Topics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Help Topics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                >
                  <h3 className="font-bold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
                  {expandedTopic === topic.id && (
                    <ul className="space-y-2 border-t pt-4">
                      {topic.articles.map((article, index) => (
                        <li key={index}>
                          <a href="#" className="text-sm text-booking-blue hover:underline">
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button className="text-booking-blue text-sm font-medium mt-2">
                    {expandedTopic === topic.id ? 'Show less' : 'View articles'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {frequentlyAskedQuestions.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-booking-blue/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
            <p className="text-gray-700 mb-6">
              Can&apos;t find what you&apos;re looking for? Our partner support team is here to help you.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Send us a message through the Extranet inbox.</p>
                <a href="#" className="text-booking-blue text-sm font-medium hover:underline">
                  Send a message
                </a>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-4">Call our partner support line (24/7)</p>
                <p className="text-booking-blue font-medium">+44 20 3320 2602</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with other partners and share tips.</p>
                <a href="#" className="text-booking-blue text-sm font-medium hover:underline">
                  Visit forum
                </a>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Partner Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 text-booking-blue hover:underline">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Partner Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-booking-blue hover:underline">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-booking-blue hover:underline">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Photo Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-booking-blue hover:underline">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Market Insights
                  </a>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-4">
                Subscribe to our partner newsletter for the latest updates, tips, and industry insights.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-booking-blue text-white rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
