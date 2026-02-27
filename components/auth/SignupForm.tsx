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
    setSuccess(false);

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedFirstName || !normalizedLastName || !normalizedEmail || !password || !confirm) {
      setError('Please complete all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
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
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
          email: normalizedEmail,
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">Account created — redirecting...</div>}

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">First name</span>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
          placeholder="Jane"
          autoComplete="given-name"
          required
          aria-invalid={!!error}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Last name</span>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
          placeholder="Doe"
          autoComplete="family-name"
          required
          aria-invalid={!!error}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required aria-invalid={!!error} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="you@example.com" />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required aria-invalid={!!error} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Choose a password" />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Confirm password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" minLength={8} required aria-invalid={!!error} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Repeat password" />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1642F0] text-white font-semibold py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
