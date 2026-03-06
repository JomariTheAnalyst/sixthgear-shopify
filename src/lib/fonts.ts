import localFont from "next/font/local"
import { Inter, Montserrat } from "next/font/google"

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
