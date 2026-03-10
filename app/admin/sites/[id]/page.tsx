'use client';

import { useCallback, useEffect, useState, use } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import {
    Loader,
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Box,
    Upload,
    Info,
    Map,
    FileText
} from 'lucide-react';
import Image from 'next/image';

interface UnitType {
    id?: string;
    name: string;
    width: number;
    depth: number;
    unit: string;
    priceAmount: number;
    priceCurrency: string;
    priceOriginalAmount?: number;
    description?: string;
    availableCount: number;
}

type StorageUnitStatus = 'available' | 'reserved' | 'occupied' | 'blocked' | 'maintenance';

interface StorageUnit {
    id?: string;
    unitNumber: string;
    status: StorageUnitStatus;
    label?: string;
    note?: string;
    unitType?: {
        id: string;
        name: string;
    };
    unitTypeId?: string;
}

interface Site {
    id?: string;
    name: string;
    code: string;
    address: string;
    about: string;
    contactPhone: string;
    contactEmail: string;
    lat: number;
    lng: number;
    measuringUnit: string;
    image?: string;
    siteMapUrl?: string;
    unitTypes: UnitType[];
    units: StorageUnit[];
}

export default function SiteEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const isNew = id === 'new';
    const authStore = useAuthStore();
    const router = useRouter();

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingMap, setUploadingMap] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [site, setSite] = useState<Site>({
        name: '',
        code: '',
        address: '',
        about: '',
        contactPhone: '',
        contactEmail: '',
        lat: 6.5244,
        lng: 3.3792, // Default Lagos
        measuringUnit: 'ft',
        unitTypes: [],
        units: [],
    });

    const [unitForm, setUnitForm] = useState<UnitType>({
        name: '',
        width: 0,
        depth: 0,
        unit: 'ft',
        priceAmount: 0,
        priceCurrency: 'NGN',
        availableCount: 0,
    });

    const [storageUnitForm, setStorageUnitForm] = useState<StorageUnit>({
        unitNumber: '',
        status: 'available',
        label: '',
        note: '',
    });

    const fetchSite = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/sites/${id}`, {
                headers: { Authorization: `Bearer ${authStore.accessToken}` }
            });
            const data = await res.json();
            if (data.ok) {
                setSite(data.site);
            } else {
                setError(data.error);
            }
        } catch {
            setError('Failed to load site');
        } finally {
            setLoading(false);
        }
    }, [authStore.accessToken, id]);

    useEffect(() => {
        if (!isNew) {
            fetchSite();
        }
    }, [fetchSite, isNew]);

    const handleSaveSite = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const url = isNew ? '/api/admin/sites' : `/api/admin/sites/${id}`;
            const method = isNew ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify(site)
            });

            const data = await res.json();
            if (data.ok) {
                if (isNew) {
                    router.push(`/admin/sites/${data.site.id}`);
                } else {
                    setSite(data.site);
                    alert('Site updated successfully');
                }
            } else {
                setError(data.error);
            }
        } catch {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    const handleAddUnit = async () => {
        if (!unitForm.name || !unitForm.width || !unitForm.depth || !unitForm.priceAmount) {
            alert('Please fill in name, dimensions, and price');
            return;
        }

        try {
            const res = await fetch(`/api/admin/sites/${id}/unit-types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify(unitForm)
            });
            const data = await res.json();
            if (data.ok) {
                setSite({ ...site, unitTypes: [...site.unitTypes, data.unitType] });
                setUnitForm({ name: '', width: 0, depth: 0, unit: 'ft', priceAmount: 0, priceCurrency: 'NGN', availableCount: 0 });
            } else {
                alert(data.error);
            }
        } catch {
            alert('Failed to add unit type');
        }
    };

    const handleDeleteUnit = async (unitId: string) => {
        if (!window.confirm('Delete this unit type?')) return;

        try {
            const res = await fetch(`/api/admin/sites/${id}/unit-types/${unitId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authStore.accessToken}` }
            });
            if (res.ok) {
                setSite({
                    ...site,
                    unitTypes: site.unitTypes.filter(u => u.id !== unitId),
                    units: site.units.filter((unit) => unit.unitType?.id !== unitId && unit.unitTypeId !== unitId),
                });
            }
        } catch {
            alert('Failed to delete unit type');
        }
    };

    const handleAddStorageUnit = async () => {
        if (!storageUnitForm.unitNumber || !storageUnitForm.unitTypeId) {
            alert('Please fill in unit number and unit type');
            return;
        }

        try {
            const res = await fetch(`/api/admin/sites/${id}/units`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify(storageUnitForm)
            });
            const data = await res.json();

            if (data.ok) {
                setSite((current) => ({
                    ...current,
                    units: [...current.units, data.unit],
                    unitTypes: current.unitTypes.map((unitType) => (
                        unitType.id === data.unit.unitType?.id
                            ? { ...unitType, availableCount: data.unit.status === 'available' ? unitType.availableCount + 1 : unitType.availableCount }
                            : unitType
                    )),
                }));
                setStorageUnitForm({
                    unitNumber: '',
                    status: 'available',
                    label: '',
                    note: '',
                    unitTypeId: storageUnitForm.unitTypeId,
                });
            } else {
                alert(data.error);
            }
        } catch {
            alert('Failed to add storage unit');
        }
    };

    const handleUpdateStorageUnit = async (unitId: string, updates: Partial<StorageUnit>) => {
        try {
            const res = await fetch(`/api/admin/sites/${id}/units/${unitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify(updates)
            });
            const data = await res.json();

            if (data.ok) {
                setSite((current) => ({
                    ...current,
                    units: current.units.map((unit) => unit.id === unitId ? { ...unit, ...data.unit } : unit),
                }));
                fetchSite();
            } else {
                alert(data.error);
            }
        } catch {
            alert('Failed to update storage unit');
        }
    };

    const handleDeleteStorageUnit = async (unitId: string) => {
        if (!window.confirm('Delete this storage unit?')) return;

        try {
            const res = await fetch(`/api/admin/sites/${id}/units/${unitId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authStore.accessToken}` }
            });

            if (res.ok) {
                setSite((current) => ({
                    ...current,
                    units: current.units.filter((unit) => unit.id !== unitId),
                }));
                fetchSite();
            }
        } catch {
            alert('Failed to delete storage unit');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'siteMapUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'image') setUploadingImage(true);
        else setUploadingMap(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', type === 'image' ? 'sites' : 'blueprints');

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                },
                body: formData
            });

            const data = await res.json();
            if (data.ok) {
                setSite({ ...site, [type]: data.url });
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch {
            alert('An error occurred during upload');
        } finally {
            if (type === 'image') setUploadingImage(false);
            else setUploadingMap(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push('/admin/sites')}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back to Sites
                </button>
                <div className="flex items-center gap-3">
                    {isNew ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">New Site</span>
                    ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Editing: {site.code}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-8">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Info className="w-5 h-5 mr-2 text-blue-600" />
                            General Information
                        </h2>
                        <form onSubmit={handleSaveSite} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={site.name}
                                        onChange={e => setSite({ ...site, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="e.g. Lagos Island Storage"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unique Code (Uppercase)</label>
                                    <input
                                        required
                                        type="text"
                                        value={site.code}
                                        onChange={e => setSite({ ...site, code: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="e.g. LAG-001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    required
                                    type="text"
                                    value={site.address}
                                    onChange={e => setSite({ ...site, address: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Street, City, State"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About this Site</label>
                                <textarea
                                    rows={5}
                                    value={site.about}
                                    onChange={e => setSite({ ...site, about: e.target.value })}
                                    className="w-full resize-y px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Describe what makes this location useful for customers, the area it serves, and the kind of storage needs it supports."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                    <input
                                        required
                                        type="text"
                                        value={site.contactPhone}
                                        onChange={e => setSite({ ...site, contactPhone: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={site.contactEmail}
                                        onChange={e => setSite({ ...site, contactEmail: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.000001"
                                        value={site.lat}
                                        onChange={e => setSite({ ...site, lat: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.000001"
                                        value={site.lng}
                                        onChange={e => setSite({ ...site, lng: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200 disabled:bg-gray-400"
                                >
                                    {saving ? (
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        <Save className="w-5 h-5 mr-2" />
                                    )}
                                    {isNew ? 'Create Site' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Unit Types Section - Only available for existing sites */}
                    {!isNew && (
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Box className="w-5 h-5 mr-2 text-blue-600" />
                                    Unit Types
                                </h2>
                                <span className="text-sm font-medium text-gray-500">{site.unitTypes.length} types</span>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Add Unit Form */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Add New Unit Type</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Size Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Large"
                                                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={unitForm.name}
                                                onChange={e => setUnitForm({ ...unitForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Dimensions (W x D)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="W"
                                                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={unitForm.width || ''}
                                                    onChange={e => setUnitForm({ ...unitForm, width: parseFloat(e.target.value) })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="D"
                                                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={unitForm.depth || ''}
                                                    onChange={e => setUnitForm({ ...unitForm, depth: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Price (₦/mo)</label>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={unitForm.priceAmount || ''}
                                                onChange={e => setUnitForm({ ...unitForm, priceAmount: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Available</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={unitForm.availableCount || ''}
                                                    onChange={e => setUnitForm({ ...unitForm, availableCount: parseInt(e.target.value) || 0 })}
                                                />
                                                <button
                                                    onClick={handleAddUnit}
                                                    className="px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Units List */}
                                <div className="space-y-3">
                                    {site.unitTypes.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8 italic">No unit types added yet.</p>
                                    ) : (
                                        site.unitTypes.map((unit) => (
                                            <div key={unit.id} className="flex items-center justify-between p-4 border rounded-xl hover:border-blue-200 transition-colors">
                                                <div>
                                                    <p className="font-bold text-gray-900">{unit.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {unit.width} x {unit.depth} {unit.unit} | ₦{unit.priceAmount.toLocaleString()} / mo
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full font-medium ${unit.availableCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {unit.availableCount} available
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteUnit(unit.id!)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {!isNew && (
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Box className="w-5 h-5 mr-2 text-blue-600" />
                                    Storage Units
                                </h2>
                                <span className="text-sm font-medium text-gray-500">{site.units.length} units</span>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Add New Unit</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Unit Number</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. SP051"
                                                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={storageUnitForm.unitNumber}
                                                onChange={e => setStorageUnitForm({ ...storageUnitForm, unitNumber: e.target.value.toUpperCase() })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Unit Type</label>
                                            <select
                                                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={storageUnitForm.unitTypeId || ''}
                                                onChange={e => setStorageUnitForm({ ...storageUnitForm, unitTypeId: e.target.value })}
                                            >
                                                <option value="">Select type</option>
                                                {site.unitTypes.map((unitType) => (
                                                    <option key={unitType.id} value={unitType.id}>
                                                        {unitType.name} ({unitType.width} x {unitType.depth} {unitType.unit})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Status</label>
                                            <select
                                                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={storageUnitForm.status}
                                                onChange={e => setStorageUnitForm({ ...storageUnitForm, status: e.target.value as StorageUnitStatus })}
                                            >
                                                <option value="available">Available</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="blocked">Blocked</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Label</label>
                                            <input
                                                type="text"
                                                placeholder="Optional"
                                                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={storageUnitForm.label || ''}
                                                onChange={e => setStorageUnitForm({ ...storageUnitForm, label: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <button
                                                onClick={handleAddStorageUnit}
                                                className="w-full inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Unit
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Note</label>
                                        <input
                                            type="text"
                                            placeholder="Optional note like cleaning, overdue, broken door"
                                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={storageUnitForm.note || ''}
                                            onChange={e => setStorageUnitForm({ ...storageUnitForm, note: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {site.units.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8 italic">No storage units added yet.</p>
                                    ) : (
                                        site.units.map((unit) => (
                                            <div key={unit.id} className="rounded-xl border border-gray-200 p-4">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{unit.unitNumber}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {unit.unitType?.name || 'Unknown type'}
                                                        </p>
                                                        {unit.note ? (
                                                            <p className="mt-1 text-xs text-gray-500">{unit.note}</p>
                                                        ) : null}
                                                    </div>
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                        <input
                                                            type="text"
                                                            defaultValue={unit.label || ''}
                                                            placeholder="Label"
                                                            onBlur={(e) => handleUpdateStorageUnit(unit.id!, { label: e.target.value })}
                                                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                        <select
                                                            value={unit.status}
                                                            onChange={(e) => handleUpdateStorageUnit(unit.id!, { status: e.target.value as StorageUnitStatus })}
                                                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        >
                                                            <option value="available">Available</option>
                                                            <option value="reserved">Reserved</option>
                                                            <option value="occupied">Occupied</option>
                                                            <option value="blocked">Blocked</option>
                                                            <option value="maintenance">Maintenance</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDeleteStorageUnit(unit.id!)}
                                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Images */}
                <div className="space-y-6">
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Upload className="w-4 h-4 mr-2 text-blue-600" />
                            Media
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Facility Image</label>
                                <div
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    className="aspect-video relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 group cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
                                >
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'image')}
                                    />
                                    {uploadingImage ? (
                                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                                    ) : site.image ? (
                                        <Image src={site.image} alt="Feature" fill className="object-cover" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold">Select Image</span>
                                        </>
                                    )}
                                </div>
                                <p className="mt-2 text-[10px] text-gray-400">Recommended: 16:9 aspect ratio, at least 1200x675px</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Site Map Layout</label>
                                <div
                                    onClick={() => document.getElementById('map-upload')?.click()}
                                    className="aspect-[4/3] relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 group cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
                                >
                                    <input
                                        type="file"
                                        id="map-upload"
                                        className="hidden"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileUpload(e, 'siteMapUrl')}
                                    />
                                    {uploadingMap ? (
                                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                                    ) : site.siteMapUrl ? (
                                        site.siteMapUrl.endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center">
                                                <FileText className="w-12 h-12 text-blue-500 mb-1" />
                                                <span className="text-[10px] font-bold">PDF Blueprint</span>
                                            </div>
                                        ) : (
                                            <Image src={site.siteMapUrl} alt="Map" fill className="object-cover" />
                                        )
                                    ) : (
                                        <>
                                            <Map className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold">Upload Blueprint</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-blue-900 text-white rounded-xl shadow-sm border border-blue-900 p-6">
                        <h3 className="text-lg font-bold mb-2">Admin Help</h3>
                        <p className="text-blue-100 text-sm mb-4">
                            Need to add coordinates? Use Google Maps to find the latitude and longitude of the facility.
                        </p>
                        <a
                            href="https://www.google.com/maps"
                            target="_blank"
                            className="inline-flex items-center text-xs font-bold underline hover:text-white transition-colors"
                        >
                            Open Google Maps <Box className="ml-1 w-3 h-3" />
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
