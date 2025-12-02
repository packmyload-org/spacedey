import Image from "next/image";
import { Check, Shield } from "lucide-react";

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

interface StufAddOnsProps {
  title?: string;
  addOns?: AddOn[];
}

const defaultAddOns: AddOn[] = [
  {
    id: "stuf-blue",
    name: "Stuf Blue",
    description:
      "With Stuf Blue, you're in control. Say goodbye to price increases and hello to hassle-free storage — cancel anytime with no strings.",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/930a6f1acb33012e44ec75f131fe284e89eb661e6882f48ca472eec205e7a88d?format=webp&placeholderIfAbsent=true&width=2000",
    features: [
      { icon: "✓", text: "12 month price lock" },
      { icon: "✓", text: "Prices start at $10/month" },
      { icon: "✓", text: "Cancel anytime, no hidden fees" },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "Convenient, easy-to-add protection plans from Minico",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/4b9dfee66be3d92388290aa6aee5f4e9b2e98250952a6a743caff00366b2711d?format=webp&placeholderIfAbsent=true&width=2000",
    features: [
      { icon: "✓", text: "Protects up to $5,000" },
      { icon: "✓", text: "$0 deductible" },
      {
        icon: "✓",
        text: "Competitively priced with plans starting at $9/month",
      },
    ],
    linkText: "View sample policy",
    linkHref: "#",
  },
];

export default function ProductsStufAddOns({
  title = "Check out Stuf add-ons",
  addOns = defaultAddOns,
}: StufAddOnsProps) {
  return (
    <div>
      <div className="w-full bg-white py-16 px-6 lg:px-36">
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
              className="border border-gray-200 rounded-2xl p-8 lg:p-12 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left - Image */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden">
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
      <div className="mt-12">
        <img src="/images/Products3.svg" className="w-full h-auto" alt="" />
      </div>
    </div>
  );
}
