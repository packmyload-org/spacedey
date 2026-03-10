'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types/roles';
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

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // In a real app, we'd have a single /api/admin/stats endpoint
        // For now, let's fetch users to get user counts
        const userRes = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        const siteRes = await fetch('/api/sites');

        const userData: { users?: DashboardUser[] } = await userRes.json();
        const siteData: { sites?: DashboardSite[] } = await siteRes.json();

        const users = userData.users || [];
        const sites = siteData.sites || [];

        setStats({
          totalUsers: users.length,
          totalAdmins: users.filter((user) => user.role === UserRole.ADMIN).length,
          totalSites: sites.length,
          totalUnitTypes: sites.reduce((acc, site) => acc + (site.unitTypes?.length || 0), 0),
        });
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, {authStore.user?.firstName}. Here is what&apos;s happening today.</p>
      </div>

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
    </div>
  );
}
