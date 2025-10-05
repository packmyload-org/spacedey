import React from "react";
import PrimaryButton from "@/app/components/ui/PrimaryButton";

export default function FinalCtaBlock() {
  return (
    <section className="w-full">
      <div className="container-px py-14 sm:py-16 lg:py-20">
        <div className="bg-brand text-white rounded-lg shadow-xl">
          <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight font-extrabold">
                Ready to Find Your Space?
              </h2>
              <p className="text-white/90 max-w-2xl">Book a modern, flexible storage unit near you in minutes.</p>
              <div className="mt-2">
                <PrimaryButton variant="secondary" className="px-8 py-4 text-base sm:text-lg">
                  Get Started
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


