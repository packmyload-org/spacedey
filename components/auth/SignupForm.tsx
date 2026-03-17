"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordField from '@/components/ui/PasswordField';
import { EMAIL_INPUT_PROPS, normalizeEmail } from '@/lib/utils/email';
import { getFieldErrors, signupFormSchema } from '@/lib/auth/authFormSchemas';

export default function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupResult, setSignupResult] = useState<{
    email: string;
    verificationEmailSent: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setErrors({});

    const validation = signupFormSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirm,
    });

    if (!validation.success) {
      setErrors(getFieldErrors(validation.error));
      return;
    }

    const payload = validation.data;

    setIsSubmitting(true);
    setSignupResult(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create account.');
      }

      setSignupResult({
        email: data?.user?.email || payload.email,
        verificationEmailSent: data?.verificationEmailSent === true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      if (message.toLowerCase().includes('recaptcha')) {
        setGlobalError('Signup requires reCAPTCHA. Please ensure it is configured and try again.');
      } else {
        setGlobalError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const getInputClass = (fieldName: string) => {
    const isError = Boolean(errors[fieldName]);
    return `mt-1 block w-full border rounded-lg px-3 py-2 outline-none transition-colors ${isError
        ? 'border-red-500 focus:border-gray-300 focus:ring-1 focus:ring-gray-300'
        : 'border-gray-300 focus:border-[#1642F0] focus:ring-1 focus:ring-[#1642F0]'
      }`;
  };

  if (signupResult) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Account created</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account is ready. Verify your email before signing in.
            </p>
          </div>

          {signupResult.verificationEmailSent ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              We sent a verification email to <span className="font-semibold">{signupResult.email}</span>.
              Open that message to verify your account.
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Your account was created, but we could not send the verification email right now.
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push('/auth/signin')}
            className="w-full bg-[#1642F0] text-white font-semibold py-3 rounded-2xl"
          >
            Continue to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-[28px] border border-[#D8E2FF] bg-white p-6 shadow-[0_20px_60px_rgba(17,56,216,0.08)] md:p-8">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">Sign up</p>
        <h1 className="mt-3 text-2xl font-black text-[#0F172A]">Create your account</h1>
        <p className="mt-3 text-sm text-[#5E6C91]">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-bold text-[#1642F0] hover:underline">
            Login
          </Link>
        </p>
      </div>

      {globalError && <div className="mb-4 text-sm text-red-600">{globalError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-700">First name</span>
          </div>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => clearError('firstName')}
            className={getInputClass('firstName')}
            placeholder="Jane"
          />
          {errors.firstName && <div className="mt-1 text-xs text-red-500">{errors.firstName}</div>}
        </label>

        <label className="block">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-700">Last name</span>
          </div>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => clearError('lastName')}
            className={getInputClass('lastName')}
            placeholder="Doe"
          />
          {errors.lastName && <div className="mt-1 text-xs text-red-500">{errors.lastName}</div>}
        </label>
      </div>

      <label className="block mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-gray-700">Email</span>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(normalizeEmail(e.target.value))}
          onFocus={() => clearError('email')}
          className={getInputClass('email')}
          placeholder="you@example.com"
          {...EMAIL_INPUT_PROPS}
        />
        {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <PasswordField
          label="Password"
          name="password"
          value={password}
          onChange={setPassword}
          onFocus={() => clearError('password')}
          error={errors.password}
          placeholder="Choose a password"
          autoComplete="new-password"
          inputClassName={getInputClass('password')}
          showRequirements
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={confirm}
          onChange={setConfirm}
          onFocus={() => clearError('confirm')}
          error={errors.confirm}
          placeholder="Repeat password"
          autoComplete="new-password"
          inputClassName={getInputClass('confirm')}
        />
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
