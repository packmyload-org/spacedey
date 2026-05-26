"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { faqData } from "@/lib/homeSeoContent"



function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-all duration-300"
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          {question}
        </h3>

        <ChevronDown
          className={`min-w-[20px] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 whitespace-pre-line text-gray-600 leading-8 text-sm md:text-base">
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0")

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-4">
              Frequently Asked Questions
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Everything You Need
              <br />
              To Know About Storage
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-gray-600 text-base md:text-lg leading-8">
              Find answers to common questions about access, pricing,
              security, move-ins, storage conditions, and more at
              Spacedey Storage.
            </p>
          </div>

          <div className="space-y-12">
            {faqData.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {section.category}
                  </h2>

                  <div className="w-20 h-1 bg-black rounded-full mt-3" />
                </div>

                <div className="space-y-4">
                  {section.items.map((faq, faqIndex) => {
                    const itemId = `${sectionIndex}-${faqIndex}`

                    return (
                      <FAQItem
                        key={itemId}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === itemId}
                        onClick={() => toggleAccordion(itemId)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-black text-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Still Have Questions?
            </h3>

            <p className="text-gray-300 max-w-2xl mx-auto leading-8">
              Our team is here to help with storage solutions across
              Lagos including Ikeja, Lekki, Victoria Island, Surulere,
              Yaba, and Maryland.
            </p>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@spacedey.com"
                className="px-6 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition-transform duration-300"
              >
                hello@spacedey.com
              </a>

              <a
                href="tel:+2347007225776"
                className="px-6 py-4 rounded-2xl border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
              >
                +234 700 722 5776
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default FAQPage