import { useState } from 'react';
import { Link } from 'react-router-dom';

const partnerBenefits = [
  {
    title: 'Manage bookings',
    description: 'View, modify, and manage all your reservations in one place',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
  {
    title: 'Update availability',
    description: 'Keep your calendar up to date and manage pricing in real-time',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
      </svg>
    ),
  },
  {
    title: 'Access analytics',
    description: 'Track your performance with detailed insights and reports',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
  },
  {
    title: 'Respond to reviews',
    description: 'Engage with guests and manage your reputation effectively',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
    ),
  },
];

export default function ExtranetPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempted with:', formData);
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-100 border-b">
        <div className="max-w-container-lg mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-booking-blue-light hover:underline">
              Home
            </Link>
            <span className="text-neutral-400">&gt;</span>
            <span className="text-neutral-600">Extranet Login</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Partner Extranet
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Access your property dashboard to manage bookings, update availability, and grow your business with TravelHub
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Login Form Section */}
          <div>
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                Sign in to your account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Email or username
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email or username"
                    required
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light focus:ring-2 focus:ring-booking-blue-light/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light focus:ring-2 focus:ring-booking-blue-light/20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        setFormData({ ...formData, rememberMe: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-neutral-300 text-booking-blue-light focus:ring-booking-blue-light"
                    />
                    <span className="text-sm text-neutral-600">Remember me</span>
                  </label>
                  <Link
                    to="/help"
                    className="text-sm text-booking-blue-light hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
                >
                  Sign in
                </button>
              </form>
            </div>

            {/* Create Account Section */}
            <div className="mt-8 bg-neutral-50 rounded-lg border border-neutral-200 p-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-3">
                New to TravelHub?
              </h3>
              <p className="text-neutral-600 mb-6">
                Join thousands of property managers who use TravelHub to reach
                millions of travellers worldwide. List your property today and
                start earning from day one.
              </p>
              <Link
                to="/list-property"
                className="inline-block px-6 py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors"
              >
                Register your property
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Partner Benefits
            </h2>
            <div className="space-y-6">
              {partnerBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 bg-white rounded-lg shadow-card p-6"
                >
                  <div className="text-booking-blue-light flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <h3 className="font-bold text-lg mb-1">Need help with your account?</h3>
              <p className="text-white/80">
                Our Partner Support team is available 24/7 to assist you
              </p>
            </div>
            <Link
              to="/help"
              className="px-6 py-3 bg-white text-booking-blue font-bold rounded hover:bg-neutral-100 transition-colors"
            >
              Partner Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
