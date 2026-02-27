import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  const token = typeof searchParams?.token === 'string' ? searchParams.token : '';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <ResetPasswordForm initialToken={token} />
    </main>
  );
}
