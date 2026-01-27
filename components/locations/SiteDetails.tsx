"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Check, Box } from 'lucide-react';
import { StoreganiseSite, StoreganiseSitemap } from '@/lib/types/storeganise';

interface SiteDetailsProps {
    site: StoreganiseSite;
    sitemap: StoreganiseSitemap | null;
}

// Helper to get localized string
const getStr = (obj: unknown) => {
    if (typeof obj === 'string') return obj;
    if (obj && typeof obj === 'object') {
        const localizedObj = obj as { en?: string; [key: string]: unknown };
        return localizedObj.en || (Object.values(localizedObj).find(val => typeof val === 'string') as string) || '';
    }
    return '';
};

export default function SiteDetails({ site }: Readonly<SiteDetailsProps>) {
    const title = getStr(site.title) || site.code;

    const addressStr = typeof getStr(site.address) == 'string'? getStr(site.address) :'Address available on request';

    const unitTypes = site.unitTypes || [];

    const displayImage = React.useMemo(() => {
        if (!site.image) return '/images/hero1.jpg'; // Default fallback
        if (site.image.startsWith('http') || site.image.startsWith('/')) return site.image;
        return `/images/${site.image}`;
    }, [site.image]);

    return (
        <div className="pb-20">
            {/* Breadcrumb */}
            {/* <div className="bg-white border-b border-gray-200 sticky top-[80px] z-10 shadow-sm backdrop-blur-md bg-white/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center text-sm text-gray-500 overflow-hidden whitespace-nowrap">
                            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                            <span className="mx-2 text-gray-300">/</span>
                            <Link href="/locations" className="hover:text-blue-600 transition-colors">Locations</Link>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-900 font-medium truncate">{title}</span>
                        </div>
                        <Link href="/locations" className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            All locations
                        </Link>
                    </div>
                </div>
            </div> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Image & Description */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Hero Image */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                            <Image
                                src={displayImage}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h1 className="text-2xl font-bold shadow-black drop-shadow-md">{title}</h1>
                            </div>
                        </div>

                        {/* Description (if any) */}
                        {site.subtitle && (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                    About this Location
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {getStr(site.subtitle)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Key Info & Actions */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-200 shadow-xl sticky top-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Location Info</h2>
                                    <p className="text-sm text-gray-500">Contact & Hours</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm leading-relaxed font-medium text-gray-700">{addressStr}</span>
                            </div>

                            <div className="space-y-5 border-t border-gray-100 pt-6">
                                {site.phone && (
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            <span className="text-sm font-medium">Phone</span>
                                        </div>
                                        <a href={`tel:${site.phone}`} className="text-blue-600 font-bold hover:underline">{site.phone}</a>
                                    </div>
                                )}

                                {site.email && (
                                    <div className="flex items-center justify-between group">
                                         <div className="flex items-center gap-3 text-gray-600">
                                            <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            <span className="text-sm font-medium">Email</span>
                                        </div>
                                        <a href={`mailto:${site.email}`} className="text-blue-600 font-bold hover:underline text-sm">{site.email}</a>
                                    </div>
                                )}

                                <div className="flex items-start justify-between group">
                                     <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        <span className="text-sm font-medium">Hours</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900">Mon-Fri: 9am - 6pm</div>
                                        <div className="text-xs text-gray-500">Sat: 10am - 4pm</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98]">
                                    Book a Unit Now
                                </button>
                                <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> No hidden fees</span>
                                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Instant access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Units Grid */}
                <div className="mt-20">
                    <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Available Storage Units</h2>
                            <p className="text-gray-500 mt-2">Choose the perfect size for your needs</p>
                        </div>
                        <div className="hidden sm:block text-sm text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full">
                            {unitTypes.length} unit types available
                        </div>
                    </div>
                    
                    {unitTypes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {unitTypes.map((unit) => {
                                const isLowStock = unit.availableCount && unit.availableCount < 3;
                                return (
                                    <div key={unit.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col relative">
                                        {/* Header */}
                                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                    <Box className="w-6 h-6" />
                                                </div>
                                                {isLowStock && (
                                                    <span className="bg-red-50 text-red-600 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border border-red-100 animate-pulse">
                                                        Low Stock
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{getStr(unit.title)}</h3>
                                            <div className="flex flex-col gap-2 mt-2">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                </div>
                                                    <div className="flex flex-wrap gap-1">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {getStr(unit?.info)}
                                                            </span>
                                                    </div>
                                            </div>
                                        </div>
                                        {/* Body */}
                                        <div className="p-6 flex-grow flex flex-col justify-between">
                                            <div className="space-y-5 mb-6">
                                                 {/* Price */}
                                                <div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-4xl font-extrabold text-blue-600 tracking-tight">₦{unit.price?.toLocaleString()}</span>
                                                        <span className="text-gray-400 font-medium text-sm">/ month</span>
                                                    </div>
                                                    <p className="text-xs text-green-600 font-medium mt-1">Best value for this size</p>
                                                </div>

                                                {/* Features / Description */}
                                                {unit.description ? (
                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div className="mt-0.5">
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <span className="text-sm text-gray-600 leading-snug">{getStr(unit.description)}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                        <MapPin className="w-4 h-4 text-blue-500" />
                                                        <span>Ground Floor Access</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA */}
                                            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:translate-y-0">
                                                Reserve Now
                                            </button>
                                            <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-wide font-medium">
                                                No payment needed today
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Units Available Online</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">We might have units that aren&apos;t listed yet. Please give us a call to check availability.</p>
                            <a href={`tel:${site.phone}`} className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 shadow-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                <Phone className="w-4 h-4 mr-2" />
                                Call {site.phone}
                            </a>
                        </div>
                    )}
                </div>

                {/* Products Section */}
                {site.products && site.products.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Products & Services</h2>
                                <p className="text-gray-500 mt-2">Moving supplies and extra services</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {site.products.map((product) => (
                                <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all p-4 flex flex-col">
                                    <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                         <Image
                                            src={product.image || '/images/image2.png'}
                                            alt={getStr(product.title)}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{getStr(product.title)}</h3>
                                    {product.description && (
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{getStr(product.description)}</p>
                                    )}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-xl font-bold text-blue-600">₦{product.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
