"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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

    // TODO: hook up real signup API. For now show success and redirect to login.
    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-600">Account created — redirecting...</div>}

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Full name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Jane Doe" />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="you@example.com" />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Choose a password" />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Confirm password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Repeat password" />
      </label>

      <button type="submit" className="w-full bg-[#1642F0] text-white font-semibold py-2 rounded-lg">Create account</button>
    </form>
  );
}
