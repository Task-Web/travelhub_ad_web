import { useState } from 'react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    id: 'billing',
    title: 'Centralized billing',
    description: 'Consolidate all travel expenses into a single invoice. Simplify accounting with detailed reports and easy reconciliation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    id: 'compliance',
    title: 'Travel policy compliance',
    description: 'Set up travel policies that guide employees to book within budget. Automatic alerts when bookings exceed limits.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 'support',
    title: 'Dedicated support',
    description: 'Access priority customer service with a dedicated account manager for your company. 24/7 assistance for all your travel needs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    title: 'Reporting & analytics',
    description: 'Get comprehensive insights into your company travel spending. Track trends, identify savings, and optimize your travel program.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: 'rates',
    title: 'Corporate rates',
    description: 'Unlock exclusive corporate discounts on over 28 million properties worldwide. Save more on every business trip.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Create a company account',
    description: 'Sign up with your work email and set up your company profile. Add your company details, billing information, and travel policies.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Invite your team',
    description: 'Add employees to your account and assign roles. Set individual budgets and approval workflows to maintain control.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Start booking',
    description: 'Your team can start booking immediately. All bookings are tracked, and expenses are consolidated for easy management.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
  },
];

export default function BusinessPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
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
              <li className="text-white">TravelHub for Business</li>
            </ol>
          </nav>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">TravelHub for Business</h1>
              <p className="text-xl text-blue-100 mb-6">
                Simplify business travel for your company. Manage bookings, control costs, and empower your team with the world&apos;s leading accommodation platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#get-started" className="px-6 py-3 bg-white text-booking-blue font-bold rounded hover:bg-neutral-100 transition-colors">
                  Get Started Free
                </a>
                <Link to="/help" className="px-6 py-3 border border-white text-white font-medium rounded hover:bg-white/10 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">28M+</p>
                    <p className="text-sm text-blue-100">Properties worldwide</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">500K+</p>
                    <p className="text-sm text-blue-100">Business accounts</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">20%</p>
                    <p className="text-sm text-blue-100">Average savings</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">24/7</p>
                    <p className="text-sm text-blue-100">Dedicated support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose TravelHub for Business?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage corporate travel efficiently, all in one platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your company set up in minutes and start saving on business travel today.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-booking-blue/20" />
                )}
                {/* Step circle */}
                <div className="relative z-10 w-24 h-24 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mx-auto mb-6">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-booking-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trusted by businesses worldwide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                &quot;TravelHub for Business has transformed how we manage travel. The centralized billing alone saves us hours each month.&quot;
              </p>
              <p className="font-bold text-gray-900">Sarah Johnson</p>
              <p className="text-sm text-gray-500">Travel Manager, TechCorp Inc.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                &quot;The policy compliance features ensure our team always books within budget. We&apos;ve reduced overspending by 30%.&quot;
              </p>
              <p className="font-bold text-gray-900">Michael Chen</p>
              <p className="text-sm text-gray-500">CFO, Global Solutions Ltd.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                &quot;The dedicated support team is incredible. Any issues are resolved within minutes, keeping our employees productive.&quot;
              </p>
              <p className="font-bold text-gray-900">Emma Williams</p>
              <p className="text-sm text-gray-500">HR Director, Innovate Co.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started CTA Section */}
      <div id="get-started" className="bg-booking-blue py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get started today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies already saving on business travel. Sign up for free and start booking smarter.
            </p>
            {isSubmitted ? (
              <div className="bg-white rounded-lg p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for signing up!</h3>
                <p className="text-gray-600">
                  We&apos;ve sent a confirmation email to <strong>{email}</strong>. Check your inbox to complete your registration.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8">
                <div className="mb-6">
                  <label htmlFor="business-email" className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Work email address
                  </label>
                  <input
                    id="business-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light focus:ring-2 focus:ring-booking-blue-light/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Get Started Free
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  No credit card required. Free for companies of all sizes.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">Is TravelHub for Business free?</h3>
              <p className="text-gray-600">
                Yes, creating a business account is completely free. There are no setup fees, monthly charges, or hidden costs. You only pay for the bookings you make.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">How many employees can I add?</h3>
              <p className="text-gray-600">
                There&apos;s no limit to the number of employees you can add to your business account. Whether you have 5 or 5,000 travelers, we can accommodate your needs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I set travel policies and budgets?</h3>
              <p className="text-gray-600">
                Absolutely. You can create custom travel policies, set per-trip budgets, and configure approval workflows to ensure compliance across your organization.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">What payment methods are supported?</h3>
              <p className="text-gray-600">
                We support all major credit cards, corporate cards, and invoicing for qualified businesses. Centralized billing makes expense management simple.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/help" className="text-booking-blue-light hover:underline font-medium">
              View all FAQs
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need help getting started?</h3>
              <p className="text-gray-600">Our business travel experts are here to answer your questions.</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/help"
                className="px-6 py-3 bg-booking-blue text-white font-medium rounded hover:bg-booking-blue-hover transition-colors inline-flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                Contact Sales
              </Link>
              <a
                href="tel:+1-800-123-4567"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
