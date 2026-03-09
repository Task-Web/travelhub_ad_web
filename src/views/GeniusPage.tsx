import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface GeniusTier {
  level: number;
  name: string;
  requiredBookings: number;
  benefits: string[];
  discount: string;
  color: string;
}

const geniusTiers: GeniusTier[] = [
  {
    level: 1,
    name: 'Genius Level 1',
    requiredBookings: 2,
    discount: '10%',
    color: 'from-blue-500 to-blue-600',
    benefits: [
      '10% discounts on select stays',
      'Free breakfast at select properties',
      'Priority customer support'
    ]
  },
  {
    level: 2,
    name: 'Genius Level 2',
    requiredBookings: 5,
    discount: '15%',
    color: 'from-blue-600 to-indigo-600',
    benefits: [
      '10-15% discounts on select stays',
      'Free breakfast at more properties',
      'Free room upgrades when available',
      'Priority customer support',
      'Early check-in when available'
    ]
  },
  {
    level: 3,
    name: 'Genius Level 3',
    requiredBookings: 15,
    discount: '20%',
    color: 'from-indigo-600 to-purple-600',
    benefits: [
      '10-20% discounts on select stays',
      'Free breakfast at participating properties',
      'Free room upgrades when available',
      'Priority 24/7 customer support',
      'Early check-in and late check-out',
      'Exclusive VIP perks at select properties',
      'Complimentary airport transfers at select hotels'
    ]
  }
];

// Use numeric IDs that match PropertyDetailPage mock properties
const participatingProperties = [
  { id: '1', name: 'The Savoy', location: 'Westminster Borough, London', discount: '15%', rating: 9.2, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop' },
  { id: '6', name: 'Shangri-La The Shard', location: 'Southwark, London', discount: '20%', rating: 9.5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop' },
  { id: '4', name: 'Hilton London Tower Bridge', location: 'Southwark, London', discount: '15%', rating: 8.5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop' },
  { id: '2', name: 'Premier Inn London City', location: 'City of London', discount: '10%', rating: 8.1, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop' },
];

export default function GeniusPage() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-booking-blue to-blue-700 text-white py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Genius Loyalty Programme</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold">Genius</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Unlock instant discounts when you travel
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Join Genius for free and enjoy exclusive savings at over 850,000 participating properties worldwide.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/sign-in"
                  className="bg-white text-booking-blue px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors"
                >
                  Sign in to unlock savings
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent text-white px-6 py-3 rounded-md font-bold border-2 border-white hover:bg-white/10 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold">850,000+</div>
                  <div className="text-blue-100">Participating properties</div>
                </div>
                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">Up to 20%</div>
                    <div className="text-blue-100">Discount savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Qualify Section */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to earn Genius status</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-booking-blue text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create a free account</h3>
              <p className="text-gray-600">Sign up for free and you&apos;re automatically a Genius member</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-booking-blue text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Complete 2 stays</h3>
              <p className="text-gray-600">Unlock Level 1 after just 2 stays within 2 years</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-booking-blue text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Keep booking to level up</h3>
              <p className="text-gray-600">The more you book, the higher your level and bigger your benefits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Tiers Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Genius membership tiers</h2>
          <p className="text-gray-600 text-center mb-8">Unlock more benefits as you level up</p>

          {/* Tier selector tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {geniusTiers.map((tier) => (
              <button
                key={tier.level}
                onClick={() => setSelectedTier(tier.level)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedTier === tier.level
                    ? 'bg-booking-blue text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Level {tier.level}
              </button>
            ))}
          </div>

          {/* Selected tier details */}
          {geniusTiers.map((tier) => (
            tier.level === selectedTier && (
              <div key={tier.level} className="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto">
                <div className={`bg-gradient-to-r ${tier.color} text-white p-8`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                      <p className="text-white/80">Complete {tier.requiredBookings} stays to unlock</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-4xl font-bold">{tier.discount}</div>
                      <div className="text-white/80">discount</div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Benefits at this level:</h4>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Participating Properties Section */}
      <div className="py-12 bg-white">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Participating properties</h2>
              <p className="text-gray-600">Over 850,000 properties worldwide offer Genius discounts</p>
            </div>
            <button
              onClick={() => navigate('/search?genius=true')}
              className="bg-booking-blue text-white px-6 py-3 rounded-md font-medium hover:bg-booking-blue-hover transition-colors"
            >
              Search Genius properties
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {participatingProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/hotel/${property.id}`)}>
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-booking-blue text-white px-2 py-1 rounded text-sm font-medium">
                    Genius
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {property.discount} OFF
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{property.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-booking-blue text-white px-2 py-0.5 rounded text-sm font-bold">
                      {property.rating}
                    </span>
                    <span className="text-sm text-gray-600">Excellent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'How do I become a Genius member?',
                answer: 'Simply create a free TravelHub account, and you\'re automatically enrolled in the Genius loyalty programme. After completing 2 stays within 2 years, you\'ll unlock Genius Level 1 and start enjoying discounts.'
              },
              {
                question: 'How do I see my Genius discounts?',
                answer: 'When you\'re signed in, you\'ll see a "Genius" label on participating properties. The discount is automatically applied when you make a booking - there\'s no code needed.'
              },
              {
                question: 'Can I use Genius discounts with other offers?',
                answer: 'Genius discounts can usually be combined with other TravelHub promotions and deals. The best available rate including your Genius discount will always be shown.'
              },
              {
                question: 'How do I level up in the Genius programme?',
                answer: 'Complete more stays to progress through the levels. You need 5 stays within 2 years for Level 2, and 15 stays within 2 years for Level 3. Each level unlocks better benefits.'
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  {faq.question}
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start saving?</h2>
          <p className="text-xl text-blue-100 mb-6">Sign up now and unlock instant discounts on your next booking</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-booking-blue px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors"
            >
              Create an account
            </Link>
            <Link
              to="/sign-in"
              className="bg-transparent text-white px-8 py-3 rounded-md font-bold border-2 border-white hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
