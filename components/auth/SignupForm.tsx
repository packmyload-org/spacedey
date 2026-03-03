"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 max-w-lg mx-auto">
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-600">Account created — redirecting...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">First name</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full border rounded-lg px-3 py-2"
            placeholder="Jane"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Last name</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full border rounded-lg px-3 py-2"
            placeholder="Doe"
          />
        </label>
      </div>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="you@example.com" />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Choose a password" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Confirm password</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Repeat password" />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1642F0] text-white font-semibold py-3 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
