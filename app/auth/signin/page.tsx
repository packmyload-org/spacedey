import LoginForm from '../../../components/auth/LoginForm';
import Header from '@/components/layout/Header';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pt-28">
        <LoginForm />
      </main>
    </>
  );
}
