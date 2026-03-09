import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TravelAgentsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    iataNumber: '',
    monthlyBookings: '',
    message: '',
  });

  const features = [
    {
      id: 'inventory',
      title: 'Global Inventory Access',
      description: 'Access over 28 million properties worldwide, from budget hostels to luxury resorts.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'commission',
      title: 'Competitive Commission',
      description: 'Earn attractive commissions on every booking with our tiered partnership model.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'booking-management',
      title: 'Easy Booking Management',
      description: 'Manage all your bookings through our dedicated travel agent portal.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'support',
      title: 'Dedicated Support',
      description: 'Access priority support from our travel agent team whenever you need help.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'flexibility',
      title: 'Flexible Payment Options',
      description: 'Multiple payment methods including credit terms for qualified agencies.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: 'api',
      title: 'API Integration',
      description: 'Integrate our inventory directly into your booking systems via API.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  const benefits = [
    'No registration or annual fees',
    'Real-time availability and instant confirmation',
    'Best price guarantee across all properties',
    'Net rates available for high-volume agencies',
    'White-label booking solutions available',
    'Multi-currency support',
    'Detailed reporting and analytics',
    'Training and certification programmes',
  ];

  const commissionStructure = [
    { tier: 'Starter', bookings: '0-50/month', commission: 'Standard rates' },
    { tier: 'Silver', bookings: '51-200/month', commission: 'Standard + 2%' },
    { tier: 'Gold', bookings: '201-500/month', commission: 'Standard + 4%' },
    { tier: 'Platinum', bookings: '500+/month', commission: 'Standard + 6%' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Travel agent registration submitted:', formData);
    alert('Thank you for your registration! Our team will contact you within 2 business days.');
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
              <li className="text-white">Travel Agents</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Agent Portal</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Partner with the world&apos;s leading accommodation platform and grow your business with access to millions of properties worldwide.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Partner With TravelHub?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              As a TravelHub travel agent partner, you&apos;ll have access to the world&apos;s largest selection of accommodations, competitive rates, and powerful tools to help you deliver exceptional service to your clients.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you&apos;re a small independent agency or a large tour operator, our travel agent programme offers the flexibility and support you need to succeed.
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Programme Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Structure</h2>
            <p className="text-gray-700 mb-6">
              Our tiered commission structure rewards your success. The more you book, the more you earn.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Partner Tier</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Monthly Bookings</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {commissionStructure.map((tier, index) => (
                    <tr key={tier.tier} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 font-medium text-gray-900">{tier.tier}</td>
                      <td className="py-3 px-4 text-gray-700">{tier.bookings}</td>
                      <td className="py-3 px-4 text-booking-blue font-medium">{tier.commission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Partner Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow p-8" id="register">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Your Agency</h2>
            <p className="text-gray-700 mb-6">
              Complete the form below to apply for our travel agent programme. Our team will review your application and contact you within 2 business days.
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
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
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
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
                  <label htmlFor="iataNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    IATA Number (if applicable)
                  </label>
                  <input
                    type="text"
                    id="iataNumber"
                    name="iataNumber"
                    value={formData.iataNumber}
                    onChange={handleInputChange}
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="monthlyBookings" className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Monthly Bookings
                </label>
                <select
                  id="monthlyBookings"
                  name="monthlyBookings"
                  value={formData.monthlyBookings}
                  onChange={handleInputChange}
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                >
                  <option value="">Select range</option>
                  <option value="1-10">1 - 10</option>
                  <option value="11-50">11 - 50</option>
                  <option value="51-200">51 - 200</option>
                  <option value="201-500">201 - 500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your agency and how you plan to use TravelHub..."
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none resize-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-booking-blue text-white font-medium rounded-lg hover:bg-booking-blue-hover transition-colors"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>

          {/* Already Registered */}
          <div className="mt-8 bg-booking-blue/5 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Already a Partner?</h2>
            <p className="text-gray-600 mb-6">
              Log in to your travel agent portal to manage bookings and access exclusive rates.
            </p>
            <button className="px-8 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors font-medium">
              Agent Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
