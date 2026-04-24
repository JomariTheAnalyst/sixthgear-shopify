const FEATURES = [
  {
    title: "Pit Stop Approved",
    description:
      "Coffee for quick resets, long waits, and those small wins after your bike finally sounds exactly how it should.",
  },
  {
    title: "Bike Talk Welcome",
    description:
      "A lounge where service updates, ride plans, and caffeine all happen naturally. No stiff cafe energy here.",
  },
  {
    title: "Easy Daily Fuel",
    description:
      "Simple, satisfying drinks that work before errands, after rides, or when you just need a better excuse to drop by.",
  },
] as const

export default function AboutUsSection() {
  return (
    <section className="bg-white py-20 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#f16d34]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            About First Gear Coffee
          </p>
          <h2
            className="text-[34px] font-black leading-[1.02] tracking-[-0.04em] text-[#222222] sm:text-[44px] md:text-[54px]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Coffee for riders,
            <br className="hidden sm:block" /> wrench days, and good stops.
          </h2>
          <p
            className="mx-auto mt-6 max-w-3xl text-sm font-medium leading-7 text-[#222222]/75 md:text-[15px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            First Gear Coffee is the laid-back side of the Sixthgear space:
            proper drinks, easy conversations, and a place to stay while the
            bikes get sorted. Come for the coffee, stay because someone started
            talking about exhaust notes again.
          </p>
        </div>

        <div className="relative mx-auto mt-8 flex max-w-4xl justify-center md:mt-10">
          <img
            src="/images/firstgear-coffee/firstgearcoffee-whitebg.png"
            alt="First Gear Coffee drink"
            className="h-auto w-full max-w-[780px] object-contain"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[#222222]/10 pt-10 md:grid-cols-3 md:gap-0 md:pt-12">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className={`px-4 text-center md:px-8 ${
                index > 0 ? "md:border-l md:border-[#222222]/10" : ""
              }`}
            >
              <h3
                className="text-xl font-extrabold leading-tight tracking-[-0.02em] text-[#222222] md:text-2xl"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {feature.title}
              </h3>
              <p
                className="mx-auto mt-4 max-w-[18rem] text-xs font-medium leading-6 text-[#222222]/70 md:text-[13px]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
