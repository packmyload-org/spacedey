"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { FileText, Calendar, Tag } from "lucide-react";
import Link from "next/link";

interface UserInvoice {
    id: string;
    invoiceNumber: string;
    total: number | string;
    createdAt: string;
    booking?: {
        billingMetadata?: {
            billingType?: 'one_time' | 'recurring';
        } | null;
        site?: {
            name?: string;
        };
    };
}

export default function UserInvoicesPage() {
    const [invoices, setInvoices] = useState<UserInvoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvoices() {
            try {
                const res = await fetch('/api/invoices');
                const data: { ok?: boolean; invoices?: UserInvoice[] } = await res.json();
                if (data.ok) {
                    setInvoices(data.invoices || []);
                }
            } catch (err) {
                console.error("Fetch invoices error", err);
            } finally {
                setLoading(false);
            }
        }
        fetchInvoices();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-blue-900">Billing & Receipts</h1>
                    <p className="text-gray-500">View your paid storage records and whether each charge was one-time or recurring.</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No invoices yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your invoices will appear here once you make a successful storage booking.</p>
                        <Link href="/search" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">
                            Find Storage
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Storage Facility</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Billing</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-gray-900">{invoice.invoiceNumber}</span>
                                                        <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Paid</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center text-gray-600">
                                                    <Tag className="w-4 h-4 mr-2 text-blue-400" />
                                                    <span className="font-medium">{invoice.booking?.site?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                    invoice.booking?.billingMetadata?.billingType === 'recurring'
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {invoice.booking?.billingMetadata?.billingType === 'recurring' ? 'Recurring' : 'One-time'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(invoice.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-bold text-blue-900">₦{Number(invoice.total).toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
