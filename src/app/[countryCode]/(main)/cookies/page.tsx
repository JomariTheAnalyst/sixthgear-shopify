import { Metadata } from "next"

import { getRegistryEntries, getVisibleCategories } from "@lib/consent/registry"
import { getCanonicalPath, getNoindexFollowRobots } from "@lib/seo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CookieSettingsButton from "@modules/consent/components/cookie-settings-button"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies and similar storage the SixthGear Moto website uses, and how you can control them.",
  alternates: {
    canonical: getCanonicalPath("/cookies"),
  },
  robots: getNoindexFollowRobots(),
}

const h2 = "text-2xl font-bold text-gray-900 mt-12 mb-6"
const p = "text-gray-700 leading-relaxed mb-6"

// Category table from the Cookie Policy draft (what each category does).
const CATEGORY_SUMMARY = [
  {
    name: "Essential",
    does: "Keeps the website working: your cart, your login, your cookie choice, security, and spam protection on our forms (Cloudflare Turnstile)",
    optOut: "No. The website cannot work without it",
  },
  {
    name: "Saved on your device only",
    does: "Remembers your wishlist, recent searches, recently viewed products, and closed notices. This information stays in your browser and is never sent to us",
    optOut: "You can clear it in your browser settings",
  },
  {
    name: "Loads with the page",
    does: "Services from other companies that load for every visitor: live chat (Tidio), our social media feed (Curator, with code from Meta), online booking (cal.com), maps (Google), and product videos (YouTube, Vimeo). They set their own cookies",
    optOut: "Not on our website. Accept or Reject does not change them. You can block third-party cookies in your browser settings",
  },
  {
    name: "Analytics",
    does: "Counts visits and shows which pages people use, so we can improve the website (for example Google Analytics)",
    optOut: "Yes, with Accept or Reject or in Cookie settings. We do not run any analytics tools right now",
  },
  {
    name: "Marketing",
    does: "Measures our ads and shows them to people who visited this website (for example a Meta pixel)",
    optOut: "Yes, with Accept or Reject or in Cookie settings. We do not run any marketing tools right now",
  },
]

// Plain-language summary of each outside service that loads with the page.
const OUTSIDE_SERVICES = [
  {
    name: "Tidio (live chat)",
    does: "Runs the chat window. Tidio sets its own cookies and stores your visitor ID and the messages you send in the chat.",
  },
  {
    name: "Curator (social media feed)",
    does: "Shows our latest Facebook and Instagram posts on the homepage. It loads code from Meta (Facebook), which may set its own cookies, including for advertising.",
  },
  {
    name: "cal.com (online booking)",
    does: "Runs the service booking form. The details you enter when you book are handled by cal.com.",
  },
  {
    name: "Google Maps",
    does: "Shows our store map on the homepage and Contact page. Google may set its own cookies.",
  },
  {
    name: "YouTube and Vimeo",
    does: "Play product videos. YouTube runs in privacy-enhanced mode. Both may set their own cookies.",
  },
]

export default function CookiesPage() {
  const categories = getVisibleCategories()

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Cookie Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: [DATE]</p>

        <p className={p}>
          This page explains the cookies and similar storage our website uses,
          and how you can control them.
        </p>

        <h2 className={h2}>What cookies are</h2>
        <p className={p}>
          Cookies are small files a website saves in your browser. Similar
          storage, called local storage, works the same way. They let a website
          remember things, like what is in your cart.
        </p>

        <h2 className={h2}>Your choices</h2>
        <p className={p}>
          On your first visit, a banner asks whether you allow optional
          analytics and marketing cookies. We do not currently run any
          analytics or marketing tools. If we add them, they will only load
          after you click Accept. If your browser sends a Global Privacy
          Control signal, we treat it as Reject. We ask again after 12 months,
          or sooner if this policy changes. You can change your choice any time
          with the <strong className="text-gray-900">Cookie settings</strong>{" "}
          link at the bottom of every page.
        </p>
        <p className={p}>
          Some services from other companies load for every visitor, whatever
          you choose in the banner. Accept or Reject does not turn them off.
          To avoid their cookies, you can block third-party cookies in your
          browser settings.
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 leading-relaxed">
          {OUTSIDE_SERVICES.map((service) => (
            <li key={service.name}>
              <strong className="text-gray-900">{service.name}:</strong>{" "}
              {service.does}
            </li>
          ))}
        </ul>
        <CookieSettingsButton className="mb-6 inline-flex min-h-11 items-center justify-center bg-[#0A0B0A] px-6 text-sm font-semibold uppercase tracking-[0.06em] text-white hover:bg-[#0A0B0A]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2">
          Open cookie settings
        </CookieSettingsButton>

        <h2 className={h2}>Categories</h2>
        <div className="mb-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Category</th>
                <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">What it does</th>
                <th scope="col" className="py-3 font-semibold text-gray-900">Can you turn it off?</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORY_SUMMARY.map((row) => (
                <tr key={row.name} className="border-b border-gray-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-semibold text-gray-900">{row.name}</th>
                  <td className="py-3 pr-4 text-gray-700">{row.does}</td>
                  <td className="py-3 text-gray-700">{row.optOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={h2}>Cookies and storage we use</h2>
        <p className={p}>
          This list is generated from the website code, so it always matches
          what the site really uses.
        </p>
        {categories.map((category) => (
          <section key={category.id} aria-labelledby={`cookies-${category.id}`} className="mb-10">
            <h3
              id={`cookies-${category.id}`}
              className="text-xl font-semibold text-gray-900 mb-3"
            >
              {category.label}
            </h3>
            <div className="overflow-x-auto">
              <table
                data-testid={`cookie-table-${category.id}`}
                className="w-full min-w-[44rem] border-collapse text-left text-sm"
              >
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Name</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Set by</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Purpose</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">How long</th>
                    <th scope="col" className="py-3 font-semibold text-gray-900">Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {getRegistryEntries(category.id).map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-200 align-top">
                      <th scope="row" className="py-3 pr-4 font-medium text-gray-900 break-words">
                        {entry.name}
                        <span className="block text-xs font-normal text-gray-500">
                          {entry.type}
                        </span>
                      </th>
                      <td className="py-3 pr-4 text-gray-700">{entry.vendor}</td>
                      <td className="py-3 pr-4 text-gray-700">
                        {entry.purpose}
                        {entry.loads && (
                          <span className="block text-xs text-gray-500">
                            Loads {entry.loads.charAt(0).toLowerCase()}
                            {entry.loads.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{entry.duration}</td>
                      <td className="py-3 text-gray-700">
                        {entry.policyUrl?.startsWith("/") ? (
                          <LocalizedClientLink
                            href={entry.policyUrl}
                            className="font-medium text-gray-900 underline"
                          >
                            Privacy Policy
                          </LocalizedClientLink>
                        ) : entry.policyUrl ? (
                          <a
                            href={entry.policyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 underline"
                          >
                            {entry.vendor}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <h2 className={h2}>Questions</h2>
        <p className={p}>Email [PRIVACY EMAIL].</p>
      </div>
    </div>
  )
}
