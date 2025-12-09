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
      answer: "As a thank you, you'll get a $50 credit towards your next months rent."
    },
    {
      question: "How many people can I refer?",
      answer: "Referrals are unlimited! Refer as many friends as you want and get $50 each time one moves in!"
    },
    {
      question: "When will I receive my $50 credit?",
      answer: "Once they move in, you'll get rewarded with a $50 credit towards your next month with Stuf!"
    },
    {
      question: "Can I refer someone if I'm not a current Stuf customer?",
      answer: "Yes! Fill out the form above and give us a call to let us know who you've referred. We'll keep track on our end and if they move in we'll send you a $50 gift card as a thank you for your support!"
    },
    {
      question: "Where is my $50 credit?",
      answer: "You're credit will automatically be applied to your next billing cycle - if you don't see it, give us a call and we'll make sure its handled!"
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Image Column */}
          <div className="flex sm:self-center md:self-start">
            <div className="relative w-full h-auto max-w-sm">
              <Image
                src="https://lp.stufstorage.com/hubfs/faqs-content-img.png"
                alt="faqs-content-img"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {/* FAQ Content Column */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">FAQ</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`border border-gray-200 rounded-lg overflow-hidden ${
                    activeIndex === index ? 'shadow-md' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      activeIndex === index 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="p-4 pt-0 bg-white">
                      <p className="text-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}