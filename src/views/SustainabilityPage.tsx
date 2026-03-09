import { Link } from 'react-router-dom';

export default function SustainabilityPage() {
  const goals = [
    {
      id: 'carbon-neutral',
      title: 'Carbon Neutral by 2030',
      description: 'We are committed to achieving carbon neutrality across all our operations by 2030, reducing our environmental footprint through renewable energy, efficient buildings, and sustainable business practices.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    },
    {
      id: 'sustainable-travel',
      title: 'Sustainable Travel Options',
      description: 'We help travellers find and book sustainable accommodations by highlighting properties that have taken meaningful steps to reduce their environmental impact.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      id: 'local-communities',
      title: 'Supporting Local Communities',
      description: 'We believe in tourism that benefits local communities. We partner with local businesses and support initiatives that preserve cultural heritage and create economic opportunities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      id: 'plastic-waste',
      title: 'Reducing Plastic Waste',
      description: 'We encourage our accommodation partners to eliminate single-use plastics and adopt sustainable alternatives, making travel cleaner for the planet.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
      ),
    },
  ];

  const travelerTips = [
    {
      id: 'choose-sustainable',
      title: 'Choose Sustainable Stays',
      description: 'Look for properties with the Travel Sustainable badge when booking. These accommodations have taken verified steps to be more sustainable.',
    },
    {
      id: 'reduce-footprint',
      title: 'Reduce Your Footprint',
      description: 'Opt for direct flights when possible, use public transport, and bring reusable water bottles and bags.',
    },
    {
      id: 'support-local',
      title: 'Support Local Businesses',
      description: 'Eat at local restaurants, buy from local artisans, and choose experiences that give back to communities.',
    },
    {
      id: 'conserve-resources',
      title: 'Conserve Resources',
      description: 'Reuse towels, turn off lights and AC when leaving your room, and take shorter showers.',
    },
    {
      id: 'respect-nature',
      title: 'Respect Nature and Wildlife',
      description: 'Stay on marked trails, do not disturb wildlife, and never buy products made from endangered species.',
    },
    {
      id: 'offset-carbon',
      title: 'Offset Your Carbon',
      description: 'Consider carbon offset programmes to compensate for the environmental impact of your travels.',
    },
  ];

  const progressMetrics = [
    { label: 'Properties with sustainability certifications', value: '500,000+' },
    { label: 'Properties displaying Travel Sustainable badge', value: '400,000+' },
    { label: 'Countries with sustainable options', value: '170+' },
    { label: 'Reduction in office carbon emissions since 2019', value: '40%' },
    { label: 'Renewable energy in our operations', value: '100%' },
  ];

  const badgeLevels = [
    {
      level: 'Level 1',
      description: 'Properties that have implemented foundational sustainability practices like energy-efficient lighting and water conservation.',
      color: 'bg-green-100 text-green-800',
    },
    {
      level: 'Level 2',
      description: 'Properties with more comprehensive sustainability measures including waste reduction and sustainable sourcing.',
      color: 'bg-green-200 text-green-800',
    },
    {
      level: 'Level 3',
      description: 'Industry-leading properties with advanced sustainability programmes and third-party certifications.',
      color: 'bg-green-300 text-green-900',
    },
  ];

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
              <li className="text-white">Sustainability</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sustainability at TravelHub</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Making it easier for everyone to experience the world more sustainably. Together, we can protect the destinations we love for generations to come.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Our Commitment Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to Sustainable Travel</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At TravelHub, we believe that travel has the power to transform lives, connect cultures, and create lasting memories. But we also recognise that tourism can have a significant impact on our planet and local communities.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              That&apos;s why we&apos;ve made sustainability a core part of our mission. We&apos;re committed to helping travellers make more sustainable choices, supporting our accommodation partners in their sustainability journey, and reducing our own environmental footprint.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We work with industry partners, environmental organisations, and local communities to develop and implement sustainable tourism practices that benefit everyone - travellers, hosts, and the planet.
            </p>
          </div>

          {/* Goals Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Sustainability Goals</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    {goal.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{goal.title}</h3>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Sustainable Badge Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Sustainable Badge</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our Travel Sustainable badge helps travellers easily identify properties that have made meaningful sustainability commitments. Properties earn the badge by implementing verified practices across key areas like energy efficiency, water conservation, waste reduction, and support for local communities.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">How Properties Earn the Badge</h3>
            <p className="text-gray-600 mb-6">
              Properties can earn different levels of the Travel Sustainable badge based on the extent of their sustainability practices:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {badgeLevels.map((level) => (
                <div key={level.level} className="border rounded-lg p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${level.color}`}>
                    {level.level}
                  </span>
                  <p className="text-gray-600 text-sm">{level.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">For Property Partners</h4>
              <p className="text-gray-600 mb-4">
                Want to earn the Travel Sustainable badge for your property? Complete the sustainability questionnaire in the extranet to showcase your sustainability efforts and attract eco-conscious travellers.
              </p>
              <Link
                to="/list-property"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Learn More About Listing Your Property
              </Link>
            </div>
          </div>

          {/* What You Can Do Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Can Do</h2>
            <p className="text-gray-600 mb-8">
              Every traveller can make a difference. Here are some ways you can travel more sustainably:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelerTips.map((tip) => (
                <div key={tip.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Progress</h2>
            <p className="text-gray-600 mb-8">
              We&apos;re making steady progress towards our sustainability goals. Here&apos;s where we stand:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressMetrics.map((metric, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-6 text-center">
                  <p className="text-3xl font-bold text-green-600 mb-2">{metric.value}</p>
                  <p className="text-gray-600 text-sm">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-booking-blue/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Us in Making Travel More Sustainable</h2>
            <p className="text-gray-600 mb-6">
              Whether you&apos;re a traveller looking for sustainable stays or a property owner wanting to showcase your sustainability efforts, we&apos;re here to help you make a positive impact.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/search"
                className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Find Sustainable Stays
              </Link>
              <Link
                to="/list-property"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                List Your Property
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                About TravelHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
