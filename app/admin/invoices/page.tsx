"use client";

import React, { useState, useEffect } from "react";
import { FileText, Search, Filter, Eye, Download } from "lucide-react";
import Link from "next/link";

interface AdminInvoice {
    id: string;
    invoiceNumber: string;
    total: number | string;
    createdAt: string;
    status?: string;
    user?: {
        email?: string;
        firstName?: string;
        lastName?: string;
    };
    booking?: {
        site?: {
            name?: string;
        };
    };
}

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchInvoices() {
            try {
                const res = await fetch('/api/invoices');
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
    }, []);

    const normalizedQuery = searchQuery.toLowerCase();
    const filteredInvoices = invoices.filter((invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
        (invoice.user?.email || "").toLowerCase().includes(normalizedQuery) ||
        (invoice.user?.firstName || "").toLowerCase().includes(normalizedQuery)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Invoices</h1>
                    <p className="text-gray-500 text-sm">Review all platform transactions and billing records</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm">
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by invoice #, name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-xl font-black text-blue-900 text-sm">₦{invoices.reduce((sum, inv) => sum + Number(inv.total), 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Active Invoices</p>
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
                                        <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
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
                                                <span className="block font-medium text-gray-900 text-sm">{invoice.user?.firstName} {invoice.user?.lastName}</span>
                                                <span className="text-xs text-gray-500">{invoice.user?.email}</span>
                                            </div>
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
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/invoices/${invoice.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>
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
