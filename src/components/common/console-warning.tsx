"use client"

import { useEffect } from "react"

export function ConsoleWarning() {
  useEffect(() => {
    console.log(
      "%cStop!",
      "background: #dc2626; color: #ffffff; font-size: 50px; font-weight: 700; padding: 4px 12px;"
    )
    console.log(
      "%cThis is a browser feature intended for developers. If someone told you\nto copy-paste something here to enable a feature or \"hack\" someone's\naccount, it is a scam and will give them access to your account.",
      "color: #111111; font-size: 16px;"
    )
    console.log(
      "%cSee https://sixthgearmoto.com/security for more information.",
      "color: #111111; font-size: 14px;"
    )
  }, [])

  return null
}
