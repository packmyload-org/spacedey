'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
    LayoutDashboard,
    Users,
    MapPin,
    Box,
    FileText,
    LogOut,
    Settings,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const authStore = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Check auth and admin
    React.useEffect(() => {
        if (!authStore.isAuthenticated) {
            router.push('/auth/signin');
            return;
        }

        if (!authStore.isAdmin()) {
            router.push('/');
            return;
        }
    }, [authStore, router]);

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Sites', href: '/admin/sites', icon: MapPin },
        { name: 'Unit Types', href: '/admin/unit-types', icon: Box },
        { name: 'Invoices', href: '/admin/invoices', icon: FileText },
    ];

    const handleLogout = () => {
        authStore.logout();
        router.push('/');
    };

    if (!authStore.isAuthenticated || !authStore.isAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 mb-8">
                            <Link href="/">
                                <Image
                                    src="/images/logo.png"
                                    alt="Spacedey Logo"
                                    width={140}
                                    height={36}
                                    priority
                                />
                            </Link>
                        </div>
                        <nav className="flex-1 px-2 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                                                }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="group block w-full flex-shrink-0 outline-none"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    {authStore.user?.firstName?.charAt(0)}{authStore.user?.lastName?.charAt(0)}
                                </div>
                                <div className="ml-3 text-left">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {authStore.user?.firstName} {authStore.user?.lastName}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center border-none">
                                        Log out <LogOut className="ml-1 h-3 w-3" />
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu */}
            <div className="md:hidden">
                <div className="fixed inset-0 flex z-40 md:hidden pointer-events-none">
                    <div
                        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out pointer-events-auto ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    <div
                        className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition duration-300 ease-in-out transform pointer-events-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <Image
                                    src="/images/logo.png"
                                    alt="Spacedey Logo"
                                    width={120}
                                    height={32}
                                />
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <item.icon className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <button onClick={handleLogout} className="flex-shrink-0 group block">
                                <div className="flex items-center">
                                    <div className="inline-block h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                        {authStore.user?.firstName?.charAt(0)}{authStore.user?.lastName?.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {authStore.user?.firstName} {authStore.user?.lastName}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center">
                                            Log out <LogOut className="ml-1 h-3 w-3" />
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
