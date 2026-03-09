import { Link } from 'react-router-dom';

export default function ModernSlaveryPage() {
  const dueDiligenceSteps = [
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'We conduct regular risk assessments to identify potential modern slavery risks in our operations and supply chains.',
    },
    {
      id: 'supplier-due-diligence',
      title: 'Supplier Due Diligence',
      description: 'We evaluate suppliers based on their labour practices and require contractual commitments to prevent modern slavery.',
    },
    {
      id: 'audits',
      title: 'Audits and Monitoring',
      description: 'We conduct regular audits of high-risk suppliers and monitor compliance with our anti-slavery policies.',
    },
    {
      id: 'grievance-mechanisms',
      title: 'Grievance Mechanisms',
      description: 'We maintain confidential channels for workers and stakeholders to report concerns about modern slavery.',
    },
  ];

  const keyPolicies = [
    {
      id: 'code-of-conduct',
      title: 'Supplier Code of Conduct',
      description: 'All suppliers must adhere to our Supplier Code of Conduct, which explicitly prohibits forced labour, child labour, and any form of exploitation.',
    },
    {
      id: 'employment-standards',
      title: 'Employment Standards',
      description: 'We maintain fair employment practices including fair wages, reasonable working hours, and safe working conditions for all employees.',
    },
    {
      id: 'zero-tolerance',
      title: 'Zero Tolerance Policy',
      description: 'We have a zero-tolerance approach to modern slavery and will immediately terminate relationships with any supplier found to be in violation.',
    },
    {
      id: 'worker-rights',
      title: 'Worker Rights',
      description: 'We respect the right of all workers to freedom of association and collective bargaining, and prohibit any form of discrimination.',
    },
  ];

  const trainingTopics = [
    'Recognising indicators of modern slavery and human trafficking',
    'Understanding the legal framework and reporting obligations',
    'Conducting effective due diligence on suppliers',
    'Handling reports and allegations appropriately',
    'Protecting and supporting victims',
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
              <li className="text-white">Modern Slavery Statement</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Modern Slavery Statement</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Our commitment to combating modern slavery and human trafficking in our business and supply chains.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">On this page</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#introduction" className="block text-booking-blue hover:underline">Introduction</a>
                  <a href="#policies" className="block text-booking-blue hover:underline">Our Policies</a>
                  <a href="#due-diligence" className="block text-booking-blue hover:underline">Due Diligence</a>
                  <a href="#training" className="block text-booking-blue hover:underline">Training</a>
                  <a href="#reporting" className="block text-booking-blue hover:underline">Reporting</a>
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Related documents</h4>
                  <div className="space-y-1 text-sm">
                    <Link to="/human-rights" className="block text-booking-blue hover:underline">Human Rights Statement</Link>
                    <Link to="/terms" className="block text-booking-blue hover:underline">Terms of Service</Link>
                    <Link to="/privacy" className="block text-booking-blue hover:underline">Privacy Policy</Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-white rounded-lg shadow p-8">
                {/* Last Updated */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-booking-blue">
                  <p className="text-gray-600">
                    <strong>Last updated:</strong> January 2024
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This statement is published in accordance with the UK Modern Slavery Act 2015, the Australian Modern Slavery Act 2018, and similar legislation worldwide.
                  </p>
                </div>

                {/* Introduction Section */}
                <section id="introduction" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    TravelHub is committed to preventing modern slavery and human trafficking in all areas of our business. Modern slavery is a serious crime and a violation of fundamental human rights. It takes various forms, including slavery, servitude, forced and compulsory labour, and human trafficking.
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    We recognise our responsibility to be vigilant in our own operations and in our supply chains. This statement sets out the steps we have taken, and continue to take, to ensure that modern slavery and human trafficking are not taking place within our business or supply chains.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    As a global travel marketplace connecting millions of travellers with accommodations and travel services worldwide, we understand that our reach brings both opportunity and responsibility. We are committed to using our influence to promote ethical practices throughout the travel industry.
                  </p>
                </section>

                {/* Our Policies Section */}
                <section id="policies" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Policies</h2>
                  <p className="text-gray-700 mb-6">
                    We have implemented a comprehensive framework of policies and procedures designed to prevent, detect, and address modern slavery risks.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {keyPolicies.map((policy) => (
                      <div key={policy.id} className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-bold text-gray-900 mb-2">{policy.title}</h3>
                        <p className="text-gray-600 text-sm">{policy.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Due Diligence Section */}
                <section id="due-diligence" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Due Diligence Processes</h2>
                  <p className="text-gray-700 mb-6">
                    We have established robust due diligence processes to identify, prevent, and mitigate the risks of modern slavery in our operations and supply chains.
                  </p>
                  <div className="space-y-4">
                    {dueDiligenceSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-booking-blue rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Training Section */}
                <section id="training" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Training and Awareness</h2>
                  <p className="text-gray-700 mb-6">
                    We provide regular training to our employees to help them understand the risks of modern slavery and their role in preventing it. Our training programme covers:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <ul className="space-y-3">
                      {trainingTopics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-gray-700 mt-4">
                    We ensure that relevant staff, particularly those in procurement, human resources, and legal departments, receive enhanced training on modern slavery issues.
                  </p>
                </section>

                {/* Reporting Section */}
                <section id="reporting" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting Concerns</h2>
                  <p className="text-gray-700 mb-6">
                    We encourage anyone who has concerns about modern slavery in any part of our business or supply chains to report them. We provide multiple channels for reporting:
                  </p>
                  <div className="bg-booking-blue/5 rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Confidential Reporting Hotline</h3>
                        <p className="text-gray-600">+44 20 3320 2600 (available 24/7)</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Email</h3>
                        <a href="mailto:ethics@booking.com" className="text-booking-blue hover:underline">
                          ethics@booking.com
                        </a>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Postal Address</h3>
                        <p className="text-gray-600">
                          TravelHub Ethics Office<br />
                          Oosterdokskade 163<br />
                          1011 DL Amsterdam<br />
                          The Netherlands
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">
                    All reports are treated confidentially and will be thoroughly investigated. We do not tolerate retaliation against anyone who reports concerns in good faith.
                  </p>
                </section>

                {/* Approval and Signature */}
                <div className="border-t pt-6">
                  <p className="text-gray-700 mb-4">
                    This statement has been approved by the Board of Directors of TravelHub B.V. and constitutes our slavery and human trafficking statement for the financial year ending December 2024.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="font-bold text-gray-900">Signed on behalf of TravelHub B.V.</p>
                    <p className="text-gray-600 mt-2">Chief Executive Officer</p>
                    <p className="text-sm text-gray-500 mt-1">January 2024</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
