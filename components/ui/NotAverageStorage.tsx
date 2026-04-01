import Link from "next/link";
import Image from "next/image";

export default function StorageLanding() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8 lg:py-10">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl  md:text-4xl lg:text-4xl font-bold text-[#003087] mb-5 leading-tight">
            Not Your Average Storage
          </h2>
          <div className="w-16 h-1 bg-[#ff6b35]"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-2 items-center">
          <div className="space-y-5 pr-4 sm:pr-6 lg:pr-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Storage in your neighborhood
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We transform underutilized spaces in nearby buildings into convenient storage solutions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Secure, inviting spaces
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our clean, bright, and welcoming storage facilities are equipped with top-notch security and surveillance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Digital key entry
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Safe, simple, and at your fingertips — the Spacedey Digital Key is the modern way to access your storage unit.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Personalized service
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Manage your reservation online or chat with a member of our 5-star Member Experience team.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/locations"
                className="inline-flex w-full justify-center rounded-full border-2 border-[#2563ff] px-6 py-2 text-sm font-semibold text-[#2563ff] transition-all duration-300 hover:bg-[#2563ff] hover:text-white sm:w-auto sm:px-10 sm:py-3 sm:text-lg md:px-12"
              >
                Explore Our Storage Facilities
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xl lg:max-w-3xl">
              <Image
                src="/images/DigitalKey.png"
                alt="Digital Key App Interface"
                width={600}
                height={400}
                quality={65}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="w-full h-auto rounded-[3rem] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
