'use client';

import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types/roles';
import { Loader, Users, Plus, Edit2, Search, Trash2, MailCheck, MailWarning, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    emailVerifiedAt: string | null;
    createdAt: string;
    deletedAt: string | null;
}

const USERS_PER_PAGE = 10;

export default function AdminUsersPage() {
    const authStore = useAuthStore();
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [openActionUserId, setOpenActionUserId] = useState<string | null>(null);
    const [openActionDirection, setOpenActionDirection] = useState<'up' | 'down'>('down');
    const deferredSearchTerm = useDeferredValue(searchTerm);
    const actionMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const fetchUsers = useCallback(async (page: number, search: string) => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(USERS_PER_PAGE),
            });

            if (search.trim()) {
                params.set('search', search.trim());
            }

            const response = await fetch(`/api/admin/users?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users || []);
            setTotalUsers(Number(data.total) || 0);
            setTotalPages(Math.max(1, Number(data.totalPages) || 1));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setUsers([]);
            setTotalUsers(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [authStore.accessToken]);

    useEffect(() => {
        if (!authStore.accessToken) {
            return;
        }

        fetchUsers(currentPage, deferredSearchTerm);
    }, [authStore.accessToken, currentPage, deferredSearchTerm, fetchUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [deferredSearchTerm]);

    useEffect(() => {
        if (!openActionUserId) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const menu = actionMenuRefs.current[openActionUserId];
            if (!menu || menu.contains(event.target as Node)) {
                return;
            }

            setOpenActionUserId(null);
        };

        const handleFocusIn = (event: FocusEvent) => {
            const menu = actionMenuRefs.current[openActionUserId];
            if (!menu || menu.contains(event.target as Node)) {
                return;
            }

            setOpenActionUserId(null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenActionUserId(null);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [openActionUserId]);

    const handleToggleActionMenu = (userId: string) => {
        if (openActionUserId === userId) {
            setOpenActionUserId(null);
            return;
        }

        const menu = actionMenuRefs.current[userId];
        if (menu) {
            const rect = menu.getBoundingClientRect();
            const estimatedMenuHeight = 120;
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenActionDirection(spaceBelow < estimatedMenuHeight ? 'up' : 'down');
        } else {
            setOpenActionDirection('down');
        }

        setOpenActionUserId(userId);
    };

    const handleDeleteUser = async (user: AdminUser) => {
        setOpenActionUserId(null);

        if (user.id === authStore.user?.id) {
            toast.error('You cannot deactivate your own account.');
            return;
        }

        if (!window.confirm(`Deactivate ${user.firstName} ${user.lastName}? They will be hidden from active users and will no longer be able to sign in.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to deactivate user');
            }

            toast.success(data.message || `${user.firstName} ${user.lastName} deactivated.`);

            const nextPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

            if (nextPage !== currentPage) {
                setCurrentPage(nextPage);
            } else {
                await fetchUsers(nextPage, deferredSearchTerm);
            }
        } catch (deleteError) {
            toast.error(deleteError instanceof Error ? deleteError.message : 'Failed to deactivate user');
        }
    };

    const handleRestoreUser = async (user: AdminUser) => {
        setOpenActionUserId(null);

        try {
            const response = await fetch(`/api/admin/users/${user.id}/restore`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to restore user');
            }

            toast.success(data.message || `${user.firstName} ${user.lastName} restored.`);
            await fetchUsers(currentPage, deferredSearchTerm);
        } catch (restoreError) {
            toast.error(restoreError instanceof Error ? restoreError.message : 'Failed to restore user');
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-visible">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => router.push('/admin/users/new')}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New User
                    </button>
                </div>

                <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {users.length} of {totalUsers} account{totalUsers === 1 ? '' : 's'}.
                    </p>
                    <p className="inline-flex rounded-full border border-[#D8E2FF] bg-[#F8FAFF] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#1642F0]">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>

                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        {deferredSearchTerm ? 'No users found matching your search.' : 'No users found yet.'}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-gray-600 text-sm">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === UserRole.ADMIN
                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                user.deletedAt
                                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                                    : user.emailVerifiedAt
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                        : 'bg-amber-100 text-amber-800 border-amber-200'
                                                }`}>
                                                {user.deletedAt ? (
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                ) : user.emailVerifiedAt ? (
                                                    <MailCheck className="w-3.5 h-3.5" />
                                                ) : (
                                                    <MailWarning className="w-3.5 h-3.5" />
                                                )}
                                                {user.deletedAt ? 'Deactivated' : user.emailVerifiedAt ? 'Verified' : 'Pending verification'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                ref={(node) => {
                                                    actionMenuRefs.current[user.id] = node;
                                                }}
                                                className="relative"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleActionMenu(user.id)}
                                                    aria-expanded={openActionUserId === user.id}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-500 transition hover:border-blue-200 hover:text-blue-700"
                                                >
                                                    ...
                                                </button>
                                                {openActionUserId === user.id ? (
                                                    <div className={`absolute right-0 z-10 min-w-[190px] rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${openActionDirection === 'up' ? 'bottom-11' : 'top-11'}`}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenActionUserId(null);
                                                                router.push(`/admin/users/${user.id}`);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit user
                                                        </button>
                                                        {user.deletedAt ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRestoreUser(user)}
                                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                                                            >
                                                                <RotateCcw className="h-4 w-4" />
                                                                Restore user
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteUser(user)}
                                                                disabled={user.id === authStore.user?.id}
                                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Deactivate user
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalUsers > USERS_PER_PAGE ? (
                    <nav className="flex items-center justify-center gap-2 border-t border-gray-200 px-4 py-6">
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D8FF] bg-white text-[#1138D8] transition hover:bg-[#F0F4FF] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black transition ${page === currentPage
                                    ? 'bg-[#1642F0] text-white'
                                    : 'border border-[#C9D8FF] bg-white text-[#1138D8] hover:bg-[#F0F4FF]'
                                    }`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D8FF] bg-white text-[#1138D8] transition hover:bg-[#F0F4FF] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </nav>
                ) : null}
            </div>
        </div>
    );
}
