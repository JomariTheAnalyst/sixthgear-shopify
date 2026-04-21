import { Metadata } from "next"
import Script from "next/script"

import { clientEnv } from "@lib/env"
import { hendrix, inter, montserrat, poppins } from "@lib/fonts"
import { getSeoMetadataBase } from "@lib/seo"
import { getBaseURL } from "@lib/util/env"
import { Toaster } from "sonner"

import { ConsoleWarning } from "../components/common/console-warning"
import { PreviewIndicator } from "../components/preview-indicator"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: getSeoMetadataBase(),
  title: {
    default: "SixthgearMoto | Motorcycle Gear, Parts, Services",
    template: "%s - SixthgearMoto",
  },
  description:
    "Shop motorcycle gear and parts, book workshop services, and discover the rider hub experience of SixthgearMoto in the Philippines.",
  applicationName: "SixthgearMoto",
  openGraph: {
    type: "website",
    url: getBaseURL(),
    siteName: "SixthgearMoto",
    title: "SixthgearMoto | Motorcycle Gear, Parts, Services",
    description:
      "Shop motorcycle gear and parts, book workshop services, and discover the rider hub experience of SixthgearMoto in the Philippines.",
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico" },
      {
        url: "/images/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/images/favicon/apple-touch-icon.png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/images/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/images/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body
        className={`${hendrix.variable} ${inter.variable} ${montserrat.variable} ${poppins.variable} font-sans`}
      >
        <ConsoleWarning />
        <PreviewIndicator />
        <main className="relative">{props.children}</main>
        <Toaster position="bottom-right" richColors />
        {clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY && (
          <Script
            src={`https://code.tidio.co/${clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY}.js`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
