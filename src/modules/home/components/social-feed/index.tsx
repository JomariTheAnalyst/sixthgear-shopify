import { nationalCompressed } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ConsentedCuratorEmbed from "./consented-curator-embed"

export default function SocialFeed() {
  return (
    <section
      aria-labelledby="social-feed-heading"
      className="w-full overflow-x-hidden bg-white pb-8 pt-12 text-[#111111] sm:pb-10 sm:pt-16 lg:pb-12 lg:pt-20"
    >
      <h2
        id="social-feed-heading"
        className={`${nationalCompressed.className} px-4 text-center text-[clamp(3rem,7vw,7rem)] uppercase leading-[0.85] tracking-[-0.025em] sm:px-6`}
      >
        #SIXTHGEARMOTO
      </h2>

      <div className="mt-8 w-full sm:mt-10">
        <ConsentedCuratorEmbed />
      </div>

      <div className="mt-6 flex justify-center px-4 sm:mt-8">
        <LocalizedClientLink
          href="/social-wall"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111111] px-9 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#ff4e00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
        >
          View Social Wall
        </LocalizedClientLink>
      </div>
    </section>
  )
}
