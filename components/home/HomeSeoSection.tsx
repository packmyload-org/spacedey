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
            Flexible self storage for households, businesses, and moves across Nigeria
          </h2>
          <p className="mt-5 text-base leading-8 text-[#475569] md:text-lg">
            Spacedey helps people find, compare, and reserve secure self storage units without the usual friction.
            Whether you need extra room during a move, safer space for inventory, or a cleaner way to manage household
            overflow, the platform is built to make storage feel straightforward from the very first search.
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

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="rounded-[32px] border border-[#D9E4FF] bg-white p-7 shadow-sm md:p-10">
            <h3 className="text-2xl font-black text-[#0F172A]">
              Why this storage experience ranks better for real customers
            </h3>
            <div className="mt-5 space-y-5 text-sm leading-8 text-[#475569] md:text-base">
              <p>
                Transparent storage pricing matters because searchers are usually comparing urgency, convenience, and
                trust at the same time. Spacedey gives people a clearer path to reserve storage by showing location
                options, unit availability, and a direct booking flow instead of making customers chase pricing across
                phone calls or disconnected listings. That clarity supports both conversion and SEO because the page can
                answer the exact intent behind searches like &quot;self storage in Lagos&quot;, &quot;storage units near me&quot;,
                or &quot;business storage in Nigeria&quot;.
              </p>
              <p>
                The strongest storage pages also need enough substance to prove expertise. This homepage now explains
                how Spacedey supports personal storage, business storage, and moving-related needs while reinforcing the
                practical reasons people search for self storage in the first place: security, flexible rental terms,
                easier access, and confidence about what comes next after checkout. That broader topical coverage helps
                the homepage support city pages, state pages, and facility pages instead of competing with them.
              </p>
              <p>
                Local relevance is another major ranking signal for a marketplace-style storage brand. Spacedey already
                connects searchers to facility pages and geographic landing pages across Nigeria, and this section makes
                that intent more explicit for both users and search engines. When someone wants storage for home items,
                retail inventory, renovation overflow, or a move between apartments, the site should communicate that it
                understands the local use case and has a practical next step ready.
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
              Spacedey&apos;s discoverability strategy already extends beyond one city, with search and location
              experiences that support growth across:
            </p>
            <p className="mt-4 text-sm font-bold leading-7 text-[#1642F0] md:text-base">
              {HOME_MARKETS.join(', ')}
            </p>
          </aside>
        </div>

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
