"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  {
    id: 1,
    question: "WHAT IS FIRST GEAR COFFEE?",
    answer:
      "First Gear Coffee is the cafe corner inside Sixthgear Moto. It is a relaxed stop for riders, customers waiting on their bikes, and anyone who wants a good coffee or snack while visiting the shop.",
  },
  {
    id: 2,
    question: "WHAT CAN I ORDER FROM FIRST GEAR COFFEE?",
    answer:
      "You can expect a mix of coffee drinks, non-coffee options, and snacks. The menu may change over time, but the goal is always simple: easy drinks and quick bites that fit the Sixthgear experience.",
  },
  {
    id: 3,
    question: "CAN I STAY HERE WHILE MY BIKE IS BEING SERVICED?",
    answer:
      "Yes. First Gear Coffee is designed to be a comfortable stop for customers waiting on service, PMS, installs, or diagnostics. You can grab a drink, sit down, and wait more comfortably while your bike is being handled.",
  },
  {
    id: 4,
    question: "DO YOU HAVE NON-COFFEE OPTIONS TOO?",
    answer:
      "Yes. First Gear Coffee is not only for coffee drinkers. Non-coffee drinks are available too, so there are options even if you want something lighter, cooler, or caffeine-free.",
  },
  {
    id: 5,
    question: "CAN I CHOOSE OPTIONS OR VARIANTS BEFORE ADDING TO CART?",
    answer:
      "Yes. If a product has available options such as size or other variants, you can select them before adding the item to your cart.",
  },
  {
    id: 6,
    question: "IS FIRST GEAR COFFEE ONLY FOR RIDERS?",
    answer:
      "No. Riders are a big part of the space, but anyone is welcome. If you are visiting Sixthgear, meeting friends, or just curious about the cafe, you can still drop by and enjoy the menu.",
  },
]

const FaqsSection = () => {
  const [openId, setOpenId] = useState<number | null>(2)

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[760px] px-5 sm:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <span
            className="mb-2 block text-[18px] text-[#dd5d36] sm:text-[22px]"
            style={{
              fontFamily: "'Brush Script MT', 'Alex Brush', cursive",
              fontStyle: "italic",
            }}
          >
            FAQS
          </span>
          <h2
            className="text-[28px] font-black uppercase leading-[1.1] tracking-tight text-[#222222] sm:text-[36px] md:text-[44px]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openId === faq.id

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-[12px] transition-colors duration-300 sm:rounded-[14px] ${
                  isOpen ? "bg-[#dd5d36] shadow-sm" : "bg-[#222222] hover:bg-[#333333]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left outline-none sm:px-8 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <h3
                    className="pr-4 text-[13px] font-extrabold uppercase tracking-wide text-white sm:text-[15px] md:text-[16px]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {faq.question}
                  </h3>

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center text-white">
                    {isOpen ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mx-5 border-t border-white/20 sm:mx-8" />
                    <div className="px-5 pb-5 pt-4 sm:px-8 sm:pb-6">
                      <p
                        className="text-[13px] font-medium leading-[1.6] text-white/95 sm:text-[14px]"
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
