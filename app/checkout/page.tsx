"use client";

import React, { Suspense, useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store/useSearchStore";
import { ChevronLeft, Info, CheckCircle2, Loader2, PartyPopper, X } from "lucide-react";
import { calculateCheckoutPricing, NAIRA_PER_SQUARE_FOOT_PER_MONTH, PAY_ONCE_MONTHS } from "@/lib/pricing/storagePricing";
import { PaymentProvider } from "@/lib/db/entities/Payment";
import type { ApiSite, ApiStorageUnit, ApiUnitType } from "@/lib/types/local";

interface CheckoutSite extends ApiSite {
    registrationFee?: number;
    annualDues?: number;
}

interface CheckoutUnit extends ApiUnitType {
    priceAmount?: number;
}

interface CheckoutSitesResponse {
    ok?: boolean;
    sites?: CheckoutSite[];
}

const paymentProviders = [
    {
        value: PaymentProvider.PAYSTACK,
        label: "Paystack",
        description: "Card, bank transfer, USSD, and other local payment methods.",
    },
    {
        value: PaymentProvider.FLUTTERWAVE,
        label: "Flutterwave",
        description: "Card and bank payments with Flutterwave checkout.",
    },
] as const;

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { sites } = useSearchStore();

    const siteId = searchParams.get("siteId");
    const unitTypeId = searchParams.get("unitTypeId");
    const storageUnitId = searchParams.get("storageUnitId");

    const [selectedSite, setSelectedSite] = useState<CheckoutSite | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<CheckoutUnit | null>(null);
    const [selectedStorageUnit, setSelectedStorageUnit] = useState<ApiStorageUnit | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

    // Booking payment state
    const [paymentMode, setPaymentMode] = useState<'monthly' | 'full'>('monthly');
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                let site = sites.find((entry) => entry.id === siteId) as CheckoutSite | undefined;
                if (!site && siteId) {
                    const res = await fetch(`/api/sites`);
                    const data: CheckoutSitesResponse = await res.json();
                    site = data.sites?.find((entry) => entry.id === siteId);
                }

                if (site) {
                    setSelectedSite(site);
                    const unit = site.unitTypes?.find((entry) => entry.id === unitTypeId) ?? null;
                    setSelectedUnit(unit);
                    const storageUnit = unit?.units?.find((entry) => entry.id === storageUnitId)
                        ?? unit?.units?.find((entry) => entry.status === 'available')
                        ?? null;
                    setSelectedStorageUnit(storageUnit);
                } else {
                    setError("Storage location not found.");
                }
            } catch (err: unknown) {
                console.error("Load checkout data error", err);
                setError("Failed to load checkout details.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [siteId, storageUnitId, unitTypeId, sites]);

    const registrationFee = Number(selectedSite?.registrationFee || 30000);
    const annualDues = Number(selectedSite?.annualDues || 35000);
    const pricing = calculateCheckoutPricing({
        width: Number(selectedUnit?.dimensions.width || 0),
        depth: Number(selectedUnit?.dimensions.depth || 0),
        unit: selectedUnit?.dimensions.unit,
        registrationFee,
        annualDues,
        payOnceMonths: PAY_ONCE_MONTHS,
    });
    const monthlyRate = pricing.monthlyRate;
    const squareFootage = pricing.squareFootage;
    const monthlyPlanAmount = pricing.dueTodayForMonthlyPlan;
    const fullPlanAmount = pricing.dueTodayForPayOncePlan;
    const finalAmount = paymentMode === 'full' ? fullPlanAmount : monthlyPlanAmount;

    const handleCheckout = async (provider: PaymentProvider) => {
        if (!selectedSite || !selectedUnit || !siteId || !unitTypeId) {
            setError("Checkout details are incomplete. Please choose a site and unit again.");
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
                    storageUnitId: selectedStorageUnit?.id,
                    startDate: new Date().toISOString(),
                    paymentMode
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
                    provider,
                    amount: finalAmount,
                    paymentMode,
                    monthsCovered: paymentMode === 'full' ? PAY_ONCE_MONTHS : 1
                })
            });

            const payData = await payRes.json();
            if (payData.ok && payData.authorizationUrl) {
                window.location.href = payData.authorizationUrl;
            } else {
                setError(payData.message || "Failed to initialize payment");
                setSubmitting(false);
            }
        } catch {
            setError("An unexpected error occurred.");
            setSubmitting(false);
        }
    };

    const handleBeginCheckout = () => {
        if (!selectedSite || !selectedUnit) {
            setError("Select a storage unit before continuing.");
            return;
        }


        setError(null);
        setIsProviderModalOpen(true);
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

                {!selectedSite || !selectedUnit ? (
                    <div className="rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-xl shadow-blue-900/5">
                        <h1 className="text-3xl font-black text-blue-900">Checkout unavailable</h1>
                        <p className="mt-3 text-gray-500">We couldn&apos;t find the selected storage unit. Please go back and choose a unit again.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* Booking Header */}
                        <div>
                            <h1 className="text-4xl font-black text-blue-900 mb-4">Booking Checkout</h1>
                           <p className="text-gray-500 max-w-xl text-lg">Secure your unit at {selectedSite.name}. Choose monthly payments or pay once upfront.</p>
                            {selectedStorageUnit?.unitNumber ? (
                                <p className="mt-2 text-sm font-semibold text-blue-600">Assigned unit: {selectedStorageUnit.unitNumber}</p>
                            ) : null}
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
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Paid once at signup</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-blue-900 text-xl">₦{registrationFee.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold">
                                            02
                                        </div>
                                        <div>
                                            <span className="block font-black text-blue-900">Monthly Subscription</span>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{squareFootage.toLocaleString()} sq ft × ₦{NAIRA_PER_SQUARE_FOOT_PER_MONTH.toLocaleString()} / month</span>
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
                                Select Payment Plan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMode('monthly')}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left ${paymentMode === 'monthly'
                                            ? "border-blue-600 bg-blue-50 shadow-lg"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${paymentMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <span className="block font-black text-blue-900 text-lg">Monthly Payment</span>
                                    <span className="text-sm text-gray-500">Pay signup fees and your first month today, then continue monthly</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMode('full')}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left ${paymentMode === 'full'
                                            ? "border-blue-600 bg-blue-50 shadow-lg"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${paymentMode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <PartyPopper className="w-6 h-6" />
                                    </div>
                                    <span className="block font-black text-blue-900 text-lg">Pay Once</span>
                                    <span className="text-sm text-gray-500">Pay 12 months upfront in one checkout</span>
                                </button>
                            </div>

                            <div className="mt-6 p-8 bg-white rounded-[2rem] border-2 border-blue-100 animate-in slide-in-from-top-4 duration-500">
                                <p className="text-sm font-black text-blue-900 uppercase tracking-widest">Selected plan</p>
                                <p className="mt-4 text-2xl font-black text-blue-900">
                                    {paymentMode === 'monthly'
                                        ? `₦${monthlyPlanAmount.toLocaleString()} due today`
                                        : `₦${fullPlanAmount.toLocaleString()} due today`}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-blue-700/80">
                                    {paymentMode === 'monthly'
                                        ? `This covers your joining fee, annual dues, and the first month for ${squareFootage.toLocaleString()} square feet.`
                                        : `This covers your joining fee, annual dues, and ${PAY_ONCE_MONTHS} months upfront at ₦${monthlyRate.toLocaleString()} per month.`}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-900/10 border border-gray-50 text-center">
                            <p className="text-sm font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4">Amount Due Today</p>
                            <div className="text-5xl font-black text-blue-900 mb-2 truncate">
                                ₦{finalAmount.toLocaleString()}
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-10">Nigerian Naira (NGN)</p>

                            <div className="mb-10 rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 text-left">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">Payment service</p>
                                <h2 className="mt-3 text-xl font-black text-blue-900">
                                    Choose your payment provider at checkout
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    When you continue, you&apos;ll pick either Paystack or Flutterwave for your monthly or upfront plan.
                                </p>
                                {selectedProvider && (
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                        Last selected: {selectedProvider}
                                    </p>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-xs font-bold mb-6 bg-red-50 py-3 px-4 rounded-xl">{error}</p>}

                            <button
                                onClick={handleBeginCheckout}
                                disabled={submitting}
                                className="w-full bg-[#1642F0] text-white py-6 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "CONTINUE TO CHECKOUT"}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <Info className="w-4 h-4" />
                                Pricing is based on ₦3,000 per square foot per month
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </main>

            {isProviderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl shadow-blue-900/20">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">Select payment service</p>
                                <h2 className="mt-3 text-3xl font-black text-blue-900">Choose how you want to pay</h2>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                                    We&apos;ll create your booking with the selected plan first, then redirect you to your selected payment provider.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProviderModalOpen(false)}
                                className="rounded-full border border-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {paymentProviders.map((provider) => {
                                const isActive = selectedProvider === provider.value;

                                return (
                                    <button
                                        key={provider.value}
                                        type="button"
                                        onClick={() => setSelectedProvider(provider.value)}
                                        className={`rounded-[2rem] border-2 p-6 text-left transition-all ${
                                            isActive
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xl font-black text-blue-900">{provider.label}</p>
                                                <p className="mt-2 text-sm leading-6 text-gray-500">{provider.description}</p>
                                            </div>
                                            <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${isActive ? "border-blue-600" : "border-gray-200"}`}>
                                                {isActive && <div className="h-3 w-3 rounded-full bg-blue-600" />}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsProviderModalOpen(false)}
                                className="rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!selectedProvider || submitting}
                                onClick={() => {
                                    if (!selectedProvider) {
                                        return;
                                    }
                                    setIsProviderModalOpen(false);
                                    void handleCheckout(selectedProvider);
                                }}
                                className="rounded-full bg-[#1642F0] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Starting payment..." : "Continue with selected provider"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
