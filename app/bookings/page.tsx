"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Image from "next/image";
import { Tag, CreditCard, Loader2, MapPin, CalendarClock, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { PaymentProvider } from "@/lib/db/entities/Payment";
import { formatStorageUnitLabel } from "@/lib/pricing/storagePricing";

interface BookingItem {
    id: string;
    status: string;
    totalAmount: number | string;
    amountPaid: number | string;
    endDate?: string | null;
    billingMetadata?: {
        billingType?: "one_time" | "recurring";
        recurringDurationMonths?: number;
    } | null;
    site?: {
        image?: string;
        name?: string;
    };
    unitType?: {
        name?: string;
        width?: number;
        depth?: number;
        unit?: string;
    };
    storageUnit?: {
        unitNumber?: string;
    };
}

function formatBookingUnitLabel(booking: BookingItem) {
    if (booking.unitType?.width && booking.unitType?.depth) {
        return formatStorageUnitLabel({
            width: Number(booking.unitType.width),
            depth: Number(booking.unitType.depth),
            unit: booking.unitType.unit,
        });
    }

    return booking.unitType?.name || "Storage Unit";
}

function formatDateLabel(dateString?: string | null) {
    if (!dateString) {
        return null;
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default function UserBookingsPage() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();
                if (data.ok) {
                    setBookings(data.bookings);
                }
            } catch (err) {
                console.error("Fetch bookings error", err);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, []);

    const handlePayBalance = async (booking: BookingItem) => {
        const amountDue = Math.max(Number(booking.totalAmount) - Number(booking.amountPaid), 0);
        if (amountDue <= 0) return;

        setProcessingId(booking.id);
        try {
            const res = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: booking.id,
                    provider: PaymentProvider.PAYSTACK,
                    amount: amountDue
                })
            });
            const data = await res.json();
            if (data.ok && data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
            } else {
                alert(data.message || "Failed to initialize payment");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-blue-900 mb-2">My Bookings</h1>
                        <p className="text-gray-500 text-lg">Manage your storage bookings and keep track of active billing records</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100 shadow-sm" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-100 shadow-xl shadow-blue-900/5 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Tag className="w-12 h-12 text-blue-200" />
                        </div>
                        <h2 className="text-2xl font-black text-blue-900 mb-3">No bookings yet</h2>
                        <p className="text-gray-500 mb-10 text-lg">Ready to make your first storage booking? Find a location near you.</p>
                        <Link href="/search" className="inline-block bg-blue-600 text-white px-10 py-5 rounded-full font-black shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                            EXPORE LOCATIONS
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {bookings.map((booking) => {
                            const billingType = booking.billingMetadata?.billingType ?? "one_time";
                            const isRecurring = billingType === "recurring";
                            const balance = Math.max(Number(booking.totalAmount) - Number(booking.amountPaid), 0);
                            const percent = Number(booking.totalAmount) > 0
                                ? Math.min(100, Math.round((Math.min(Number(booking.amountPaid), Number(booking.totalAmount)) / Number(booking.totalAmount)) * 100))
                                : 0;
                            const unitLabel = formatBookingUnitLabel(booking);
                            const recurringEndDateLabel = formatDateLabel(booking.endDate);

                            return (
                                <div key={booking.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 group hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col md:flex-row gap-8">
                                    <div className="md:w-48 flex-shrink-0">
                                            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-inner">
                                            {booking.site?.image ? (
                                                <Image src={booking.site.image} alt={booking.site.name || 'Storage site'} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-blue-200"><MapPin className="w-12 h-12" /></div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${booking.status === 'active' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-black text-blue-900 mb-1">{booking.site?.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                                                <Box className="w-3 h-3 text-blue-400" />
                                                {booking.storageUnit?.unitNumber
                                                    ? `${booking.storageUnit.unitNumber} • ${unitLabel}`
                                                    : unitLabel}
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            {isRecurring ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                                                        <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">Billing</span>
                                                        <span className="mt-1 flex items-center gap-2 text-sm font-bold text-blue-900">
                                                            <RefreshCcw className="w-4 h-4" />
                                                            Recurring monthly
                                                        </span>
                                                    </div>
                                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Term Ends</span>
                                                        <span className="mt-1 flex items-center gap-2 text-sm font-bold text-gray-900">
                                                            <CalendarClock className="w-4 h-4 text-blue-500" />
                                                            {recurringEndDateLabel || "Not set"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex justify-between text-xs font-black text-blue-900 uppercase tracking-widest mb-2">
                                                        <span>Payment Progress</span>
                                                        <span>{percent}%</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-end">
                                                <div className="text-left">
                                                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {isRecurring ? "Current Month Covered" : "Balance Due"}
                                                    </span>
                                                    <span className="text-xl font-black text-blue-900">
                                                        {isRecurring ? "Yes" : `₦${balance.toLocaleString()}`}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
                                                    <span className="text-sm font-black text-green-600">₦{Number(booking.amountPaid).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`mt-auto grid gap-3 ${isRecurring ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                                            {!isRecurring && (
                                                <button
                                                    onClick={() => handlePayBalance(booking)}
                                                    disabled={processingId === booking.id || balance <= 0}
                                                    className="flex items-center justify-center gap-2 bg-[#1642F0] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    {processingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                                    Complete Payment
                                                </button>
                                            )}
                                            <Link href="/invoices" className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-blue-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                                                View Invoices
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

function Box({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
    )
}
