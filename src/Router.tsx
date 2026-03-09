import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './views/HomePage';
import FlightsPage from './views/FlightsPage';
import FlightSearchResultsPage from './views/FlightSearchResultsPage';
import FlightDetailPage from './views/FlightDetailPage';
import CarsPage from './views/CarsPage';
import CarSearchResultsPage from './views/CarSearchResultsPage';
import CarCheckoutPage from './views/CarCheckoutPage';
import AttractionsPage from './views/AttractionsPage';
import AttractionsSearchResultsPage from './views/AttractionsSearchResultsPage';
import AttractionDetailPage from './views/AttractionDetailPage';
import AttractionsCheckoutPage from './views/AttractionsCheckoutPage';
import AirportTaxisPage from './views/AirportTaxisPage';
import AirportTaxisSearchResultsPage from './views/AirportTaxisSearchResultsPage';
import AirportTaxiCheckoutPage from './views/AirportTaxiCheckoutPage';
import FlightHotelPage from './views/FlightHotelPage';
import FlightHotelSearchResultsPage from './views/FlightHotelSearchResultsPage';
import FlightHotelCheckoutPage from './views/FlightHotelCheckoutPage';
import SignInPage from './views/SignInPage';
import RegisterPage from './views/RegisterPage';
import HelpPage from './views/HelpPage';
import SearchResultsPage from './views/SearchResultsPage';
import ListPropertyPage from './views/ListPropertyPage';
import PropertyDetailPage from './views/PropertyDetailPage';
import CheckoutPage from './views/CheckoutPage';
import FlightCheckoutPage from './views/FlightCheckoutPage';
import HolidayRentalsPage from './views/HolidayRentalsPage';
import LondonCityPage from './views/LondonCityPage';
import CityPage from './views/CityPage';
import UKHotelsPage from './views/UKHotelsPage';
import CountryHotelsPage from './views/CountryHotelsPage';
import GreaterLondonPage from './views/GreaterLondonPage';
import RegionPage from './views/RegionPage';
import DisputeResolutionPage from './views/DisputeResolutionPage';
import TrustSafetyPage from './views/TrustSafetyPage';
import ManageTripsPage from './views/ManageTripsPage';
import GeniusPage from './views/GeniusPage';
import DealsPage from './views/DealsPage';
import CountriesPage from './views/CountriesPage';
import RegionsPage from './views/RegionsPage';
import CitiesPage from './views/CitiesPage';
import PrivacyPolicyPage from './views/PrivacyPolicyPage';
import TermsPage from './views/TermsPage';
import DistrictsPage from './views/DistrictsPage';
import AirportsPage from './views/AirportsPage';
import HotelsPage from './views/HotelsPage';
import HolidayHomesPage from './views/HolidayHomesPage';
import ApartmentsPage from './views/ApartmentsPage';
import ResortsPage from './views/ResortsPage';
import VillasPage from './views/VillasPage';
import HostelsPage from './views/HostelsPage';
import BedAndBreakfastPage from './views/BedAndBreakfastPage';
import GuestHousesPage from './views/GuestHousesPage';
import TravelArticlesPage from './views/TravelArticlesPage';
import CookieSettingsPage from './views/CookieSettingsPage';
import HowWeWorkPage from './views/HowWeWorkPage';
import PropertyTypeSearchPage from './views/PropertyTypeSearchPage';
import AboutPage from './views/AboutPage';
import AccessibilityPage from './views/AccessibilityPage';
import CareersPage from './views/CareersPage';
import BusinessPage from './views/BusinessPage';
import ExtranetPage from './views/ExtranetPage';
import SustainabilityPage from './views/SustainabilityPage';
import RestaurantsPage from './views/RestaurantsPage';
import ModernSlaveryPage from './views/ModernSlaveryPage';
import HumanRightsPage from './views/HumanRightsPage';
import CovidFaqPage from './views/CovidFaqPage';
import AffiliatePage from './views/AffiliatePage';
import PartnerHelpPage from './views/PartnerHelpPage';
import PressPage from './views/PressPage';
import InvestorsPage from './views/InvestorsPage';
import TravellerAwardsPage from './views/TravellerAwardsPage';
import TravelAgentsPage from './views/TravelAgentsPage';
import CorporateContactPage from './views/CorporateContactPage';

// Placeholder page for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="max-w-container-lg mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-neutral-800 mb-4">{title}</h1>
      <p className="text-neutral-600">This page is under construction.</p>
    </div>
  );
}

