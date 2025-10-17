'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  region: string;
  squareFootage: string;
  details: string;
}

interface GetInTouchProps {
  title?: string;
  image?: string;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function LandlordGetInTouch({
  title = "Get in touch",
  image = "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=600&fit=crop",
  onSubmit,
}: GetInTouchProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    region: '',
    squareFootage: '',
    details: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        streetAddress: '',
        region: '',
        squareFootage: '',
        details: '',
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="get-in-touch" className="w-full bg-[#FCF8F1] py-16 px-6 lg:px-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 mb-8">
          {title}
        </h1>
        <div className="flex justify-center">
          <div className="w-20 h-1 bg-orange-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-96 lg:h-full min-h-96 rounded-3xl overflow-hidden shadow-lg">
              <Image
                src={image}
                alt="Get in touch"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Blue Decorative Circles */}
              <div className="absolute top-8 left-8 w-8 h-8 bg-blue-600 rounded-full opacity-80"></div>
              <div className="absolute top-4 left-16 w-12 h-12 bg-blue-600 rounded-full opacity-70"></div>
              <div className="absolute top-20 left-4 w-10 h-10 bg-blue-600 rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                />
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                />
              </div>

              {/* Location Section Title */}
              <h3 className="text-xl font-bold text-blue-900 mt-8 mb-4">
                Have a location in mind?
              </h3>

              {/* Street Address */}
              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address*"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
              />

              {/* Region & Square Footage Row */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-400"
                >
                  <option value="">Region</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
                <input
                  type="text"
                  name="squareFootage"
                  placeholder="Approximate Square Footage"
                  value={formData.squareFootage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                />
              </div>

              {/* Details Textarea */}
              <textarea
                name="details"
                placeholder="Any other details we should know?"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 resize-none"
              ></textarea>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-12 py-3 rounded-lg font-bold text-lg transition-colors duration-200"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  Thank you! We&apos;ll be in touch soon.
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}