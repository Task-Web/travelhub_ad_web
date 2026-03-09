import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stateApi } from '@/api/client';

const propertyTypes = [
  { id: 'hotel', name: 'Hotel', description: 'Accommodations for travellers with multiple rooms', icon: '🏨' },
  { id: 'apartment', name: 'Apartment', description: 'Furnished apartments for short or long stays', icon: '🏢' },
  { id: 'holiday-home', name: 'Holiday Home', description: 'Houses, villas, chalets, cottages, etc.', icon: '🏠' },
  { id: 'bnb', name: 'B&B', description: 'Bed and breakfast or guest houses', icon: '🛏️' },
];

const benefits = [
  { title: '45% of hosts get their first booking within a week', icon: '📅' },
  { title: 'More than 1 billion guest arrivals on TravelHub', icon: '🌍' },
  { title: '24/7 support from our team', icon: '💬' },
  { title: 'Set your own house rules', icon: '📋' },
];

const registrationSteps = [
  { id: 1, title: 'Property details', description: 'Name, address, and basic information' },
  { id: 2, title: 'Room setup', description: 'Add rooms, beds, and amenities' },
  { id: 3, title: 'Photos', description: 'Upload photos of your property' },
  { id: 4, title: 'Pricing', description: 'Set your rates and availability' },
  { id: 5, title: 'Review', description: 'Review and publish your listing' },
];

