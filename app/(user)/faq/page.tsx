
import { FAQBody } from "@/components/faq/FaqBody"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { buildPageMetadata } from "@/lib/seo"
import { Metadata } from "next"

export const metadata: Metadata = buildPageMetadata({
  title: 'Frequently Asked Questions | Spacedey',
  description: 'Read Frequently Asked Questions about Spacedey Self Storage and Services in Nigeria.',
  path: '/faq',
  noIndex: false
})

function FAQPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#e65c3a] text-white text-sm font-medium mb-4">
              Frequently Asked Questions
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-[#1642F0] leading-tight">
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

          <FAQBody/>

          <div className="mt-20 bg-[#1642F0] text-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Still Have Questions?
            </h3>

            <p className="max-w-2xl mx-auto leading-8 text-xl text-white">
              Our team is here to help with storage solutions across
              Lagos including Ikeja, Lekki, Victoria Island, Surulere,
              Yaba, and Maryland.
            </p>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@spacedey.com"
                className="px-6 py-4 rounded-2xl bg-[#e65c3a] text-white font-semibold hover:scale-105 transition-transform duration-300 border-0"
              >
                Send Us An Email
              </a>

              <a
                href="tel:+2347007225776"
                className="px-6 py-4 rounded-2xl border border-white/30 hover:bg-[#e65c3a] transition-all duration-300"
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