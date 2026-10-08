import { nationalCompressed, parkinsans } from "@lib/fonts"

/** Section title: heavy compressed display font, uppercase. */
export const ABOUT_TITLE = `${nationalCompressed.className} uppercase leading-[0.88] tracking-[0.005em] text-[clamp(2.75rem,6vw,6.25rem)]`

/** Smaller display title for rows, tiles and accordion items. */
export const ABOUT_SUBTITLE = `${nationalCompressed.className} uppercase leading-[0.9] tracking-[0.01em]`

export const ABOUT_EYEBROW = `${parkinsans.className} text-xs font-semibold uppercase tracking-[0.18em] text-[#F16D34] md:text-sm`

export const ABOUT_BODY = `${parkinsans.className} text-base leading-relaxed md:text-lg`
