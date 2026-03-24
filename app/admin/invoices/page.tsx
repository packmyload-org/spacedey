"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface AdminInvoice {
    id: string;
    invoiceNumber: string;
    total: number;
    createdAt: string;
    dueDate: string;
    status: string;
    user: {
        email: string;
        firstName: string;
        lastName: string;
    };
    booking: {
        status: string;
        billingMetadata?: {
            billingType?: 'one_time' | 'recurring';
        } | null;
        site?: {
            name?: string;
        };
    } | null;
}

export default function AdminInvoicesPage() {
    const authStore = useAuthStore();
    const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!authStore.accessToken) {
            return;
        }

        async function fetchInvoices() {
            try {
                const res = await fetch('/api/admin/invoices', {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                });
                const data: { ok?: boolean; invoices?: AdminInvoice[] } = await res.json();
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
    }, [authStore.accessToken]);

    const normalizedQuery = searchQuery.toLowerCase();
    const filteredInvoices = invoices.filter((invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
        invoice.user.email.toLowerCase().includes(normalizedQuery) ||
        invoice.user.firstName.toLowerCase().includes(normalizedQuery) ||
        invoice.user.lastName.toLowerCase().includes(normalizedQuery)
    );

    return (
        <div className="space-y-8">
            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by invoice #, name or email..."
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-xl font-black text-blue-900 text-sm">₦{invoices.reduce((sum, inv) => sum + Number(inv.total), 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Tracked Invoices</p>
                        <p className="text-xl font-black text-blue-900 text-sm">{invoices.length}</p>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Billing</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No invoices found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs">
                                                    #{invoice.invoiceNumber.split('-').pop()}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-gray-900 text-sm">{invoice.invoiceNumber}</span>
                                                    <span className="text-xs text-gray-400">{invoice.booking?.site?.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="block font-medium text-gray-900 text-sm">{invoice.user.firstName} {invoice.user.lastName}</span>
                                                <span className="text-xs text-gray-500">{invoice.user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                invoice.booking?.billingMetadata?.billingType === 'recurring'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {invoice.booking?.billingMetadata?.billingType === 'recurring' ? 'Recurring' : 'One-time'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(invoice.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900 text-sm">₦{Number(invoice.total).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${invoice.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/invoices/${invoice.id}`}
                                                className="inline-flex items-center gap-2 text-sm font-bold text-[#1642F0] transition hover:text-[#1238D4]"
                                            >
                                                View details
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
