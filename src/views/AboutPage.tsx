import { Link } from 'react-router-dom';

export default function AboutPage() {
  const companyStats = [
    { label: 'Founded', value: '1996 in Amsterdam' },
    { label: 'Offices worldwide', value: '198 offices in 70+ countries' },
    { label: 'Employees', value: '17,000+ employees' },
    { label: 'Listings', value: '28+ million listings worldwide' },
    { label: 'Guests hosted', value: '500M+ guests hosted annually' },
  ];

  const valuePropositions = [
    {
      id: 'best-price',
      title: 'Best Price Guarantee',
      description: 'We guarantee the best available rates. If you find a lower price elsewhere, we\'ll match it.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      id: 'no-fees',
      title: 'No Booking Fees',
      description: 'We don\'t charge you any booking fees. The price you see is the price you pay.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
    },
    {
      id: 'secure',
      title: 'Secure Booking',
      description: 'Your personal information is protected with industry-standard encryption and security protocols.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      id: 'support',
      title: '24/7 Customer Support',
      description: 'Our dedicated team is available around the clock to help you with any questions or issues.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
    },
    {
      id: 'reviews',
      title: 'Verified Reviews',
      description: 'Read genuine reviews from verified guests who have actually stayed at the properties.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      id: 'cancellation',
      title: 'Free Cancellation',
      description: 'Many properties offer free cancellation, so you can book with confidence and flexibility.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      ),
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
              <li className="text-white">About TravelHub</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About TravelHub</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Connecting travellers with the world&apos;s largest selection of incredible places to stay since 1996.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Sidebar with Company Stats */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Company Stats</h2>
                <div className="space-y-4">
                  {companyStats.map((stat, index) => (
                    <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <p className="font-bold text-booking-blue">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  TravelHub&apos;s mission is to make it easier for everyone to experience the world.
                  By investing in the technology that helps take the friction out of travel,
                  TravelHub seamlessly connects millions of travellers with memorable experiences,
                  a range of transport options, and incredible places to stay - from homes to hotels and much more.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  As one of the world&apos;s largest travel marketplaces for both established brands and
                  entrepreneurs of all sizes, TravelHub enables properties around the world to reach
                  a global audience and grow their businesses.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  TravelHub is available in 43 languages and offers more than 28 million total
                  reported accommodation listings, including over 6.6 million homes, apartments,
                  and other unique places to stay. No matter where you want to go or what you want
                  to do, TravelHub makes it easy and backs it all up with 24/7 customer support.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-booking-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Think Customer First</h4>
                      <p className="text-sm text-gray-600">Everything we do starts with understanding what our customers need.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-booking-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Innovate Relentlessly</h4>
                      <p className="text-sm text-gray-600">We continuously improve our platform to provide better experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-booking-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Empower People</h4>
                      <p className="text-sm text-gray-600">We believe in empowering our partners and customers alike.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-booking-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Own the Outcome</h4>
                      <p className="text-sm text-gray-600">We take responsibility for delivering results that matter.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Propositions Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Book With Us</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {valuePropositions.map((prop) => (
                <div key={prop.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                    {prop.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{prop.title}</h3>
                  <p className="text-gray-600 text-sm">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Information Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Partner With Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Property Owners</h3>
                <p className="text-gray-600 mb-4">
                  Join over 28 million accommodation providers who trust TravelHub to connect them
                  with travellers from around the world. Whether you own a hotel, apartment, holiday
                  home, or unique property, we can help you reach guests and grow your business.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Global exposure to millions of travellers</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Easy-to-use extranet for managing listings</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>24/7 partner support</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Secure and reliable payment processing</span>
                  </li>
                </ul>
                <Link
                  to="/list-property"
                  className="inline-block px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors font-medium"
                >
                  List Your Property
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Travel Partners</h3>
                <p className="text-gray-600 mb-4">
                  We work with travel agencies, tour operators, and businesses worldwide to help
                  their customers find and book the perfect accommodation. Our affiliate and partner
                  programmes offer competitive commissions and comprehensive support.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Competitive affiliate commissions</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>API access for seamless integration</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Dedicated account management</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Marketing resources and support</span>
                  </li>
                </ul>
                <Link
                  to="/affiliate"
                  className="inline-block px-6 py-3 border border-booking-blue text-booking-blue rounded-lg hover:bg-booking-blue hover:text-white transition-colors font-medium"
                >
                  Become an Affiliate
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-booking-blue/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions about TravelHub? We&apos;re here to help. Explore our resources or contact our team directly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/help"
                className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                Help Centre
              </Link>
              <Link
                to="/careers"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                Careers
              </Link>
              <Link
                to="/how-we-work"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                How We Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
