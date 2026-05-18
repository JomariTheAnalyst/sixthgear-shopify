import { Metadata } from "next"

import SupportTemplate from "@modules/account/templates/support-template"

export const metadata: Metadata = {
  title: "Support",
}

export default function SupportPage() {
  return <SupportTemplate />
}
