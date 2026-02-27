"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send reset email.');
      }

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
        <p className="text-gray-600">Enter your email and we&apos;ll send a reset link.</p>
      </div>

      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && (
        <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          If an account exists for this email, a reset link has been sent.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            autoComplete="email"
            required
            aria-invalid={!!error}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96541] focus:border-transparent text-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1642F0] hover:bg-[#103ff9] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Remembered your password?{' '}
        <Link href="/auth/signin" className="text-[#1642F0] font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
