"use client"

import ConsentBanner from "./components/consent-banner"
import { ConsentProvider } from "./components/consent-provider"
import ConsentScripts from "./components/consent-scripts"
import ConsentSettingsDialog from "./components/consent-settings-dialog"

export { useConsent } from "./components/consent-provider"

/** Wraps the whole app: consent state, banner, settings panel, gated scripts. */
export default function ConsentRoot({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider
      ui={
        <>
          <ConsentScripts />
          <ConsentBanner />
          <ConsentSettingsDialog />
        </>
      }
    >
      {children}
    </ConsentProvider>
  )
}
