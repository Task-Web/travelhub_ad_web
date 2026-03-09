import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CorporateContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    department: '',
    subject: '',
    message: '',
  });

  const officeLocations = [
    {
      id: 'headquarters',
      name: 'Global Headquarters',
      city: 'Amsterdam',
      country: 'Netherlands',
      address: 'Oosterdokskade 163, 1011 DL Amsterdam',
      phone: '+31 20 712 5000',
      isHeadquarters: true,
    },
    {
      id: 'london',
      name: 'London Office',
      city: 'London',
      country: 'United Kingdom',
      address: '1 St Giles High Street, London WC2H 8AG',
      phone: '+44 20 3320 2609',
      isHeadquarters: false,
    },
    {
      id: 'new-york',
      name: 'New York Office',
      city: 'New York',
      country: 'United States',
      address: '800 Connecticut Avenue, Norwalk, CT 06854',
      phone: '+1 203 299 8000',
      isHeadquarters: false,
    },
    {
      id: 'singapore',
      name: 'Singapore Office',
      city: 'Singapore',
      country: 'Singapore',
      address: '1 Raffles Place, #20-61, One Raffles Place Tower 2',
      phone: '+65 6671 9000',
      isHeadquarters: false,
    },
  ];

  const departments = [
    {
      id: 'customer-service',
      name: 'Customer Service',
      description: 'For help with bookings, cancellations, and general inquiries',
      contact: 'customer.service@booking.com',
      type: 'email',
    },
    {
      id: 'partner-support',
      name: 'Partner Support',
      description: 'For property partners and accommodation providers',
      contact: 'partner.support@booking.com',
      type: 'email',
    },
    {
      id: 'press',
      name: 'Press & Media',
      description: 'For media inquiries and press releases',
      contact: 'press@booking.com',
      type: 'email',
    },
    {
      id: 'investor-relations',
      name: 'Investor Relations',
      description: 'For shareholders and investment inquiries',
      contact: 'ir@bookingholdings.com',
      type: 'email',
    },
    {
      id: 'legal',
      name: 'Legal',
      description: 'For legal matters and compliance inquiries',
      contact: 'legal@booking.com',
      type: 'email',
    },
    {
      id: 'careers',
      name: 'Careers',
      description: 'For job inquiries and recruitment',
      contact: 'careers@booking.com',
      type: 'email',
    },
  ];

  const legalContacts = [
    {
      title: 'Data Protection Office',
      email: 'dataprotectionoffice@booking.com',
      description: 'For GDPR and data privacy related inquiries',
    },
    {
      title: 'Compliance',
      email: 'compliance@booking.com',
      description: 'For regulatory and compliance matters',
    },
    {
      title: 'Intellectual Property',
      email: 'ip@booking.com',
      description: 'For trademark and copyright inquiries',
    },
    {
      title: 'Legal Notices',
      address: 'TravelHub B.V., Legal Department, Oosterdokskade 163, 1011 DL Amsterdam, The Netherlands',
      description: 'For service of legal documents',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will respond within 3-5 business days.');
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
              <li className="text-white">Corporate Contact</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Get in touch with TravelHub. Find the right department or office for your inquiry.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Quick Contact Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-yellow-800">
                  <strong>For help with an existing booking:</strong> Please visit our{' '}
                  <Link to="/help" className="underline hover:text-yellow-900">Help Centre</Link>{' '}
                  or go to{' '}
                  <Link to="/trips" className="underline hover:text-yellow-900">Manage your trips</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {officeLocations.map((office) => (
                <div
                  key={office.id}
                  className={`p-6 rounded-lg border ${office.isHeadquarters ? 'border-booking-blue bg-booking-blue/5' : 'border-gray-200'}`}
                >
                  {office.isHeadquarters && (
                    <span className="inline-block px-2 py-1 bg-booking-blue text-white text-xs font-medium rounded mb-3">
                      Headquarters
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{office.name}</h3>
                  <p className="text-gray-600 mb-3">{office.city}, {office.country}</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span><br />
                      {office.address}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {office.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Departments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="p-4 border rounded-lg hover:border-booking-blue transition-colors">
                  <h3 className="font-bold text-gray-900 mb-1">{dept.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                  <a
                    href={`mailto:${dept.contact}`}
                    className="text-booking-blue hover:underline text-sm font-medium"
                  >
                    {dept.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Contact Information */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Contacts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {legalContacts.map((contact, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-1">{contact.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-booking-blue hover:underline text-sm"
                    >
                      {contact.email}
                    </a>
                  )}
                  {contact.address && (
                    <p className="text-sm text-gray-600">{contact.address}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* General Inquiry Form */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">General Inquiry</h2>
            <p className="text-gray-700 mb-6">
              For general corporate inquiries, please use the form below. We aim to respond within 3-5 business days.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  />
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
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Organization
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
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                  >
                    <option value="">Select department</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnerships</option>
                    <option value="press">Press & Media</option>
                    <option value="legal">Legal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none resize-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-booking-blue text-white font-medium rounded-lg hover:bg-booking-blue-hover transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Company Information */}
          <div className="mt-8 bg-gray-100 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">TravelHub B.V.</h3>
                <p className="text-gray-600 text-sm">
                  Oosterdokskade 163<br />
                  1011 DL Amsterdam<br />
                  The Netherlands
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Company Registration</h3>
                <p className="text-gray-600 text-sm">
                  Chamber of Commerce: 31047344<br />
                  VAT Number: NL805734958B01<br />
                  Part of Booking Holdings Inc.
                </p>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/about"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              About Us
            </Link>
            <Link
              to="/careers"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Careers
            </Link>
            <Link
              to="/press"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Press Centre
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
