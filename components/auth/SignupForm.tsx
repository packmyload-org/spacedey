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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = 'First name is required.';
    if (!lastName) newErrors.lastName = 'Last name is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (!confirm) newErrors.confirm = 'Confirm password is required.';

    if (password && confirm && password !== confirm) {
      newErrors.confirm = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 max-w-lg mx-auto">
      {globalError && <div className="mb-4 text-sm text-red-600">{globalError}</div>}
      {success && <div className="mb-4 text-sm text-green-600">Account created — redirecting...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-700">First name</span>
          </div>
          {errors.firstName && <div className="text-xs text-red-500 mb-1">{errors.firstName}</div>}
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => clearError('firstName')}
            className={getInputClass('firstName')}
            placeholder="Jane"
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-700">Last name</span>
          </div>
          {errors.lastName && <div className="text-xs text-red-500 mb-1">{errors.lastName}</div>}
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => clearError('lastName')}
            className={getInputClass('lastName')}
            placeholder="Doe"
          />
        </label>
      </div>

      <label className="block mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-gray-700">Email</span>
        </div>
        {errors.email && <div className="text-xs text-red-500 mb-1">{errors.email}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => clearError('email')}
          className={getInputClass('email')}
          placeholder="you@example.com"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-700">Password</span>
          </div>
          {errors.password && <div className="text-xs text-red-500 mb-1">{errors.password}</div>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => clearError('password')}
            className={getInputClass('password')}
            placeholder="Choose a password"
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-700">Confirm password</span>
          </div>
          {errors.confirm && <div className="text-xs text-red-500 mb-1">{errors.confirm}</div>}
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onFocus={() => clearError('confirm')}
            className={getInputClass('confirm')}
            placeholder="Repeat password"
          />
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
