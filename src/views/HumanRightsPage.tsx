import { Link } from 'react-router-dom';

export default function HumanRightsPage() {
  const employeeRights = [
    {
      id: 'fair-wages',
      title: 'Fair Wages and Benefits',
      description: 'We provide competitive compensation and comprehensive benefits packages to all employees, ensuring living wages across all locations.',
    },
    {
      id: 'working-conditions',
      title: 'Safe Working Conditions',
      description: 'We maintain safe and healthy working environments, with regular safety assessments and employee wellness programmes.',
    },
    {
      id: 'non-discrimination',
      title: 'Non-Discrimination',
      description: 'We prohibit discrimination based on race, gender, age, religion, disability, sexual orientation, or any other protected characteristic.',
    },
    {
      id: 'freedom-association',
      title: 'Freedom of Association',
      description: 'We respect employees\' rights to form and join trade unions and engage in collective bargaining.',
    },
    {
      id: 'work-life-balance',
      title: 'Work-Life Balance',
      description: 'We promote reasonable working hours, flexible work arrangements, and paid leave to support employee wellbeing.',
    },
    {
      id: 'professional-development',
      title: 'Professional Development',
      description: 'We invest in training and development opportunities to help employees grow their skills and careers.',
    },
  ];

  const supplyChainPrinciples = [
    {
      id: 'no-forced-labour',
      title: 'Prohibition of Forced Labour',
      description: 'We require all suppliers to prohibit forced, bonded, or involuntary labour in any form.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    {
      id: 'no-child-labour',
      title: 'Prohibition of Child Labour',
      description: 'We strictly prohibit the use of child labour and require suppliers to comply with minimum age requirements.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'fair-treatment',
      title: 'Fair Treatment',
      description: 'We require suppliers to treat workers with dignity and respect, free from harassment and abuse.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'environmental-respect',
      title: 'Environmental Responsibility',
      description: 'We expect suppliers to minimise environmental impact and respect the rights of affected communities.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const communityImpacts = [
    {
      id: 'local-employment',
      title: 'Local Employment',
      description: 'We prioritise hiring from local communities and support local economic development.',
    },
    {
      id: 'cultural-heritage',
      title: 'Cultural Heritage',
      description: 'We promote responsible tourism that respects and preserves local cultures and heritage sites.',
    },
    {
      id: 'community-investment',
      title: 'Community Investment',
      description: 'We invest in community programmes and charitable initiatives in the regions where we operate.',
    },
    {
      id: 'stakeholder-engagement',
      title: 'Stakeholder Engagement',
      description: 'We engage with local communities to understand and address their concerns about our operations.',
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
              <li className="text-white">Human Rights Statement</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Human Rights Commitment</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Our commitment to respecting and promoting human rights across our operations and global value chain.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              TravelHub is committed to respecting and promoting human rights in all aspects of our business. We recognise our responsibility to respect the human rights of our employees, workers in our supply chain, users of our platform, and communities affected by our operations.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our approach is guided by the UN Guiding Principles on Business and Human Rights, the Universal Declaration of Human Rights, and the International Labour Organization&apos;s Declaration on Fundamental Principles and Rights at Work.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are committed to identifying, preventing, and mitigating adverse human rights impacts, and to providing remedy where we have caused or contributed to such impacts.
            </p>
          </div>

          {/* Employee Rights Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Rights</h2>
            <p className="text-gray-700 mb-6">
              We are committed to creating a workplace where all employees are treated with dignity and respect. Our employee rights commitments include:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employeeRights.map((right) => (
                <div key={right.id} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{right.title}</h3>
                  <p className="text-gray-600 text-sm">{right.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Chain Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Supply Chain Responsibility</h2>
            <p className="text-gray-700 mb-6">
              We expect all our suppliers and business partners to share our commitment to human rights. Our supply chain principles include:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {supplyChainPrinciples.map((principle) => (
                <div key={principle.id} className="flex items-start gap-4 p-6 border rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{principle.title}</h3>
                    <p className="text-gray-600 text-sm">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Impact Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Impact</h2>
            <p className="text-gray-700 mb-6">
              We recognise that our business can have significant impacts on local communities. We are committed to ensuring these impacts are positive:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {communityImpacts.map((impact) => (
                <div key={impact.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{impact.title}</h3>
                    <p className="text-gray-600 text-sm">{impact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Section */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Governance and Oversight</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Responsibility for human rights at TravelHub starts at the highest level. Our Board of Directors oversees our human rights policies and performance, with regular reporting on key human rights issues and progress.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We have established a cross-functional Human Rights Working Group that includes representatives from Legal, Human Resources, Procurement, and Sustainability. This group is responsible for implementing our human rights commitments and monitoring progress.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We conduct regular human rights due diligence to identify and address risks, and we report transparently on our progress through our annual sustainability report.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-booking-blue/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have concerns about human rights in relation to TravelHub&apos;s operations or supply chain, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Human Rights Concerns</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:humanrights@booking.com" className="text-booking-blue hover:underline">
                      humanrights@booking.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hotline</p>
                    <p className="text-gray-700">+44 20 3320 2601</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Postal Address</h3>
                <p className="text-gray-600">
                  TravelHub Human Rights Office<br />
                  Oosterdokskade 163<br />
                  1011 DL Amsterdam<br />
                  The Netherlands
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-6">
              All concerns are treated confidentially. We do not tolerate retaliation against anyone who raises concerns in good faith.
            </p>
          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/modern-slavery"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Modern Slavery Statement
            </Link>
            <Link
              to="/sustainability"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Sustainability
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
