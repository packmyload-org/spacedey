"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  const loadRecaptcha = async () => {
    if (!recaptchaSiteKey) return;
    if (window.grecaptcha) return;
    if (document.querySelector(`script[src^=\"https://www.google.com/recaptcha/api.js\"]`)) return;

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA.'));
      document.head.appendChild(script);
    });
  };

  const getRecaptchaToken = async (): Promise<string | null> => {
    if (!recaptchaSiteKey) return null;
    try {
      await loadRecaptcha();
      await new Promise<void>((resolve) => {
        window.grecaptcha?.ready(() => resolve());
      });
      if (!window.grecaptcha) return null;
      const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'signup' });
      return token || null;
    } catch (error) {
      console.warn('reCAPTCHA token generation failed:', error);
      return null; // Fail gracefully - proceed without reCAPTCHA
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName || !lastName || !email || !password || !confirm) {
      setError('Please complete all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const recaptchaResponse = await getRecaptchaToken();
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          recaptchaResponse,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create account.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      if (message.toLowerCase().includes('recaptcha')) {
        setError('Signup requires reCAPTCHA. Please ensure it is configured and try again.');
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-600">Account created — redirecting...</div>}

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">First name</span>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1642F0] focus:border-transparent"
          placeholder="Jane"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Last name</span>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1642F0] focus:border-transparent"
          placeholder="Doe"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1642F0] focus:border-transparent" placeholder="you@example.com" />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1642F0] focus:border-transparent" placeholder="Choose a password" />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Confirm password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1642F0] focus:border-transparent" placeholder="Repeat password" />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1642F0] hover:bg-[#103ff9] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
