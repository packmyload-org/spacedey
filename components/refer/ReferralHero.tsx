'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  refereeFirstName: string;
  refereeLastName: string;
  refereeEmail: string;
  refereePhone: string;
  refereeLocation: string;
}

const LOCATIONS = [
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Benin City',
  'Jos',
  'Enugu',
  'Kaduna',
  'Abeokuta',
];

export default function ReferralHero() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    refereeFirstName: '',
    refereeLastName: '',
    refereeEmail: '',
    refereePhone: '',
    refereeLocation: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState('/images/referHero.png');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Submit to your API endpoint
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          refereeFirstName: '',
          refereeLastName: '',
          refereeEmail: '',
          refereePhone: '',
          refereeLocation: '',
        });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting referral:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20  px-5 lg:px-24 my-10 bg-[#1642F0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="bg-[#D9DDF0] p-6 rounded-t-3xl">
              <h1 className="text-3xl lg:text-4xl font-bold bg-[#D9DDF0] text-blue-900 my-6">
                Refer a friend to Spacedey and get rewarded
              </h1>
              <p className="text-lg text-gray-700">
             Earn ₦50 when any one you refer moves in — and they&apos;ll save 50% too.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 rounded-b-3xl">
              {/* Your Info Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your info</h3>
                
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name*"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Their Info Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Their info</h3>

                {/* Referee Name Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="refereeFirstName"
                    placeholder="First Name*"
                    value={formData.refereeFirstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="refereeLastName"
                    placeholder="Last Name"
                    value={formData.refereeLastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Referee Email & Phone Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="email"
                    name="refereeEmail"
                    placeholder="Email*"
                    value={formData.refereeEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="tel"
                    name="refereePhone"
                    placeholder="Phone"
                    value={formData.refereePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Referee Location */}
                <select
                  name="refereeLocation"
                  value={formData.refereeLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
                >
                  <option value="">Please Select Location*</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-full font-bold text-md transition-colors"
              >
                {isLoading ? 'Submitting...' : 'Submit Referral'}
              </button>

              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  Thanks for submitting the form!
                </div>
              )}
            </form>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full">
              <Image
                src={imageSrc}
                alt="Referral hero image"
                width={964}
                height={886}
                style={{ width: '100%', height: 'auto', minHeight: '600px', minWidth: '650px' }}
                priority
                unoptimized
                onError={() => setImageSrc('/images/hero1.jpg')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// function ReferralHeroImage() {
  // const external =
  //   'https://lp.stufstorage.com/hs-fs/hubfs/raw_assets/public/stuf_storage/images/sections/referral-hero-img.png?width=482&height=443&name=referral-hero-img.png';
  // const [src, setSrc] = useState(external);

//   return (
//     <Image
//       src={src}
//       alt="Referral hero image"
//       width={482}
//       height={443}
//       className="w-full h-auto"
//       priority
//       unoptimized
//       onError={() => setSrc('/images/hero1.jpg')}
//     />
//   );
// }