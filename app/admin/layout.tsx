'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Users,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and platform health',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Roles, access, and account management',
  },
  {
    name: 'Sites',
    href: '/admin/sites',
    icon: MapPin,
    description: 'Locations, units, and inventory setup',
  },
  {
    name: 'Invoices',
    href: '/admin/invoices',
    icon: FileText,
    description: 'Billing operations and records',
  },
];

const sectionMeta = {
  '/admin': {
    eyebrow: 'Control Center',
    title: 'Dashboard',
    description: 'Monitor operations, manage inventory, and handle billing from one workspace.',
  },
  '/admin/users': {
    eyebrow: 'Access',
    title: 'Users',
    description: 'Manage admins and customers without leaving the dashboard.',
  },
  '/admin/sites': {
    eyebrow: 'Inventory',
    title: 'Sites',
    description: 'Update storage locations, unit types, and operational details.',
  },
  '/admin/invoices': {
    eyebrow: 'Billing',
    title: 'Invoices',
    description: 'Review invoice records and track payment-related activity.',
  },
} as const;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const authStore = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (!authStore.isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (!authStore.isAdmin()) {
      router.push('/');
    }
  }, [authStore, router]);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    authStore.logout();
    router.push('/');
  };

  const initials = `${authStore.user?.firstName?.charAt(0) ?? ''}${authStore.user?.lastName?.charAt(0) ?? ''}`.toUpperCase();

  const currentSection =
    Object.entries(sectionMeta).find(([href]) => (href === '/admin' ? pathname === href : pathname.startsWith(href)))?.[1] ??
    sectionMeta['/admin'];

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  if (!authStore.isAuthenticated || !authStore.isAdmin()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFF4FF]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#1642F0]"></div>
      </div>
    );
  }

  const renderSidebarContent = (collapsed: boolean) => (
    <>
      <div className={`border-b border-white/10 ${collapsed ? 'px-3 py-4' : 'px-5 py-5'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
          <Link href="/" className="flex min-w-0 items-center">
            <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm">
              <Image
                src="/images/logo.png"
                alt="Spacedey Logo"
                width={collapsed ? 34 : 112}
                height={32}
                priority
                className="h-auto w-auto"
              />
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsDesktopSidebarCollapsed((value) => !value)}
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20 lg:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={`border-b border-white/10 ${collapsed ? 'px-3 py-4' : 'px-5 py-5'}`}>
        <div className={`rounded-[24px] bg-white/10 backdrop-blur-sm ${collapsed ? 'p-3' : 'p-4'}`}>
          <p className={`text-[11px] font-black uppercase tracking-[0.28em] text-white/55 ${collapsed ? 'text-center' : ''}`}>
            Admin
          </p>
          <h1 className={`mt-2 text-white ${collapsed ? 'text-center text-base font-black' : 'text-xl font-black'}`}>
            {collapsed ? 'HQ' : 'Spacedey HQ'}
          </h1>
          {!collapsed && (
            <p className="mt-2 text-sm leading-6 text-white/70">
              Work with sites, users, and finance in a focused admin workspace.
            </p>
          )}
        </div>
      </div>

      <nav className={`flex-1 space-y-2 ${collapsed ? 'px-3 py-4' : 'px-4 py-5'}`}>
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-[22px] transition-all ${
                collapsed
                  ? 'justify-center px-3 py-3.5'
                  : 'gap-3 px-4 py-3.5'
              } ${
                isActive
                  ? 'bg-white text-[#1138D8] shadow-[0_18px_45px_rgba(4,16,61,0.2)]'
                  : 'text-white/74 hover:bg-white/10 hover:text-white'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-[#1642F0]' : 'text-white/80'}`} />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className={`truncate text-xs ${isActive ? 'text-[#4D66C8]' : 'text-white/55 group-hover:text-white/72'}`}>
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-white/10 ${collapsed ? 'p-3' : 'p-4'}`}>
        <div className={`rounded-[24px] bg-white/10 backdrop-blur-sm ${collapsed ? 'p-3' : 'p-4'}`}>
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center text-left text-white transition-opacity hover:opacity-90 ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
            title={collapsed ? 'Log out' : undefined}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-[#1642F0]">
              {initials || 'AD'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {authStore.user?.firstName} {authStore.user?.lastName}
                </p>
                <p className="truncate text-xs text-white/65">{authStore.user?.email}</p>
              </div>
            )}
            {!collapsed && <LogOut className="h-4 w-4 flex-shrink-0 text-white/80" />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#EDF3FF] text-[#0F172A]">
      <div className="flex min-h-screen">
        <aside
          className={`hidden border-r border-white/10 bg-[linear-gradient(180deg,#1642F0_0%,#0C2BAA_100%)] text-white lg:flex lg:flex-col ${
            isDesktopSidebarCollapsed ? 'lg:w-[104px]' : 'lg:w-[320px]'
          } transition-[width] duration-300`}
        >
          {renderSidebarContent(isDesktopSidebarCollapsed)}
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#D6E2FF] bg-[#EDF3FF]/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D6E2FF] bg-white text-[#1642F0] shadow-sm transition-colors hover:bg-[#F5F8FF] lg:hidden"
                  aria-label="Open admin menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">
                    {currentSection.eyebrow}
                  </p>
                  <h2 className="truncate text-xl font-black text-[#102A72] sm:text-2xl">
                    {currentSection.title}
                  </h2>
                  <p className="hidden truncate text-sm text-[#5E6C91] md:block">
                    {currentSection.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden rounded-2xl border border-[#D6E2FF] bg-white px-4 py-2.5 text-sm font-semibold text-[#1642F0] transition-colors hover:bg-[#F5F8FF] sm:inline-flex"
                >
                  View site
                </Link>
                <div className="flex items-center gap-3 rounded-2xl border border-[#D6E2FF] bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1642F0] text-sm font-black text-white">
                    {initials || 'AD'}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-bold text-[#102A72]">
                      {authStore.user?.firstName} {authStore.user?.lastName}
                    </p>
                    <p className="truncate text-xs text-[#5E6C91]">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>

      <div className={`lg:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 z-40 bg-[#07153F]/52 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-[320px] flex-col bg-[linear-gradient(180deg,#1642F0_0%,#0C2BAA_100%)] text-white shadow-[0_24px_60px_rgba(7,21,63,0.45)] transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-white/70">Menu</p>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white"
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {renderSidebarContent(false)}
        </aside>
      </div>
    </div>
  );
}
