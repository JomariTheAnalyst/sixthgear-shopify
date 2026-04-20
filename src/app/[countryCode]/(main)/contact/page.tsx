import { Metadata } from "next"
import ContactPage from "@modules/contact"

export const metadata: Metadata = {
  title: "Contact SixthgearMoto",
  description:
    "Contact SixthgearMoto for product questions, workshop bookings, and store support.",
}

export default function Contact() {
  return <ContactPage />
}
