import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
	title: 'Sign Up'
};

export default function SignupPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
			<div className="w-full max-w-lg">
				<h1 className="text-3xl font-bold text-center mb-6">Create an account</h1>
				<SignupForm />
			</div>
		</main>
	);
}
