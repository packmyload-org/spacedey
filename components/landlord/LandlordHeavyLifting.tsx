import Image from 'next/image';
import Link from 'next/link';

interface FeatureCardProps {
  icon: string;
  title: string;
}

const FeatureCard = ({ icon, title }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <Image
          src={icon}
          alt=""
          fill
          className="object-contain"
          sizes="(max-width: 538px) 32vw, (max-width: 898px) 21vw, 15vw"
          loading="lazy"
        />
      </div>
      <p className="text-base md:text-lg text-gray-800 leading-relaxed max-w-xs">
        {title}
      </p>
    </div>
  );
};

const HeavyLiftingSection = () => {
  const features = [
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e059d07574c105345ca0792bf09ed1826da58b7dbce085db826ccda8dd5ad503?placeholderIfAbsent=true&width=400',
      title: 'We design, build, and maintain the space',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f5e0e6eea126b7600a5c0f4b611da8fa271cfa843dde3daabc5480ebc21c6ac?placeholderIfAbsent=true&width=200',
      title: 'We operate and surveil each location',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/63ceb38af1bd55e12038201a4b9f6ef913d81fd39a519e0d419cbcea4baf3d42?placeholderIfAbsent=true&width=200',
      title: 'We manage sales and marketing to get new customers',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3fd6a3bdb470f5095f840b72f5716e9b23ccc8a6627df310f59a48bd53948d4b?placeholderIfAbsent=true&width=400',
      title: 'We pay percentage rent to our landlord partners',
    },
  ];

  return (
    <section className="w-full px-10 py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading. */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Let us do the heavy lifting
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>

        {/* Features Grid. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="#get-in-touch"
            className="border-1 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
          >
            Partner with us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeavyLiftingSection;