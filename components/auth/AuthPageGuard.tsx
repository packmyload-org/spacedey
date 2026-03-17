'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function AuthPageGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [isHydrated, setIsHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      return undefined;
    }

    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      return;
    }

    router.replace(isAdmin() ? '/admin' : '/');
  }, [isAuthenticated, isAdmin, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8FF]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#1642F0]" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8FF]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#1642F0]" />
      </div>
    );
  }

  return <>{children}</>;
}
