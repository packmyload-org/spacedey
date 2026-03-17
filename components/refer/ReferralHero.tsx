'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import SpaceyConversationPanel from '@/components/chat/SpaceyConversationPanel';
import type { ConversationMessage } from '@/lib/conversations/messages';
import { EMAIL_INPUT_PROPS, normalizeEmail } from '@/lib/utils/email';

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
  const { isAuthenticated, user } = useAuthStore();
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
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState('/images/referHero.png');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    setFormData((current) => ({
      ...current,
      firstName: user.firstName || current.firstName,
      lastName: user.lastName || current.lastName,
      email: user.email ? normalizeEmail(user.email) : current.email,
    }));
  }, [isAuthenticated, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'email' || name === 'refereeEmail' ? normalizeEmail(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Submit to your API endpoint
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to submit referral.');
      }

      setConversationId(data?.conversation?.conversationId || null);
      setConversationMessages(Array.isArray(data?.conversation?.messages) ? data.conversation.messages : []);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting referral:', error);
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFollowUp = async (message: string) => {
    if (!conversationId) {
      return;
    }

    setIsSendingFollowUp(true);
    setError(null);

    try {
      const response = await fetch(`/api/referral/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send your message.');
      }

      setConversationMessages(Array.isArray(data?.conversation?.messages) ? data.conversation.messages : []);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to send your message.';
      setError(messageText);
      throw error;
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  return (
    <section className="bg-[#1642F0] px-4 py-16 sm:px-5 lg:px-24 lg:pb-16 lg:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12 lg:items-center">
          {/* Left Content */}
          <div className="min-w-0 lg:max-w-[560px]">
            <div className="rounded-t-[28px] bg-[#D9DDF0] px-5 py-5 sm:px-6 sm:py-6">
              <h1 className="my-3 text-[1.85rem] font-bold leading-tight text-blue-900 sm:my-4 sm:text-[2.25rem] lg:text-[2.6rem]">
                Refer a friend to Spacedey and get rewarded
              </h1>
              <p className="max-w-xl text-[0.95rem] text-gray-700 sm:text-base">
             Earn ₦50 when any one you refer moves in — and they&apos;ll save 50% too.
              </p>
            </div>

            {/* Form */}
            {conversationId ? (
              <div className="space-y-4 rounded-b-[28px] bg-white p-4 sm:p-5">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  Your referral is logged. Keep chatting with Spacey here if there is any timing, urgency, or extra context we should attach to it.
                </div>
                <SpaceyConversationPanel
                  messages={conversationMessages}
                  onSendMessage={handleSendFollowUp}
                  isSending={isSendingFollowUp}
                  emptyLabel="Referral follow-up"
                  helperText="Share the best time to contact them, what storage need they mentioned, or any move-in timing."
                />
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-b-[28px] bg-white p-4 sm:p-5">
              {/* Your Info Section */}
              <div>
                <h3 className="mb-4 text-base font-bold text-gray-900 sm:text-lg">Your info</h3>
                {isAuthenticated && user ? (
                  <p className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    We pre-filled your details from your Spacedey account.
                  </p>
                ) : null}
                
                {/* Name Row */}
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name*"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...EMAIL_INPUT_PROPS}
                />
              </div>

              {/* Their Info Section */}
              <div>
                <h3 className="mb-4 text-base font-bold text-gray-900 sm:text-lg">Their info</h3>

                {/* Referee Name Row */}
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="refereeFirstName"
                    placeholder="First Name*"
                    value={formData.refereeFirstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="refereeLastName"
                    placeholder="Last Name"
                    value={formData.refereeLastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Referee Email & Phone Row */}
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="email"
                    name="refereeEmail"
                    placeholder="Email*"
                    value={formData.refereeEmail}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    {...EMAIL_INPUT_PROPS}
                  />
                  <input
                    type="tel"
                    name="refereePhone"
                    placeholder="Phone"
                    value={formData.refereePhone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Referee Location */}
                <select
                  name="refereeLocation"
                  value={formData.refereeLocation}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 sm:text-base"
              >
                {isLoading ? 'Submitting...' : 'Submit Referral'}
              </button>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  Spacey started your referral conversation.
                </div>
              )}
            </form>
            )}
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <Image
                src={imageSrc}
                alt="Referral hero image"
                width={964}
                height={886}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="h-auto w-full"
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
