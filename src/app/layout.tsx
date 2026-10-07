import { Metadata } from "next"
import { draftMode } from "next/headers"
import Script from "next/script"
import { VisualEditing } from "next-sanity/visual-editing"

import ConsentRoot from "@modules/consent"
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
import { PRELOADER_HEAD_SCRIPT } from "@lib/preloader-config"
import {
  getDefaultTwitterMetadata,
  getOpenGraph,
  getSeoMetadataBase,
  getSiteName,
} from "@lib/seo"
import { Toaster } from "sonner"

import { ConsoleWarning } from "../components/common/console-warning"
import { PreviewIndicator } from "../components/preview-indicator"
import { SanityVisualEditingProvider } from "../components/sanity/visual-editing-provider"
import { SanityLive } from "../../sanity/lib/live"
import { shouldRenderVisualEditing } from "@lib/cms/visual-editing"
import "styles/globals.css"

const DEFAULT_DESCRIPTION =
  "Shop motorcycle gear and parts, book workshop services, and discover the rider hub experience of SixthGear Moto in the Philippines."

export const metadata: Metadata = {
  metadataBase: getSeoMetadataBase(),
  title: {
    default: getSiteName(),
    template: `%s | ${getSiteName()}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: getSiteName(),
  openGraph: getOpenGraph({
    title: getSiteName(),
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
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
    // suppressHydrationWarning: the preloader script below may add a class before React loads.
    <html lang="en-PH" data-mode="light" suppressHydrationWarning>
      <head>
        {/* Runs before paint so a repeat load in the same tab never flashes the preloader. */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_HEAD_SCRIPT }} />
        <noscript>
          <style>{`.sg-preloader{display:none}html{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${copy.variable} ${nationalCompressed.variable} ${nationalCondensed.variable} ${hendrix.variable} ${inter.variable} ${montserrat.variable} ${poppins.variable} font-sans`}
      >
        <SanityVisualEditingProvider enabled={isDraftModeEnabled}>
          <ConsoleWarning />
          {isDraftModeEnabled && <PreviewIndicator />}
          {/* Consent state, settings panel, and the banner for future analytics or marketing. */}
          <ConsentRoot>
            <main className="relative">{props.children}</main>
          </ConsentRoot>
          <Toaster position="bottom-right" richColors />
          {clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY && (
            <Script
              src={`https://code.tidio.co/${clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY}.js`}
              strategy="lazyOnload"
            />
          )}
          <SanityLive />
          {shouldRenderVisualEditing(isDraftModeEnabled) && <VisualEditing />}
        </SanityVisualEditingProvider>
      </body>
    </html>
  )
}
