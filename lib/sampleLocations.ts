export type SamplePricing = { size: string; originalPrice: string; currentPrice: string };

export type SampleLocation = {
  city: string;
  address: string;
  hours: string;
  imageUrl: string;
  pricing: SamplePricing[];
};

export const SAMPLE_LOCATIONS: SampleLocation[] = [
  {
    city: 'Lagos',
    address: '100 Market Rd, Lagos, NG',
    hours: '6am - 10pm',
    imageUrl: '/images/Lagos.jpg',
    pricing: [
      { size: "S (6' x 8')", originalPrice: '7200', currentPrice: '5004.00' },
      { size: "M (5' x 9')", originalPrice: '6800', currentPrice: '4706.00' },
      { size: "L (18' x 9')", originalPrice: '24300', currentPrice: '17001.00' },
    ],
  },
  {
    city: 'Abuja',
    address: '10 Central Ave, Abuja, NG',
    hours: '6am - 10pm',
    imageUrl: '/images/Abuja.jpeg',
    pricing: [
      { size: "S (6' x 8')", originalPrice: '7200', currentPrice: '5004.00' },
      { size: "M (5' x 9')", originalPrice: '6800', currentPrice: '4706.00' },
      { size: "L (18' x 9')", originalPrice: '24300', currentPrice: '17001.00' },
    ],
  },
  {
    city: 'Kano',
    address: '55 Commerce St, Kano, NG',
    hours: '6am - 10pm',
    imageUrl: '/images/Kano.png',
    pricing: [
      { size: "S (6' x 8')", originalPrice: '7200', currentPrice: '5004.00' },
      { size: "M (5' x 9')", originalPrice: '6800', currentPrice: '4706.00' },
      { size: "L (18' x 9')", originalPrice: '24300', currentPrice: '17001.00' },
    ],
  },
  {
    city: 'Ibadan',
    address: '2 Liberty Rd, Ibadan, NG',
    hours: '6am - 10pm',
    imageUrl: '/images/Ibadan.jpg',
    pricing: [
      { size: "S (6' x 8')", originalPrice: '7200', currentPrice: '5004.00' },
      { size: "M (5' x 9')", originalPrice: '6800', currentPrice: '4706.00' },
      { size: "L (18' x 9')", originalPrice: '24300', currentPrice: '17001.00' },
    ],
  },
  {
    city: 'Port Harcourt',
    address: '8 Harbor Way, Port Harcourt, NG',
    hours: '6am - 10pm',
    imageUrl: '/images/ph.jpg',
    pricing: [
      { size: "S (6' x 8')", originalPrice: '7200', currentPrice: '5004.00' },
      { size: "M (5' x 9')", originalPrice: '6800', currentPrice: '4706.00' },
      { size: "L (18' x 9')", originalPrice: '24300', currentPrice: '17001.00' },
    ],
  },
];

export default SAMPLE_LOCATIONS;
