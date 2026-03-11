"use client"

import React, { useState } from "react"

const FAQ_ITEMS = [
  {
    id: 1,
    question: "WHAT TYPES OF COFFEE DO YOU SERVE?",
    answer: "We offer a wide variety of coffee including single-origin espresso, expertly crafted pour-overs, cold brews, and classic milk-based drinks like lattes and cappuccinos."
  },
  {
    id: 2,
    question: "DO YOU HAVE NON-DAIRY MILK OPTIONS?",
    answer: "Yes! We provide almond, soy, and oat milk options so you can enjoy your favorite coffee exactly how you like it, without compromising taste or quality."
  },
  {
    id: 3,
    question: "CAN I ORDER ONLINE OR FOR TAKEAWAY?",
    answer: "Absolutely! You can easily place an order through our website or partner apps for quick pickup, or just drop by for a takeaway cup."
  },
  {
    id: 4,
    question: "DO YOU OFFER LOYALTY OR MEMBERSHIP PROGRAMS?",
    answer: "Yes, we have a digital loyalty program where you earn points for every purchase, which can be redeemed for free drinks, beans, and exclusive merchandise."
  },
  {
    id: 5,
    question: "ARE YOUR BEANS ETHICALLY SOURCED?",
    answer: "We partner directly with farmers and trusted suppliers to ensure fair trade practices, sustainable farming, and premium quality in every batch of beans we roast."
  },
  {
    id: 6,
    question: "IS YOUR CAFÃ‰ KID AND FAMILY-FRIENDLY?",
    answer: "Of course! We have a welcoming atmosphere for all ages, with special kid-friendly non-caffeinated drinks and a cozy seating area for families."
  }
]

const FaqsSection = () => {
  const [openId, setOpenId] = useState<number | null>(2) // Default open item to match design mockup

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[760px] mx-auto px-5 sm:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-14">
          <span 
            className="text-[#dd5d36] text-[18px] sm:text-[22px] block mb-2"
            style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
          >
            FAQS
          </span>
          <h2 
            className="text-[#222222] text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1] font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        {/* FAQs Accordion */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openId === faq.id;
            
            return (
              <div 
                key={faq.id}
                className={`rounded-[12px] sm:rounded-[14px] overflow-hidden transition-colors duration-300 ${
                  isOpen ? 'bg-[#dd5d36] shadow-sm' : 'bg-[#222222] hover:bg-[#333333]'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between outline-none"
                  aria-expanded={isOpen}
                >
                  <h3 
                    className="text-white text-[13px] sm:text-[15px] md:text-[16px] font-extrabold uppercase tracking-wide pr-4"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {faq.question}
                  </h3>
                  
                  {/* Plus/Minus Icon */}
                  <div className="shrink-0 text-white flex items-center justify-center w-6 h-6">
                    {isOpen ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                </button>
                
                {/* Answer Content - Collapsable */}
                <div 
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* The subtle separator line specific to the design */}
                    <div className="border-t border-white/20 mx-5 sm:mx-8" />
                    <div className="px-5 pb-5 sm:px-8 sm:pb-6 pt-4">
                      <p 
                        className="text-white/95 text-[13px] sm:text-[14px] leading-[1.6] font-medium"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FaqsSection
