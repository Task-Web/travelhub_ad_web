import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    website: '',
    country: '',
    monthlyVisitors: '',
    message: '',
  });

  const benefits = [
    {
      id: 'commission',
      title: 'Competitive Commission Rates',
      description: 'Earn up to 40% of the commission TravelHub receives on completed stays.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'global-inventory',
      title: 'Global Inventory',
      description: 'Access over 28 million properties worldwide, including hotels, apartments, and unique stays.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'tools',
      title: 'Marketing Tools',
      description: 'Access banners, search boxes, deep links, and APIs to integrate seamlessly with your website.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
    },
    {
      id: 'tracking',
      title: 'Real-Time Tracking',
      description: 'Monitor your performance with detailed reports and analytics in our affiliate dashboard.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'support',
      title: 'Dedicated Support',
      description: 'Get help from our affiliate team with account management and optimization tips.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'payments',
      title: 'Reliable Payments',
      description: 'Receive monthly payments via bank transfer or PayPal with no minimum threshold.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  const commissionTiers = [
    { tier: 'Standard', bookings: '0-50', rate: '25%' },
    { tier: 'Silver', bookings: '51-150', rate: '30%' },
    { tier: 'Gold', bookings: '151-500', rate: '35%' },
    { tier: 'Platinum', bookings: '500+', rate: '40%' },
  ];

  const requirements = [
    'Have an active website with original, quality content',
    'Website must be publicly accessible and in compliance with local laws',
    'No incentivised traffic (cashback, rewards, coupons) without prior approval',
    'Agree to our affiliate terms and conditions',
    'Accurate representation of TravelHub brand and services',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Affiliate application submitted:', formData);
    alert('Thank you for your application! We will review it and get back to you within 5 business days.');
  };

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
              <li className="text-white">Affiliate Programme</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Affiliate Programme</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Partner with the world&apos;s leading travel platform and earn competitive commissions on every booking.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Join Our Affiliate Programme?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The TravelHub Affiliate Programme is designed to help content creators, bloggers, travel websites, and businesses monetise their traffic by promoting the world&apos;s largest selection of accommodations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With access to over 28 million properties in 227 countries and territories, you can offer your audience incredible travel options while earning competitive commissions on every completed stay.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Programme Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Structure</h2>
            <p className="text-gray-700 mb-6">
              Our tiered commission structure rewards you for driving more bookings. The more completed stays you generate, the higher your commission rate.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Tier</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Monthly Bookings</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Commission Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {commissionTiers.map((tier, index) => (
                    <tr key={tier.tier} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 text-gray-700">{tier.tier}</td>
                      <td className="py-3 px-4 text-gray-700">{tier.bookings}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-booking-blue">{tier.rate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Commission rates are calculated as a percentage of TravelHub&apos;s commission on each completed stay.
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Programme Requirements</h2>
            <p className="text-gray-700 mb-6">
              To join our affiliate programme, you must meet the following requirements:
            </p>
            <ul className="space-y-3">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-lg shadow p-8" id="apply">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply Now</h2>
            <p className="text-gray-700 mb-6">
              Ready to start earning? Fill out the form below and our team will review your application.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                  placeholder="https://"
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  >
                    <option value="">Select a country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="NL">Netherlands</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="AU">Australia</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="monthlyVisitors" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Website Visitors
                  </label>
                  <select
                    id="monthlyVisitors"
                    name="monthlyVisitors"
                    value={formData.monthlyVisitors}
                    onChange={handleInputChange}
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  >
                    <option value="">Select range</option>
                    <option value="0-1000">0 - 1,000</option>
                    <option value="1000-10000">1,000 - 10,000</option>
                    <option value="10000-50000">10,000 - 50,000</option>
                    <option value="50000-100000">50,000 - 100,000</option>
                    <option value="100000+">100,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us about your website
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your website content and how you plan to promote TravelHub..."
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none resize-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-booking-blue text-white font-medium rounded-lg hover:bg-booking-blue-hover transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>

          {/* FAQ Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Have questions about the affiliate programme?</p>
            <Link
              to="/help"
              className="text-booking-blue hover:underline font-medium"
            >
              Visit our Help Centre
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
