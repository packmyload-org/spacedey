"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
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

 export function FAQBody() {
    const [openIndex, setOpenIndex] = useState<string | null>("0-0")

    const toggleAccordion = (id: string) => {
      setOpenIndex(openIndex === id ? null : id)
    }
    return(
        <>
          <div className="space-y-12">
            {faqData.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1642F0]">
                    {section.category}
                  </h2>

                  <div className="w-20 h-1 bg-[#e65c3a] rounded-full mt-3" />
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
        </>
    )
  }
