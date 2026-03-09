import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-8">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Privacy Notice</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold">Privacy Notice for Travellers</h1>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">On this page</h3>
              <nav className="space-y-2 text-sm">
                <a href="#what-we-collect" className="block text-booking-blue hover:underline">Personal data we collect</a>
                <a href="#how-we-use" className="block text-booking-blue hover:underline">How we use your data</a>
                <a href="#sharing" className="block text-booking-blue hover:underline">How we share data</a>
                <a href="#your-rights" className="block text-booking-blue hover:underline">Your rights</a>
                <a href="#cookies" className="block text-booking-blue hover:underline">Cookies & tracking</a>
                <a href="#data-protection" className="block text-booking-blue hover:underline">How we protect data</a>
                <a href="#contact" className="block text-booking-blue hover:underline">Contact us</a>
              </nav>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Related documents</h4>
                <div className="space-y-1 text-sm">
                  <Link to="/terms" className="block text-booking-blue hover:underline">Terms of Service</Link>
                  <a href="#cookies" className="block text-booking-blue hover:underline">Cookie Policy</a>
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

              <p className="text-gray-700 mb-6">
                This Privacy Notice describes how TravelHub B.V. (referred to as &quot;TravelHub&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) processes personal data relating to your use of our services.
              </p>

              {/* Section 1: Personal data we collect */}
              <section id="what-we-collect" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal data we collect and process</h2>

                <p className="text-gray-700 mb-4">
                  We collect personal data that you provide to us directly and data generated through your use of our services. This includes:
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">Information you provide</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Identity data:</strong> Name, date of birth, gender, nationality</li>
                    <li><strong>Contact data:</strong> Email address, phone number, postal address</li>
                    <li><strong>Payment data:</strong> Credit/debit card numbers, bank account details, billing address</li>
                    <li><strong>Travel documents:</strong> Passport number, ID card details, visa information</li>
                    <li><strong>Preferences:</strong> Language preferences, currency, accommodation preferences</li>
                    <li><strong>Communications:</strong> Messages, reviews, survey responses</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Information we collect automatically</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Device data:</strong> IP address, device type, operating system, browser type</li>
                    <li><strong>Usage data:</strong> Pages visited, searches performed, bookings made</li>
                    <li><strong>Location data:</strong> General location based on IP address</li>
                    <li><strong>Cookie data:</strong> Information collected via cookies and similar technologies</li>
                  </ul>
                </div>
              </section>

              {/* Section 2: How we use data */}
              <section id="how-we-use" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Purposes of collecting and processing your personal data</h2>

                <p className="text-gray-700 mb-4">We use your personal data for the following purposes:</p>

                <div className="space-y-4">
                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Trip reservations</h3>
                    <p className="text-gray-600">To process your bookings for accommodations, flights, car rentals, and other travel services.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Customer service</h3>
                    <p className="text-gray-600">To provide support, respond to your inquiries, and handle complaints.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">User accounts</h3>
                    <p className="text-gray-600">To create and manage your user account and provide personalized services.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Marketing and communications</h3>
                    <p className="text-gray-600">To send promotional materials, newsletters, and personalized offers (with your consent).</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Market research</h3>
                    <p className="text-gray-600">To conduct surveys and analyze trends to improve our services.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Improving services</h3>
                    <p className="text-gray-600">To enhance user experience, develop new features, and optimize our platform.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Pricing and offers</h3>
                    <p className="text-gray-600">To provide personalized pricing and promotional offers based on your preferences.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Reviews</h3>
                    <p className="text-gray-600">To display guest reviews and ratings to help other travelers.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Call monitoring</h3>
                    <p className="text-gray-600">To record calls for quality assurance and training purposes.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Fraud prevention</h3>
                    <p className="text-gray-600">To detect and prevent fraudulent activities and protect our users.</p>
                  </div>

                  <div className="border-l-4 border-booking-blue pl-4">
                    <h3 className="font-bold text-gray-900">Legal purposes</h3>
                    <p className="text-gray-600">To comply with legal obligations and enforce our terms of service.</p>
                  </div>
                </div>
              </section>

              {/* Section 3: How we share data */}
              <section id="sharing" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How we share personal data with third parties</h2>

                <p className="text-gray-700 mb-4">We may share your personal data with the following categories of recipients:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Trip providers</h3>
                    <p className="text-gray-600 text-sm">Hotels, airlines, car rental companies, and other travel service providers to fulfill your bookings.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Strategic partners</h3>
                    <p className="text-gray-600 text-sm">Affiliated companies within our corporate group and business partners who offer complementary services.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Connectivity providers</h3>
                    <p className="text-gray-600 text-sm">Third parties who help connect our platform with travel service providers.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Service providers</h3>
                    <p className="text-gray-600 text-sm">Companies that help us with payment processing, customer service, marketing, and analytics.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Professional third parties</h3>
                    <p className="text-gray-600 text-sm">Lawyers, accountants, auditors, and other professional advisors.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Competent authorities</h3>
                    <p className="text-gray-600 text-sm">Government agencies, law enforcement, and regulatory bodies when required by law.</p>
                  </div>
                </div>
              </section>

              {/* Section 4: Your rights */}
              <section id="your-rights" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your rights</h2>

                <p className="text-gray-700 mb-4">
                  Under the General Data Protection Regulation (GDPR) and other applicable data protection laws, you have the following rights:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right of Access</h3>
                      <p className="text-gray-600">You can request a copy of the personal data we hold about you.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right of Correction</h3>
                      <p className="text-gray-600">You can request that we correct inaccurate or incomplete personal data.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right of Erasure</h3>
                      <p className="text-gray-600">You can request that we delete your personal data in certain circumstances.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right of Restriction</h3>
                      <p className="text-gray-600">You can request that we restrict the processing of your personal data.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right of Portability</h3>
                      <p className="text-gray-600">You can request to receive your personal data in a portable format.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right to Withdraw Consent</h3>
                      <p className="text-gray-600">You can withdraw your consent for data processing at any time.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-booking-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Right to Object</h3>
                      <p className="text-gray-600">You can object to processing of your personal data for direct marketing purposes.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Cookies */}
              <section id="cookies" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How we use cookies & other tracking technologies</h2>

                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience and provide personalized services. The types of cookies we use include:
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Functional cookies</h3>
                    <p className="text-gray-600">Essential for the website to function properly. These cannot be disabled.</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Analytical cookies</h3>
                    <p className="text-gray-600">Help us understand how visitors interact with our website to improve user experience.</p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Marketing cookies</h3>
                    <p className="text-gray-600">Used to deliver personalized advertisements and measure their effectiveness.</p>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">
                  You can manage your cookie preferences through your browser settings. Note that disabling certain cookies may affect your experience on our platform.
                </p>
              </section>

              {/* Section 6: Data protection */}
              <section id="data-protection" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How we protect personal data</h2>

                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Data retention</h3>
                  <p className="text-gray-700">
                    We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. The retention period may vary depending on the context and nature of the data.
                  </p>
                </div>
              </section>

              {/* Section 7: Contact */}
              <section id="contact" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact us</h2>

                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Notice or wish to exercise your rights, you can contact us at:
                </p>

                <div className="bg-booking-blue/5 rounded-lg p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900">Data Protection Office</h3>
                      <p className="text-gray-700">TravelHub B.V.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Email:</h4>
                      <a href="mailto:dataprotectionoffice@booking.com" className="text-booking-blue hover:underline">
                        dataprotectionoffice@booking.com
                      </a>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Address:</h4>
                      <p className="text-gray-600">
                        Oosterdokskade 163<br />
                        1011 DL Amsterdam<br />
                        The Netherlands
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Data Subject Request:</h4>
                      <Link to="/dispute" className="text-booking-blue hover:underline">
                        Submit a data subject request form
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer links */}
              <div className="border-t pt-6 mt-10">
                <h3 className="font-bold text-gray-900 mb-3">Related documents</h3>
                <div className="flex flex-wrap gap-4">
                  <Link to="/terms" className="text-booking-blue hover:underline">Terms of Service</Link>
                  <a href="#cookies" className="text-booking-blue hover:underline">Cookie Policy</a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
