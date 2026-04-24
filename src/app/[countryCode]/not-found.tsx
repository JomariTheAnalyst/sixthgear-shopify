import { Metadata } from "next"

import NotFoundPage from "@modules/layout/components/not-found-page"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function CountryCodeNotFound() {
  return <NotFoundPage homeHref="/" />
}
