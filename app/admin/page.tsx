'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { PaymentProvider } from '@/lib/db/entities/Payment';
import { UserRole } from '@/lib/types/roles';
import type { PaymentMethodsResponse, PaymentMethodStatus } from '@/lib/types/local';
import { Loader, Users, MapPin, Box, FileText, TrendingUp } from 'lucide-react';

interface DashboardUser {
  role: UserRole;
}

interface DashboardSite {
  unitTypes?: unknown[];
}

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalSites: number;
  totalUnitTypes: number;
}

export default function AdminDashboard() {
  const authStore = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalSites: 0,
    totalUnitTypes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodStatus[]>([]);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(null);
  const [savingProvider, setSavingProvider] = useState<PaymentProvider | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const userRes = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        const siteRes = await fetch('/api/sites');
        const paymentMethodRes = await fetch('/api/admin/payment-methods', {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });

        const userData: { users?: DashboardUser[] } = await userRes.json();
        const siteData: { sites?: DashboardSite[] } = await siteRes.json();
        const paymentMethodData = await paymentMethodRes.json() as Partial<PaymentMethodsResponse & { error?: string }>;

        const users = userData.users || [];
        const sites = siteData.sites || [];

        setStats({
          totalUsers: users.length,
          totalAdmins: users.filter((user) => user.role === UserRole.ADMIN).length,
          totalSites: sites.length,
          totalUnitTypes: sites.reduce((acc, site) => acc + (site.unitTypes?.length || 0), 0),
        });

        if (paymentMethodRes.ok && Array.isArray(paymentMethodData.methods)) {
          setPaymentMethods(paymentMethodData.methods);
          setPaymentMethodsError(null);
        } else {
          setPaymentMethods([]);
          setPaymentMethodsError(paymentMethodData.error || 'Failed to load payment methods');
        }
      } catch {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    if (authStore.isAuthenticated && authStore.isAdmin()) {
      fetchStats();
    }
  }, [authStore]);

  const handleTogglePaymentMethod = async (provider: PaymentProvider, enabled: boolean) => {
    try {
      setSavingProvider(provider);
      setPaymentMethodsError(null);

      const response = await fetch('/api/admin/payment-methods', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: JSON.stringify({
          methods: [{ provider, enabled }],
        }),
      });

      const data = await response.json() as Partial<PaymentMethodsResponse & { error?: string }>;

      if (!response.ok || !Array.isArray(data.methods)) {
        throw new Error(data.error || 'Failed to update payment method');
      }

      setPaymentMethods(data.methods);
    } catch (toggleError) {
      setPaymentMethodsError(toggleError instanceof Error ? toggleError.message : 'Failed to update payment method');
    } finally {
      setSavingProvider(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Admin Users', value: stats.totalAdmins, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Sites', value: stats.totalSites, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Unit Types', value: stats.totalUnitTypes, icon: Box, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:scale-[1.02]">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity or other sections can go here */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
            Platform Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database Connection</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage Service</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sync Status</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Synced</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-orange-500" />
            Quick Links
          </h2>
          <ul className="divide-y divide-gray-200">
            <li>
              <button
                onClick={() => window.location.href = '/admin/sites'}
                className="w-full text-left py-3 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Add new storage location
              </button>
            </li>
            <li>
              <button
                onClick={() => window.location.href = '/admin/users'}
                className="w-full text-left py-3 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Manage user permissions
              </button>
            </li>
            <li>
              <button
                className="w-full text-left py-3 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View billing reports
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
        <p className="mb-6 text-sm text-gray-500">
          Control which payment providers the checkout flow can offer. Disabled methods stay hidden from customers and are blocked server-side.
        </p>

        {paymentMethodsError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentMethodsError}
          </div>
        ) : null}

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const isSaving = savingProvider === method.provider;

            return (
              <div key={method.provider} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">{method.label}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {method.available
                      ? 'Available in checkout.'
                      : method.enabled
                        ? 'Configured status is preventing checkout availability.'
                        : 'Disabled by admin.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className={`rounded-full px-3 py-1 ${method.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {method.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${method.configured ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {method.configured ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePaymentMethod(method.provider, !method.enabled)}
                  disabled={isSaving}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    method.enabled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-[#1642F0] text-white hover:bg-blue-700'
                  }`}
                >
                  {isSaving ? 'Saving...' : method.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
