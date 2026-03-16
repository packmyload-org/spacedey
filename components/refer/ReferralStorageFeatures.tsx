import { ArrowRight, Gift, ShieldCheck, UserPlus } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Share a qualified referral',
    description:
      'Send a friend, family member, or business owner who genuinely needs storage. Once you submit the form, our team follows up directly.',
    icon: UserPlus,
    accent: 'bg-[#E9F0FF] text-[#1642F0]',
  },
  {
    number: '02',
    title: 'We help them choose the right unit',
    description:
      'Your referral gets guided to the right storage size, location, and move-in plan, plus the active discount attached to the referral offer.',
    icon: ShieldCheck,
    accent: 'bg-[#EAFBF2] text-[#0B8A4A]',
  },
  {
    number: '03',
    title: 'You get rewarded after move-in',
    description:
      'When your referral completes their move-in, we apply your referral reward and keep the process simple on our side.',
    icon: Gift,
    accent: 'bg-[#FFF2EA] text-[#D96541]',
  },
];

const highlights = [
  'Quick to submit',
  'Unlimited referrals',
  'Great for personal and business storage',
];

export default function ReferralStorageFeatures() {
  return (
    <section className="bg-[#F5F8FF] px-4 py-14 sm:px-5 lg:px-24 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[34px] border border-[#D7E3FF] bg-white shadow-[0_28px_70px_rgba(17,56,216,0.08)]">
          <div className="grid gap-8 border-b border-[#E6EEFF] bg-[linear-gradient(180deg,#F8FBFF_0%,#EEF4FF_100%)] px-5 py-8 sm:px-6 md:px-10 md:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#7386B9]">
                How It Works
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-[#0F172A] md:text-4xl">
                Three clear steps. One smoother referral experience.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#475569] md:text-base">
                Refer someone who needs storage, let our team handle the follow-up, and receive
                your reward once they move in. The flow should feel simple, credible, and easy to
                trust at a glance.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#D7E3FF] bg-white px-4 py-3 text-sm font-semibold text-[#1642F0]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 px-5 py-6 sm:px-6 md:px-10 md:py-10 lg:grid-cols-3 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`group rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1 md:p-7 ${
                  index === 1
                    ? 'border-[#BCD0FF] bg-[linear-gradient(180deg,#F3F7FF_0%,#FFFFFF_100%)] shadow-[0_20px_50px_rgba(17,56,216,0.1)]'
                    : 'border-[#E1E9FF] bg-white shadow-[0_14px_36px_rgba(17,56,216,0.05)]'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#7386B9]">
                    Step {step.number}
                  </span>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${step.accent}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-8 text-2xl font-black leading-tight text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#475569] md:text-base">
                  {step.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 border-t border-[#E6EEFF] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-semibold text-[#5D74B0]">
                    {index === 0
                      ? 'Starts with your form'
                      : index === 1
                        ? 'Handled by Spacedey'
                        : 'Reward after move-in'}
                  </span>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1642F0]">
                    {index === 2 ? 'Completed' : 'Next step'}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
