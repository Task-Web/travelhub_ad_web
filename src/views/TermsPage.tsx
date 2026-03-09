import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('summary');

  const tableOfContents = [
    { id: 'summary', title: 'Summary' },
    { id: 'all-experiences', title: 'A. All Travel Experiences' },
    { id: 'accommodations', title: 'B. Accommodations' },
    { id: 'attractions', title: 'C. Attractions' },
    { id: 'car-rentals', title: 'D. Car rentals' },
    { id: 'flights', title: 'E. Flights' },
    { id: 'transport', title: 'F. Transport (Taxis, etc.)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-8">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Terms of Service</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold">Customer terms of service</h1>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-1 text-sm">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`block px-2 py-1 rounded ${
                      activeSection === item.id
                        ? 'bg-booking-blue/10 text-booking-blue font-medium'
                        : 'text-gray-600 hover:text-booking-blue hover:bg-gray-50'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Related documents</h4>
                <div className="space-y-1 text-sm">
                  <Link to="/privacy" className="block text-booking-blue hover:underline">Privacy Notice</Link>
                  <Link to="/cookie-settings" className="block text-booking-blue hover:underline">Cookie settings</Link>
                  <Link to="/how-we-work" className="block text-booking-blue hover:underline">How we work</Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow p-8">
              <p className="text-gray-600 mb-8">
                Last updated: January 2024
              </p>

              {/* Summary Section */}
              <section id="summary" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <p className="text-gray-700">
                    These Customer Terms of Service govern your use of TravelHub&apos;s platform and services. By making a booking through our platform, you agree to these terms. Please read them carefully.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  These terms are supplemented by the following related documents:
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>How we Work:</strong> Information about how our platform operates</li>
                  <li><strong>Content Standards:</strong> Guidelines for user-generated content and reviews</li>
                  <li><strong>Privacy Notice:</strong> How we collect and process your personal data</li>
                </ul>
              </section>

              {/* Section A: All Travel Experiences */}
              <section id="all-experiences" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">A. All Travel Experiences</h2>

                {/* A2: About these terms */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">A2. About these terms</h3>
                  <p className="text-gray-700 mb-4">
                    By making a booking through our platform, you accept these terms and agree to comply with them. These terms constitute a legally binding agreement between you and TravelHub.
                  </p>
                  <p className="text-gray-700">
                    We may update these terms from time to time. When we make significant changes, we will notify you through our platform or by email. Your continued use of our services after such changes constitutes acceptance of the updated terms.
                  </p>
                </div>

                {/* A15: Intellectual Property */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">A15. Intellectual property</h3>
                  <p className="text-gray-700 mb-4">
                    All intellectual property rights in our platform, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li>Software, technology, and database rights</li>
                    <li>Text, images, graphics, and multimedia content</li>
                    <li>Trademarks, logos, and trade names</li>
                    <li>Website design and user interface</li>
                  </ul>
                  <p className="text-gray-700">
                    are owned by or licensed to TravelHub B.V. You may not copy, modify, distribute, or use any content from our platform without our prior written consent.
                  </p>
                </div>

                {/* A16: What if something goes wrong */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">A16. What if something goes wrong?</h3>
                  <p className="text-gray-700 mb-4">
                    If you experience any issues with your booking or our services, please contact our Customer Service team:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Through our 24/7 Customer Service helpline</li>
                      <li>• Via the contact form on our Help Centre</li>
                      <li>• Through the messaging system in your booking</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 mb-4">
                    For customers in the European Union, you may also use the Online Dispute Resolution (ODR) platform provided by the European Commission at: <a href="https://ec.europa.eu/odr" className="text-booking-blue hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/odr</a>
                  </p>
                </div>

                {/* A18: Prohibited activities */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">A18. Unacceptable behaviour and account termination</h3>
                  <p className="text-gray-700 mb-4">
                    We reserve the right to take the following actions if you violate these terms or engage in unacceptable behaviour:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li>Stop any bookings you have made or are trying to make</li>
                    <li>Cancel any existing bookings</li>
                    <li>Block your access to our platform</li>
                    <li>Terminate your account</li>
                  </ul>
                  <p className="text-gray-700">
                    Prohibited activities include fraud, harassment, providing false information, damaging property, and any illegal activities.
                  </p>
                </div>

                {/* A19: Limitation of liability */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">A19. Limitation of liability</h3>
                  <p className="text-gray-700 mb-4">
                    To the maximum extent permitted by law:
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <ul className="space-y-2 text-gray-700">
                      <li>• We are not liable for any indirect, special, or consequential damages</li>
                      <li>• Our total liability is limited to the amount you paid for the booking in question</li>
                      <li>• We are not liable for issues caused by third-party service providers</li>
                      <li>• We are not liable for force majeure events beyond our control</li>
                    </ul>
                  </div>
                  <p className="text-gray-700">
                    Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded by law.
                  </p>
                </div>

                {/* A20: Applicable law and forum */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">A20. Applicable law and forum</h3>
                  <p className="text-gray-700 mb-4">
                    These terms are governed by and construed in accordance with:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3 text-gray-700">
                      <li>
                        <strong>For customers outside the UK:</strong> Dutch law applies, and disputes will be resolved by the courts of Amsterdam, Netherlands.
                      </li>
                      <li>
                        <strong>For customers in the UK:</strong> English law applies, and disputes will be resolved by the courts of England.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section B: Accommodations */}
              <section id="accommodations" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">B. Accommodations</h2>
                <p className="text-gray-700 mb-4">
                  When you book accommodation through our platform, you enter into a contract directly with the accommodation provider. TravelHub acts as an intermediary and is not a party to this contract.
                </p>
                <p className="text-gray-700 mb-4">
                  Key points for accommodation bookings:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Check-in and check-out times are set by the property</li>
                  <li>Cancellation policies vary by property and rate type</li>
                  <li>Some properties require a deposit or prepayment</li>
                  <li>Additional fees may apply for extra services or damage</li>
                </ul>
              </section>

              {/* Section C: Attractions */}
              <section id="attractions" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">C. Attractions</h2>
                <p className="text-gray-700 mb-4">
                  For attraction bookings (tours, activities, experiences), please note:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tickets are typically non-refundable unless otherwise stated</li>
                  <li>Some attractions require advance booking</li>
                  <li>Age restrictions may apply for certain activities</li>
                  <li>Weather conditions may affect outdoor activities</li>
                </ul>
              </section>

              {/* Section D: Car rentals */}
              <section id="car-rentals" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">D. Car rentals</h2>
                <p className="text-gray-700 mb-4">
                  For car rental bookings:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>A valid driving license is required</li>
                  <li>Age restrictions apply (typically 21-75 years)</li>
                  <li>A credit card is usually required for the security deposit</li>
                  <li>Insurance options vary by supplier</li>
                  <li>Fuel policies differ by rental company</li>
                </ul>
              </section>

              {/* Section E: Flights */}
              <section id="flights" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">E. Flights</h2>
                <p className="text-gray-700 mb-4">
                  For flight bookings:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tickets are subject to the airline&apos;s terms and conditions</li>
                  <li>Baggage allowances and fees vary by airline and fare class</li>
                  <li>Schedule changes may occur and are subject to airline policies</li>
                  <li>Cancellation and refund policies are set by the airline</li>
                  <li>Passport and visa requirements are the passenger&apos;s responsibility</li>
                </ul>
              </section>

              {/* Section F: Transport */}
              <section id="transport" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">F. Transport (Taxis, Airport Transfers)</h2>
                <p className="text-gray-700 mb-4">
                  For taxi and transport bookings:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Prices are fixed at the time of booking</li>
                  <li>Waiting time charges may apply for delays</li>
                  <li>Vehicle types may vary based on availability</li>
                  <li>Flight tracking is included for airport pickups</li>
                </ul>
              </section>

              {/* Footer links */}
              <div className="border-t pt-6 mt-10">
                <h3 className="font-bold text-gray-900 mb-3">Related documents</h3>
                <div className="flex flex-wrap gap-4">
                  <Link to="/privacy" className="text-booking-blue hover:underline">Privacy Notice</Link>
                  <Link to="/cookie-settings" className="text-booking-blue hover:underline">Cookie settings</Link>
                  <Link to="/how-we-work" className="text-booking-blue hover:underline">How we work</Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
