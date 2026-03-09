import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Countries', href: '/countries' },
  { label: 'Regions', href: '/regions' },
  { label: 'Cities', href: '/cities' },
  { label: 'Districts', href: '/districts' },
  { label: 'Airports', href: '/airports' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Holiday Homes', href: '/holiday-homes' },
  { label: 'Apartments', href: '/apartments' },
  { label: 'Resorts', href: '/resorts' },
  { label: 'Villas', href: '/villas' },
  { label: 'Hostels', href: '/hostels' },
  { label: 'B&Bs', href: '/bed-and-breakfast' },
  { label: 'Guest Houses', href: '/guest-houses' },
];

const footerSections = [
  {
    title: 'Support',
    links: [
      { label: 'Coronavirus (COVID-19) FAQs', href: '/help/covid' },
      { label: 'Manage your trips', href: '/trips' },
      { label: 'Contact Customer Service', href: '/help/contact' },
      { label: 'Safety resource centre', href: '/help/safety' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Genius loyalty programme', href: '/genius' },
      { label: 'Seasonal and holiday deals', href: '/deals' },
      { label: 'Travel articles', href: '/articles' },
      { label: 'TravelHub for Business', href: '/business' },
      { label: 'Traveller Review Awards', href: '/awards' },
      { label: 'Car hire', href: '/cars' },
      { label: 'Flight finder', href: '/flights' },
      { label: 'Restaurant reservations', href: '/restaurants' },
      { label: 'TravelHub for Travel Agents', href: '/agents' },
    ],
  },
  {
    title: 'Terms and settings',
    links: [
      { label: 'Privacy Notice', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility Statement', href: '/accessibility' },
      { label: 'Dispute resolution', href: '/dispute' },
      { label: 'Modern Slavery Statement', href: '/modern-slavery' },
      { label: 'Human Rights Statement', href: '/human-rights' },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Extranet login', href: '/extranet' },
      { label: 'Partner help', href: '/partner-help' },
      { label: 'List your property', href: '/list-property' },
      { label: 'Become an affiliate', href: '/affiliate' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About TravelHub', href: '/about' },
      { label: 'How we work', href: '/how-we-work' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Press centre', href: '/press' },
      { label: 'Careers', href: '/careers' },
      { label: 'Investor relations', href: '/investors' },
      { label: 'Corporate contact', href: '/corporate' },
    ],
  },
];

const partnerBrands = [
  { name: 'TravelHub', url: '/' },
  { name: 'Priceline.com', url: 'https://www.priceline.com' },
  { name: 'Kayak', url: 'https://www.kayak.com' },
  { name: 'Agoda', url: 'https://www.agoda.com' },
  { name: 'OpenTable', url: 'https://www.opentable.com' },
];

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* Quick Links Section */}
      <div className="bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-container-lg mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            {quickLinks.map((link, index) => (
              <span key={link.label} className="flex items-center">
                <Link
                  to={link.href}
                  className="text-booking-blue-light text-sm hover:underline"
                >
                  {link.label}
                </Link>
                {index < quickLinks.length - 1 && (
                  <span className="text-neutral-400 mx-1">.</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-bold text-sm mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-white/80 text-sm hover:text-white hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Partner Brands */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm text-center mb-4">
              TravelHub is your comprehensive travel booking platform for flights, hotels, cars, and more.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              {partnerBrands.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-24 h-8 bg-white/10 rounded text-white/80 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
                  title={brand.name}
                >
                  {brand.name}
                </a>
              ))}
            </div>
            <p className="text-white/60 text-sm text-center">
              &copy; 2026 TravelHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
