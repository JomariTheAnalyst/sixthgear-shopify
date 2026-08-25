import localFont from "next/font/local"
import { Inter, Montserrat, Poppins } from "next/font/google"

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
})

export const nationalCompressed = localFont({
  src: "../../public/fonts/national-2-compressed-extrabold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-national-compressed",
  display: "swap",
})

export const nationalCondensed = localFont({
  src: "../../public/fonts/national-2-condensed-extrabold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-national-condensed",
  display: "swap",
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
})

export const interDisplayMedium = localFont({
  src: [
    {
      path: "../../public/fonts/6915c8332ea6e8104f5a63fd_InterDisplay-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-inter-display-medium",
  display: "swap",
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
