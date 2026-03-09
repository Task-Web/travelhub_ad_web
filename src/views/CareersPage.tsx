import { useState } from 'react';
import { Link } from 'react-router-dom';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export default function CareersPage() {
  const [keyword, setKeyword] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');

  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Customer Service',
    'Finance',
    'HR',
    'Operations',
  ];

  const locations = [
    'Amsterdam',
    'London',
    'Singapore',
    'New York',
    'Dublin',
    'Berlin',
    'Paris',
    'Sydney',
  ];

  const featuredJobs: JobListing[] = [
    {
      id: 'job-1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Amsterdam',
      type: 'Full-time',
    },
    {
      id: 'job-2',
      title: 'Product Manager',
      department: 'Product',
      location: 'London',
      type: 'Full-time',
    },
    {
      id: 'job-3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Singapore',
      type: 'Full-time',
    },
    {
      id: 'job-4',
      title: 'Data Scientist',
      department: 'Engineering',
      location: 'Amsterdam',
      type: 'Full-time',
    },
    {
      id: 'job-5',
      title: 'Customer Service Representative',
      department: 'Customer Service',
      location: 'Dublin',
      type: 'Full-time',
    },
  ];

  const benefits = [
    {
      id: 'flexible-work',
      title: 'Flexible Work',
      description: 'Work from home or office with flexible hours that suit your lifestyle.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'competitive-pay',
      title: 'Competitive Pay',
      description: 'Industry-leading salaries with performance bonuses and equity options.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
    },
    {
      id: 'learning-budget',
      title: 'Learning Budget',
      description: 'Annual budget for courses, conferences, and professional development.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      id: 'health-insurance',
      title: 'Health Insurance',
      description: 'Comprehensive health, dental, and vision coverage for you and your family.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      id: 'travel-discounts',
      title: 'Travel Discounts',
      description: 'Exclusive discounts on TravelHub properties and travel experiences.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
    },
    {
      id: 'diversity-inclusion',
      title: 'Diversity & Inclusion',
      description: 'A welcoming environment where everyone belongs and can thrive.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would filter jobs based on keyword, department, and location
    console.log('Searching for:', { keyword, department, location });
  };

  // Filter jobs based on search criteria
  const filteredJobs = featuredJobs.filter((job) => {
    const matchesKeyword = keyword === '' ||
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.department.toLowerCase().includes(keyword.toLowerCase());
    const matchesDepartment = department === '' || job.department === department;
    const matchesLocation = location === '' || job.location === location;
    return matchesKeyword && matchesDepartment && matchesLocation;
  });

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
              <li className="text-white">Careers</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            At TravelHub, we&apos;re passionate about making it easier for everyone to experience the world.
            Join our global team and help shape the future of travel.
          </p>
        </div>
      </div>

      {/* Job Search Form */}
      <div className="bg-white shadow-md py-8">
        <div className="max-w-container-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Next Role</h2>
          <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                Keyword
              </label>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-booking-blue-light focus:outline-none"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded px-4 py-2 bg-booking-blue text-white hover:bg-booking-blue-hover transition-colors font-medium"
              >
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-container-lg mx-auto px-4">
          {/* Featured Jobs Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Opportunities</h2>
            <div className="grid gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded px-6 py-2 bg-booking-blue text-white hover:bg-booking-blue-hover transition-colors font-medium whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                  No jobs found matching your criteria. Try adjusting your search filters.
                </div>
              )}
            </div>
          </div>

          {/* Company Culture Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Work With Us</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-booking-blue/10 rounded-full flex items-center justify-center text-booking-blue mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-booking-blue/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join a team of over 17,000 employees across 70+ countries, all working together to make travel experiences unforgettable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about"
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Learn About Us
              </Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-booking-blue-hover transition-colors inline-flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Browse All Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
