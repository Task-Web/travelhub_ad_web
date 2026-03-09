import { Link } from 'react-router-dom';

export default function TravellerAwardsPage() {
  const awardCategories = [
    {
      id: 'top-rated',
      title: 'Most Loved',
      description: 'Properties with consistently exceptional guest review scores throughout the year.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'best-value',
      title: 'Best Value',
      description: 'Properties offering excellent value for money based on guest feedback.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'best-breakfast',
      title: 'Best Breakfast',
      description: 'Properties recognised for outstanding breakfast offerings.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'best-location',
      title: 'Best Location',
      description: 'Properties praised for their convenient and attractive locations.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'best-service',
      title: 'Best Service',
      description: 'Properties with exceptional staff service ratings from guests.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'sustainable',
      title: 'Sustainability Leader',
      description: 'Properties leading in sustainable and eco-friendly practices.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const awardCriteria = [
    {
      title: 'Guest Review Score',
      description: 'Properties must maintain a high average review score based on verified guest feedback.',
    },
    {
      title: 'Review Volume',
      description: 'A minimum number of reviews is required to ensure statistical significance.',
    },
    {
      title: 'Consistency',
      description: 'Scores must remain consistent throughout the award period.',
    },
    {
      title: 'Recent Performance',
      description: 'Greater weight is given to more recent reviews to reflect current quality.',
    },
  ];

  const pastWinners = [
    {
      year: '2023',
      properties: [
        { name: 'Grand Hotel Amsterdam', location: 'Amsterdam, Netherlands', category: 'Most Loved' },
        { name: 'The Ritz London', location: 'London, United Kingdom', category: 'Best Service' },
        { name: 'Six Senses Fiji', location: 'Malolo Island, Fiji', category: 'Sustainability Leader' },
      ],
    },
    {
      year: '2022',
      properties: [
        { name: 'Aman Tokyo', location: 'Tokyo, Japan', category: 'Most Loved' },
        { name: 'Four Seasons Sydney', location: 'Sydney, Australia', category: 'Best Location' },
        { name: 'The Peninsula Paris', location: 'Paris, France', category: 'Best Breakfast' },
      ],
    },
  ];

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
              <li className="text-white">Traveller Review Awards</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Traveller Review Awards</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Recognising excellence in hospitality based on millions of verified guest reviews.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Awards</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The TravelHub Traveller Review Awards celebrate properties that have delivered exceptional guest experiences throughout the year. Based entirely on verified guest reviews, these awards represent the voice of real travellers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Each year, we analyse millions of reviews to identify properties that consistently exceed guest expectations. Award winners receive recognition across our platform, helping travellers find outstanding places to stay.
            </p>
          </div>

          {/* Award Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Award Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awardCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Award Criteria */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Winners Are Selected</h2>
            <p className="text-gray-700 mb-6">
              Our awards are based on a rigorous, data-driven methodology that ensures only the most deserving properties are recognised.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {awardCriteria.map((criterion, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-booking-blue rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{criterion.title}</h3>
                    <p className="text-gray-600 text-sm">{criterion.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Winners Showcase */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Winners</h2>
            {pastWinners.map((yearData) => (
              <div key={yearData.year} className="mb-8 last:mb-0">
                <h3 className="text-xl font-bold text-booking-blue mb-4">{yearData.year} Winners</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {yearData.properties.map((property, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <span className="inline-block px-2 py-1 bg-booking-blue/10 text-booking-blue text-xs font-medium rounded mb-2">
                        {property.category}
                      </span>
                      <h4 className="font-bold text-gray-900">{property.name}</h4>
                      <p className="text-sm text-gray-600">{property.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-6 pt-6 border-t text-center">
              <button className="px-6 py-2 border border-booking-blue text-booking-blue rounded-lg hover:bg-booking-blue hover:text-white transition-colors font-medium">
                View All Winners
              </button>
            </div>
          </div>

          {/* For Partners Section */}
          <div className="bg-booking-blue/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Property Partners</h2>
            <p className="text-gray-700 mb-6">
              Want to be considered for a Traveller Review Award? Focus on delivering exceptional guest experiences and collecting verified reviews.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">How to Participate</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Be listed on TravelHub</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Maintain a minimum review score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Have a minimum number of verified reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Deliver consistent quality year-round</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Benefits of Winning</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-booking-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Award badge displayed on your listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-booking-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Digital certificate for your property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-booking-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Marketing materials to promote your award</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-booking-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Increased visibility to potential guests</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/list-property"
                className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors font-medium"
              >
                List Your Property
              </Link>
              <Link
                to="/partner-help"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
              >
                Partner Help Centre
              </Link>
            </div>
          </div>

          {/* Guest CTA */}
          <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Award-Winning Properties</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Stay at properties recognised for excellence by millions of travellers. Look for the Traveller Review Award badge when booking.
            </p>
            <Link
              to="/search"
              className="inline-block px-8 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors font-medium"
            >
              Search Award Winners
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
