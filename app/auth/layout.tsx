import type { Metadata } from 'next';
import AuthPageGuard from '@/components/auth/AuthPageGuard';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthPageGuard>{children}</AuthPageGuard>;
}
