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
  price?: number;
  linkText?: string;
  linkHref?: string;
}

interface SpacedeyAddOnsProps {
  title?: string;
  subtitle?: string;
  addOns?: AddOn[];
  variant?: "feature" | "compact";
  onAddToCart?: (addOn: AddOn) => void;
  getItemQuantity?: (addOnId: string) => number;
}

const defaultAddOns: AddOn[] = [
  {
    id: "spacedey-blue",
    name: "Spacedey Blue",
    description:
      "With Spacedey Blue, you're in control. Say goodbye to price increases and hello to hassle-free storage — cancel anytime with no strings.",
    image: "/images/products/cardboard-box-medium.png",
    price: 15000,
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
    price: 15000,
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
    price: 15000,
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
    price: 15000,
    features: [
      { icon: "✓", text: "Useful for larger drop-offs and restocks" },
      { icon: "✓", text: "Supports business and household moves" },
      { icon: "✓", text: "Pairs well with flexible unit access" },
    ],
  },
];

function CompactAddOnCard({
  addOn,
  onAddToCart,
  quantity,
}: {
  addOn: AddOn;
  onAddToCart?: (addOn: AddOn) => void;
  quantity: number;
}) {
  const footerText = addOn.features[0]?.text;
  const price = addOn.price ?? 15000;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={addOn.image}
          alt={addOn.name}
          fill
          className="object-contain p-3"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>

      <h3 className="mb-1 text-base font-bold text-gray-900">{addOn.name}</h3>
      <p className="mb-3 line-clamp-2 text-sm leading-5 text-gray-500">{addOn.description}</p>

      <div className="mt-auto border-t border-gray-100 pt-3">
        <div className="mb-3 flex items-end justify-between gap-3">
          <span className="block text-xl font-bold text-blue-600">₦{price.toLocaleString()}</span>
          <p className="text-xs font-semibold text-blue-600 text-right">{footerText}</p>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart?.(addOn)}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-blue-700"
        >
          {quantity > 0 ? `Add to cart again (${quantity})` : "Add to cart"}
        </button>

        {addOn.linkText && addOn.linkHref ? (
          <a
            href={addOn.linkHref}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <Shield size={14} />
            {addOn.linkText}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function FeaturedAddOnCard({ addOn }: { addOn: AddOn }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-8 transition-shadow duration-300 hover:shadow-lg lg:p-20">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex justify-center lg:justify-center">
          <div className="relative h-72 w-72 overflow-hidden rounded-xl">
            <Image
              src={addOn.image}
              alt={addOn.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold text-blue-900">{addOn.name}</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">{addOn.description}</p>
          </div>

          <div className="mb-6 space-y-4">
            {addOn.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base text-gray-800">{feature.text}</span>
              </div>
            ))}
          </div>

          {addOn.linkText && (
            <div>
              <a
                href={addOn.linkHref}
                className="inline-flex items-center gap-2 text-base font-semibold text-blue-600 group hover:text-blue-700"
              >
                <Shield size={20} />
                {addOn.linkText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsSpacedeyAddOns({
  title = "Check out Spacedey add-ons",
  subtitle,
  addOns = defaultAddOns,
  variant = "feature",
  onAddToCart,
  getItemQuantity,
}: SpacedeyAddOnsProps) {
  if (variant === "compact") {
    return (
      <section className="w-full bg-white py-8">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-1.5 text-sm text-gray-500">{subtitle ?? "Moving supplies and extra services"}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {addOns.map((addOn) => (
            <CompactAddOnCard
              key={addOn.id}
              addOn={addOn}
              onAddToCart={onAddToCart}
              quantity={getItemQuantity?.(addOn.id) ?? 0}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div>
      <div className="w-full bg-white px-6 py-16 lg:px-16">
        <div className="mb-16 text-center">
          <h1 className="mb-8 text-3xl font-bold text-blue-900 lg:text-4xl">{title}</h1>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-orange-500"></div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-12">
          {addOns.map((addOn) => (
            <FeaturedAddOnCard key={addOn.id} addOn={addOn} />
          ))}
        </div>
      </div>

      <div className="relative mt-8 h-[0px] md:h-[100px]">
        <div className="absolute bottom-0 left-0 h-full w-full">
          <Image src="/images/Products3.svg" alt="" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
