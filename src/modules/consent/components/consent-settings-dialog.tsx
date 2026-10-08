"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Switch,
} from "@headlessui/react"
import { X } from "lucide-react"

import { NO_OPTIONAL_CONSENT, type ConsentChoices } from "@lib/consent/consent"
import {
  getSettingsCategories,
  getVisibleOptionalCategories,
  type OptionalCategoryId,
} from "@lib/consent/registry"
import { CONSENT_BUTTON_CLASS } from "./consent-banner"
import { useConsent } from "./consent-provider"

const GPC_BLOCKED: OptionalCategoryId[] = ["analytics", "marketing"]
// No analytics or marketing tool in the registry yet: say so under the switches.
const noOptionalToolsYet = getVisibleOptionalCategories().length === 0

export default function ConsentSettingsDialog() {
  const {
    status,
    categories,
    gpc,
    settingsOpen,
    closeSettings,
    save,
    acceptAll,
    rejectAll,
  } = useConsent()
  const [draft, setDraft] = useState<ConsentChoices>(NO_OPTIONAL_CONSENT)

  // Start from the saved choice; nothing is pre-ticked before a first choice.
  useEffect(() => {
    if (settingsOpen) {
      setDraft(status === "set" ? categories : NO_OPTIONAL_CONSENT)
    }
  }, [settingsOpen, status, categories])

  return (
    <Dialog
      open={settingsOpen}
      onClose={closeSettings}
      className="relative z-[400]"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50" />

      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
        <DialogPanel
          data-lenis-prevent
          data-testid="consent-settings"
          className="relative flex max-h-[92dvh] w-full flex-col bg-white text-[#0A0B0A] shadow-2xl sm:max-w-xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-6">
            <div>
              <DialogTitle className="text-lg font-bold uppercase tracking-[0.04em]">
                Cookie settings
              </DialogTitle>
              <p className="mt-1 text-[13px] leading-relaxed text-black/70">
                Choose what you allow. You can change this any time with the
                Cookie settings link at the bottom of every page.
              </p>
            </div>
            <button
              type="button"
              onClick={closeSettings}
              aria-label="Close cookie settings"
              className="-mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 hover:border-[#0A0B0A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A]"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            {gpc && (
              <p
                role="note"
                className="mb-4 border border-black/15 bg-black/[0.03] px-3 py-2 text-[13px] leading-relaxed"
              >
                Your browser sends a Global Privacy Control signal, so
                analytics and marketing stay off.
              </p>
            )}

            <ul className="divide-y divide-black/10">
              {getSettingsCategories().map((category) => {
                const optionalId = category.id as OptionalCategoryId
                const blockedByGpc = gpc && GPC_BLOCKED.includes(optionalId)
                const descriptionId = `consent-category-${category.id}`

                return (
                  <li key={category.id} className="flex items-start gap-4 py-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{category.label}</p>
                      <p
                        id={descriptionId}
                        className="mt-1 text-[13px] leading-relaxed text-black/65"
                      >
                        {category.description}
                      </p>
                    </div>

                    {category.status ? (
                      <span className="mt-0.5 shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-black/55">
                        {category.status}
                      </span>
                    ) : (
                      <Switch
                        checked={!blockedByGpc && draft[optionalId]}
                        disabled={blockedByGpc}
                        onChange={(checked) =>
                          setDraft((current) => ({
                            ...current,
                            [optionalId]: checked,
                          }))
                        }
                        aria-label={category.label}
                        aria-describedby={descriptionId}
                        className="group relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-black/20 transition-colors focus:outline-none data-[checked]:bg-[#0A0B0A] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus]:ring-2 data-[focus]:ring-[#0A0B0A] data-[focus]:ring-offset-2"
                      >
                        <span className="inline-block h-5 w-5 translate-x-1 rounded-full bg-white shadow transition-transform group-data-[checked]:translate-x-6" />
                      </Switch>
                    )}
                  </li>
                )
              })}
            </ul>

            {noOptionalToolsYet && (
              <p
                role="note"
                className="border-t border-black/10 pt-3 text-[13px] leading-relaxed text-black/65"
              >
                We do not currently run any analytics or marketing tools.
              </p>
            )}

            <p className="mt-2 text-[13px] text-black/65">
              Full list of cookies and services:{" "}
              <Link
                href="/cookies"
                onClick={closeSettings}
                className="font-semibold text-[#0A0B0A] underline underline-offset-2"
              >
                Cookie Policy
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-black/10 px-5 py-4 sm:px-6">
            <button type="button" onClick={acceptAll} className={CONSENT_BUTTON_CLASS}>
              Accept all
            </button>
            <button type="button" onClick={rejectAll} className={CONSENT_BUTTON_CLASS}>
              Reject all
            </button>
            <button
              type="button"
              onClick={() => save(draft)}
              className={CONSENT_BUTTON_CLASS}
            >
              Save choices
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
