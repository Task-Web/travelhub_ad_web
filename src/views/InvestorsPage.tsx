import { Link } from 'react-router-dom';

export default function InvestorsPage() {
  const stockInfo = {
    symbol: 'BKNG',
    exchange: 'NASDAQ',
    lastPrice: '$3,542.18',
    change: '+$45.23 (+1.29%)',
    lastUpdated: 'January 17, 2024, 4:00 PM EST',
  };

  const financialHighlights = [
    { label: 'Revenue (FY 2023)', value: '$21.4B', change: '+25%' },
    { label: 'Gross Bookings (FY 2023)', value: '$142.5B', change: '+24%' },
    { label: 'Room Nights (FY 2023)', value: '1.04B', change: '+18%' },
    { label: 'Net Income (FY 2023)', value: '$4.2B', change: '+35%' },
  ];

  const financialReports = [
    { title: 'Q4 2023 Earnings Report', date: 'February 22, 2024', type: 'Quarterly Report' },
    { title: 'Q3 2023 Earnings Report', date: 'November 2, 2023', type: 'Quarterly Report' },
    { title: 'Q2 2023 Earnings Report', date: 'August 3, 2023', type: 'Quarterly Report' },
    { title: 'Annual Report 2023', date: 'February 22, 2024', type: 'Annual Report' },
    { title: 'Annual Report 2022', date: 'February 23, 2023', type: 'Annual Report' },
  ];

  const upcomingEvents = [
    { title: 'Q1 2024 Earnings Call', date: 'May 2, 2024', time: '8:30 AM EST' },
    { title: 'Annual Shareholder Meeting', date: 'June 6, 2024', time: '10:00 AM CEST' },
    { title: 'Q2 2024 Earnings Call', date: 'August 1, 2024', time: '8:30 AM EST' },
  ];

  const boardMembers = [
    { name: 'Glenn D. Fogel', title: 'Chief Executive Officer & President' },
    { name: 'David I. Goulden', title: 'Executive Vice President & CFO' },
    { name: 'Peter J. Millones', title: 'Executive Vice President, General Counsel' },
    { name: 'Jeffery H. Boyd', title: 'Chairman of the Board' },
  ];

  const governanceDocuments = [
    'Corporate Governance Guidelines',
    'Code of Business Conduct and Ethics',
    'Audit Committee Charter',
    'Compensation Committee Charter',
    'Nominating Committee Charter',
    'Certificate of Incorporation',
    'Bylaws',
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
              <li className="text-white">Investor Relations</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Investor Relations</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Financial information, stock data, and corporate governance for Booking Holdings Inc.
          </p>
        </div>
      </div>

      {/* Stock Ticker */}
      <div className="bg-white border-b">
        <div className="max-w-container-lg mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">{stockInfo.exchange}: {stockInfo.symbol}</p>
                <p className="text-3xl font-bold text-gray-900">{stockInfo.lastPrice}</p>
              </div>
              <div className="text-green-600 font-medium">
                {stockInfo.change}
              </div>
            </div>
            <p className="text-sm text-gray-500">{stockInfo.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Financial Highlights */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Highlights</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {financialHighlights.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
                  <p className="text-green-600 font-medium text-sm">{item.change} YoY</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2">
              {/* Financial Reports */}
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Reports</h2>
                <div className="space-y-4">
                  {financialReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:border-booking-blue transition-colors">
                      <div>
                        <h3 className="font-bold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-500">{report.date} | {report.type}</p>
                      </div>
                      <button className="flex items-center gap-2 text-booking-blue hover:underline font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t text-center">
                  <button className="text-booking-blue font-medium hover:underline">
                    View All SEC Filings
                  </button>
                </div>
              </div>

              {/* Corporate Governance */}
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Corporate Governance</h2>
                <p className="text-gray-700 mb-6">
                  Booking Holdings Inc. is committed to maintaining the highest standards of corporate governance. Our governance framework ensures accountability, transparency, and ethical business practices.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {governanceDocuments.map((doc, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:border-booking-blue hover:bg-booking-blue/5 transition-colors"
                    >
                      <svg className="w-5 h-5 text-booking-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-900">{doc}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Leadership */}
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Leadership</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {boardMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t text-center">
                  <button className="text-booking-blue font-medium hover:underline">
                    View Full Leadership Team
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 border border-booking-blue text-booking-blue rounded hover:bg-booking-blue hover:text-white transition-colors font-medium">
                  View Event Calendar
                </button>
              </div>

              {/* Email Alerts */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Email Alerts</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Subscribe to receive SEC filings, press releases, and other investor communications.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  />
                  <button
                    type="button"
                    className="w-full py-2 bg-booking-blue text-white rounded hover:bg-booking-blue-hover transition-colors font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Investor Contact */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Investor Contact</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Investor Relations</h3>
                    <a href="mailto:ir@bookingholdings.com" className="text-booking-blue hover:underline text-sm">
                      ir@bookingholdings.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone</h3>
                    <p className="text-gray-600 text-sm">+1 (203) 299-8000</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Address</h3>
                    <p className="text-gray-600 text-sm">
                      Booking Holdings Inc.<br />
                      800 Connecticut Avenue<br />
                      Norwalk, CT 06854<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyst Coverage */}
          <div className="mt-8 bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyst Coverage</h2>
            <p className="text-gray-700 mb-6">
              Booking Holdings is covered by major financial institutions. Please contact the analysts directly for their reports and investment recommendations.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Morgan Stanley</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Goldman Sachs</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">JPMorgan</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Bank of America</p>
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
              to="/press"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Press Centre
            </Link>
            <Link
              to="/careers"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Careers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
