import { useState } from 'react';
import { Link } from 'react-router-dom';

type TabType = 'overview' | 'travellers' | 'partners' | 'guidelines';

export default function TrustSafetyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-white/80 hover:text-white">Home</Link>
            <span className="text-white/60">&gt;</span>
            <Link to="/help" className="text-white/80 hover:text-white">Help Centre</Link>
            <span className="text-white/60">&gt;</span>
            <span className="text-white">Trust and Safety Resource Center</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-2">Trust and Safety Resource Center</h1>
          <p className="text-white/90 text-lg">
            Your safety is our priority. Learn how we protect you and your guests.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'travellers', label: 'Travellers' },
              { id: 'partners', label: 'Partners' },
              { id: 'guidelines', label: 'Guidelines' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-booking-blue text-booking-blue'
                    : 'border-transparent text-neutral-600 hover:text-booking-blue'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                  Safe travels start here
                </h2>
                <p className="text-neutral-600 mb-6">
                  At TravelHub, we&apos;re committed to creating a safe environment for everyone.
                  Our Trust and Safety team works around the clock to ensure your experience is secure and enjoyable.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('travellers')}
                    className="px-6 py-3 bg-booking-blue text-white font-bold rounded hover:bg-booking-blue-hover transition-colors"
                  >
                    Stay safely
                  </button>
                  <button
                    onClick={() => setActiveTab('partners')}
                    className="px-6 py-3 border border-booking-blue text-booking-blue font-bold rounded hover:bg-booking-blue hover:text-white transition-colors"
                  >
                    Host safely
                  </button>
                </div>
              </div>
              <div className="bg-booking-blue/5 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-booking-blue mx-auto mb-4">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                  Your safety matters
                </h3>
                <p className="text-neutral-600">
                  Over 1.5 million stays are booked on our platform every day. We take your safety seriously.
                </p>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">
                Our values and guidelines
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-booking-blue">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-neutral-800 mb-2">Trust</h3>
                  <p className="text-sm text-neutral-600">
                    We build trust through transparency and verified reviews from real guests.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-booking-blue">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-neutral-800 mb-2">Safety</h3>
                  <p className="text-sm text-neutral-600">
                    We maintain rigorous safety standards and respond quickly to any concerns.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-booking-blue">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-neutral-800 mb-2">Community</h3>
                  <p className="text-sm text-neutral-600">
                    We foster a respectful community where everyone is welcome.
                  </p>
                </div>
              </div>
            </div>

            {/* If Something Goes Wrong */}
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">If something goes wrong</h2>
              <p className="text-neutral-600 mb-6">
                We&apos;re here to help 24/7. If you encounter any safety concerns during your stay, contact us immediately.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div className="w-12 h-12 bg-booking-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 mb-1">Emergency Contact</h3>
                    <p className="text-sm text-neutral-600 mb-2">For urgent safety concerns</p>
                    <p className="font-semibold text-booking-blue">+44 20 3320 2609</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div className="w-12 h-12 bg-booking-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 mb-1">Report a Concern</h3>
                    <p className="text-sm text-neutral-600 mb-2">For non-urgent issues</p>
                    <Link to="/dispute" className="font-semibold text-booking-blue hover:underline">
                      Submit a report
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Travellers Tab */}
        {activeTab === 'travellers' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Stay safely</h2>
              <p className="text-neutral-600 mb-6">
                Tips and resources to help ensure a safe and enjoyable trip.
              </p>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-bold text-neutral-800 mb-2">Before your trip</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Read reviews from previous guests carefully
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Verify the property details match your expectations
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Contact the property with any questions before booking
                    </li>
                  </ul>
                </div>
                <div className="border-b pb-6">
                  <h3 className="font-bold text-neutral-800 mb-2">During your stay</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Check emergency exits and safety equipment
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Keep your valuables secure
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Report any concerns to us immediately
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">Recognising scams</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-warning flex-shrink-0">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Never make payments outside of TravelHub
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-warning flex-shrink-0">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Be cautious of emails asking for personal information
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-warning flex-shrink-0">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Verify URLs start with booking.com
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Host safely</h2>
              <p className="text-neutral-600 mb-6">
                Resources to help you provide a safe experience for your guests.
              </p>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-bold text-neutral-800 mb-2">Property safety requirements</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Working smoke and carbon monoxide detectors
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Fire extinguisher readily available
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      First aid kit accessible
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Clear emergency exit routes
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">Guest verification</h3>
                  <p className="text-neutral-600">
                    TravelHub provides tools to help verify guest identities and protect your property.
                    Learn more about our verification process in the Partner Help Center.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Community guidelines</h2>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-600 mb-4">
                  Our community guidelines ensure that everyone on our platform can enjoy a safe,
                  respectful, and positive experience. These guidelines apply to all users, including
                  guests, hosts, and partners.
                </p>

                <h3 className="text-lg font-bold text-neutral-800 mt-6 mb-2">Respect and dignity</h3>
                <p className="text-neutral-600">
                  All users must treat each other with respect and dignity. Discrimination, harassment,
                  or offensive behavior based on race, ethnicity, nationality, religion, gender, sexual
                  orientation, or disability is strictly prohibited.
                </p>

                <h3 className="text-lg font-bold text-neutral-800 mt-6 mb-2">Honest communication</h3>
                <p className="text-neutral-600">
                  Provide accurate information in all listings and communications. Misleading descriptions,
                  fake reviews, or fraudulent activity will result in account suspension.
                </p>

                <h3 className="text-lg font-bold text-neutral-800 mt-6 mb-2">Safety first</h3>
                <p className="text-neutral-600">
                  Both guests and hosts should prioritize safety. Report any unsafe conditions,
                  suspicious activity, or emergencies immediately through our platform.
                </p>

                <h3 className="text-lg font-bold text-neutral-800 mt-6 mb-2">Legal compliance</h3>
                <p className="text-neutral-600">
                  All users must comply with local laws and regulations. Properties must meet
                  local safety and licensing requirements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
