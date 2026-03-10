import SignupForm from '@/components/auth/SignupForm';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export const metadata = {
	title: 'Sign Up'
};

export default function SignupPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
				<div className="w-full max-w-lg">
					<div className="mb-6 text-center">
						<h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
						<p className="mt-3 text-sm text-gray-500">
							Already have an account?{' '}
							<Link href="/auth/signin" className="font-semibold text-[#1642F0] hover:underline">
								Login
							</Link>
						</p>
					</div>
					<SignupForm />
				</div>
		</main>
		</>
	);
}
