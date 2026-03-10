"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Header from "@/components/layout/Header";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState("Verifying your payment...");
    const verificationAttempted = useRef(false);

    useEffect(() => {
        // Prevent double verification on strict mode
        if (verificationAttempted.current) return;
        verificationAttempted.current = true;

        async function verify() {
            // Paystack uses 'reference', Flutterwave uses 'tx_ref' and 'transaction_id'
            const reference = searchParams.get("reference") || searchParams.get("tx_ref");
            const transactionId = searchParams.get("transaction_id");

            if (!reference) {
                setStatus('failed');
                setMessage("Missing payment reference.");
                return;
            }

            try {
                const res = await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reference, transactionId })
                });

                const data = await res.json();
                if (data.ok) {
                    setStatus('success');
                    setMessage("Payment confirmed! Your storage unit is now active.");
                } else {
                    setStatus('failed');
                    setMessage(data.message || "Payment verification failed.");
                }
            } catch {
                setStatus('failed');
                setMessage("An error occurred during verification.");
            }
        }
        verify();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="max-w-md mx-auto pt-48 pb-20 px-6 text-center">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-black text-blue-900">Confirming Payment</h1>
                        <p className="text-gray-500 leading-relaxed">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-blue-900 mb-2">Thank You!</h1>
                            <p className="text-gray-500 leading-relaxed font-medium">{message}</p>
                        </div>
                        <div className="pt-4 space-y-4">
                            <Link href="/bookings" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                Go to My Bookings
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/" className="block text-blue-600 font-bold hover:underline">
                                Return to Homepage
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-blue-900 mb-2">Payment Failed</h1>
                            <p className="text-red-500/80 leading-relaxed font-medium bg-red-50 py-3 px-4 rounded-xl border border-red-100">{message}</p>
                        </div>
                        <div className="pt-4 space-y-4">
                            <Link href="/bookings" className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">
                                View My Bookings
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="block w-full border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        }>
            <PaymentCallbackContent />
        </Suspense>
    );
}
