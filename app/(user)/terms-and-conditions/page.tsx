import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { buildPageMetadata } from "@/lib/seo"
import { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, FileText, CreditCard, Globe } from "lucide-react"

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service | Spacedey",
  description:
    "Read the Terms of Service for using Spacedey Storage services and website.",
  path: "/terms-and-conditions",
  noIndex: false,
})

const termsSections = [
  {
    icon: <FileText size={20} />,
    title: "1. Acceptance Of The Terms Of Use",
    content: [
      `These terms of use ("Terms") are a legally binding agreement between you and Spacedey Storage Ltd and its affiliates, operating as Spacedey Storage ("Company," "we," "us," "our," or "Spacedey Storage").`,
      `By accessing or using our website, services, or storage solutions, you agree to be bound by these Terms and our Privacy Policy.`,
      `The Website is intended for users who are 18 years of age or older and reside in Nigeria.`,
      `Storage rentals are additionally governed by a separate Rental Agreement.`,
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "2. Changes To The Terms Of Use",
    content: [
      `We reserve the right to update or modify these Terms at any time without prior notice.`,
      `Your continued use of the Website after updates are posted constitutes acceptance of the revised Terms.`,
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "3. Accessing The Website And Account Security",
    content: [
      `You are responsible for maintaining the confidentiality of your account credentials and ensuring all information provided is accurate.`,
      `Notify us immediately of any unauthorized access or security breach.`,
      `We are not liable for loss arising from improperly stored or shared access credentials or padlock combinations.`,
    ],
  },
  {
    icon: <FileText size={20} />,
    title: "4. Intellectual Property Rights",
    content: [
      `All Website content, branding, and materials are owned by Spacedey Storage Ltd or its licensors and are protected by applicable intellectual property laws.`,
      `You may use the Website for personal and non-commercial purposes only.`,
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "5. Prohibited Uses",
    content: [
      `You agree not to misuse the Website or services for unlawful or harmful activities.`,
    ],
    list: [
      "Violating Nigerian laws or regulations",
      "Uploading malicious software or harmful code",
      "Harassing, exploiting, or impersonating others",
      "Sending unauthorized advertising or spam",
      "Interfering with Website operations or security",
    ],
  },
  {
    icon: <CreditCard size={20} />,
    title: "6. Payments & Billing",
    content: [
      `We accept online payments, Nigerian bank transfers, and approved payment methods.`,
      `By providing payment information, you authorize charges related to your selected services.`,
      `Fraudulent transactions or unauthorized payment activities are strictly prohibited.`,
    ],
    list: [
      "Use of stolen payment information",
      "Counterfeit transactions",
      "Identity theft or phishing scams",
      "Money laundering activities",
      "Unauthorized use of payment methods",
    ],
  },
  {
    icon: <Globe size={20} />,
    title: "7. Membership Plans",
    content: [
      `Eligible users may enroll in Spacedey membership plans to enjoy long-term pricing benefits and storage perks.`,
      `Membership plans may include locked-in rates for up to 24 months.`,
      `Membership fees are billed monthly in Nigerian Naira (NGN).`,
    ],
  },
  {
    icon: <FileText size={20} />,
    title: "8. Cancellation Policy",
    content: [
      `Members are required to provide at least twenty-four (24) hours notice before cancellation.`,
      `Current billing cycle payments are non-refundable and non-prorated once processed.`,
    ],
  },
  {
    icon: <Globe size={20} />,
    title: "9. Governing Law & Jurisdiction",
    content: [
      `These Terms are governed by the laws of the Federal Republic of Nigeria.`,
      `Any disputes arising from these Terms shall fall under the jurisdiction of Nigerian courts.`,
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "10. Limitation Of Liability",
    content: [
      `To the fullest extent permitted by Nigerian law, Spacedey Storage Ltd shall not be liable for indirect, incidental, or consequential damages arising from your use of the Website or services.`,
    ],
  },
]

export default function TermsAndConditions() {
  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#e65c3a] text-white text-sm font-medium mb-4">
              Legal & Compliance
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-[#1642F0] leading-tight">
              Terms Of Service
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-gray-600 text-base md:text-lg leading-8">
              Please carefully review the Terms governing your use of
              Spacedey Storage services, membership plans, and website
              access across Nigeria.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
                Effective Date: 2026
              </span>

              <span className="bg-[#1642F0]/10 text-[#1642F0] rounded-full px-4 py-2 text-sm font-medium">
                Nigeria Data Protection Act (NDPA) Compliant
              </span>
            </div>
          </div>

          {/* Intro Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-[#1642F0]/10 text-[#1642F0] p-3 rounded-2xl">
                <FileText size={28} />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1642F0] mb-4">
                  Spacedey Storage Ltd & Affiliates
                </h2>

                <p className="text-gray-600 leading-8 text-base md:text-lg">
                  These Terms govern your use of Spacedey Storage
                  services, self-storage rentals, pricing plans,
                  memberships, digital platforms, and related services
                  provided across Nigeria.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {termsSections.map((section, index) => (
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
              Questions About Our Terms?
            </h3>

            <p className="max-w-2xl mx-auto leading-8 text-xl text-white">
              Reach out to our support and legal team for clarification
              regarding our services, memberships, storage agreements,
              or policies.
            </p>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@spacedey.com"
                className="px-6 py-4 rounded-2xl bg-[#e65c3a] text-white font-semibold hover:scale-105 transition-transform duration-300 border-0"
              >
                Contact Support
              </a>

              <a
                href="tel:+2347007225776"
                className="px-6 py-4 rounded-2xl border border-white/30 hover:bg-[#e65c3a] transition-all duration-300"
              >
                +234 700 722 5776
              </a>
            </div>

            <div className="mt-8 text-sm text-blue-100">
              Oregun, Ikeja, Lagos, Nigeria
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}