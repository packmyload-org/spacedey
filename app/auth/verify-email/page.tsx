'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('failed');
      setMessage('Missing verification token.');
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to verify email.');
        }

        setStatus('success');
        setMessage(data?.message || 'Email verified successfully.');
      } catch (error) {
        setStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Failed to verify email.');
      }
    }

    void verifyEmail();
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Verify your email</h1>
        <p className={`text-sm ${status === 'failed' ? 'text-red-600' : status === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
          {message}
        </p>
        {status === 'success' &&
          (<div className="mt-6 text-sm text-gray-600">
            <Link href="/auth/signin" className="font-semibold text-[#1642F0] hover:underline">
              Back to login
            </Link>
          </div>)}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <Header/>
      <VerifyEmailContent />
    </Suspense>
  );
}
