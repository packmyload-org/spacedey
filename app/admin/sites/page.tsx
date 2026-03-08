'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import {
    Loader,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Search,
    Box,
    Mail,
    Phone
} from 'lucide-react';
import Image from 'next/image';

interface Site {
    id: string;
    name: string;
    code: string;
    address: string;
    contactPhone: string;
    contactEmail: string;
    image?: string;
    unitTypes: any[];
    createdAt: string;
}

export default function AdminSitesPage() {
    const authStore = useAuthStore();
    const router = useRouter();
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSites();
    }, [authStore.accessToken]);

    const fetchSites = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/admin/sites', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sites');
            }

            const data = await response.json();
            setSites(data.sites || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSite = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This will also delete all associated unit types.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/sites/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete site');
            }

            setSites(sites.filter(s => s.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete site');
        }
    };

    const filteredSites = sites.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Storage Locations</h1>
                    <p className="text-gray-500">Add and manage storage facilities across Nigeria.</p>
                </div>
                <button
                    onClick={() => router.push('/admin/sites/new')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Site
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, code, or address..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-gray-200">
                    {filteredSites.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            No sites found matching your search.
                        </div>
                    ) : (
                        filteredSites.map((site) => (
                            <div key={site.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col lg:flex-row gap-6">
                                {/* Site Image */}
                                <div className="relative w-full lg:w-48 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    {site.image ? (
                                        <Image
                                            src={site.image}
                                            alt={site.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                                            <MapPin className="w-6 h-6" />
                                            <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur shadow-sm rounded text-[10px] font-bold text-gray-900">
                                        {site.code}
                                    </div>
                                </div>

                                {/* Site Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                {site.name}
                                            </h3>
                                            <div className="flex items-center text-gray-500 text-sm mt-1">
                                                <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                                {site.address}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/sites/${site.id}`)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white"
                                                title="Edit Site"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSite(site.id, site.name)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 bg-white"
                                                title="Delete Site"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            {site.contactEmail}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            {site.contactPhone}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Box className="w-4 h-4 mr-2 text-gray-400" />
                                            {site.unitTypes?.length || 0} Unit Types
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
