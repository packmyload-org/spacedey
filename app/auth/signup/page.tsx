import SignupForm from '@/components/auth/SignupForm';
import Header from '@/components/layout/Header';

export const metadata = {
	title: 'Sign Up'
};

export default function SignupPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
				<div className="w-full max-w-lg">
					<SignupForm />
				</div>
		</main>
		</>
	);
}
