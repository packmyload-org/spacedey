import React from "react";
import PrimaryButton from "@/app/components/ui/PrimaryButton";

const COLORS = {
  TITLE_NAVY: "#172a58",
  UNDERLINE_ORANGE: "#e59976",
  BUTTON_BLUE: "#4a7eff",
} as const;

const features = [
  { id: 1, text: "No hidden or additional fees", iconUrl: "/images/Dollar.jpg" },
  { id: 2, text: "Storage near home and work", iconUrl: "/images/LocationPin.jpg" },
  { id: 3, text: "Month to Month Leases", iconUrl: "/images/Calendar.jpg" },
  { id: 4, text: "Complimentary padlock", iconUrl: "/images/Lock.jpg" },
] as const;

function FeatureItem({ iconUrl, text }: { iconUrl: string; text: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 max-w-[280px] min-w-[200px]">
      <div
        className="w-[150px] h-[150px] mb-4 bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${iconUrl})` }}
        role="img"
        aria-label={`${text.split(" ").slice(0, 2).join(" ")} icon`}
      />
      <p className="text-gray-800 text-lg font-medium leading-relaxed px-2">{text}</p>
    </div>
  );
}

export default function WhyStoreWithUs() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-1" style={{ color: COLORS.TITLE_NAVY }}>
          Why Store With Us?
        </h2>
        <div className="w-12 h-1 mx-auto mb-16" style={{ backgroundColor: COLORS.UNDERLINE_ORANGE }} />

        <div className="grid grid-cols-2 lg:grid-cols-4 justify-items-center gap-y-12 gap-x-4 lg:gap-x-6">
          {features.map((feature) => (
            <FeatureItem key={feature.id} iconUrl={feature.iconUrl} text={feature.text} />
          ))}
        </div>

        <div className="text-center mt-16">
          <PrimaryButton
            variant="custom"
            className="px-8 py-3 text-lg font-semibold border-2"
            style={{ borderColor: COLORS.BUTTON_BLUE, color: COLORS.BUTTON_BLUE }}
          >
            Find A Storage Unit
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}


