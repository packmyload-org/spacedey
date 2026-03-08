"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store/useSearchStore";
import { ChevronLeft, Info, CheckCircle2, CreditCard, Wallet, Loader2, PartyPopper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PaymentProvider } from "@/lib/db/entities/Payment";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { sites } = useSearchStore();

    const siteId = searchParams.get("siteId");
    const unitTypeId = searchParams.get("unitTypeId");

    const [selectedSite, setSelectedSite] = useState<any>(null);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // iFitness Model State
    const [paymentMode, setPaymentMode] = useState<'full' | 'incremental'>('full');
    const [customAmount, setCustomAmount] = useState<string>("");
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(PaymentProvider.PAYSTACK);

    useEffect(() => {
        async function loadData() {
            try {
                let site = sites.find(s => s.id === siteId);
                if (!site && siteId) {
                    const res = await fetch(`/api/sites`);
                    const data = await res.json();
                    site = data.sites?.find((s: any) => s.id === siteId);
                }

                if (site) {
                    setSelectedSite(site);
                    const unit = site.unitTypes?.find((u: any) => u.id === unitTypeId);
                    setSelectedUnit(unit);
                }
            } catch (err) {
                console.error("Load checkout data error", err);
                setError("Failed to load checkout details.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [siteId, unitTypeId, sites]);

    const registrationFee = Number(selectedSite?.registrationFee || 30000);
    const monthlyRate = Number(selectedUnit?.priceAmount || 0);
    const annualDues = Number(selectedSite?.annualDues || 35000);

    // 5% Discount on joining fee for online payment
    const regDiscount = registrationFee * 0.05;
    const discountedReg = registrationFee - regDiscount;

    const totalDue = discountedReg + monthlyRate + annualDues;
    const finalAmount = paymentMode === 'full' ? totalDue : (Number(customAmount) || 5000);

    const handleCheckout = async () => {
        if (paymentMode === 'incremental' && (Number(customAmount) < 5000)) {
            setError("Minimum incremental payment is ₦5,000");
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            // 1. Create Booking
            const bookingRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteId,
                    unitTypeId,
                    startDate: new Date().toISOString()
                })
            });

            const bookingData = await bookingRes.json();
            if (!bookingData.ok) {
                setError(bookingData.message || "Failed to create booking");
                setSubmitting(false);
                return;
            }

            // 2. Initialize Payment with Custom Amount
            const payRes = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: bookingData.bookingId,
                    provider: selectedProvider,
                    amount: finalAmount
                })
            });

            const payData = await payRes.json();
            if (payData.ok && payData.authorizationUrl) {
                window.location.href = payData.authorizationUrl;
            } else {
                setError(payData.message || "Failed to initialize payment");
                setSubmitting(false);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-blue-600 font-bold mb-8 hover:underline uppercase text-xs tracking-widest"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* Membership Header */}
                        <div>
                            <h1 className="text-4xl font-black text-blue-900 mb-4">Membership Checkout</h1>
                            <p className="text-gray-500 max-w-xl text-lg">Secure your unit at {selectedSite.name}. Pay full now or start incrementally.</p>
                        </div>

                        {/* Breakdown Section */}
                        <section className="bg-white rounded-[2rem] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16" />

                            <h2 className="text-xl font-black text-blue-900 mb-8 flex items-center gap-2">
                                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                Payment Breakdown
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                                            01
                                        </div>
                                        <div>
                                            <span className="block font-black text-blue-900">Joining Fee</span>
                                            <span className="text-xs text-green-600 font-bold uppercase tracking-wider">5% Discount Applied</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-gray-400 line-through text-sm">₦{registrationFee.toLocaleString()}</span>
                                        <span className="block font-black text-blue-900 text-xl">₦{discountedReg.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold">
                                            02
                                        </div>
                                        <div>
                                            <span className="block font-black text-blue-900">Monthly Subscription</span>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{selectedUnit.name} Unit</span>
                                        </div>
                                    </div>
                                    <span className="block font-black text-blue-900 text-xl">₦{monthlyRate.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center font-bold">
                                            03
                                        </div>
                                        <div>
                                            <span className="block font-black text-blue-900">Annual Dues</span>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Paid once yearly</span>
                                        </div>
                                    </div>
                                    <span className="block font-black text-blue-900 text-xl">₦{annualDues.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>

                        {/* Payment Mode Selection */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
                                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                Select Payment Mode
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMode('full')}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left ${paymentMode === 'full'
                                            ? "border-blue-600 bg-blue-50 shadow-lg"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${paymentMode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <span className="block font-black text-blue-900 text-lg">Full Payment</span>
                                    <span className="text-sm text-gray-500">Pay entire startup cost at once</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMode('incremental')}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left ${paymentMode === 'incremental'
                                            ? "border-blue-600 bg-blue-50 shadow-lg"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${paymentMode === 'incremental' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <PartyPopper className="w-6 h-6" />
                                    </div>
                                    <span className="block font-black text-blue-900 text-lg">Incremental Payment</span>
                                    <span className="text-sm text-gray-500">Pay in part today & complete later</span>
                                </button>
                            </div>

                            {paymentMode === 'incremental' && (
                                <div className="mt-6 p-8 bg-white rounded-[2rem] border-2 border-blue-100 animate-in slide-in-from-top-4 duration-500">
                                    <label className="block text-sm font-black text-blue-900 uppercase tracking-widest mb-4">Amount to pay today (min ₦5,000)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">₦</div>
                                        <input
                                            type="number"
                                            className="w-full pl-12 pr-6 py-6 bg-gray-50 border-none rounded-2xl text-2xl font-black text-blue-900 focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="5000"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                        />
                                    </div>
                                    <p className="mt-4 text-xs text-blue-400 font-medium">Your unit will be fully active once your balance reaches ₦{(discountedReg + monthlyRate).toLocaleString()}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-900/10 border border-gray-50 text-center">
                            <p className="text-sm font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4">Total Amount to Pay</p>
                            <div className="text-5xl font-black text-blue-900 mb-2 truncate">
                                ₦{finalAmount.toLocaleString()}
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-10">Nigerian Naira (NGN)</p>

                            <div className="space-y-3 mb-10">
                                <button
                                    onClick={() => setSelectedProvider(PaymentProvider.PAYSTACK)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${selectedProvider === PaymentProvider.PAYSTACK ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:bg-gray-50'}`}
                                >
                                    <span className="font-black text-blue-900">Paystack</span>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProvider === PaymentProvider.PAYSTACK ? 'border-blue-600' : 'border-gray-200'}`}>
                                        {selectedProvider === PaymentProvider.PAYSTACK && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                    </div>
                                </button>
                                <button
                                    onClick={() => setSelectedProvider(PaymentProvider.FLUTTERWAVE)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${selectedProvider === PaymentProvider.FLUTTERWAVE ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:bg-gray-50'}`}
                                >
                                    <span className="font-black text-blue-900">Flutterwave</span>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProvider === PaymentProvider.FLUTTERWAVE ? 'border-blue-600' : 'border-gray-200'}`}>
                                        {selectedProvider === PaymentProvider.FLUTTERWAVE && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                    </div>
                                </button>
                            </div>

                            {error && <p className="text-red-500 text-xs font-bold mb-6 bg-red-50 py-3 px-4 rounded-xl">{error}</p>}

                            <button
                                onClick={handleCheckout}
                                disabled={submitting}
                                className="w-full bg-[#1642F0] text-white py-6 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "SECURE MEMBERSHIP"}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <Info className="w-4 h-4" />
                                Instant activation on full pay
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
