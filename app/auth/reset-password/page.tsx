import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6 space-y-6">
        <ResetPasswordForm />
      </main>
    </>
  );
}
