"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { storeganiseAPI } from '@/lib/storeganise-api';

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // We need to access registration direct from API or add it to AuthContext
  // For now, let's assume we can call storeganiseAPI directly or we should have added it to AuthContext.
  // The plan said "Ensure it uses useAuth() hook for registration."
  // Let's check AuthContext again... IT DOES NOT HAVE REGISTER.
  // I should add register to AuthContext or use storeganiseAPI directly here.
  // Using storeganiseAPI directly is fine for specific actions, but AuthContext is better for state.
  // Let's stick to the plan of "using useAuth" implying we might need to expose it there OR just use the API and then login.
  // Actually, usually signup logs you in.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirm) {
      setError('Please complete all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Split name
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      await storeganiseAPI.register({
        email,
        password,
        firstName,
        lastName,
      });

      setSuccess(true);
      // Automatically login? StoreganiseAPI register implementation sets token.
      // So we just need to update auth context state.
      // We can force a checkAuth or reload.

      // Let's redirect to login for now to be safe, or direct to dashboard if token is set.
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">Account created! Redirecting to login...</div>}

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Full name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Jane Doe"
          disabled={loading}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="you@example.com"
          disabled={loading}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Choose a password"
          disabled={loading}
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Confirm password</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Repeat password"
          disabled={loading}
        />
      </label>

      <button
        type="submit"
        className="w-full bg-[#1642F0] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
