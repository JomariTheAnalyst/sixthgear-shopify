import localFont from "next/font/local"
import { Instrument_Serif, Inter, Montserrat, Poppins } from "next/font/google"

/**
 * Only the fonts the hero and nav use above the fold (Inter, Montserrat,
 * Outfit) are preloaded. The rest set preload: false; they still load, with
 * display: swap, as soon as a rendered section uses them.
 */

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
})

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
})

/**
 * Cursive title on the homepage services rows (hover state). Not preloaded:
 * this module is shared by every page, and the hidden hover titles start the
 * download when the services section renders.
 */
export const instrumentSerifItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
})

export const hendrix = localFont({
  src: [
    {
      path: "../../public/fonts/BRHendrix.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/BRHendrix_Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/BRHendrix-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hendrix",
  display: "swap",
  preload: false,
})

export const copy = localFont({
  src: [
    {
      path: "../../public/fonts/copy-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/copy-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-copy",
  display: "swap",
  preload: false,
})

export const nationalCompressed = localFont({
  src: "../../public/fonts/national-2-compressed-extrabold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-national-compressed",
  display: "swap",
  preload: false,
})

export const nationalCondensed = localFont({
  src: "../../public/fonts/national-2-condensed-extrabold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-national-condensed",
  display: "swap",
  preload: false,
})

export const lato = localFont({
  src: [
    {
      path: "../../public/fonts/halden_solid-webfont.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-lato",
  display: "swap",
  preload: false,
})

export const interDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/BngMUXZYTXPIvIBgJJSb6ufN5qU.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
  preload: false,
})

export const handwritten = localFont({
  src: [
    {
      path: "../../public/fonts/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpYQ.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-handwritten",
  display: "swap",
  preload: false,
})

export const silka = localFont({
  src: [
    {
      path: "../../public/fonts/silka-regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-silka",
  display: "swap",
  preload: false,
})

export const outfit = localFont({
  src: [
    {
      path: "../../public/fonts/outfit-variable-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
})
