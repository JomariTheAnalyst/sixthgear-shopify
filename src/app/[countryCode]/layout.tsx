import { notFound } from "next/navigation"

// Middleware rewrites every public URL to /ph. Any other value here is a path
// that skipped the rewrite (e.g. /missing-file.png) and must be a real 404.
export default async function CountryLayout(props: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  if (countryCode !== "ph") {
    notFound()
  }

  return props.children
}