export default function Router() {
  const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);

  useEffect(() => {
    setRouter(
      createBrowserRouter([
        {
          path: '/',
          element: <Layout />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'flights', element: <FlightsPage /> },
            { path: 'flights/search', element: <FlightSearchResultsPage /> },
            { path: 'flights/detail', element: <FlightDetailPage /> },
            { path: 'flights/checkout', element: <FlightCheckoutPage /> },
            { path: 'cars', element: <CarsPage /> },
            { path: 'cars/search', element: <CarSearchResultsPage /> },
            { path: 'cars/checkout', element: <CarCheckoutPage /> },
            { path: 'attractions', element: <AttractionsPage /> },
            { path: 'attractions/index.en-gb.html', element: <AttractionsPage /> },
            { path: 'attractions/search', element: <AttractionsSearchResultsPage /> },
            { path: 'attractions/searchresults.en-gb.html', element: <AttractionsSearchResultsPage /> },
            { path: 'attractions/detail/:id', element: <AttractionDetailPage /> },
            { path: 'attractions/checkout', element: <AttractionsCheckoutPage /> },
            { path: 'airport-taxis', element: <AirportTaxisPage /> },
            { path: 'airport-taxis/search', element: <AirportTaxisSearchResultsPage /> },
            { path: 'airport-taxis/checkout', element: <AirportTaxiCheckoutPage /> },
            { path: 'flight-hotel', element: <FlightHotelPage /> },
            { path: 'flight-hotel/search', element: <FlightHotelSearchResultsPage /> },
            { path: 'flight-hotel/checkout', element: <FlightHotelCheckoutPage /> },
            { path: 'booking-home/index.en-gb.html', element: <HolidayRentalsPage /> },
            { path: 'holiday-rentals', element: <HolidayRentalsPage /> },
            { path: 'city/gb/london', element: <LondonCityPage /> },
            { path: 'city/gb/:cityId', element: <LondonCityPage /> },
            { path: 'country/gb', element: <UKHotelsPage /> },
            { path: 'region/gb/greater-london', element: <GreaterLondonPage /> },
            { path: 'region/gb/greater-london.en-gb.html', element: <GreaterLondonPage /> },
            { path: 'search', element: <SearchResultsPage /> },
            { path: 'hotel/:id', element: <PropertyDetailPage /> },
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'book', element: <CheckoutPage /> },
            { path: 'help', element: <HelpPage /> },
            { path: 'help/safety', element: <TrustSafetyPage /> },
            { path: 'help/contact', element: <HelpPage /> },
            { path: 'dispute', element: <DisputeResolutionPage /> },
            { path: 'trust-and-safety', element: <TrustSafetyPage /> },
            { path: 'list-property', element: <ListPropertyPage /> },
            { path: 'trips', element: <ManageTripsPage /> },
            { path: 'terms', element: <TermsPage /> },
            { path: 'privacy', element: <PrivacyPolicyPage /> },
            { path: 'genius', element: <GeniusPage /> },
            { path: 'deals', element: <DealsPage /> },
            { path: 'countries', element: <CountriesPage /> },
            { path: 'regions', element: <RegionsPage /> },
            { path: 'cities', element: <CitiesPage /> },
            { path: 'districts', element: <DistrictsPage /> },
            { path: 'airports', element: <AirportsPage /> },
            { path: 'hotels', element: <HotelsPage /> },
            { path: 'holiday-homes', element: <HolidayHomesPage /> },
            { path: 'apartments', element: <ApartmentsPage /> },
            { path: 'resorts', element: <ResortsPage /> },
            { path: 'villas', element: <VillasPage /> },
            { path: 'hostels', element: <HostelsPage /> },
            { path: 'bed-and-breakfast', element: <BedAndBreakfastPage /> },
            { path: 'guest-houses', element: <GuestHousesPage /> },
            { path: 'articles', element: <TravelArticlesPage /> },
            { path: 'articles/:articleId', element: <TravelArticlesPage /> },
            { path: 'country/:countryCode', element: <CountryHotelsPage /> },
            { path: 'region/:countryCode/:regionSlug', element: <RegionPage /> },
            { path: 'city/:countryCode/:citySlug', element: <CityPage /> },
            { path: 'cookie-settings', element: <CookieSettingsPage /> },
            { path: 'how-we-work', element: <HowWeWorkPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'accessibility', element: <AccessibilityPage /> },
            { path: 'careers', element: <CareersPage /> },
            { path: 'business', element: <BusinessPage /> },
            { path: 'extranet', element: <ExtranetPage /> },
            { path: 'sustainability', element: <SustainabilityPage /> },
            { path: 'restaurants', element: <RestaurantsPage /> },
            { path: 'modern-slavery', element: <ModernSlaveryPage /> },
            { path: 'human-rights', element: <HumanRightsPage /> },
            { path: 'help/covid', element: <CovidFaqPage /> },
            { path: 'affiliate', element: <AffiliatePage /> },
            { path: 'partner-help', element: <PartnerHelpPage /> },
            { path: 'press', element: <PressPage /> },
            { path: 'investors', element: <InvestorsPage /> },
            { path: 'awards', element: <TravellerAwardsPage /> },
            { path: 'agents', element: <TravelAgentsPage /> },
            { path: 'corporate', element: <CorporateContactPage /> },
            // Property type specific city search routes (e.g., /apartments/city/gb/london)
            { path: ':propertyType/city/:countryCode/:citySlug', element: <PropertyTypeSearchPage /> },
            { path: '*', element: <PlaceholderPage title="Page Not Found" /> },
          ],
        },
        // Pages without standard layout
        { path: '/sign-in', element: <SignInPage /> },
        { path: '/register', element: <RegisterPage /> },
      ])
    );
  }, []);

  if (!router) {
    return null;
  }

  return <RouterProvider router={router} />;
}
