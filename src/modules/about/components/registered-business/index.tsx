import { ABOUT_CONTAINER, ABOUT_PROSE } from "@modules/about/constants"
import { ABOUT_BODY, ABOUT_TITLE } from "@modules/about/styles"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BirSealBadge from "@modules/legal/components/bir-seal-badge"

/** BIR Registration Seal (BIR RMC 38-2026) at a size where the QR stays scannable. */
export default function RegisteredBusiness() {
  return (
    <section
      aria-labelledby="about-registered-heading"
      className="bg-[#0A0A0A] py-16 text-white md:py-20"
    >
      <div
        className={`${ABOUT_CONTAINER} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}
      >
        <div>
          <h2 id="about-registered-heading" className={ABOUT_TITLE}>
            Registered business
          </h2>
          <p className={`${ABOUT_BODY} ${ABOUT_PROSE} mt-5 text-white/75`}>
            Registered with the Bureau of Internal Revenue. Scan the QR code to
            verify.
          </p>
          <LocalizedClientLink
            href="/government-compliance"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:border-[#F16D34] hover:bg-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
          >
            Government Compliance
            <span aria-hidden="true">&rarr;</span>
          </LocalizedClientLink>
        </div>

        {/* White card keeps the QR on a light background for scanning. */}
        <div className="w-full max-w-[720px] rounded-[20px] bg-white p-3 sm:p-4 lg:justify-self-end">
          <BirSealBadge />
        </div>
      </div>
    </section>
  )
}
