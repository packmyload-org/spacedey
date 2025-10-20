"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  verified?: boolean;
}

export default function ReferralReviewsCarousel() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});

  const reviews = [
    {
      id: 1,
      author: "Max Asante",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXExXfjQ6YP43tdOe-64QQ-rCrohG-eViwgf_bFLQbODG5HRWBd=s120-c-rp-mo-br100",
      rating: 5,
      date: "2 months ago",
      text: "I was assisted with making a reservation last minute by Meagan Weld at the call center. She was very helpful detailed and patient with all my questions. I was able to make it the facility almost by 5pm and was assisted by Magdalene Brown the property manager. She walked me through the facility and gave me the rundown. I was impressed and signed the contract to start the same day instead of the next day which would be Sat. Rates were amazing and I was assured they wouldn't have any major increases ever 6 months like extra space storage.",
      verified: true
    },
    {
      id: 2,
      author: "Katie H",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWzHp57-T26LygbjzFJ3wUb34UJcpT7Orc498s6TULuJ7V3ZEA=s120-c-rp-mo-ba4-br100",
      rating: 5,
      date: "1 year ago",
      text: "We've had a great experience so far when the Stuf storage in downtown Oakland. The remote customer service is responsive good at problem solving. Alerted us right away when we had accidentally left our unit unsecured. Sent maintenance out right away when someone had locked the new unit we were moving into. Other customers we've met their are all very nice . Not all units are equally well lit, so I'm going to reach out to customer service to see if there's anything we can do to get more light in our space.",
      verified: true
    },
    {
      id: 3,
      author: "Don Palm",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUMVxwe__N7p8Okb7s4jk903ccz1euHLnG2EBDisYDLWO-yCzuQag=s120-c-rp-mo-br100",
      rating: 5,
      date: "2 years ago",
      text: "The place is peaceful and accessible without a lot of people around, but its kinda hard, for me at least, to get help from customer support. That's the tradeoff for such a peaceful storage location, I'd say, since its all remotely staffed. But yea, that's kinda why I love the place. I can go whenever i need my stuff and I dont have to have a human interaction haha",
      verified: true
    },
    {
      id: 4,
      author: "Neeraj Lal",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXgR8_EhlaLags1Pi2czdf9k4zJqRq5jmLPA2mmr0rD3viHepwR=s120-c-rp-mo-ba3-br100",
      rating: 5,
      date: "2 years ago",
      text: "Easy to access. Clean and quiet storage. With 24hour safe access.",
      verified: true
    },
     {
      id: 5,
      author: "Max Asante",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXExXfjQ6YP43tdOe-64QQ-rCrohG-eViwgf_bFLQbODG5HRWBd=s120-c-rp-mo-br100",
      rating: 5,
      date: "2 months ago",
      text: "I was assisted with making a reservation last minute by Meagan Weld at the call center. She was very helpful detailed and patient with all my questions. I was able to make it the facility almost by 5pm and was assisted by Magdalene Brown the property manager. She walked me through the facility and gave me the rundown. I was impressed and signed the contract to start the same day instead of the next day which would be Sat. Rates were amazing and I was assured they wouldn't have any major increases ever 6 months like extra space storage.",
      verified: true
    },
    {
      id: 6,
      author: "Katie H",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWzHp57-T26LygbjzFJ3wUb34UJcpT7Orc498s6TULuJ7V3ZEA=s120-c-rp-mo-ba4-br100",
      rating: 5,
      date: "1 year ago",
      text: "We've had a great experience so far when the Stuf storage in downtown Oakland. The remote customer service is responsive good at problem solving. Alerted us right away when we had accidentally left our unit unsecured. Sent maintenance out right away when someone had locked the new unit we were moving into. Other customers we've met their are all very nice . Not all units are equally well lit, so I'm going to reach out to customer service to see if there's anything we can do to get more light in our space.",
      verified: true
    },
  ];

  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(reviews.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const toggleExpanded = (id: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getVisibleReviews = () => {
    const start = currentSlide * itemsPerSlide;
    return reviews.slice(start, start + itemsPerSlide);
  };

  return (
    <div className="w-full py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all -ml-4"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all -mr-4"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Reviews Container */}
          <div className="overflow-hidden px-2">
            <div className="flex gap-5 transition-transform duration-300 ease-in-out">
              {getVisibleReviews().map((review) => (
                <div
                  key={review.id}
                  className="flex-1 min-w-0"
                >
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                    {/* Author Block */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4" viewBox="0 0 24 25" fill="none">
                            <path fill="#fff" stroke="#fff" strokeWidth="2" d="M11.8 1.5C5.835 1.5 1 6.335 1 12.3v.4c0 5.965 4.835 10.8 10.8 10.8 5.965 0 10.8-4.835 10.8-10.8v-.4c0-5.965-4.835-10.8-10.8-10.8Z"/>
                            <path fill="#2A84FC" d="M21.579 12.734c0-.677-.055-1.358-.172-2.025h-9.403v3.839h5.384a4.614 4.614 0 0 1-1.992 3.029v2.49h3.212c1.886-1.736 2.97-4.3 2.97-7.333Z"/>
                            <path fill="#00AC47" d="M12.004 22.474c2.688 0 4.956-.882 6.608-2.406l-3.213-2.491c-.893.608-2.047.952-3.392.952-2.6 0-4.806-1.754-5.597-4.113H3.095v2.567a9.97 9.97 0 0 0 8.909 5.491Z"/>
                            <path fill="#FFBA00" d="M6.407 14.416a5.971 5.971 0 0 1 0-3.817V8.03H3.095a9.977 9.977 0 0 0 0 8.952l3.312-2.567Z"/>
                            <path fill="#FC2C25" d="M12.004 6.482a5.417 5.417 0 0 1 3.824 1.494l2.846-2.846a9.581 9.581 0 0 0-6.67-2.593A9.967 9.967 0 0 0 3.095 8.03l3.312 2.57c.787-2.363 2.996-4.117 5.597-4.117Z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{review.author}</span>
                          {review.verified && (
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 14 14" fill="none">
                              <path fill="#197BFF" d="M6.757.236a.35.35 0 0 1 .486 0l1.106 1.07a.35.35 0 0 0 .329.089l1.493-.375a.35.35 0 0 1 .422.244l.422 1.48a.35.35 0 0 0 .24.24l1.481.423a.35.35 0 0 1 .244.422l-.375 1.493a.35.35 0 0 0 .088.329l1.071 1.106a.35.35 0 0 1 0 .486l-1.07 1.106a.35.35 0 0 0-.089.329l.375 1.493a.35.35 0 0 1-.244.422l-1.48.422a.35.35 0 0 0-.24.24l-.423 1.481a.35.35 0 0 1-.422.244l-1.493-.375a.35.35 0 0 0-.329.088l-1.106 1.071a.35.35 0 0 1-.486 0l-1.106-1.07a.35.35 0 0 0-.329-.089l-1.493.375a.35.35 0 0 1-.422-.244l-.422-1.48a.35.35 0 0 0-.24-.24l-1.481-.423a.35.35 0 0 1-.244-.422l.375-1.493a.35.35 0 0 0-.088-.329L.236 7.243a.35.35 0 0 1 0-.486l1.07-1.106a.35.35 0 0 0 .089-.329L1.02 3.829a.35.35 0 0 1 .244-.422l1.48-.422a.35.35 0 0 0 .24-.24l.423-1.481a.35.35 0 0 1 .422-.244l1.493.375a.35.35 0 0 0 .329-.088L6.757.236Z"/>
                              <path fill="#fff" fillRule="evenodd" d="M9.065 4.85a.644.644 0 0 1 .899 0 .615.615 0 0 1 .053.823l-.053.059L6.48 9.15a.645.645 0 0 1-.84.052l-.06-.052-1.66-1.527a.616.616 0 0 1 0-.882.645.645 0 0 1 .84-.052l.06.052 1.21 1.086 3.034-2.978Z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          fill={i < review.rating ? "#FFC107" : "none"}
                          stroke={i < review.rating ? "#FFC107" : "#E0E0E0"}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <div className="flex-1">
                      <p className={`text-gray-700 text-sm leading-relaxed ${!expandedReviews[review.id] && review.text.length > 200 ? 'line-clamp-4' : ''}`}>
                        {review.text}
                      </p>
                      {review.text.length > 200 && (
                        <button
                          onClick={() => toggleExpanded(review.id)}
                          className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                        >
                          {expandedReviews[review.id] ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-gray-800 w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}