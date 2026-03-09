import { Link } from 'react-router-dom';

export default function HowWeWorkPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-booking-blue text-white py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>&gt;</li>
              <li className="text-white">How we work</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-bold mb-4">How TravelHub works</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            We connect travellers with the world&apos;s largest selection of incredible places to stay,
            including everything from apartments, vacation homes, and family-run B&Bs to 5-star
            luxury resorts, tree houses, and even igloos.
          </p>
        </div>
      </div>

      {/* Our Business Model */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our business model</h2>
              <p className="text-gray-600 mb-4">
                TravelHub is a platform that connects accommodation providers with travellers.
                We don&apos;t own any properties ourselves - instead, we partner with millions of
                accommodation providers worldwide to offer you the widest selection possible.
              </p>
              <p className="text-gray-600 mb-4">
                When you book through TravelHub, we charge accommodation providers a commission
                for each reservation made through our platform. This means you don&apos;t pay any extra
                fees for using TravelHub - you pay the same price as booking directly in most cases.
              </p>
              <p className="text-gray-600">
                Our revenue allows us to invest in technology, customer service, and marketing to
                help connect travellers with the perfect place to stay.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">By the numbers</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-gray-600">Properties worldwide</span>
                  <span className="text-2xl font-bold text-booking-blue">28M+</span>
                </div>
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-gray-600">Countries & territories</span>
                  <span className="text-2xl font-bold text-booking-blue">226</span>
                </div>
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-gray-600">Guest reviews</span>
                  <span className="text-2xl font-bold text-booking-blue">300M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily bookings</span>
                  <span className="text-2xl font-bold text-booking-blue">1.5M+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Ranking */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How search results are ranked</h2>
            <p className="text-gray-600 mb-6">
              When you search on TravelHub, we use an algorithm that considers multiple factors
              to display results. Here&apos;s what influences the order of search results:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Relevance to your search</h4>
                  <p className="text-sm text-gray-600">Properties that match your search criteria (dates, guests, location) are prioritised.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Guest reviews</h4>
                  <p className="text-sm text-gray-600">Properties with higher review scores and more reviews tend to rank higher.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Booking history</h4>
                  <p className="text-sm text-gray-600">Properties that perform well and have good conversion rates may rank higher.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Commission rates</h4>
                  <p className="text-sm text-gray-600">Properties that pay higher commission may receive a boost in visibility.</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded">
              <strong>Note:</strong> You can always use our filters and sorting options to find
              the property that best suits your needs. Sort by price, rating, or distance to see
              results in a different order.
            </p>
          </div>

          {/* Preferred Partner Programme */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferred Partner Programme</h2>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Preferred Partner
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Properties in our Preferred Partner Programme pay a higher commission rate in exchange
              for better visibility in our search results. These properties are marked with a
              &quot;Preferred&quot; badge.
            </p>
            <p className="text-gray-600">
              Preferred Partners generally:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-600">
              <li>Offer competitive prices</li>
              <li>Have excellent guest reviews</li>
              <li>Maintain high booking confirmation rates</li>
              <li>Provide reliable availability information</li>
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How reviews work</h2>
            <p className="text-gray-600 mb-4">
              Guest reviews are one of the most important factors when choosing where to stay.
              Here&apos;s how our review system works:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900">Only verified guests</h4>
                  <p className="text-sm text-gray-600">Only guests who have completed their stay can leave a review.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900">No editing by properties</h4>
                  <p className="text-sm text-gray-600">Property owners cannot edit or delete guest reviews.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900">All reviews visible</h4>
                  <p className="text-sm text-gray-600">Both positive and negative reviews are published (within our guidelines).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900">Category ratings</h4>
                  <p className="text-sm text-gray-600">Guests rate specific aspects: cleanliness, comfort, location, facilities, staff, and value for money.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-booking-blue/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about how TravelHub works or want to provide feedback,
              we&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/help"
                className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors inline-flex items-center gap-2"
              >
                Visit Help Centre
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                About TravelHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
