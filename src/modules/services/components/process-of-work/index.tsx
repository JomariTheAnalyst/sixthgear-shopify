const PROCESS_STEPS = [
  {
    number: "01",
    title: "Consultation & Service Intake",
    description:
      "We start by understanding the motorcycle, the riding concerns, and the work required. This gives the team a clear service brief before any technical work begins.",
  },
  {
    number: "02",
    title: "Inspection & Work Planning",
    description:
      "Our technicians inspect the bike, identify the priority issues, and map out the correct service path. Parts, labor scope, and timing are aligned before execution.",
  },
  {
    number: "03",
    title: "Workshop Execution",
    description:
      "Approved work is carried out using the proper tools, service procedures, and parts. Every task is handled with the same focus on reliability, cleanliness, and finish quality.",
  },
  {
    number: "04",
    title: "Final Check & Handover",
    description:
      "Before release, the motorcycle goes through a final review so the completed work is verified and ready for handover. The result is a clear, professional service experience from start to finish.",
  },
] as const

export default function ProcessOfWork() {
  return (
    <section className="bg-white py-24 md:py-32 w-full border-t border-[#EAEAEA]">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mb-14 md:mb-16">
          <h2
            className="text-[2.5rem] md:text-5xl lg:text-6xl text-[#111] leading-[1.05] tracking-[-0.03em] font-semibold"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            Sixthgear process of work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {PROCESS_STEPS.map((step, index) => {
            const isMuted = index === 0 || index === 3

            return (
              <article
                key={step.number}
                className={`min-h-[280px] md:min-h-[320px] border border-[#EAEAEA] p-8 md:p-10 lg:p-12 flex flex-col justify-start ${
                  isMuted ? "bg-[#FAFAFA]" : "bg-white"
                }`}
              >
                <span
                  className="text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] leading-none tracking-[-0.05em] font-medium text-black/30"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  {step.number}
                </span>

                <h3
                  className="mt-6 text-[1.9rem] md:text-[2.1rem] lg:text-[2.35rem] leading-[1.05] tracking-[-0.03em] font-semibold text-[#111]"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  {step.title}
                </h3>

                <p
                  className="mt-5 max-w-[34rem] text-sm md:text-[15px] lg:text-base leading-7 text-[#111]/78"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}
