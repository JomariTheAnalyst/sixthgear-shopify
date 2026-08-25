import { Metadata } from "next"
import Script from "next/script"
import { draftMode } from "next/headers"
import { VisualEditing } from "next-sanity/visual-editing"

import { clientEnv } from "@lib/env"
import {
  copy,
  hendrix,
  inter,
  montserrat,
  nationalCompressed,
  nationalCondensed,
  poppins,
} from "@lib/fonts"
import { getDefaultTwitterMetadata, getSeoMetadataBase } from "@lib/seo"
import { getBaseURL } from "@lib/util/env"
import { Toaster } from "sonner"

import { ConsoleWarning } from "../components/common/console-warning"
import { PreviewIndicator } from "../components/preview-indicator"
import { SanityVisualEditingProvider } from "../components/sanity/visual-editing-provider"
import { SanityLive } from "../../sanity/lib/live"
import { shouldRenderVisualEditing } from "@lib/cms/visual-editing"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: getSeoMetadataBase(),
  title: {
    default: "SixthGearMoto",
    template: "%s | SixthGearMoto",
  },
  description:
    "Shop motorcycle gear and parts, book workshop services, and discover the rider hub experience of SixthGearMoto in the Philippines.",
  applicationName: "SixthGearMoto",
  openGraph: {
    type: "website",
    url: getBaseURL(),
    siteName: "SixthGearMoto",
    title: "SixthGearMoto",
    description:
      "Shop motorcycle gear and parts, book workshop services, and discover the rider hub experience of SixthGearMoto in the Philippines.",
  },
  twitter: getDefaultTwitterMetadata(),
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico?v=20260824" },
      {
        url: "/images/favicon/favicon-16x16.png?v=20260824",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-32x32.png?v=20260824",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/images/favicon/apple-touch-icon.png?v=20260824" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/images/favicon/android-chrome-192x192.png?v=20260824",
      },
      {
        rel: "android-chrome-512x512",
        url: "/images/favicon/android-chrome-512x512.png?v=20260824",
      },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { isEnabled: isDraftModeEnabled } = await draftMode()

  return (
    <html lang="en" data-mode="light">
      <body
        className={`${copy.variable} ${nationalCompressed.variable} ${nationalCondensed.variable} ${hendrix.variable} ${inter.variable} ${montserrat.variable} ${poppins.variable} font-sans`}
      >
        <SanityVisualEditingProvider enabled={isDraftModeEnabled}>
          <ConsoleWarning />
          {isDraftModeEnabled && <PreviewIndicator />}
          <main className="relative">{props.children}</main>
          <Toaster position="bottom-right" richColors />
          {clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY && (
            <Script
              src={`https://code.tidio.co/${clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY}.js`}
              strategy="afterInteractive"
            />
          )}
          <SanityLive />
          {shouldRenderVisualEditing(isDraftModeEnabled) && <VisualEditing />}
        </SanityVisualEditingProvider>
      </body>
    </html>
  )
}
