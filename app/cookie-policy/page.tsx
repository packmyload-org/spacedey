import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | Spacedey',
  description: 'Learn about how Spacedey uses cookies and similar technologies on our website.',
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#0d1d73] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-gray-300">Understand how we use cookies on our website</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better browsing experience and allow certain features to work properly.
            </p>
          </section>

          <div className="w-12 h-1 bg-[#e65c3a] my-8"></div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Necessary Cookies:</strong> Essential for the website to function properly</li>
              <li><strong>Preferences Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Statistics Cookies:</strong> Help us understand how you use our website</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver personalized advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">First-party Cookies</h3>
            <p className="text-gray-700 mb-4">
              Set by our website to remember your preferences and improve your experience.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Third-party Cookies</h3>
            <p className="text-gray-700 mb-4">
              Set by third-party services we use, such as Google Analytics for website analytics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, disabling cookies may affect the functionality of our website.
            </p>
            <p className="text-gray-700 mb-4">
              You can also use our cookie consent tool to manage your preferences for different types of cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> customercare@spacedey.com<br />
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/" className="text-[#0d1d73] hover:text-blue-900 font-medium transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}