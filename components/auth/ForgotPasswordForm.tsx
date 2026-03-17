"use client";

import { useState } from 'react';
import Link from 'next/link';
import { EMAIL_INPUT_PROPS, normalizeEmail } from '@/lib/utils/email';
import { forgotPasswordFormSchema, getFieldErrors } from '@/lib/auth/authFormSchemas';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const validation = forgotPasswordFormSchema.safeParse({ email });
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error));
      return;
    }

    const payload = validation.data;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && (
        <div className="mb-4 text-sm text-green-600">
          If an account exists for this email, a reset link has been sent.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(normalizeEmail(e.target.value));
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: '' }));
              }
            }}
            placeholder="Email Address"
            className={`w-full rounded-lg border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent ${
              fieldErrors.email
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-[#D96541]'
            }`}
            {...EMAIL_INPUT_PROPS}
          />
          {fieldErrors.email ? (
            <div className="mt-1 text-xs text-red-500">{fieldErrors.email}</div>
          ) : null}
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
