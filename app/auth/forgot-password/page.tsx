import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-50 px-6 pb-12 pt-28 md:pt-32">
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
}
