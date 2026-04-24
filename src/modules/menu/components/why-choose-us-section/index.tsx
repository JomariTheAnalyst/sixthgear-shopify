import { inter, montserrat } from "@lib/fonts"

const FEATURES = [
  {
    id: 1,
    title: "Ride-Ready Fuel",
    description:
      "Coffee made for quick stops, long talks, and the kind of mornings that need a clean first gear.",
    icon: "/images/firstgear-coffee/SVG/wimpdecaf.com-5.svg",
  },
  {
    id: 2,
    title: "Cafe Meets Moto",
    description:
      "A proper hangout for riders, friends, and anyone who likes their coffee with a bit of garage energy.",
    icon: "/images/firstgear-coffee/SVG/wimpdecaf.com-6.svg",
  },
  {
    id: 3,
    title: "Easy Daily Picks",
    description:
      "Simple coffee drinks, non-coffee options, and snacks that are easy to order and easy to come back for.",
    icon: "/images/firstgear-coffee/SVG/wimpdecaf.com-8.svg",
  },
  {
    id: 4,
    title: "Fresh Stop Ritual",
    description:
      "Built for your pre-ride, post-service, or afternoon reset without making the menu complicated.",
    icon: "/images/firstgear-coffee/SVG/wimpdecaf.com-9.svg",
  },
  {
    id: 5,
    title: "No-Rush Corners",
    description:
      "A calmer space to wait, meet, or plan the next route while your drink does the quiet heavy lifting.",
    icon: "/images/firstgear-coffee/SVG/wimpdecaf.com-11.svg",
  },
  {
    id: 6,
    title: "Made For The Stopover",
    description:
      "Not a generic cafe corner. First Gear Coffee is part of the Sixthgear experience, from bikes to brews.",
    icon: "/images/firstgear-coffee/SVG/wimpdecaf.com-5.svg",
  },
]

const WhyChooseUsSection = () => {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1260px] px-5 sm:px-8 lg:px-10">
        <h2
          className={`${montserrat.className} mx-auto mb-14 text-center text-[64px] font-black leading-[0.82] tracking-[-0.09em] text-[#191b22] sm:mb-18 sm:text-[104px] lg:text-[150px]`}
        >
          Why First Gear?
        </h2>

        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className="flex min-h-[300px] flex-col items-center justify-center rounded-[26px] bg-[#f6f1e8] px-8 py-10 text-center sm:min-h-[330px] lg:min-h-[360px]"
            >
              <div className="mb-8 flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                <img
                  src={feature.icon}
                  alt=""
                  className="h-full w-full scale-110 object-contain"
                  aria-hidden="true"
                />
              </div>

              <h3
                className={`${montserrat.className} text-[26px] font-black leading-none tracking-[-0.06em] text-[#2b2b2b] sm:text-[30px]`}
              >
                {feature.title}
              </h3>

              <p
                className={`${inter.className} mt-6 max-w-[310px] text-[15px] font-medium leading-7 text-[#4b4b4b] sm:text-[16px]`}
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

export default WhyChooseUsSection
