'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader, Mail, RotateCcw, Save, ShieldCheck, Trash2, UserRound, UserRoundPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types/roles';

interface EditableAdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface UserEditorPageProps {
  userId: string;
}

export default function UserEditorPage({ userId }: Readonly<UserEditorPageProps>) {
  const authStore = useAuthStore();
  const router = useRouter();
  const isNew = userId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<EditableAdminUser | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.USER,
    password: '',
  });

  const isCurrentUser = useMemo(
    () => !isNew && authStore.user?.id === userId,
    [authStore.user?.id, isNew, userId]
  );

  const fetchUser = useCallback(async () => {
    if (isNew) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to load user.');
      }

      setUser(data.user);
      setForm({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        password: '',
      });
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load user.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [authStore.accessToken, isNew, userId]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'role' ? value as UserRole : value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = isNew
        ? form
        : {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            role: form.role,
          };

      const response = await fetch(isNew ? '/api/admin/users' : `/api/admin/users/${userId}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to save user.');
      }

      if (isNew) {
        const message = data.verificationEmailSent
          ? 'User created. Verification email sent.'
          : 'User created. They must verify their email before login.';
        toast.success(message);
        router.push(`/admin/users/${data.user.id}`);
        return;
      }

      setUser(data.user);
      setForm((current) => ({
        ...current,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
      }));

      const message = data.requiresEmailVerification
        ? data.verificationEmailSent
          ? 'User updated. A new verification email was sent.'
          : 'User updated. The email must be verified before login.'
        : 'User updated successfully.';
      toast.success(message);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to save user.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew || deleting) {
      return;
    }

    if (!window.confirm(`Deactivate ${form.firstName || user?.firstName || 'this user'}? They will be hidden from active users and will no longer be able to sign in.`)) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to deactivate user.');
      }

      toast.success(data.message || 'User deactivated successfully.');
      router.push('/admin/users');
      router.refresh();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Failed to deactivate user.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async () => {
    if (isNew || restoring) {
      return;
    }

    try {
      setRestoring(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${userId}/restore`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to restore user.');
      }

      toast.success(data.message || 'User restored successfully.');
      await fetchUser();
      router.refresh();
    } catch (restoreError) {
      const message = restoreError instanceof Error ? restoreError.message : 'Failed to restore user.';
      setError(message);
      toast.error(message);
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/users')}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </button>

        {!isNew ? user?.deletedAt ? (
          <button
            type="button"
            onClick={handleRestore}
            disabled={restoring}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            title="Restore user"
          >
            {restoring ? <Loader className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Restore user
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isCurrentUser}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            title={isCurrentUser ? 'You cannot deactivate your own account.' : 'Deactivate user'}
          >
            {deleting ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Deactivate user
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isNew && user?.deletedAt ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This account is deactivated. Restore it to allow sign-in again.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={handleSave}
          className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">First name</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => handleChange('firstName', event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="First name"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Last name</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => handleChange('lastName', event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Last name"
                required
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="name@example.com"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Role</span>
              <select
                value={form.role}
                onChange={(event) => handleChange('role', event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value={UserRole.USER}>User</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </label>

            {isNew ? (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-700">Temporary password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange('password', event.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Set a temporary password"
                  required
                />
              </label>
            ) : (
              <div className="rounded-2xl border border-[#D8E2FF] bg-[#F7F9FF] px-4 py-3">
                <p className="text-sm font-semibold text-[#16306D]">Password is protected</p>
                <p className="mt-1 text-sm leading-6 text-[#5E6C91]">
                  This admin screen only updates name, email, and role. Password changes stay outside this flow.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1642F0] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1238D4] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isNew ? 'Create user' : 'Save changes'}
            </button>

            {!isNew ? (
              <p className="text-sm text-gray-500">
                If the email changes, the user will need to verify the new address before login.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                New users receive a verification email and cannot sign in until they confirm it.
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Verification
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${user?.emailVerifiedAt ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {user?.emailVerifiedAt ? <ShieldCheck className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {isNew
                    ? 'Verification starts after creation'
                    : user?.deletedAt
                      ? 'Account is deactivated'
                    : user?.emailVerifiedAt
                      ? 'Email verified'
                      : 'Verification pending'}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {isNew
                    ? 'After you create the account, the user must verify their email before they can log in.'
                    : user?.deletedAt
                      ? 'The email stays reserved while the account is inactive. Restore the account to give the user access again.'
                    : user?.emailVerifiedAt
                      ? `Verified on ${new Date(user.emailVerifiedAt).toLocaleDateString()}.`
                      : 'The user is blocked from login until they verify their email.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Account details
            </p>
            <div className="mt-4 space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-4 w-4 text-[#1642F0]" />
                <div>
                  <p className="font-semibold text-gray-900">Role access</p>
                  <p>{form.role === UserRole.ADMIN ? 'Admin access to dashboard tools.' : 'Standard customer account access.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserRoundPlus className="mt-0.5 h-4 w-4 text-[#1642F0]" />
                <div>
                  <p className="font-semibold text-gray-900">Profile edits only</p>
                  <p>Name, email, and role can be managed here without exposing sensitive credentials.</p>
                </div>
              </div>
            </div>

            {!isNew && user ? (
              <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-sm text-gray-600">
                <p><span className="font-semibold text-gray-900">Created:</span> {new Date(user.createdAt).toLocaleString()}</p>
                <p className="mt-2"><span className="font-semibold text-gray-900">Last updated:</span> {new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
