import { Link } from 'react-router-dom';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
}

export default function PressPage() {
  const pressReleases: PressRelease[] = [
    {
      id: 'pr-1',
      title: 'TravelHub Reports Record Q4 2023 Results',
      date: 'February 22, 2024',
      category: 'Financial',
      summary: 'TravelHub announces record fourth quarter results with gross bookings up 15% year-over-year.',
    },
    {
      id: 'pr-2',
      title: 'TravelHub Launches New Sustainable Travel Initiative',
      date: 'January 15, 2024',
      category: 'Sustainability',
      summary: 'New programme to help 100,000 properties reduce their environmental impact by 2025.',
    },
    {
      id: 'pr-3',
      title: 'TravelHub Expands AI-Powered Trip Planning Features',
      date: 'December 5, 2023',
      category: 'Product',
      summary: 'New AI assistant helps travellers plan and book their perfect trip with personalised recommendations.',
    },
    {
      id: 'pr-4',
      title: 'TravelHub Named Top Travel App of 2023',
      date: 'November 20, 2023',
      category: 'Awards',
      summary: 'Industry recognition for user experience and innovation in mobile travel booking.',
    },
    {
      id: 'pr-5',
      title: 'TravelHub Partners with World Tourism Organisation',
      date: 'October 10, 2023',
      category: 'Partnership',
      summary: 'Strategic partnership to promote responsible tourism and support destination sustainability.',
    },
  ];

  const companyFacts = [
    { label: 'Founded', value: '1996' },
    { label: 'Headquarters', value: 'Amsterdam, Netherlands' },
    { label: 'Employees', value: '17,000+' },
    { label: 'Offices', value: '198 in 70+ countries' },
    { label: 'Listings', value: '28+ million' },
    { label: 'Languages', value: '43' },
    { label: 'Countries/Territories', value: '227' },
    { label: 'Annual Guest Arrivals', value: '500+ million' },
  ];

  const mediaResources = [
    {
      id: 'logo-pack',
      title: 'Logo Package',
      description: 'Official TravelHub logos in various formats (PNG, SVG, EPS)',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'brand-guidelines',
      title: 'Brand Guidelines',
      description: 'Official brand usage guidelines and visual identity standards',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'executive-photos',
      title: 'Executive Photos',
      description: 'High-resolution photos of TravelHub leadership team',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'product-screenshots',
      title: 'Product Screenshots',
      description: 'Screenshots of TravelHub website and mobile apps',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'fact-sheet',
      title: 'Fact Sheet',
      description: 'Key facts and figures about TravelHub (PDF)',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'b-roll',
      title: 'Video B-Roll',
      description: 'Video footage for media use',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
              <li className="text-white">Press Centre</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Press Centre</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            The latest news, announcements, and media resources from TravelHub.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2">
              {/* Latest Press Releases */}
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Press Releases</h2>
                <div className="space-y-6">
                  {pressReleases.map((release) => (
                    <article key={release.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500">{release.date}</span>
                        <span className="px-2 py-1 bg-booking-blue/10 text-booking-blue text-xs font-medium rounded">
                          {release.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-booking-blue cursor-pointer">
                        {release.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{release.summary}</p>
                      <button className="text-booking-blue font-medium text-sm hover:underline">
                        Read more
                      </button>
                    </article>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t text-center">
                  <button className="px-6 py-2 border border-booking-blue text-booking-blue rounded-lg hover:bg-booking-blue hover:text-white transition-colors font-medium">
                    View All Press Releases
                  </button>
                </div>
              </div>

              {/* Media Kit */}
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Kit</h2>
                <p className="text-gray-700 mb-6">
                  Download official TravelHub assets for media use. All materials must be used in accordance with our brand guidelines.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mediaResources.map((resource) => (
                    <button
                      key={resource.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:border-booking-blue hover:bg-booking-blue/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue flex-shrink-0">
                        {resource.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Company Facts */}
              <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Company Facts</h2>
                <div className="space-y-4">
                  {companyFacts.map((fact, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{fact.label}</span>
                      <span className="font-bold text-booking-blue">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Press Contacts */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Press Contacts</h2>
                <p className="text-gray-600 mb-6 text-sm">
                  For media inquiries, please contact our press office.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Global Press Office</h3>
                    <a href="mailto:press@booking.com" className="text-booking-blue hover:underline text-sm">
                      press@booking.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Americas</h3>
                    <a href="mailto:press.americas@booking.com" className="text-booking-blue hover:underline text-sm">
                      press.americas@booking.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">EMEA</h3>
                    <a href="mailto:press.emea@booking.com" className="text-booking-blue hover:underline text-sm">
                      press.emea@booking.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">APAC</h3>
                    <a href="mailto:press.apac@booking.com" className="text-booking-blue hover:underline text-sm">
                      press.apac@booking.com
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-bold text-gray-900 mb-2">Headquarters</h3>
                  <p className="text-gray-600 text-sm">
                    TravelHub B.V.<br />
                    Oosterdokskade 163<br />
                    1011 DL Amsterdam<br />
                    The Netherlands
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-8 bg-booking-blue/5 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Stay Updated</h2>
                <p className="text-gray-600">
                  Subscribe to receive press releases and company news directly to your inbox.
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                />
                <button className="px-6 py-2 bg-booking-blue text-white rounded hover:bg-booking-blue-hover transition-colors font-medium whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/about"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              About TravelHub
            </Link>
            <Link
              to="/careers"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Careers
            </Link>
            <Link
              to="/investors"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Investor Relations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
