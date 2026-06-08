import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { buildPageMetadata } from "@/lib/seo"
import {
  ShieldCheck,
  Database,
  Lock,
  Cookie,
  BellRing,
  FileText,
} from "lucide-react"

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Learn about how Spacedey collects, uses, and protects your personal information.",
  path: "/privacy-policy",
  noIndex: false,
})

const privacySections = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Introduction & Organizational Information",
    content: [
      `At Spacedey, we are committed to protecting your personal information and respecting your privacy rights.`,
      `This Privacy Policy explains how we collect, use, store, process, and safeguard personal information gathered through spacedey.com and related interactions.`,
      `We process personal information responsibly to improve user experience, provide support, manage accounts, and deliver our services securely.`,
      `For questions regarding this policy or data handling practices, contact our Data Protection Officer at hello@spacedey.com.`,
    ],
  },
  {
    icon: <FileText size={20} />,
    title: "Scope & Application",
    content: [
      `This policy applies to all visitors, registered users, customers, and anyone interacting with Spacedey services or digital platforms.`,
      `Whether you browse our website, rent storage space, or contact support, your personal information is handled in accordance with this policy.`,
    ],
  },
  {
    icon: <Database size={20} />,
    title: "Data Collection & Processing",
    content: [
      `We collect personal data through service usage, account registration, enquiries, and communications with our team.`,
      `Information collected is limited to what is necessary for service delivery, legal compliance, and operational improvements.`,
    ],
    list: [
      "First and last name",
      "Email address and phone number",
      "Browser, device, and language information",
      "Interaction logs and website analytics",
      "Support requests and communication records",
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "How We Use Your Information",
    content: [
      `Your information helps us provide secure and reliable services while improving your overall experience with Spacedey.`,
    ],
    list: [
      "Authentication and account security",
      "Customer support and communication",
      "Analytics and website performance tracking",
      "Personalized experiences and recommendations",
      "Marketing and promotional communications",
      "Compliance with legal obligations",
    ],
  },
  {
    icon: <Lock size={20} />,
    title: "Data Storage & Protection",
    content: [
      `Personal information is stored using secure infrastructure and trusted hosting providers with industry-standard protections.`,
      `Access to personal information is restricted to authorized personnel with legitimate business needs.`,
      `We use encryption, audits, monitoring systems, and access controls to prevent unauthorized access, misuse, or disclosure.`,
    ],
  },
  {
    icon: <Database size={20} />,
    title: "Data Sharing & Disclosure",
    content: [
      `We may share personal information with carefully selected third-party providers who support our operations and services.`,
      `These providers are contractually obligated to protect your information and use it only for approved business purposes.`,
    ],
    list: [
      "Google Ads – analytics and campaign performance",
      "Google Tag Manager – website performance and tag management",
      "Hosting and infrastructure providers",
      "Payment processing and communication services",
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "User Rights & Choices",
    content: [
      `Depending on applicable laws, including the Nigeria Data Protection Act (NDPA), you may have rights relating to your personal information.`,
    ],
    list: [
      "Access your personal information",
      "Request correction or updates",
      "Request deletion of personal data",
      "Withdraw consent for marketing communications",
      "Object to certain processing activities",
      "Request portability of your information",
    ],
  },
  {
    icon: <Cookie size={20} />,
    title: "Cookies & Tracking Technologies",
    content: [
      `We use cookies and similar technologies to support website functionality, analytics, personalization, and advertising.`,
      `You may choose to accept, reject, or customize cookie preferences through our consent banner.`,
      `Essential cookies are required for the Website to function properly.`,
    ],
  },
  {
    icon: <BellRing size={20} />,
    title: "Direct Marketing & Communications",
    content: [
      `Marketing communications are only sent where permitted by law or with your consent.`,
      `Every promotional communication includes a clear unsubscribe option.`,
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Data Breach Notification Procedures",
    content: [
      `We actively monitor our systems for security threats and data breaches.`,
      `If a breach poses a risk to your rights or freedoms, we will notify relevant authorities and affected individuals in accordance with applicable laws.`,
    ],
  },
  {
    icon: <FileText size={20} />,
    title: "Policy Updates & Changes",
    content: [
      `This Privacy Policy may be updated periodically to reflect legal, operational, or service-related changes.`,
      `Continued use of our Website and services after updates constitutes acceptance of the revised policy.`,
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#e65c3a] text-white text-sm font-medium mb-4">
              Privacy & Data Protection
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-[#1642F0] leading-tight">
              Privacy Policy
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-gray-600 text-base md:text-lg leading-8">
              Learn how Spacedey collects, processes, stores, and
              protects your personal information while delivering
              secure storage and digital services across Nigeria.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
                Effective Date: 23/04/2026
              </span>

              <span className="bg-[#1642F0]/10 text-[#1642F0] rounded-full px-4 py-2 text-sm font-medium">
                NDPA 2023 Compliant
              </span>
            </div>
          </div>

          {/* Intro Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-[#1642F0]/10 text-[#1642F0] p-3 rounded-2xl">
                <ShieldCheck size={28} />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1642F0] mb-4">
                  Your Privacy Matters To Us
                </h2>

                <p className="text-gray-600 leading-8 text-base md:text-lg">
                  At Spacedey, protecting your information is part of
                  how we build trust. This policy explains what data
                  we collect, why we collect it, how it is used, and
                  the choices available to you regarding your personal
                  information.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            {privacySections.map((section, index) => (
              <section
                key={index}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="bg-[#1642F0]/10 text-[#1642F0] p-3 rounded-2xl">
                    {section.icon}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#1642F0] leading-tight">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-gray-600 leading-8 text-[15px] md:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.list && (
                  <ul className="mt-6 space-y-3">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-600 leading-7"
                      >
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#e65c3a]" />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-20 bg-[#1642F0] text-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Questions About Your Privacy?
            </h3>

            <p className="max-w-2xl mx-auto leading-8 text-xl text-white">
              Contact our support or data protection team if you have
              questions regarding your information, privacy rights, or
              security concerns.
            </p>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@spacedey.com"
                className="px-6 py-4 rounded-2xl bg-[#e65c3a] text-white font-semibold hover:scale-105 transition-transform duration-300 border-0"
              >
                Contact Our Team
              </a>

              <a
                href="tel:+2347007225776"
                className="px-6 py-4 rounded-2xl border border-white/30 hover:bg-[#e65c3a] transition-all duration-300"
              >
                +234 700 722 5776
              </a>
            </div>

            <div className="mt-8 text-sm text-blue-100">
              Spacedey Storage Ltd • Oregun, Ikeja, Lagos, Nigeria
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}