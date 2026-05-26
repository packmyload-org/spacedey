import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { buildPageMetadata } from "@/lib/seo"
import {
  Cookie,
  ShieldCheck,
  Settings2,
  Database,
  Globe,
  BellRing,
} from "lucide-react"

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy | Spacedey",
  description:
    "Learn about how Spacedey uses cookies and similar technologies on our website.",
  path: "/cookie-policy",
  noIndex: false,
})

const cookieSections = [
  {
    icon: <Cookie size={20} />,
    title: "What Are Cookies?",
    content: [
      `Cookies are small text files stored on your device when you visit a website.`,
      `They help websites remember information about your visit such as preferences, login sessions, and browsing activity to improve your overall experience.`,
      `Cookies also help us understand how visitors interact with Spacedey platforms so we can improve performance, usability, and security.`,
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "How We Use Cookies",
    content: [
      `We use cookies and related technologies to support website functionality, improve services, personalize experiences, and measure performance.`,
    ],
    list: [
      "Necessary Cookies — required for core website functionality",
      "Preference Cookies — remember settings and user preferences",
      "Analytics Cookies — help us understand website usage and traffic",
      "Marketing Cookies — support relevant advertising and campaigns",
      "Security Cookies — help detect suspicious or unauthorized activity",
    ],
  },
  {
    icon: <Database size={20} />,
    title: "Types Of Cookies We Use",
    content: [
      `Spacedey uses both first-party and third-party cookies depending on the service being delivered.`,
    ],
    cards: [
      {
        title: "First-Party Cookies",
        text: "These cookies are set directly by Spacedey to support website functionality, account preferences, and user experience improvements.",
      },
      {
        title: "Third-Party Cookies",
        text: "These cookies are provided by trusted third-party services such as analytics, advertising, or infrastructure providers.",
      },
    ],
  },
  {
    icon: <Globe size={20} />,
    title: "Third-Party Services",
    content: [
      `Some cookies may be placed by external providers whose services help us operate and improve our platform.`,
    ],
    list: [
      "Google Analytics — website analytics and reporting",
      "Google Ads — campaign tracking and advertising",
      "Google Tag Manager — website tag and script management",
      "Hosting and security providers — performance and protection",
    ],
  },
  {
    icon: <Settings2 size={20} />,
    title: "Managing Cookie Preferences",
    content: [
      `You can manage or disable cookies through your browser settings or our cookie consent banner.`,
      `Most browsers allow you to refuse cookies, delete stored cookies, or receive alerts before cookies are stored.`,
      `Please note that disabling certain cookies may affect parts of the Website and reduce functionality.`,
    ],
  },
  {
    icon: <BellRing size={20} />,
    title: "Updates To This Cookie Policy",
    content: [
      `We may update this Cookie Policy periodically to reflect operational, legal, or technological changes.`,
      `Any updates become effective immediately upon publication on the Website unless otherwise stated.`,
    ],
  },
]

export default function CookiePolicy() {
  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#e65c3a] text-white text-sm font-medium mb-4">
              Website Cookies & Tracking
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-[#1642F0] leading-tight">
              Cookie Policy
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-gray-600 text-base md:text-lg leading-8">
              Learn how Spacedey uses cookies and related technologies
              to improve your browsing experience, website performance,
              analytics, and security.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
                Updated For 2026
              </span>

              <span className="bg-[#1642F0]/10 text-[#1642F0] rounded-full px-4 py-2 text-sm font-medium">
                Privacy Focused
              </span>
            </div>
          </div>

          {/* Intro Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-[#1642F0]/10 text-[#1642F0] p-3 rounded-2xl">
                <Cookie size={28} />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1642F0] mb-4">
                  Understanding Cookies At Spacedey
                </h2>

                <p className="text-gray-600 leading-8 text-base md:text-lg">
                  Cookies help us deliver a smoother, safer, and more
                  personalized experience across Spacedey platforms.
                  This policy explains what cookies are, why we use
                  them, and how you can control your preferences.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {cookieSections.map((section, index) => (
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

                {section.cards && (
                  <div className="grid md:grid-cols-2 gap-5 mt-6">
                    {section.cards.map((card, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
                      >
                        <h4 className="text-lg font-bold text-gray-900 mb-3">
                          {card.title}
                        </h4>

                        <p className="text-gray-600 leading-7">
                          {card.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 bg-[#1642F0] text-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Questions About Cookies?
            </h3>

            <p className="max-w-2xl mx-auto leading-8 text-xl text-white">
              Contact our team if you have questions about cookie
              usage, privacy settings, analytics, or managing your
              preferences on Spacedey platforms.
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
              Spacedey Storage Ltd • Oregun, Ikeja, Lagos, Nigeria
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  )
}