import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | Spacedey',
  description: 'Read the terms and conditions for using Spacedey services.',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#0d1d73] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
          <p className="text-gray-300">Please review our service terms carefully</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Spacedey services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <div className="w-12 h-1 bg-[#e65c3a] my-8"></div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on Spacedey's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-4">
              Spacedey provides storage solutions including self-storage units, vehicle storage, and related services. All bookings are subject to availability and confirmation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Payment is due at the time of booking and must be made in full. Late payments may result in additional fees or termination of storage agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
            <p className="text-gray-700 mb-4">
              Cancellations must be made at least 24 hours in advance. Refunds are subject to our refund policy and may incur processing fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Liability</h2>
            <p className="text-gray-700 mb-4">
              Spacedey is not liable for loss, damage, or theft of stored items unless caused by our negligence. Customers are responsible for insuring their belongings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Items</h2>
            <p className="text-gray-700 mb-4">
              Certain items including hazardous materials, perishable goods, and illegal substances are prohibited from storage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate services for violation of these terms. Customers may terminate with proper notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms are governed by the laws of the jurisdiction in which the storage facility is located.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> hello@spacedey.com<br />
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