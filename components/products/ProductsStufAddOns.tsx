import Image from "next/image";
import { Shield } from "lucide-react";

interface AddOnFeature {
  icon: string;
  text: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  image: string;
  features: AddOnFeature[];
  linkText?: string;
  linkHref?: string;
}

interface SpacedeyAddOnsProps {
  title?: string;
  addOns?: AddOn[];
}

const defaultAddOns: AddOn[] = [
  {
    id: "spacedey-blue",
    name: "Spacedey Blue",
    description:
      "With Spacedey Blue, you're in control. Say goodbye to price increases and hello to hassle-free storage — cancel anytime with no strings.",
    image: "/images/products/cardboard-box-medium.png",
    features: [
      { icon: "✓", text: "12 month price lock" },
      { icon: "✓", text: "Price starts at ₦4,500. per square feet/month" },
      { icon: "✓", text: "Cancel anytime, no hidden fees" },
    ],
  },
  {
    id: "packing-supplies",
    name: "Packing Supplies",
    description:
      "Get the everyday packing essentials you need before move-in, from tape and wrap support to easy prep for cleaner, safer storage.",
    image: "/images/products/tape-dispenser.png",
    features: [
      { icon: "✓", text: "Great for move-in prep and repacking" },
      { icon: "✓", text: "Helps keep boxes secure in storage" },
      { icon: "✓", text: "Useful for both personal and business items" },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "Convenient, easy-to-add protection plans from Minico",
    image: "/images/services/umbrella.png",
    features: [
      { icon: "✓", text: "Protects up to ₦500,000." },
      { icon: "✓", text: "₦0 deductible" },
      {
        icon: "✓",
        text: "Competitively priced with plans starting at ₦10,000/month",
      },
    ],
    linkText: "View sample policy",
    linkHref: "#",
  },
  {
    id: "move-in-support",
    name: "Move-In Support",
    description:
      "Plan smoother drop-offs and business inventory moves with service support built around recurring storage use and quick access.",
    image: "/images/services/truck.png",
    features: [
      { icon: "✓", text: "Useful for larger drop-offs and restocks" },
      { icon: "✓", text: "Supports business and household moves" },
      { icon: "✓", text: "Pairs well with flexible unit access" },
    ],
  },
];

export default function ProductsSpacedeyAddOns({
  title = "Check out Spacedey add-ons",
  addOns = defaultAddOns,
}: SpacedeyAddOnsProps) {
  return (
    <div>
      <div className="w-full bg-white py-16 px-6 lg:px-16">
        {/* Header */}

        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-8">
            {title}
          </h1>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-orange-500"></div>
          </div>
        </div>

        {/* Add-ons Container */}
        <div className="max-w-6xl mx-auto space-y-12 ">
          {addOns.map((addOn) => (
            <div
              key={addOn.id}
              className="border border-gray-200 rounded-2xl p-8 lg:p-20 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left - Image */}
                <div className="flex justify-center lg:justify-center">
                  <div className="relative w-72 h-72 rounded-xl overflow-hidden">
                    <Image
                      src={addOn.image}
                      alt={addOn.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                {/* Right - Content */}
                <div className="lg:col-span-2 flex flex-col justify-between">
                  {/* Title & Description */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                      {addOn.name}
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {addOn.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-6">
                    {addOn.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-800 text-base">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Link (if exists) */}
                  {addOn.linkText && (
                    <div>
                      <a
                        href={addOn.linkHref}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-base group"
                      >
                        <Shield size={20} />
                        {addOn.linkText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
       
    
      <div className="mt-8 relative h-[0px] md:h-[100px]">
       <div className="absolute bottom-0 left-0 w-full h-full">
          <Image src="/images/Products3.svg" alt="" fill className="object-contain" />
        </div>
        </div>
    </div>
  );
}
