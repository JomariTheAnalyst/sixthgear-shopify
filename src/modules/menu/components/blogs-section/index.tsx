"use client"

import React, { useRef } from "react"

const BLOG_POSTS = [
  {
    id: 1,
    title: "THE HEART OF OUR COZY SPACE",
    date: "JUN 21, 2026",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    excerpt: "Learn simple tips to make every cup taste like a cafÃ© classic, right at home.",
    link: "#"
  },
  {
    id: 2,
    title: "SWEET MORNING MOMENTS WITH MOCHA",
    date: "JUN 21, 2026",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    excerpt: "Explore delicious mocha ideas to enjoy your day, rich, creamy, and smooth.",
    link: "#"
  },
  {
    id: 3,
    title: "BREWING A GREENER COFFEE FUTURE",
    date: "JUN 21, 2026",
    image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=800&q=80",
    excerpt: "We're committed to sustainable sourcing and eco-friendly practices.",
    link: "#"
  },
  {
    id: 4,
    title: "MORNING RITUALS THAT INSPIRE",
    date: "JUN 21, 2026",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
    excerpt: "Start your day right with coffee moments that energize and calm, made with love.",
    link: "#"
  },
  {
    id: 5,
    title: "THE ART OF PERFECT LATTE POUR",
    date: "JUN 18, 2026",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    excerpt: "Master the subtle wrist movements required to pour stunning latte art at home.",
    link: "#"
  },
  {
    id: 6,
    title: "FARM TO CUP JOURNEY",
    date: "JUN 15, 2026",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    excerpt: "Trace the incredible journey of our beans from high-altitude farms to your daily cup.",
    link: "#"
  }
]

const BlogsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth
      const scrollAmount = direction === "left" ? -containerWidth * 0.8 : containerWidth * 0.8
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="bg-white py-20 lg:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <span 
            className="text-[#f16d34] text-xl sm:text-2xl block mb-2"
            style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
          >
            Blogs
          </span>
          <h2 
            className="text-[#222222] text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-black uppercase tracking-tight max-w-[800px] mx-auto"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            FRESH READS FOR COFFEE<br className="hidden sm:block" /> LOVERS
          </h2>
        </div>

        {/* Hide Scrollbar Snippet */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          >
            {BLOG_POSTS.map((post) => (
              <div 
                key={post.id}
                className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex flex-col bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden group mb-2"
              >
                {/* Image Section */}
                <div className="relative h-[200px] sm:h-[220px] w-full overflow-hidden shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Date Badge */}
                  <div 
                    className="absolute top-4 right-4 bg-[#F3B748] text-[#222222] text-[11px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm z-10"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {post.date}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 
                    className="text-[#222222] text-[18px] sm:text-[20px] font-extrabold uppercase leading-[1.3] tracking-tight mb-3 line-clamp-2"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {post.title}
                  </h3>
                  
                  <p 
                    className="text-gray-500 text-[13px] sm:text-[14px] leading-[1.6] font-medium mb-6 line-clamp-3"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <a 
                      href={post.link}
                      className="inline-block text-[#222222]/80 hover:text-[#222222] text-[12px] font-extrabold uppercase tracking-widest transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#f16d34] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      READ BLOG
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8 sm:mt-12">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-[12px] bg-white border border-gray-200 text-[#222222] flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
            aria-label="Previous posts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-[12px] bg-white border border-gray-200 text-[#222222] flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
            aria-label="Next posts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}

export default BlogsSection
