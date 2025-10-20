import Image from 'next/image';

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
  leftImage?: string;
  rightImage?: string;
}

export default function BlogHero({
  title = 'Things to Know',
  subtitle = 'Tips, tricks, and storage hacks from the people who know space best.',
  leftImage = 'https://blog.stufstorage.com/hubfs/blog-list-hero-left.png',
  rightImage = 'https://blog.stufstorage.com/hubfs/blog-list-hero-right.png',
}: BlogHeroProps) {
  return (
    <div className="w-full bg-[#1642F0]">
      <div className="relative flex items-center justify-center min-h-96 px-4 py-12">
        {/* Left Image */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block w-1/4">
          <div className="relative w-full h-full">
            <Image
              src={leftImage}
              alt="blog-list-hero-left"
              width={300}
              height={400}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center max-w-2xl px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <h2 className="text-xl lg:text-2xl text-white font-normal">
            {subtitle}
          </h2>
        </div>

        {/* Right Image */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block w-1/4">
          <div className="relative w-full h-full">
            <Image
              src={rightImage}
              alt="blog-list-hero-right"
              width={300}
              height={400}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}