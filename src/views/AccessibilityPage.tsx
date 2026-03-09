import { Link } from 'react-router-dom';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-booking-blue text-white py-8">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">Accessibility Statement</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold">Accessibility Statement</h1>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">On this page</h3>
              <nav className="space-y-2 text-sm">
                <a href="#commitment" className="block text-booking-blue hover:underline">Our commitment</a>
                <a href="#features" className="block text-booking-blue hover:underline">Accessibility features</a>
                <a href="#standards" className="block text-booking-blue hover:underline">Standards</a>
                <a href="#contact" className="block text-booking-blue hover:underline">Contact us</a>
                <a href="#property-accessibility" className="block text-booking-blue hover:underline">Property accessibility</a>
              </nav>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Related documents</h4>
                <div className="space-y-1 text-sm">
                  <Link to="/terms" className="block text-booking-blue hover:underline">Terms of Service</Link>
                  <Link to="/privacy" className="block text-booking-blue hover:underline">Privacy Notice</Link>
                  <Link to="/help" className="block text-booking-blue hover:underline">Help Centre</Link>
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

              {/* Our Commitment Section */}
              <section id="commitment" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our commitment to digital accessibility</h2>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <p className="text-gray-700">
                    At TravelHub, we are committed to ensuring that our website and mobile applications are accessible to everyone, including people with disabilities. We believe that travel should be available to all, and we continuously work to improve the digital experience for every user.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  We strive to provide an inclusive online experience that enables all users to access information, navigate our platform, and complete bookings independently. Our accessibility efforts are ongoing, and we regularly review and enhance our digital properties to meet the needs of our diverse user base.
                </p>

                <p className="text-gray-700">
                  We recognize that accessibility is not a one-time achievement but an ongoing commitment. Our team actively works to identify and address accessibility barriers, and we welcome feedback from our users to help us improve.
                </p>
              </section>

              {/* Accessibility Features Section */}
              <section id="features" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility features</h2>

                <p className="text-gray-700 mb-6">
                  We have implemented the following accessibility features across our platform to ensure a better experience for all users:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Keyboard navigation support</h3>
                      <p className="text-gray-600">All interactive elements on our website can be accessed and operated using a keyboard alone. Users can navigate through pages, forms, and menus using Tab, Enter, and arrow keys without requiring a mouse.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Screen reader compatibility</h3>
                      <p className="text-gray-600">Our platform is designed to work seamlessly with popular screen readers including JAWS, NVDA, and VoiceOver. We use semantic HTML, ARIA labels, and proper heading structures to ensure content is properly announced.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Alternative text for images</h3>
                      <p className="text-gray-600">All meaningful images on our website include descriptive alternative text (alt text) that conveys the purpose and content of the image to users who cannot see them. Decorative images are marked appropriately to be ignored by assistive technologies.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">High contrast mode support</h3>
                      <p className="text-gray-600">Our website is designed to maintain readability and functionality when users enable high contrast mode in their operating system or browser. We ensure sufficient color contrast ratios between text and backgrounds throughout the platform.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Resizable text</h3>
                      <p className="text-gray-600">Users can resize text up to 200% without loss of content or functionality. Our responsive design ensures that the layout adapts appropriately when text size is increased, maintaining readability and usability.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-booking-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Skip navigation links</h3>
                      <p className="text-gray-600">We provide skip navigation links at the top of each page, allowing keyboard and screen reader users to bypass repetitive navigation menus and jump directly to the main content of the page.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Standards Section */}
              <section id="standards" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Standards and compliance</h2>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">WCAG 2.1 Compliance</h3>
                  <p className="text-gray-700 mb-4">
                    We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines, developed by the World Wide Web Consortium (W3C), are internationally recognized standards for web accessibility.
                  </p>
                  <p className="text-gray-700">
                    WCAG 2.1 Level AA addresses the most common barriers for users with disabilities, including those with visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
                  </p>
                </div>

                <div className="border-l-4 border-booking-blue pl-4 mb-4">
                  <p className="text-gray-700">
                    <strong>Perceivable:</strong> Information and user interface components must be presentable to users in ways they can perceive.
                  </p>
                </div>

                <div className="border-l-4 border-booking-blue pl-4 mb-4">
                  <p className="text-gray-700">
                    <strong>Operable:</strong> User interface components and navigation must be operable by all users.
                  </p>
                </div>

                <div className="border-l-4 border-booking-blue pl-4 mb-4">
                  <p className="text-gray-700">
                    <strong>Understandable:</strong> Information and the operation of the user interface must be understandable.
                  </p>
                </div>

                <div className="border-l-4 border-booking-blue pl-4">
                  <p className="text-gray-700">
                    <strong>Robust:</strong> Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies.
                  </p>
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact us for accessibility feedback</h2>

                <p className="text-gray-700 mb-4">
                  We welcome your feedback on the accessibility of our website and services. If you encounter any accessibility barriers or have suggestions for improvement, please let us know.
                </p>

                <div className="bg-booking-blue/5 rounded-lg p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900">Accessibility Support Team</h3>
                      <p className="text-gray-700">TravelHub B.V.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Email:</h4>
                      <a href="mailto:accessibility@booking.com" className="text-booking-blue hover:underline">
                        accessibility@booking.com
                      </a>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Response time:</h4>
                      <p className="text-gray-600">
                        We aim to respond to accessibility feedback within 5 business days.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">
                  When contacting us about an accessibility issue, please provide as much detail as possible, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                  <li>The web page address (URL) where you encountered the issue</li>
                  <li>A description of the problem you experienced</li>
                  <li>The device, browser, and assistive technology you were using</li>
                  <li>Any error messages you received</li>
                </ul>
              </section>

              {/* Property Accessibility Section */}
              <section id="property-accessibility" className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Finding accessible properties</h2>

                <p className="text-gray-700 mb-4">
                  We understand that physical accessibility at your destination is just as important as digital accessibility. Our platform provides filters and information to help you find properties that meet your accessibility needs.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">How to find accessible accommodations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Use the &quot;Accessibility features&quot; filter in your search results</li>
                    <li>Look for properties with wheelchair accessibility indicated</li>
                    <li>Check the &quot;Facilities&quot; section on property pages for detailed accessibility information</li>
                    <li>Read guest reviews for real experiences from travelers with similar needs</li>
                    <li>Contact properties directly through our messaging system for specific accessibility questions</li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Common accessibility filters</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>- Wheelchair accessible</li>
                      <li>- Step-free access</li>
                      <li>- Accessible bathroom</li>
                      <li>- Roll-in shower</li>
                      <li>- Lowered sink</li>
                      <li>- Raised toilet</li>
                      <li>- Elevator access</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Additional resources</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>- Visual aids (braille, large print)</li>
                      <li>- Hearing aids (visual doorbell, vibrating alarm)</li>
                      <li>- Service animal friendly properties</li>
                      <li>- Ground floor rooms available</li>
                      <li>- Accessible parking</li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">
                  We encourage properties to provide detailed accessibility information, but we recommend contacting the property directly to confirm specific accessibility features before booking if you have particular requirements.
                </p>
              </section>

              {/* Footer links */}
              <div className="border-t pt-6 mt-10">
                <h3 className="font-bold text-gray-900 mb-3">Related documents</h3>
                <div className="flex flex-wrap gap-4">
                  <Link to="/terms" className="text-booking-blue hover:underline">Terms of Service</Link>
                  <Link to="/privacy" className="text-booking-blue hover:underline">Privacy Notice</Link>
                  <Link to="/help" className="text-booking-blue hover:underline">Help Centre</Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
