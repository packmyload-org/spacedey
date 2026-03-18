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
    <div className="group flex h-full flex-col rounded-[22px] border border-[#DCE5FF] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#BFD0FF] hover:shadow-[0_18px_45px_rgba(17,42,114,0.08)]">
      <div className="relative mb-2.5 aspect-[1.08/1] overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F6FF_100%)]">
        <Image
          src={addOn.image}
          alt={addOn.name}
          fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>

      <div className="mb-2">
        <h3 className="text-[1.02rem] font-black text-[#102A72]">{addOn.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#62739E]">{addOn.description}</p>
      </div>

      <div className="mt-auto border-t border-[#EEF3FF] pt-3">
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <span className="block text-[1.75rem] font-black leading-none text-[#1642F0]">₦{price.toLocaleString()}</span>
          <p className="max-w-[48%] text-right text-[11px] font-bold leading-4 text-[#3E63D3]">{footerText}</p>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart?.(addOn)}
          className="w-full rounded-xl bg-[#1642F0] px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1238D4]"
        >
          {quantity > 0 ? `Add to cart again (${quantity})` : "Add to cart"}
        </button>

        {addOn.linkText && addOn.linkHref ? (
          <a
            href={addOn.linkHref}
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1642F0] transition-colors hover:text-[#1238D4]"
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
      <section className="w-full rounded-[30px] border border-[#E4EBFF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFCFF_100%)] px-4 py-6 shadow-[0_16px_50px_rgba(17,42,114,0.05)] md:px-6">
        <div className="flex flex-col gap-2 border-b border-[#E8EEFF] pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">Extras for move-in</p>
            <h2 className="mt-2 text-[1.8rem] font-black text-[#102A72]">{title}</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#62739E]">{subtitle ?? "Moving supplies and extra services"}</p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3E63D3]">{addOns.length} options</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