export default function ListPropertyPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    propertyName: '',
    address: '',
  });
  const [, setFormSubmitted] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ name: string; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved property listing data from backend state on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const { state } = await stateApi.getState();
        const data = state?.data as Record<string, unknown> | undefined;
        const propertyListing = data?.propertyListing as {
          selectedType?: string;
          formData?: { email: string; propertyName: string; address: string };
          showWizard?: boolean;
          currentStep?: number;
        } | undefined;

        if (propertyListing) {
          if (propertyListing.selectedType) {
            setSelectedType(propertyListing.selectedType);
          }
          if (propertyListing.formData) {
            setFormData(propertyListing.formData);
          }
          if (propertyListing.showWizard) {
            setShowWizard(propertyListing.showWizard);
          }
          if (propertyListing.currentStep) {
            setCurrentStep(propertyListing.currentStep);
          }
        }
      } catch (error) {
        console.error('Failed to load property listing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Save property listing data to backend state
  const saveToBackend = async (updates: {
    selectedType?: string | null;
    formData?: { email: string; propertyName: string; address: string };
    showWizard?: boolean;
    currentStep?: number;
  }) => {
    try {
      await stateApi.patchState({
        propertyListing: {
          selectedType: updates.selectedType ?? selectedType,
          formData: updates.formData ?? formData,
          showWizard: updates.showWizard ?? showWizard,
          currentStep: updates.currentStep ?? currentStep,
        },
      }, 'Updated property listing form data');
    } catch (error) {
      console.error('Failed to save property listing data:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => ({
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files) {
      const newPhotos = Array.from(files)
        .filter(file => file.type.startsWith('image/'))
        .map(file => ({
          name: file.name,
          preview: URL.createObjectURL(file),
        }));
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleContinueWithType = () => {
    if (selectedType) {
      setShowWizard(true);
      setCurrentStep(1);
      saveToBackend({ showWizard: true, currentStep: 1 });
    }
  };

  // Handle property type selection
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    saveToBackend({ selectedType: typeId });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.propertyName && formData.address) {
      setFormSubmitted(true);
      setShowWizard(true);
      setCurrentStep(1);
      const typeToUse = selectedType || 'hotel';
      if (!selectedType) {
        setSelectedType(typeToUse); // Default to hotel if no type selected
      }
      // Save form data to backend
      saveToBackend({
        formData,
        showWizard: true,
        currentStep: 1,
        selectedType: typeToUse,
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep < registrationSteps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveToBackend({ currentStep: newStep });
    } else {
      // Final step - clear saved data and navigate to success
      stateApi.patchState({ propertyListing: null }, 'Property listing completed');
      navigate('/');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveToBackend({ currentStep: newStep });
    }
  };

  const handleBackToSelection = () => {
    setShowWizard(false);
    setCurrentStep(1);
    setFormSubmitted(false);
    saveToBackend({ showWizard: false, currentStep: 1 });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-booking-blue mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your listing...</p>
        </div>
      </div>
    );
  }

  // Registration Wizard View
  if (showWizard) {
    return (
      <div>
        {/* Wizard Header */}
        <div className="bg-booking-blue">
          <div className="max-w-container-lg mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToSelection}
                className="text-white hover:text-white/80 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">
                  Register your {propertyTypes.find(t => t.id === selectedType)?.name || 'Property'}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-neutral-100 border-b">
          <div className="max-w-container-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {registrationSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step.id < currentStep
                          ? 'bg-green-500 text-white'
                          : step.id === currentStep
                          ? 'bg-booking-blue text-white'
                          : 'bg-neutral-300 text-neutral-600'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm hidden md:inline ${
                        step.id === currentStep ? 'text-neutral-800 font-medium' : 'text-neutral-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < registrationSteps.length - 1 && (
                    <div className="w-8 md:w-16 h-0.5 bg-neutral-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">
              {registrationSteps[currentStep - 1].title}
            </h2>
            <p className="text-neutral-600 mb-6">
              {registrationSteps[currentStep - 1].description}
            </p>

            {/* Step-specific content */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Property name
                  </label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    placeholder="Enter your property name"
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Property address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, city, country"
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Property type
                  </label>
                  <div className="p-3 border rounded bg-neutral-50 flex items-center gap-2">
                    <span className="text-2xl">{propertyTypes.find(t => t.id === selectedType)?.icon}</span>
                    <span className="font-medium">{propertyTypes.find(t => t.id === selectedType)?.name}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Number of rooms
                  </label>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Maximum guests
                  </label>
                  <input
                    type="number"
                    defaultValue={2}
                    min={1}
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['WiFi', 'Parking', 'Air conditioning', 'Kitchen', 'TV', 'Pool'].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-neutral-50">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpeg,.jpg,image/png,image/jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Drag and drop zone */}
                <div
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-booking-blue-light transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-4 text-neutral-400">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <p className="text-neutral-600 mb-2">Drag and drop photos here</p>
                  <p className="text-sm text-neutral-500 mb-4">or</p>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-booking-blue-light text-white rounded hover:bg-booking-blue transition-colors"
                  >
                    Upload photos
                  </button>
                </div>

                {/* Uploaded photos preview */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.preview}
                          alt={photo.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                        </button>
                        <p className="text-xs text-neutral-500 truncate mt-1">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">
                    Upload at least 5 photos. High-quality images help attract more guests.
                  </p>
                  <span className={`text-sm font-medium ${uploadedPhotos.length >= 5 ? 'text-green-600' : 'text-neutral-500'}`}>
                    {uploadedPhotos.length}/5 minimum
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Accepted formats: PNG, JPEG, JPG. Minimum resolution: 1280x900 pixels
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price per night (EUR)
                  </label>
                  <input
                    type="number"
                    defaultValue={100}
                    min={1}
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum stay (nights)
                  </label>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Cancellation policy
                  </label>
                  <select className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light">
                    <option>Flexible - Free cancellation up to 24 hours before</option>
                    <option>Moderate - Free cancellation up to 5 days before</option>
                    <option>Strict - 50% refund up to 7 days before</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="font-bold">Your listing is ready!</span>
                  </div>
                  <p className="text-green-600 text-sm">
                    Review your property details below and click &quot;Publish&quot; to go live.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-neutral-800 mb-2">{formData.propertyName || 'Your Property'}</h4>
                  <p className="text-neutral-600 text-sm">{formData.address || 'Address not provided'}</p>
                  <p className="text-neutral-600 text-sm">Type: {propertyTypes.find(t => t.id === selectedType)?.name}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                onClick={handlePrevStep}
                className={`px-6 py-3 rounded font-medium ${
                  currentStep === 1
                    ? 'text-neutral-400 cursor-not-allowed'
                    : 'text-booking-blue-light hover:bg-neutral-100'
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors"
              >
                {currentStep === registrationSteps.length ? 'Publish listing' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            List your property on TravelHub
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Whether hosting is your side hustle or full-time job, register your vacation rental on TravelHub to reach travellers worldwide
          </p>
        </div>
      </div>

      {/* Property Type Selection */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          What would you like to list?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                selectedType === type.id
                  ? 'border-booking-blue bg-booking-blue/5'
                  : 'border-neutral-200 hover:border-booking-blue-light'
              }`}
            >
              <span className="text-4xl block mb-4">{type.icon}</span>
              <h3 className="font-bold text-neutral-800 mb-2">{type.name}</h3>
              <p className="text-sm text-neutral-600">{type.description}</p>
            </button>
          ))}
        </div>

        {selectedType && (
          <div className="mt-8">
            <button
              onClick={handleContinueWithType}
              className="px-8 py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors"
            >
              Continue with {propertyTypes.find(t => t.id === selectedType)?.name}
            </button>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-neutral-100">
        <div className="max-w-container-lg mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            Why list on TravelHub?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-lg p-6 shadow-card text-center">
                <span className="text-4xl block mb-4">{benefit.icon}</span>
                <p className="text-neutral-800 font-medium">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Form Preview */}
      <div className="max-w-container-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Start your registration
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => saveToBackend({ formData })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light focus:ring-2 focus:ring-booking-blue-light/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Property name
              </label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                onBlur={() => saveToBackend({ formData })}
                placeholder="Enter your property name"
                required
                className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light focus:ring-2 focus:ring-booking-blue-light/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Property address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                onBlur={() => saveToBackend({ formData })}
                placeholder="Street address, city, country"
                required
                className="w-full px-4 py-3 rounded border border-neutral-200 focus:outline-none focus:border-booking-blue-light focus:ring-2 focus:ring-booking-blue-light/20"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-booking-blue-light text-white font-bold rounded hover:bg-booking-blue transition-colors"
            >
              Get started
            </button>
          </form>
          <p className="mt-6 text-sm text-neutral-500 text-center">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-booking-blue-light hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-booking-blue">
        <div className="max-w-container-lg mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="font-bold text-lg mb-1">Need help with your listing?</h3>
              <p className="text-white/80">Our Partner Support team is available 24/7</p>
            </div>
            <Link
              to="/help"
              className="px-6 py-3 bg-white text-booking-blue font-bold rounded hover:bg-neutral-100 transition-colors"
            >
              Contact Partner Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
