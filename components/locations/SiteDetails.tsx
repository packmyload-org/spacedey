"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, MapPin, Phone, Mail, Clock, Check } from 'lucide-react';
import { StoreganiseSite, StoreganiseSitemap } from '@/lib/types/storeganise';
import SiteMapViewer from './SiteMapViewer';

interface SiteDetailsProps {
    site: StoreganiseSite;
    sitemap: StoreganiseSitemap | null;
}

// Helper to get localized string
const getStr = (obj: any) => {
    if (typeof obj === 'string') return obj;
    if (obj && typeof obj === 'object') {
        return obj.en || Object.values(obj)[0] || '';
    }
    return '';
};

export default function SiteDetails({ site, sitemap }: SiteDetailsProps) {
    const title = getStr(site.title) || site.code;
    const addressStr = site.address 
        ? [site.address.street, site.address.city, site.address.state, site.address.postalCode].filter(Boolean).join(', ')
        : 'Address available on request';

    const unitTypes = site.unitTypes || [];

    const displayImage = React.useMemo(() => {
        if (!site.image) return '/images/hero1.jpg'; // Default fallback
        if (site.image.startsWith('http') || site.image.startsWith('/')) return site.image;
        return `/images/${site.image}`;
    }, [site.image]);

    return (
        <div className="pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/locations" className="hover:text-blue-600">Locations</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{title}</span>
                    </div>
                    <div className="mt-4 mb-2">
                        <Link href="/locations" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to all locations
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Image & Description */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Hero Image */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src={displayImage}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Description (if any) */}
                        {site.subtitle && (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Location</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {getStr(site.subtitle)}
                                </p>
                            </div>
                        )}

                        {/* Sitemap Section */}
                        <SiteMapViewer svgContent={sitemap?.svg} />
                    </div>

                    {/* Right Column: Key Info & Actions */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-blue-100 shadow-lg sticky top-24">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                            
                            <div className="flex items-start gap-3 mt-4 text-gray-600">
                                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm leading-relaxed">{addressStr}</span>
                            </div>

                            <div className="space-y-4 mt-8 pt-8 border-t border-gray-100">
                                {site.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide">Phone</div>
                                            <a href={`tel:${site.phone}`} className="font-medium text-gray-900 hover:text-blue-600">{site.phone}</a>
                                        </div>
                                    </div>
                                )}

                                {site.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                                            <a href={`mailto:${site.email}`} className="font-medium text-gray-900 hover:text-blue-600">{site.email}</a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Office Hours</div>
                                        <div className="font-medium text-gray-900">Mon-Fri: 9am - 6pm</div>
                                        <div className="text-sm text-gray-500">Sat: 10am - 4pm</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg">
                                    Book a Unit Now
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    No credit card required for reservation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Units Grid */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Available Storage Units</h2>
                    </div>
                    
                    {unitTypes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {unitTypes.map((unit) => {
                                const isLowStock = unit.availableCount && unit.availableCount < 3;
                                return (
                                    <div key={unit.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col relative">
                                        {/* Header */}
                                        <div className="p-6 pb-4 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{getStr(unit.title)}</h3>
                                                <p className="text-gray-500 text-sm mt-1">{unit.width} x {unit.depth} {site.measure || 'm'}</p>
                                            </div>
                                            {isLowStock && (
                                                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 animate-pulse">
                                                    Only {unit.availableCount} left
                                                </span>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 flex-grow flex flex-col justify-between">
                                            <div className="space-y-4 mb-6">
                                                 {/* Price */}
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-extrabold text-blue-600">₦{unit.price?.toLocaleString()}</span>
                                                    <span className="text-gray-400 font-medium">/ month</span>
                                                </div>

                                                {/* Features / Description */}
                                                {unit.description && (
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 bg-green-100 p-1 rounded-full">
                                                            <Check className="w-3 h-3 text-green-600" />
                                                        </div>
                                                        <span className="text-sm text-gray-600 leading-relaxed">{getStr(unit.description)}</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="bg-blue-50 p-1.5 rounded-md">
                                                        <MapPin className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <span>Ground Floor Access</span>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <button className="w-full py-3.5 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95">
                                                Reserve Now
                                            </button>
                                            <p className="text-center text-xs text-gray-400 mt-3">Lock in this price today</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Units Available Online</h3>
                            <p className="text-gray-500 max-w-md mx-auto">We might have units that aren't listed yet. Please give us a call to check availability.</p>
                            <a href={`tel:${site.phone}`} className="mt-6 inline-flex items-center text-blue-600 font-medium hover:underline">
                                <Phone className="w-4 h-4 mr-2" />
                                Call {site.phone}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
