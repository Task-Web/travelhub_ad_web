import { useState } from 'react';
import { Link } from 'react-router-dom';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export default function CookieSettingsPage() {
  const [cookieSettings, setCookieSettings] = useState<CookieCategory[]>([
    {
      id: 'necessary',
      name: 'Strictly Necessary Cookies',
      description: 'These cookies are essential for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
      required: true,
      enabled: true
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.',
      required: false,
      enabled: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
      required: false,
      enabled: true
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
      required: false,
      enabled: false
    },
    {
      id: 'social',
      name: 'Social Media Cookies',
      description: 'These cookies are set by a range of social media services that we have added to the site to enable you to share our content with your friends and networks.',
      required: false,
      enabled: false
    }
  ]);

  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setCookieSettings(prev =>
      prev.map(category =>
        category.id === id && !category.required
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
    setSaved(false);
  };

  const handleSavePreferences = () => {
    // In a real app, this would save to a cookie or backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    setCookieSettings(prev =>
      prev.map(category => ({ ...category, enabled: true }))
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectOptional = () => {
    setCookieSettings(prev =>
      prev.map(category =>
        category.required ? category : { ...category, enabled: false }
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-8">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li>&gt;</li>
              <li className="text-white">Cookie settings</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold">Cookie settings</h1>
          <p className="text-blue-100 mt-2">Manage your cookie preferences</p>
        </div>
      </div>

      <div className="max-w-container-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your device when you visit a website.
            They are widely used to make websites work more efficiently and provide information to
            the owners of the site.
          </p>
          <p className="text-gray-600">
            We use cookies to improve your experience on our website, including keeping you signed in,
            understanding how you use our website, and showing you content that is relevant to you.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick settings</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAcceptAll}
              className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors"
            >
              Accept all cookies
            </button>
            <button
              onClick={handleRejectOptional}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reject optional cookies
            </button>
          </div>
        </div>

        {/* Cookie Categories */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cookie categories</h2>

          <div className="space-y-6">
            {cookieSettings.map((category) => (
              <div key={category.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                      {category.required && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleToggle(category.id)}
                      disabled={category.required}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${category.enabled ? 'bg-booking-blue' : 'bg-gray-300'}
                        ${category.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${category.enabled ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors"
          >
            Save preferences
          </button>
          {saved && (
            <span className="text-green-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Preferences saved
            </span>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">More information</h2>
          <p className="text-gray-600 mb-4">
            For more information about how we use cookies and your personal data, please read our{' '}
            <Link to="/privacy" className="text-booking-blue hover:underline">Privacy Notice</Link>.
          </p>
          <p className="text-gray-600">
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@booking.com" className="text-booking-blue hover:underline">
              privacy@booking.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
