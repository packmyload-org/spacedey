"use client";
//login form component
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import PasswordField from '@/components/ui/PasswordField';
import { EMAIL_INPUT_PROPS, normalizeEmail } from '@/lib/utils/email';

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setVerificationNotice(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data?.requiresEmailVerification) {
          setVerificationNotice(
            `We found your account for ${data?.email || email}. Verify your email before signing in.`
          );
        }

        throw new Error(data?.error || 'Login failed.');
      }

      setAuth(data.user, data.accessToken, rememberMe);
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="mt-3 text-sm text-gray-500">
            New here?{' '}
            <Link href="/auth/signup" className="font-semibold text-[#1642F0] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <hr className="border-gray-200 mb-6" />

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {verificationNotice && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {verificationNotice}
            </div>
          )}

          {/* Email Input */}
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

          {/* Password Input */}
          <div className="mb-4">
            <PasswordField
              name="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              autoComplete="current-password"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#D96541]"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-2 ${
                  rememberMe
                    ? 'bg-[#1642F0] border-[#1642F0]'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {rememberMe && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="text-gray-700">Keep me signed in</span>
            </label>

            <Link href="/auth/forgot-password" className="text-gray-600 hover:text-gray-900">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1642F0] hover:bg-[#103ff9] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
