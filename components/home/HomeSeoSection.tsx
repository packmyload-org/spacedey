import { HOME_FAQS, HOME_MARKETS, HOME_SERVICE_TYPES } from '@/lib/homeSeoContent';

const audienceCards = [
  {
    title: 'Personal storage',
    description:
      'Store household items, seasonal belongings, furniture, luggage, or overflow that no longer fits comfortably at home.',
  },
  {
    title: 'Business storage',
    description:
      'Create breathing room for documents, stock, retail inventory, equipment, and day-to-day operational supplies.',
  },
  {
    title: 'Moving support',
    description:
      'Bridge the gap during relocations, renovations, office moves, and staged move-ins when timing does not line up perfectly.',
  },
];

export default function HomeSeoSection() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#5D74B0]">
            Self Storage In Nigeria
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight text-[#0F172A] md:text-5xl">
            Secure self storage units for households, businesses, and moves across Nigeria
          </h2>
          <p className="mt-5 text-base leading-8 text-[#475569] md:text-lg">
            Spacedey helps people compare and reserve self storage units in Lagos and across Nigeria without the usual
            friction. Whether you need extra room during a move, safer space for business inventory, or practical
            household storage, the platform is built to make self storage straightforward from the first search to the
            final reservation.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {audienceCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[28px] border border-[#D9E4FF] bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-black text-[#0F172A]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#475569] md:text-base">
                {card.description}
              </p>
            </article>
          ))}
        </div>

        {/* <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="rounded-[32px] border border-[#D9E4FF] bg-white p-7 shadow-sm md:p-10">
            <h3 className="text-2xl font-black text-[#0F172A]">
              How Spacedey answers the storage questions people ask before they book
            </h3>
            <div className="mt-5 space-y-5 text-sm leading-8 text-[#475569] md:text-base">
              <p>
                Searchers usually compare security, price, and convenience at the same time. Spacedey helps them do that
                faster by showing location options, visible pricing signals, available unit sizes, and a direct path from
                research into reservation instead of pushing every question into offline calls.
              </p>
              <p>
                That structure supports the exact intent behind searches like &quot;which storage is safest&quot;,
                &quot;how much should you pay for storage&quot;, and &quot;what size storage unit do I need&quot;. The goal is not only
                to rank for those questions, but to answer them clearly enough that the next step feels obvious.
              </p>
              <p>
                Because Spacedey serves personal storage, business inventory, and moving-related use cases in Nigeria, the
                homepage can support city pages, sizing pages, and facility pages without competing with them. It sets
                trust and context while the deeper pages handle location, price, and unit-size detail.
              </p>
            </div>
          </div>

          <aside className="rounded-[32px] border border-[#D9E4FF] bg-[linear-gradient(180deg,#EDF3FF_0%,#FFFFFF_100%)] p-7 shadow-sm md:p-8">
            <h3 className="text-xl font-black text-[#0F172A]">What customers can expect</h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#475569] md:text-base">
              {HOME_SERVICE_TYPES.map((serviceType) => (
                <li key={serviceType} className="rounded-2xl bg-white px-4 py-3">
                  {serviceType}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-xl font-black text-[#0F172A]">Active search markets</h3>
            <p className="mt-3 text-sm leading-7 text-[#475569] md:text-base">
              Spacedey&apos;s location coverage is designed to support commercial searches in Nigeria first, with Lagos as a
              lead market and expanding city and state discovery pages for broader demand.
            </p>
            <p className="mt-4 text-sm font-bold leading-7 text-[#1642F0] md:text-base">
              {HOME_MARKETS.join(', ')}
            </p>
          </aside>
        </div> */}

        <div className="mt-14 rounded-[32px] border border-[#D9E4FF] bg-white p-7 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#5D74B0]">
              Storage Questions
            </p>
            <h2 className="mt-4 text-3xl font-black text-[#0F172A] md:text-4xl">
              Frequently asked questions about booking storage with Spacedey
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#475569] md:text-base">
              These are the questions searchers usually ask before they trust a storage company with their belongings,
              inventory, or move timeline.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {HOME_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[24px] border border-[#D9E4FF] bg-[#FBFDFF] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-base font-bold text-[#0F172A] marker:hidden">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#475569] md:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
