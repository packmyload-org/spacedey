import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Spacedey',
  description:
    'Learn about how Spacedey collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0d1d73] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-[#cbd5e1] mb-3">
            Effective Date: 23/04/2026, 05:23:30
          </p>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-300 max-w-2xl">
            This Privacy Policy explains how Spacedey collects, uses, stores, and shares
            personal information for visitors, users, and customers of spacedey.com.
          </p>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction and organizational info
            </h2>
            <p className="text-gray-700 mb-4">
              We, at Spacedey, are dedicated to serving our customers and contacts to the
              best of our abilities. Part of our commitment involves the responsible
              management of personal information collected through our website spacedey.com
              and any related interactions.
            </p>
            <p className="text-gray-700 mb-4">
              Our primary goals in processing this information include enhancing the user
              experience on our platform, providing timely support, improving our products
              and services, and conducting necessary business operations such as billing and
              account management.
            </p>
            <p className="text-gray-700">
              It is our policy to process personal information with the utmost respect for
              privacy and security. We adhere to all relevant regulations and guidelines to
              ensure data protection and maintain confidentiality, integrity, and availability
              of your information.
            </p>
            <p className="text-gray-700 mt-4">
              We have a designated Data Protection Officer (DPO). For questions about how we
              manage personal information, contact us at{' '}
              <a className="text-[#0d1d73] underline" href="mailto:hello@spacedey.com">
                hello@spacedey.com
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scope and application</h2>
            <p className="text-gray-700 mb-4">
              This policy applies to all stakeholders, including website visitors, registered
              users, and customers. Whether you are browsing spacedey.com, using our services,
              or engaging with us as a customer, your personal data is processed with the
              highest standards of privacy and security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data collection and processing</h2>
            <p className="text-gray-700 mb-4">
              We collect personal data through interactions such as service use, product
              inquiries, and direct communications.
            </p>
            <p className="text-gray-700 mb-4">We may process:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>First and last name</li>
              <li>Email address and/or phone number</li>
              <li>Browser information and language</li>
              <li>Interaction logs, such as clicks and time spent on pages</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We only process information that is essential for delivering our services,
              complying with legal obligations, or improving your experience.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How we use your information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Authentication and security</li>
              <li>Customizing and adapting user experience</li>
              <li>Analytics and performance tracking</li>
              <li>Marketing and advertising</li>
              <li>Tag management</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data storage and protection</h2>
            <p className="text-gray-700 mb-4">
              Personal information is stored on secure servers located in VI and GB. For
              international transfers, we ensure compliance with applicable laws and maintain
              equivalent data protection standards.
            </p>
            <p className="text-gray-700 mb-4">
              We partner with reputable hosting providers that use strong security measures.
              Access to your personal information is limited to authorized personnel with a
              legitimate business need.
            </p>
            <p className="text-gray-700 mb-4">
              We protect data through encryption, strict access controls, audits, and
              monitoring to prevent unauthorized access or disclosure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data sharing and disclosure</h2>
            <p className="text-gray-700 mb-4">
              We may share personal information with third-party service providers who perform
              services on our behalf. These providers are contractually obligated to keep your
              data confidential and use it only to deliver services to Spacedey.
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-2">Examples of third-party services</p>
              <p className="text-gray-700 mb-2">
                Google Ads (Google Ireland Limited) – analytics, advertising, and campaign performance.
              </p>
              <p className="text-gray-700 mb-2">
                Google Tag Manager (Google Ireland Limited) – tag management for website performance.
              </p>
            </div>
            <p className="text-gray-700">
              We use Data Processing Agreements to ensure third parties protect your information
              according to GDPR and other applicable laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User rights and choices
            </h2>
            <p className="text-gray-700 mb-4">
              You have rights under GDPR and other applicable laws, including access, correction,
              deletion, restriction, portability, objection, withdrawal of consent, and lodging a complaint.
            </p>
            <p className="text-gray-700">
              To exercise your rights, contact us at{' '}
              <a className="text-[#0d1d73] underline" href="mailto:hello@spacedey.com">
                hello@spacedey.com
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies and tracking technologies
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to support website functionality, analytics,
              personalization, and advertising. Essential cookies are required for the site to
              function properly.
            </p>
            <p className="text-gray-700 mb-4">
              You can accept all cookies, reject non-essential cookies, or customize your
              preferences through our consent banner.
            </p>
            <p className="text-gray-700">
              For more details, visit our Cookie Policy at{' '}
              <a
                className="text-[#0d1d73] underline"
                href="https://spacedey.com/cookie-policy"
                target="_blank"
                rel="noreferrer"
              >
                https://spacedey.com/cookie-policy
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Direct marketing and communications
            </h2>
            <p className="text-gray-700 mb-4">
              We may send marketing communications only with your consent where required by law.
              Every message will include a clear option to unsubscribe.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data breach notification procedures
            </h2>
            <p className="text-gray-700 mb-4">
              We monitor for breaches and will investigate any incident promptly. If a breach
              poses a risk to your rights, we will notify authorities and affected individuals
              within 30 days when required.
            </p>
            <p className="text-gray-700">
              Contact us immediately at{' '}
              <a className="text-[#0d1d73] underline" href="mailto:hello@spacedey.com">
                hello@spacedey.com
              </a>{' '}
            if you suspect a breach.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Policy updates and changes
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this policy periodically to reflect legal, operational, or
              business changes. We will provide notice when significant changes occur.
            </p>
            <p className="text-gray-700">
              Continued use of our services after updates means you accept the revised policy.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-700 mb-4">
              If you have any questions about this policy, contact us at{' '}
              <a className="text-[#0d1d73] underline" href="mailto:hello@spacedey.com">
                hello@spacedey.com
              </a>
              .
            </p>
            <Link
              href="/"
              className="text-[#0d1d73] hover:text-blue-900 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}