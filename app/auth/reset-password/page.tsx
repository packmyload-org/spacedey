import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string; email?: string };
}) {
  const token = typeof searchParams?.token === 'string' ? searchParams.token : '';
  const email = typeof searchParams?.email === 'string' ? searchParams.email : '';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <ResetPasswordForm initialToken={token} initialEmail={email} />
    </main>
  );
}
