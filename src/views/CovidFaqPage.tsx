import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function CovidFaqPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'restrictions', label: 'Travel Restrictions' },
    { id: 'cancellation', label: 'Cancellation Policies' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'health', label: 'Health & Safety' },
  ];

  const faqs: FaqItem[] = [
    // Travel Restrictions
    {
      id: 'current-restrictions',
      question: 'Are there still COVID-19 travel restrictions in place?',
      answer: 'Most COVID-19 travel restrictions have been lifted worldwide. However, some countries may still have specific requirements or may reinstate measures during outbreaks. We recommend checking the official government websites of your destination country for the most up-to-date information before travelling. You can also check our destination guides for general travel information.',
      category: 'restrictions',
    },
    {
      id: 'vaccination-requirements',
      question: 'Do I need to be vaccinated to travel?',
      answer: 'Vaccination requirements vary by destination and are subject to change. While many countries have removed vaccination requirements for entry, some destinations may still require proof of vaccination or a negative test result. Always check the latest entry requirements for your specific destination before booking your trip.',
      category: 'restrictions',
    },
    {
      id: 'testing-requirements',
      question: 'Do I need a COVID-19 test to travel?',
      answer: 'Testing requirements have been removed in most countries. However, some destinations may still require testing under certain circumstances. Additionally, some accommodations, cruise lines, or tour operators may have their own testing policies. Check with your destination and service providers for current requirements.',
      category: 'restrictions',
    },
    {
      id: 'quarantine-rules',
      question: 'Will I need to quarantine when I arrive?',
      answer: 'Most countries have eliminated quarantine requirements for travellers. However, policies can change quickly in response to new variants or outbreaks. Check the official government website of your destination for current quarantine policies before travelling.',
      category: 'restrictions',
    },
    // Cancellation Policies
    {
      id: 'cancel-covid',
      question: 'Can I cancel my booking due to COVID-19?',
      answer: 'Cancellation policies depend on the rate you booked and the property\'s policies. Many properties still offer flexible cancellation options. Check your booking confirmation for the specific cancellation policy that applies. If you need to cancel due to COVID-19 related government restrictions affecting your travel, contact the property or our customer service to discuss your options.',
      category: 'cancellation',
    },
    {
      id: 'free-cancellation',
      question: 'How do I find properties with free cancellation?',
      answer: 'When searching for accommodations, use the "Free cancellation" filter to show only properties offering flexible cancellation options. Look for the "Free cancellation" badge on property listings. We recommend booking properties with free cancellation for added peace of mind.',
      category: 'cancellation',
    },
    {
      id: 'modify-booking',
      question: 'Can I change my booking dates instead of cancelling?',
      answer: 'Many properties allow date changes. Go to "Manage booking" and select "Change dates" to see if your booking can be modified. Date changes are subject to availability and may result in price differences. Contact the property directly if you need more flexibility than what\'s available online.',
      category: 'cancellation',
    },
    {
      id: 'non-refundable',
      question: 'I booked a non-refundable rate. What are my options?',
      answer: 'If you have a non-refundable booking, standard cancellation terms apply. However, many properties have been flexible during the pandemic. Contact the property directly to discuss your situation. If government restrictions prevent travel, you may have additional options. Our customer service team can help facilitate discussions with the property.',
      category: 'cancellation',
    },
    // Refunds
    {
      id: 'refund-timeline',
      question: 'How long will my refund take?',
      answer: 'Refunds are typically processed within 7-10 business days from the cancellation date. However, it may take additional time (3-5 business days) for the refund to appear on your bank statement, depending on your payment method and financial institution. If you haven\'t received your refund after 14 business days, contact your bank first, then our customer service.',
      category: 'refunds',
    },
    {
      id: 'refund-method',
      question: 'How will I receive my refund?',
      answer: 'Refunds are processed to the original payment method used for booking. Credit card refunds go back to the same card, and PayPal refunds return to your PayPal account. If your card has expired or been cancelled, contact your bank as they can usually still process the refund to your account.',
      category: 'refunds',
    },
    {
      id: 'partial-refund',
      question: 'Can I get a partial refund if I shorten my stay?',
      answer: 'This depends on the property\'s policies and your booking rate. If you need to shorten your stay, contact the property or our customer service before your travel dates. Some properties may offer partial refunds, while others may apply their standard cancellation policy.',
      category: 'refunds',
    },
    {
      id: 'refund-voucher',
      question: 'Can I get a voucher instead of a refund?',
      answer: 'Some properties may offer vouchers or credits for future stays as an alternative to refunds. This is at the property\'s discretion. If you prefer a voucher over a refund, contact the property directly to discuss this option.',
      category: 'refunds',
    },
    // Health & Safety
    {
      id: 'property-measures',
      question: 'What safety measures are properties taking?',
      answer: 'Many properties have implemented enhanced cleaning protocols, contactless check-in, social distancing measures, and other safety precautions. Look for properties displaying health and safety information on their listing page. You can also contact the property directly to ask about their specific measures.',
      category: 'health',
    },
    {
      id: 'clean-stay',
      question: 'How can I find properties with enhanced cleaning?',
      answer: 'Properties that have implemented enhanced cleaning measures often highlight this in their listing. Look for mentions of cleaning protocols, sanitisation practices, or health and safety measures in the property description. You can also use the "Health & safety" filter when searching.',
      category: 'health',
    },
    {
      id: 'sick-during-stay',
      question: 'What should I do if I get sick during my stay?',
      answer: 'If you develop COVID-19 symptoms during your stay, follow local health guidelines. Inform the property staff and seek medical advice. Check if your travel insurance covers medical expenses and extended stays. Contact our customer service if you need help with extending your booking or other arrangements.',
      category: 'health',
    },
    {
      id: 'travel-insurance',
      question: 'Should I get travel insurance?',
      answer: 'We strongly recommend purchasing comprehensive travel insurance that covers COVID-19 related issues, including medical expenses, trip cancellation, and interruption. Check the policy details carefully to understand what is covered, including any exclusions related to pandemics or pre-existing conditions.',
      category: 'health',
    },
  ];

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
              <li><Link to="/help" className="hover:text-white">Help Centre</Link></li>
              <li>&gt;</li>
              <li className="text-white">COVID-19 FAQs</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">COVID-19 FAQs</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Find answers to frequently asked questions about travelling during and after COVID-19.
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border-b border-yellow-100">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-800">
              <strong>Important:</strong> Travel requirements change frequently. Always check the official government websites of your destination for the most current information before travelling.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-booking-blue text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow overflow-hidden">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      expandedId === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedId === faq.id && (
                  <div className="px-6 pb-4">
                    <div className="border-t pt-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No questions found in this category.</p>
            </div>
          )}

          {/* Still Need Help */}
          <div className="mt-12 bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is available 24/7 to help you with any questions about your booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/help"
                className="px-6 py-3 bg-booking-blue text-white font-medium rounded-lg hover:bg-booking-blue-hover transition-colors"
              >
                Visit Help Centre
              </Link>
              <Link
                to="/trips"
                className="px-6 py-3 border border-booking-blue text-booking-blue font-medium rounded-lg hover:bg-booking-blue hover:text-white transition-colors"
              >
                Manage Your Booking
              </Link>
            </div>
          </div>

          {/* Useful Resources */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Useful Resources</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow transition-shadow"
              >
                <svg className="w-6 h-6 text-booking-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="text-gray-700">World Health Organization (WHO)</span>
              </a>
              <a
                href="https://www.iatatravelcentre.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow transition-shadow"
              >
                <svg className="w-6 h-6 text-booking-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="text-gray-700">IATA Travel Centre</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
