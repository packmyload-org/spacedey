"use client"
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ReferralFAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "How do I refer a friend?",
      answer: "Simply fill out the form above and we'll handle the rest."
    },
    {
      question: "What does my friend get when I refer them?",
      answer: "Your friend gets 50% off their first 3 months when they book using your referral!"
    },
    {
      question: "What do I get for referring someone?",
      answer: "As a thank you, you'll get a ₦50 credit towards your next months rent."
    },
    {
      question: "How many people can I refer?",
      answer: "Referrals are unlimited! Refer as many friends as you want and get ₦50 each time one moves in!"
    },
    {
      question: "When will I receive my ₦50 credit?",
      answer: "Once they move in, you'll get rewarded with a ₦50 credit towards your next month with Spacedey!"
    },
    {
      question: "Can I refer someone if I'm not a current Spacedey customer?",
      answer: "Yes! Fill out the form above and give us a call to let us know who you've referred. We'll keep track on our end and if they move in we'll send you a ₦50 gift card as a thank you for your support!"
    },
    {
      question: "Where is my ₦50 credit?",
      answer: "You're credit will automatically be applied to your next billing cycle - if you don't see it, give us a call and we'll make sure its handled!"
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="w-full bg-[#FBFCFF] px-4 py-14 sm:px-5 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#7386B9]">
            Frequently Asked Questions
          </p>
          <h2 className="mt-4 text-3xl font-black text-[#0F172A] md:text-4xl">
            Everything people ask before they refer someone
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#475569] md:text-base">
            A quick breakdown of the reward, when it applies, and how the referral process works from submission to move-in.
          </p>
        </div>

        <div className="flex flex-col items-start justify-center gap-8 lg:flex-row lg:gap-12">
          {/* Image Column */}
          <div className="flex w-full sm:self-center md:self-start lg:w-[340px]">
            <div className="relative w-full overflow-hidden rounded-[28px] border border-[#D9E4FF] bg-[linear-gradient(180deg,#EEF4FF_0%,#FFFFFF_100%)] p-6 shadow-[0_20px_50px_rgba(17,56,216,0.06)]">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#DDE8FF] blur-3xl" />
              <div className="relative aspect-[4/5] w-full">
              <Image
                src="https://lp.stufstorage.com/hubfs/faqs-content-img.png"
                alt="faqs-content-img"
                fill
                unoptimized
                className="object-contain"
              />
              </div>
              <div className="relative mt-5 rounded-2xl bg-white px-4 py-4">
                <p className="text-sm font-bold text-[#1138D8]">Fast answer</p>
                <p className="mt-2 text-sm leading-6 text-[#5D74B0]">
                  Refer first, then let Spacedey handle the outreach and qualification.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Content Column */}
          <div className="w-full lg:flex-1">
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`overflow-hidden rounded-[22px] border border-[#D9E4FF] bg-white ${
                    activeIndex === index ? 'shadow-[0_18px_40px_rgba(17,56,216,0.08)]' : 'shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="flex w-full items-center justify-between gap-4 bg-white px-4 py-5 text-left transition-[background-color,transform] duration-300 hover:bg-[#F8FAFF] sm:px-5"
                  >
                    <span className="pr-2 text-sm font-bold text-[#0F172A] sm:pr-4 sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`h-5 w-5 flex-shrink-0 text-[#5D74B0] transition-transform duration-500 ease-out ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <div 
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      activeIndex === index 
                        ? 'grid-rows-[1fr] opacity-100' 
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 bg-white">
                      <div className={`px-5 pb-5 pt-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        activeIndex === index ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                      }`}>
                      <p className="text-sm leading-7 text-[#475569] md:text-base">
                        {faq.answer}
                      </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
