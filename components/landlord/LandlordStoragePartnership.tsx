import Image from 'next/image';
import Link from 'next/link';

const LandlordStoragePartnership = () => {
  return (
    <section className="w-full bg-[#FAFBFF] px-12 pt-12 pb-4 md:pt-16 md:pb-6 lg:pt-20 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Column */}
          <div className="w-full">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
              <Image
                src="/images/BEFORE%26AFTER.jpg"
                alt="Stuf Partnership before and after"
                fill
                className="object-cover"
                sizes="(max-width: 638px) 90vw, (max-width: 998px) 45vw, 65vw"
                priority
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Convert empty space into rent
            </h2>

            <div className="border-t-2 border-gray-200 my-6"></div>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  New rental stream for ownership
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  Generate ₦90-500k in annual rent on space that was generating ₦0
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Practical amenity for tenants and the community
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  Provide an easy-to-access and flexible on-site storage solution
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Let us do all the work
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  We own all operations and opex, from sales and marketing to R&M
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="#get-in-touch"
                  className="border-1 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
                >
                  Partner with us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandlordStoragePartnership;