import Image from 'next/image';

export default function StorageFeatures() {
  const features = [
    {
      title: 'They reserve a storage unit',
      description: "We'll reach out to your friend and give them an additional 50% off their first 3 months when they reserve and move into a storage unit.",
      image: '/images/location.png',
      alt: 'they-reserve',
    },
    {
      title: 'You earn a reward',
      description: 'Just like that, once they move in, you\'ll get rewarded for every friend you refer who moves in.',
      image: '/images/reward.png',
      alt: 'earn-a-reward',
    },
    {
      title: 'Invite Friends',
      description: 'Refer friends to Spacedey by simply submitting the form above.',
      image: '/images/invite.png',
      alt: 'invite-friends',
    },
  ];

  return (
    <section className="storage-features-section py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="storage-features-header text-center mb-12">
          <h2 className="storage-features-header-heading text-3xl lg:text-4xl font-bold mb-4">
            HOW IT WORKS
          </h2>
          <div className="richtext">
            <p><span>follow these 3 easy steps</span></p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="storage-features-wrapper grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="storage-feature-box text-center">
              <div className="flex justify-center mb-4">
                <Image
                  className="storage-feature-icon"
                  src={feature.image}
                  alt={feature.alt}
                  width={150}
                  height={150}
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <h4 className="storage-feature-title text-xl font-semibold mb-3">
                {feature.title}
              </h4>
              <div className="richtext">
                <p><span>{feature.description}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}