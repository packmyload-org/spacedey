"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  author: string;
  href: string;
}

const allBlogPosts = [
  // Page 1
  {
    id: "1",
    title:
      "Creating a Self-Storage Inventory Checklist: Best Tips to Keep Your Storage Organized",
    date: "July 24, 2025",
    excerpt:
      "Learn tips to organise and manage your storage inventory with ease. Discover strategies for tracking, categorizing, and maintaining items long-term.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20133.png",
    author: "Samara Gofran",
    href: "#",
  },
  {
    id: "2",
    title: "Self-Storage for Furniture: Best Practices and Common Mistakes",
    date: "July 15, 2025",
    excerpt:
      "Learn the essential do's and don'ts of furniture storage to keep your pieces safe, clean, and damage-free in long-term storage.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20129.png",
    author: "Liezel",
    href: "#",
  },
  {
    id: "3",
    title: "Best Practices for Bicycle Storage in a Self-Storage Unit",
    date: "July 10, 2025",
    excerpt:
      "Get expert tips on bicycle storage solutions in self storage units. Learn how to prep, protect, and store your bike safely for the long term.",
    image: "https://blog.stufstorage.com/hubfs/postwoman-working-office-4.png",
    author: "Samara Gofran",
    href: "#",
  },
  {
    id: "4",
    title:
      "Living With Roommates? Here's What to Store Offsite to Make Room for Peace",
    date: "July 2, 2025",
    excerpt:
      "Living with a roommate and running out of space? Discover smart offsite storage tips to stay organized and reduce clutter.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20121%20(1)%20(1).png",
    author: "Samara Gofran",
    href: "#",
  },
  {
    id: "5",
    title:
      "Warehouse or Business Storage Units? How to Choose the Right Fit for Your Business",
    date: "June 26, 2025",
    excerpt:
      "Learn the key differences, pros and cons, and what to consider before choosing between warehouses or business storage units.",
    image:
      "https://blog.stufstorage.com/hubfs/postwoman-working-office%201.png",
    author: "David Thompson",
    href: "#",
  },
  {
    id: "6",
    title:
      "What to Store In Your Self Storage Units Before Your Summer Vacation",
    date: "June 19, 2025",
    excerpt:
      "Heading off on a summer getaway? Discover what to safely keep in self storage units before you travel.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20113%20(3)%20(1).png",
    author: "Spacedey",
    href: "#",
  },
  {
    id: "7",
    title: "How to Use Summer Storage to Make Your Vacation Hassle-Free",
    date: "June 11, 2025",
    excerpt:
      "Planning a summer getaway? Discover how summer storage helps protect your belongings and streamline your travel plans.",
    image: "https://blog.stufstorage.com/hubfs/pexels-kampus-8623325%201.png",
    author: "Spacedey",
    href: "#",
  },
  // Page 2
  {
    id: "8",
    title: "Smart Packing Strategies for Long-Term Storage Success",
    date: "June 5, 2025",
    excerpt:
      "Master the art of packing for storage with our comprehensive guide on maximizing space and protecting your items.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20133.png",
    author: "John Smith",
    href: "#",
  },
  {
    id: "9",
    title: "Climate Control in Storage: Why It Matters for Your Valuables",
    date: "May 28, 2025",
    excerpt:
      "Understand how temperature and humidity control can protect your most precious possessions from damage.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20129.png",
    author: "Sarah Johnson",
    href: "#",
  },
  {
    id: "10",
    title: "Storage Solutions for Small Spaces: Apartment Living Tips",
    date: "May 20, 2025",
    excerpt:
      "Maximize your apartment space with creative storage solutions and organizational techniques.",
    image: "https://blog.stufstorage.com/hubfs/postwoman-working-office-4.png",
    author: "Mike Chen",
    href: "#",
  },
  {
    id: "11",
    title: "Moving Guide: How to Store Your Belongings During Transition",
    date: "May 12, 2025",
    excerpt:
      "Learn the best practices for storing items during your move to ensure nothing gets damaged.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20121%20(1)%20(1).png",
    author: "Emma Wilson",
    href: "#",
  },
  {
    id: "12",
    title: "Seasonal Storage: Preparing Your Items for Different Climates",
    date: "May 5, 2025",
    excerpt:
      "Discover how to properly store seasonal items to keep them in perfect condition year after year.",
    image:
      "https://blog.stufstorage.com/hubfs/postwoman-working-office%201.png",
    author: "Robert Lee",
    href: "#",
  },
  {
    id: "13",
    title: "Business Inventory Management: Storage Solutions for Entrepreneurs",
    date: "April 28, 2025",
    excerpt:
      "Explore affordable and efficient storage options for your growing business inventory.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20113%20(3)%20(1).png",
    author: "Lisa Anderson",
    href: "#",
  },
  {
    id: "14",
    title: "Budget-Friendly Storage Tips: Save Money While Keeping Items Safe",
    date: "April 21, 2025",
    excerpt:
      "Get practical advice on how to store your items affordably without compromising on quality and safety.",
    image: "https://blog.stufstorage.com/hubfs/pexels-kampus-8623325%201.png",
    author: "Tom Brown",
    href: "#",
  },
  // Page 3
  {
    id: "15",
    title: "Wine and Art Storage: Preserving Your Valuable Collections",
    date: "April 14, 2025",
    excerpt:
      "Professional tips for storing valuable items like wine, art, and collectibles safely.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20133.png",
    author: "Victoria Green",
    href: "#",
  },
  {
    id: "16",
    title: "Document Storage and Organization: Keeping Records Safe",
    date: "April 7, 2025",
    excerpt:
      "Learn best practices for storing important documents and maintaining organized records.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20129.png",
    author: "David Martinez",
    href: "#",
  },
  {
    id: "17",
    title:
      "Storage Insurance: Protecting Your Belongings from Unexpected Events",
    date: "March 31, 2025",
    excerpt:
      "Understand storage insurance options and how to ensure your items are fully protected.",
    image: "https://blog.stufstorage.com/hubfs/postwoman-working-office-4.png",
    author: "Jennifer White",
    href: "#",
  },
  {
    id: "18",
    title: "Vehicle Storage: Winter Preparation and Long-Term Care",
    date: "March 24, 2025",
    excerpt:
      "Complete guide to preparing and storing your vehicle for winter or extended periods.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20121%20(1)%20(1).png",
    author: "Carlos Rodriguez",
    href: "#",
  },
  {
    id: "19",
    title: "RV and Boat Storage: Adventure Gear Protection",
    date: "March 17, 2025",
    excerpt:
      "Expert advice on storing recreational vehicles and boats to maintain their condition.",
    image:
      "https://blog.stufstorage.com/hubfs/postwoman-working-office%201.png",
    author: "Nicole Thompson",
    href: "#",
  },
  {
    id: "20",
    title: "Family Heirloom Storage: Preserving Your Heritage",
    date: "March 10, 2025",
    excerpt:
      "Learn how to properly store family treasures and heirlooms for future generations.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20113%20(3)%20(1).png",
    author: "George Peterson",
    href: "#",
  },
  {
    id: "21",
    title: "Storage for Students: Semester Break Solutions",
    date: "March 3, 2025",
    excerpt:
      "Affordable storage solutions for college students during breaks and transitions.",
    image: "https://blog.stufstorage.com/hubfs/pexels-kampus-8623325%201.png",
    author: "Rachel Adams",
    href: "#",
  },
  // Page 4
  {
    id: "22",
    title: "Organizing Your Storage Unit: Layout and Access Tips",
    date: "February 24, 2025",
    excerpt:
      "Maximize your storage unit efficiency with smart organization and layout strategies.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20133.png",
    author: "Marcus Johnson",
    href: "#",
  },
  {
    id: "23",
    title: "Security Features: What to Look for in a Storage Facility",
    date: "February 17, 2025",
    excerpt:
      "Essential security features every storage facility should have to protect your belongings.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20129.png",
    author: "Sophia Williams",
    href: "#",
  },
  {
    id: "24",
    title: "Storage Myths Debunked: Common Misconceptions Explained",
    date: "February 10, 2025",
    excerpt:
      "Separate fact from fiction with the truth about common storage facility concerns.",
    image: "https://blog.stufstorage.com/hubfs/postwoman-working-office-4.png",
    author: "Nathan Brooks",
    href: "#",
  },
  {
    id: "25",
    title: "Emergency Preparedness: Using Storage for Disaster Recovery",
    date: "February 3, 2025",
    excerpt:
      "How storage units can play a crucial role in emergency preparedness and disaster recovery.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20121%20(1)%20(1).png",
    author: "Patricia Clarke",
    href: "#",
  },
  {
    id: "26",
    title: "Storage Unit Downsizing: Making the Most of Smaller Spaces",
    date: "January 27, 2025",
    excerpt:
      "Smart tips for efficiently using smaller storage units and maximizing every square foot.",
    image:
      "https://blog.stufstorage.com/hubfs/postwoman-working-office%201.png",
    author: "Kevin Foster",
    href: "#",
  },
  {
    id: "27",
    title: "Eco-Friendly Storage: Sustainable Practices for Your Items",
    date: "January 20, 2025",
    excerpt:
      "Learn about sustainable and environmentally friendly storage options and practices.",
    image: "https://blog.stufstorage.com/hubfs/Frame%20113%20(3)%20(1).png",
    author: "Amanda Green",
    href: "#",
  },
  {
    id: "28",
    title: "Storage Unit Maintenance: Keeping Your Space Clean and Organized",
    date: "January 13, 2025",
    excerpt:
      "Regular maintenance tips to keep your storage unit in optimal condition year-round.",
    image: "https://blog.stufstorage.com/hubfs/pexels-kampus-8623325%201.png",
    author: "Daniel Harris",
    href: "#",
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.href}
      className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <p className="text-sm text-gray-500 mb-3">{post.date}</p>
        <h2 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm font-semibold text-blue-900">
            {post.author}
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
            Learn more
            <ChevronRight size={20} />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function BlogList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const totalPages = 4;
  const postsPerPage = 7;

  // Get posts for current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allBlogPosts.slice(startIndex, endIndex);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Blog Cards Grid */}
        <div className="space-y-8 mb-16">
          {/* Row 1: 2 Cards (First 2 Posts) */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentPosts.slice(0, 2).map((post, index) => (
              <div
                key={post.id}
                className={index === 0 ? "lg:col-span-2" : "lg:col-span-1"}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {/* Row 2: 3 Cards (Next 3 Posts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.slice(2, 5).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Row 3: 2 Cards + Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.slice(5, 7).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}

            {/* Newsletter Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 flex flex-col justify-between h-4/6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-3">
                  Subscribe to our Newsletter Updates
                </h2>
                <p className="text-gray-600 text-sm">
                  Subscribe to our Newsletter Updates
                  <br />
                  Additional text to convince them to subscribe
                </p>
              </div>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-4 mt-6"
              >
                <input
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="w-full bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-4 py-3 rounded-full font-bold text-base transition-colors"
                >
                  Subscribe
                </button>
                {subscribed && (
                  <p className="text-green-600 text-sm text-center">
                    Thanks for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <nav className="flex items-center justify-center gap-2 flex-wrap">
          {/* Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </nav>
      </div>
      {/* Related Posts & Resources Section */}
        <div className="mt-20 pt-12 ">

          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Related Post 1 */}
            <a
              href="#"
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1556746753-b2406de998e8?w=500&h=400&fit=crop"
                  alt="Spring storage guide"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <p className="text-sm text-gray-500 mb-3">April 26, 2025</p>
                <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors">
                  What to Store This Spring: A Guide for First-Time Renters
                </h3>
                <p className="text-gray-600 text-sm mt-3">
                  Spring cleaning in NYC? Discover what to store as a first-time renter of self storage units.
                </p>
              </div>
            </a>

            {/* Related Post 2 */}
            <a
              href="#"
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=400&fit=crop"
                  alt="Storage facilities guide"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <p className="text-sm text-gray-500 mb-3">April 30, 2025</p>
                <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors">
                  When to Use Self Storage Facilities: Smart Reasons to Rent
                </h3>
                <p className="text-gray-600 text-sm mt-3">
                  Discover when to use home storage facilities and how storage units can support various life transitions.
                </p>
              </div>
            </a>

            {/* Find the Right Size Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700  rounded-2xl p-6 flex flex-col justify-between lg:justify-start text-white shadow-lg h-4/5">
              <div>
                <h3 className="text-2xl font-bold mb-3">Find the Right Size</h3>
                
                <div className="space-y-2">
                  {/* Small */}
                  <div className=" bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20">
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 25" fill="none" className="flex-shrink-0 mt-1">
                        <path d="M21.6148 6.58036L13.3648 2.0663C13.1444 1.9445 12.8967 1.88062 12.6448 1.88062C12.393 1.88062 12.1453 1.9445 11.9248 2.0663L3.67484 6.58224C3.43923 6.71115 3.24256 6.90095 3.10535 7.13182C2.96815 7.3627 2.89545 7.62617 2.89484 7.89474V16.861C2.89545 17.1296 2.96815 17.393 3.10535 17.6239C3.24256 17.8548 3.43923 18.0446 3.67484 18.1735L11.9248 22.6894C12.1453 22.8112 12.393 22.8751 12.6448 22.8751C12.8967 22.8751 13.1444 22.8112 13.3648 22.6894L21.6148 18.1735C21.8504 18.0446 22.0471 17.8548 22.1843 17.6239C22.3215 17.393 22.3942 17.1296 22.3948 16.861V7.89568C22.3947 7.62663 22.3223 7.36257 22.185 7.13116C22.0478 6.89975 21.8509 6.7095 21.6148 6.58036ZM12.6448 11.6288L5.11202 7.5038L12.6448 3.3788L20.1777 7.5038L12.6448 11.6288ZM13.3948 20.9701V12.9254L20.8948 8.82099V16.861L13.3948 20.9701Z" fill="white"/>
                      </svg>
                      <div>
                        <p className="font-semibold">Small</p>
                        <p className="text-sm text-blue-100">3 x 3 and smaller</p>
                      </div>
                    </div>
                  </div>

                  {/* Medium */}
                  <div className=" backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 25" fill="none" className="flex-shrink-0 mt-1">
                        <path d="M21.6148 6.58036L13.3648 2.0663C13.1444 1.9445 12.8967 1.88062 12.6448 1.88062C12.393 1.88062 12.1453 1.9445 11.9248 2.0663L3.67484 6.58224C3.43923 6.71115 3.24256 6.90095 3.10535 7.13182C2.96815 7.3627 2.89545 7.62617 2.89484 7.89474V16.861C2.89545 17.1296 2.96815 17.393 3.10535 17.6239C3.24256 17.8548 3.43923 18.0446 3.67484 18.1735L11.9248 22.6894C12.1453 22.8112 12.393 22.8751 12.6448 22.8751C12.8967 22.8751 13.1444 22.8112 13.3648 22.6894L21.6148 18.1735C21.8504 18.0446 22.0471 17.8548 22.1843 17.6239C22.3215 17.393 22.3942 17.1296 22.3948 16.861V7.89568C22.3947 7.62663 22.3223 7.36257 22.185 7.13116C22.0478 6.89975 21.8509 6.7095 21.6148 6.58036ZM12.6448 11.6288L5.11202 7.5038L12.6448 3.3788L20.1777 7.5038L12.6448 11.6288ZM13.3948 20.9701V12.9254L20.8948 8.82099V16.861L13.3948 20.9701Z" fill="white"/>
                      </svg>
                      <div>
                        <p className="font-semibold">Medium</p>
                        <p className="text-sm text-blue-100">3 x 3 to 6 x 7</p>
                      </div>
                    </div>
                  </div>

                  {/* Large */}
                  <div className=" backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 25" fill="none" className="flex-shrink-0 mt-1">
                        <path d="M21.6148 6.58036L13.3648 2.0663C13.1444 1.9445 12.8967 1.88062 12.6448 1.88062C12.393 1.88062 12.1453 1.9445 11.9248 2.0663L3.67484 6.58224C3.43923 6.71115 3.24256 6.90095 3.10535 7.13182C2.96815 7.3627 2.89545 7.62617 2.89484 7.89474V16.861C2.89545 17.1296 2.96815 17.393 3.10535 17.6239C3.24256 17.8548 3.43923 18.0446 3.67484 18.1735L11.9248 22.6894C12.1453 22.8112 12.393 22.8751 12.6448 22.8751C12.8967 22.8751 13.1444 22.8112 13.3648 22.6894L21.6148 18.1735C21.8504 18.0446 22.0471 17.8548 22.1843 17.6239C22.3215 17.393 22.3942 17.1296 22.3948 16.861V7.89568C22.3947 7.62663 22.3223 7.36257 22.185 7.13116C22.0478 6.89975 21.8509 6.7095 21.6148 6.58036ZM12.6448 11.6288L5.11202 7.5038L12.6448 3.3788L20.1777 7.5038L12.6448 11.6288ZM13.3948 20.9701V12.9254L20.8948 8.82099V16.861L13.3948 20.9701Z" fill="white"/>
                      </svg>
                      <div>
                        <p className="font-semibold">Large</p>
                        <p className="text-sm text-blue-100">6 x 7 and larger</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="mt-4 lg:mt-4 inline-block text-center text-white font-bold transition-colors"
              >
                Explore all unit sizes
              </a>
            </div>
          </div>
        </div>
    </section>
  );
}
