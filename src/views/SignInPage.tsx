import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stateApi } from '@/api/client';

// Extended language list for the sign-in page (47+ languages)
const languages = [
  { code: 'en-gb', name: 'English (UK)', flag: 'GB' },
  { code: 'en-us', name: 'English (US)', flag: 'US' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
  { code: 'nl', name: 'Nederlands', flag: 'NL' },
  { code: 'fr', name: 'Francais', flag: 'FR' },
  { code: 'es', name: 'Espanol', flag: 'ES' },
  { code: 'es-ar', name: 'Espanol (AR)', flag: 'AR' },
  { code: 'es-mx', name: 'Espanol (MX)', flag: 'MX' },
  { code: 'ca', name: 'Catala', flag: 'ES' },
  { code: 'it', name: 'Italiano', flag: 'IT' },
  { code: 'pt', name: 'Portugues', flag: 'PT' },
  { code: 'pt-br', name: 'Portugues (BR)', flag: 'BR' },
  { code: 'no', name: 'Norsk', flag: 'NO' },
  { code: 'fi', name: 'Suomi', flag: 'FI' },
  { code: 'sv', name: 'Svenska', flag: 'SE' },
  { code: 'da', name: 'Dansk', flag: 'DK' },
  { code: 'cs', name: 'Cestina', flag: 'CZ' },
  { code: 'hu', name: 'Magyar', flag: 'HU' },
  { code: 'ro', name: 'Romana', flag: 'RO' },
  { code: 'ja', name: 'Japanese', flag: 'JP' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', flag: 'CN' },
  { code: 'zh-tw', name: 'Chinese (Traditional)', flag: 'TW' },
  { code: 'pl', name: 'Polski', flag: 'PL' },
  { code: 'el', name: 'Greek', flag: 'GR' },
  { code: 'ru', name: 'Russian', flag: 'RU' },
  { code: 'tr', name: 'Turkce', flag: 'TR' },
  { code: 'bg', name: 'Bulgarian', flag: 'BG' },
  { code: 'ar', name: 'Arabic', flag: 'SA' },
  { code: 'ko', name: 'Korean', flag: 'KR' },
  { code: 'he', name: 'Hebrew', flag: 'IL' },
  { code: 'lv', name: 'Latvian', flag: 'LV' },
  { code: 'uk', name: 'Ukrainian', flag: 'UA' },
  { code: 'id', name: 'Indonesian', flag: 'ID' },
  { code: 'ms', name: 'Malay', flag: 'MY' },
  { code: 'th', name: 'Thai', flag: 'TH' },
  { code: 'et', name: 'Estonian', flag: 'EE' },
  { code: 'hr', name: 'Croatian', flag: 'HR' },
  { code: 'lt', name: 'Lithuanian', flag: 'LT' },
  { code: 'sk', name: 'Slovak', flag: 'SK' },
  { code: 'sr', name: 'Serbian', flag: 'RS' },
  { code: 'sl', name: 'Slovenian', flag: 'SI' },
  { code: 'vi', name: 'Vietnamese', flag: 'VN' },
  { code: 'tl', name: 'Filipino', flag: 'PH' },
  { code: 'is', name: 'Icelandic', flag: 'IS' },
  { code: 'hi', name: 'Hindi', flag: 'IN' },
  { code: 'bn', name: 'Bengali', flag: 'BD' },
  { code: 'mk', name: 'Macedonian', flag: 'MK' },
];

// Flag emoji helper
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

type OAuthProvider = 'google' | 'apple' | 'facebook' | null;

const providerConfig = {
  google: {
    name: 'Google',
    color: '#4285F4',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  apple: {
    name: 'Apple',
    color: '#000000',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
};

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-gb');
  const [showOAuthPopup, setShowOAuthPopup] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<OAuthProvider>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowVerification(true);
      setCountdown(60);
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleCodeChange = async (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Check if complete
    if (newCode.every((c) => c) && newCode.join('').length === 6) {
      // Persist authentication state and navigate
      try {
        await stateApi.patchState({
          auth: {
            isAuthenticated: true,
            provider: 'email',
            email: email,
            authenticatedAt: new Date().toISOString(),
          },
        }, 'Authenticated via email verification');
      } catch (error) {
        console.error('Failed to save auth state:', error);
      }
      navigate('/');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const requestNewCode = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOAuthClick = (provider: OAuthProvider) => {
    setOauthProvider(provider);
    setShowOAuthPopup(true);
    setIsAuthenticating(false);
  };

  const handleOAuthContinue = async () => {
    setIsAuthenticating(true);
    // Simulate OAuth authentication and persist to backend
    try {
      await stateApi.patchState({
        auth: {
          isAuthenticated: true,
          provider: oauthProvider,
          email: `user@${oauthProvider}.com`,
          authenticatedAt: new Date().toISOString(),
        },
      }, `Authenticated via ${oauthProvider} OAuth`);
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }

    setTimeout(() => {
      setShowOAuthPopup(false);
      setIsAuthenticating(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-booking-blue py-4">
        <div className="max-w-container-lg mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold">
            TravelHub
          </Link>
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <button
              onClick={() => setShowLanguageModal(true)}
              className="text-white text-sm hover:bg-booking-blue-hover px-3 py-2 rounded flex items-center gap-2"
              aria-label="Select language"
            >
              <span className="text-lg">{getFlagEmoji(languages.find(l => l.code === selectedLanguage)?.flag || 'GB')}</span>
              <span>{languages.find(l => l.code === selectedLanguage)?.name || 'English (UK)'}</span>
            </button>
            <Link
              to="/help"
              className="text-white text-sm hover:underline flex items-center gap-1 px-3 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
              Help and support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-card p-8 max-w-md w-full">
          {!showVerification ? (
            <>
              <h1 className="text-2xl font-bold text-neutral-800 mb-6">
                Sign in or create an account
              </h1>
              <form onSubmit={handleEmailSubmit}>
                <label className="block mb-4">
                  <span className="text-sm font-medium text-neutral-700">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1 w-full px-4 py-3 border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="w-full bg-booking-blue-light text-white font-bold py-3 rounded hover:bg-booking-blue transition-colors"
                >
                  Continue with email
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-neutral-500 text-sm">or use one of these options</span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* Social Login Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuthClick('google')}
                  className="w-full flex items-center justify-center gap-3 p-3 border border-neutral-200 rounded hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-medium">Sign in with Google</span>
                </button>
                <button
                  onClick={() => handleOAuthClick('apple')}
                  className="w-full flex items-center justify-center gap-3 p-3 border border-neutral-200 rounded hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span className="font-medium">Sign in with Apple</span>
                </button>
                <button
                  onClick={() => handleOAuthClick('facebook')}
                  className="w-full flex items-center justify-center gap-3 p-3 border border-neutral-200 rounded hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span className="font-medium">Sign in with Facebook</span>
                </button>
              </div>

              <p className="text-xs text-neutral-500 text-center">
                By signing in or creating an account, you agree with our{' '}
                <Link to="/terms" className="text-booking-blue-light hover:underline">Terms & conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-booking-blue-light hover:underline">Privacy statement</Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowVerification(false)}
                className="flex items-center gap-2 text-booking-blue-light hover:underline mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to sign in
              </button>

              <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                Verify your email address to sign in
              </h1>
              <p className="text-neutral-600 mb-6">
                We&apos;ve sent a verification code to <strong>{email}</strong>
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border border-neutral-200 rounded focus:outline-none focus:border-booking-blue-light"
                  />
                ))}
              </div>

              <button
                disabled={!verificationCode.every((c) => c)}
                onClick={async () => {
                  // Persist authentication state and navigate
                  try {
                    await stateApi.patchState({
                      auth: {
                        isAuthenticated: true,
                        provider: 'email',
                        email: email,
                        authenticatedAt: new Date().toISOString(),
                      },
                    }, 'Authenticated via email verification');
                  } catch (error) {
                    console.error('Failed to save auth state:', error);
                  }
                  navigate('/');
                }}
                className={`w-full py-3 rounded font-bold mb-4 transition-colors ${
                  verificationCode.every((c) => c)
                    ? 'bg-booking-blue-light text-white hover:bg-booking-blue'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Verify email
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-neutral-500 text-sm">
                    Request another code in {countdown}s
                  </p>
                ) : (
                  <button
                    onClick={requestNewCode}
                    className="text-booking-blue-light hover:underline text-sm"
                  >
                    Request another code
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-booking-blue py-4">
        <div className="max-w-container-lg mx-auto px-4 text-center text-white/60 text-sm">
          &copy; 1996-2026 TravelHub&trade;. All rights reserved.
        </div>
      </footer>

      {/* Language Modal */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowLanguageModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-neutral-800">Select your language</h2>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-full"
                aria-label="Close the list of languages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-neutral-600">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`p-3 rounded text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 ${
                    selectedLanguage === lang.code ? 'bg-blue-50 border border-booking-blue' : 'border border-transparent'
                  }`}
                >
                  <span className="text-xl">{getFlagEmoji(lang.flag)}</span>
                  <span className={`flex-1 ${selectedLanguage === lang.code ? 'font-medium text-booking-blue' : 'text-neutral-700'}`}>
                    {lang.name}
                  </span>
                  {selectedLanguage === lang.code && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-booking-blue">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OAuth Popup Modal */}
      {showOAuthPopup && oauthProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              {providerConfig[oauthProvider].icon}
            </div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">
              Sign in with {providerConfig[oauthProvider].name}
            </h2>
            <p className="text-neutral-600 text-sm mb-6">
              {isAuthenticating
                ? `Connecting to ${providerConfig[oauthProvider].name}...`
                : `You'll be redirected to ${providerConfig[oauthProvider].name} to complete your sign-in.`
              }
            </p>

            {isAuthenticating ? (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-booking-blue"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleOAuthContinue}
                  style={{ backgroundColor: providerConfig[oauthProvider].color }}
                  className="w-full text-white font-bold py-3 rounded hover:opacity-90 transition-opacity"
                >
                  Continue with {providerConfig[oauthProvider].name}
                </button>
                <button
                  onClick={() => setShowOAuthPopup(false)}
                  className="w-full text-neutral-600 font-medium py-2 hover:text-neutral-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            <p className="text-xs text-neutral-500 mt-4">
              Your {providerConfig[oauthProvider].name} account information will be used to sign in to your TravelHub account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
