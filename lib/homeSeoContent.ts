export const faqData = [
  {
    category: "ACCESS & SUPPORT",
    items: [
      {
        question: "1. What are your access hours?",
        answer: `Our storage facility in Oregun, Ikeja is accessible during operating hours. Please contact us at hello@spacedey.com or call +234 700 722 5776 for current access hour information, as hours may vary by unit type and rental plan.

We understand that Lagos life does not always run on a 9-to-5 schedule. If you have specific access requirements - early morning, late evening, or weekend access - speak to our team when booking and we will do our best to accommodate you.`,
      },
      {
        question: "2. What are your customer service hours?",
        answer: `Our customer service team is available Monday to Saturday.

Phone/WhatsApp: +234 700 722 5776
Email: hello@spacedey.com
Website: www.spacedey.com

We aim to respond to all enquiries within 2 hours during business hours. For urgent issues outside of office hours, please WhatsApp us and we will get back to you as soon as possible.`,
      },
      {
        question: "3. How do I access my storage unit?",
        answer: `Once your rental agreement is confirmed and payment received, our team will provide you with access details for your specific unit. Access is through our secured facility entrance. You will be issued a key depending on your unit type.

Please note: access is only granted to named account holders and authorized contacts listed on your rental agreement. We take security seriously - do not share your access credentials with anyone not listed on your account.`,
      },
      {
        question: "4. Can I authorize someone else to access my unit?",
        answer: `Yes. You can authorize a trusted individual to access your storage unit on your behalf.

To do this:
• Submit a written authorization request to hello@spacedey.com with the full name and contact details of the person you are authorizing
• The authorized person must present valid government-issued ID
• Authorization can be one-time or ongoing

Spacedey Storage will not be liable for any loss, damage, or misuse resulting from access granted to an authorized third party.`,
      },
    ],
  },
  {
    category: "UNIT SELECTION & STORAGE CONDITIONS",
    items: [
      {
        question: "5. What size unit do I need?",
        answer: `Choosing the right unit size is important - and we are here to help.

Small units:
Ideal for boxes, documents, small appliances, and personal items.

Medium units:
Suitable for the contents of a 1–2 bedroom flat.

Large units:
Best for 3+ bedroom homes, office relocations, or business inventory.

Not sure? Contact our team on WhatsApp at +234 700 722 5776 and describe what you need to store.`,
      },
      {
        question: "6. Are the units climate controlled?",
        answer: `Given Lagos's tropical climate - with high humidity and heat year-round - this is one of the most important questions for any self storage facility in Nigeria.

Please contact our team at hello@spacedey.com or +234 700 722 5776 for specific information about climate control and ventilation options available.

General storage tips:
• Use sealed plastic boxes rather than cardboard
• Wrap electronics in moisture-resistant material
• Elevate items off the floor where possible
• Avoid storing perishable goods`,
      },
    ],
  },
  {
    category: "SECURITY & LOCKS",
    items: [
      {
        question: "7. How secure are your facilities?",
        answer: `Security is at the core of everything we do at Spacedey Storage.

Our facility features:
• 24/7 CCTV surveillance
• Secured perimeter access
• Individual unit locks
• On-site management presence

We strongly recommend that customers insure their stored items for added protection.`,
      },
      {
        question: "8. Do I need to bring my own lock?",
        answer: `Yes. Each customer is required to provide their own padlock for their storage unit.

We recommend:
• A high-quality disc padlock
• Keeping a spare key with a trusted person
• Never sharing your lock details with unauthorized persons

Spacedey Storage is not responsible for loss resulting from an inadequate or compromised lock.`,
      },
    ],
  },
  {
    category: "MOVE-IN, PARKING & ON-SITE LOGISTICS",
    items: [
      {
        question: "9. Can I move in the same day I book?",
        answer: `In most cases, yes - subject to unit availability and payment confirmation.

To move in the same day:
• Complete your booking and payment
• Submit all required documentation
• Ensure move-in falls within access hours

We recommend booking at least 24 hours in advance where possible.`,
      },
      {
        question: "10. Do you offer carts or moving equipment?",
        answer: `Please contact our team to confirm what moving equipment is currently available at our facility.

For large or heavy items:
• Arrange your own moving team
• Inform us in advance for oversized items

Our sister company, Packmyload, also offers professional moving and logistics services across Lagos.`,
      },
      {
        question: "11. Is parking available for move-in?",
        answer: `Yes, parking is available to facilitate loading and offloading.

For large vehicles or multiple arrivals, please notify us in advance so we can coordinate access and avoid congestion.

Parking is for active loading and offloading only.`,
      },
    ],
  },
  {
    category: "PRICING, BILLING & TERMS",
    items: [
      {
        question: "12. How much does storage cost per month?",
        answer: `Spacedey Storage offers competitive and affordable self storage prices in Lagos, Nigeria.

We offer:
• Flexible monthly rental plans
• Discounted long-term rates
• Business storage packages

Visit www.spacedey.com or WhatsApp us on +234 700 722 5776 for current pricing and availability.`,
      },
      {
        question: "13. Is there a minimum rental period?",
        answer: `Yes. Our minimum rental period is one month.

We do not offer daily or weekly storage rentals. If you need short-term storage during a move, contact us and we will help you find the most cost-effective option.`,
      },
      {
        question: "14. Do prices increase?",
        answer: `Like all businesses operating in Nigeria, pricing may be reviewed periodically due to inflation, exchange rates, and operational costs.

We always provide advance written notice before any price adjustment takes effect.

Ask about our price-lock membership plans for long-term savings.`,
      },
      {
        question: "15. How do I cancel my storage unit?",
        answer: `To cancel your storage unit:
• Provide at least 24 hours written notice
• Submit cancellation via email or dashboard
• Clear and clean out your unit
• Return all access credentials

Please note:
• Verbal cancellations are not accepted
• Final month rental is not prorated`,
      },
    ],
  },
  {
    category: "POLICIES & PROTECTION",
    items: [
      {
        question: "16. What items am I not allowed to store?",
        answer: `The following items are strictly prohibited:
• Hazardous or flammable materials
• Perishable goods
• Illegal substances or stolen goods
• Firearms or ammunition without approval
• Live animals
• Uninsured high-value items
• Strong odour-emitting items

If prohibited items are discovered, Spacedey Storage reserves the right to terminate the rental agreement immediately.`,
      },
      {
        question: "17. Is insurance required?",
        answer: `While insurance is not mandatory, we strongly recommend it.

Important notes:
• We are not liable for loss or damage unless caused by negligence
• Many home insurance policies may not cover storage facilities
• Specialist goods-in-storage insurance is available

We advise customers to maintain a detailed inventory with photographs and replacement values.`,
      },
    ],
  },
]

export const HOME_FAQS = faqData.flatMap(item => item.items).slice(0, 15)

export const HOME_SERVICE_TYPES = [
  'Secure self storage units',
  'Secure storage solutions',
  'Personal self storage',
  'Business inventory storage',
  'Moving and transition storage',
  'Student storage',
  'Flexible monthly storage plans',
  'Storage size guidance',
] as const;

export const HOME_MARKETS = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Ibadan',
  'Benin City',
  'Enugu',
  'Abeokuta',
  'Kaduna',
  'Plateau',
] as const;
