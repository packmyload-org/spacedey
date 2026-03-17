"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordField from '@/components/ui/PasswordField';
import { validatePasswordStrength } from '@/lib/auth/passwordPolicy';
import { EMAIL_INPUT_PROPS, normalizeEmail } from '@/lib/utils/email';

interface ResetPasswordFormProps {
  initialToken?: string;
  initialEmail?: string;
}

export default function ResetPasswordForm({
  initialToken = '',
  initialEmail = '',
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState(normalizeEmail(initialEmail));
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token || !email || !password || !confirm) {
      setError('Please complete all fields.');
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || 'Password is too weak.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to reset password.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 1200);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set a new password</h1>
        <p className="text-gray-600">Enter your new password to finish resetting your account.</p>
      </div>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && (
        <div className="mb-4 text-sm text-green-600">
          Password updated. Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!initialToken && (
          <div className="mb-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Reset token"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96541] focus:border-transparent text-gray-700"
            />
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(normalizeEmail(e.target.value))}
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96541] focus:border-transparent text-gray-700"
            {...EMAIL_INPUT_PROPS}
          />
        </div>

        <div className="mb-4">
          <PasswordField
            name="newPassword"
            label="New password"
            value={password}
            onChange={setPassword}
            placeholder="New password"
            autoComplete="new-password"
            inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#D96541]"
            showRequirements
          />
        </div>

        <div className="mb-6">
          <PasswordField
            name="confirmNewPassword"
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Confirm new password"
            autoComplete="new-password"
            inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#D96541]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1642F0] hover:bg-[#103ff9] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Back to{' '}
        <Link href="/auth/signin" className="text-[#1642F0] font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
