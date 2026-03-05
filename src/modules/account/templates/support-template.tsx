import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react"

const SUPPORT = {
  email: "customercare@sixthgearmoto.com",
  phone: ["09950930157", "09155951120"],
  landline: "(02)7000-0141",
  messenger: "https://www.facebook.com/camille.sixthgear",
  facebook: [
    {
      label: "Sixth Gear Moto",
      url: "https://www.facebook.com/sixthgear.moto",
    },
    {
      label: "Camille - Sixth Gear",
      url: "https://www.facebook.com/camille.sixthgear",
    },
  ],
  instagram: "https://www.instagram.com/6thgearmotosupply/",
  hours: "Mon–Sat, 9:00 AM – 6:00 PM (PHT)",
  address: "3610 Bautista St, Makati City, Metro Manila",
  responseTime: "We typically respond within 24 hours",
} as const

const PRIMARY_PHONE = SUPPORT.phone[0]

const LANDLINE_TEL = (() => {
  const numeric = SUPPORT.landline.replace(/\D/g, "")
  if (numeric.startsWith("02")) return `+632${numeric.slice(2)}`
  if (numeric.startsWith("0")) return `+63${numeric.slice(1)}`
  return `+${numeric}`
})()

const INSTAGRAM_HANDLE = `@${SUPPORT.instagram
  .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
  .replace(/\/+$/, "")}`

// Minimalist, compact, professional classes
const CARD_CLASS =
  "group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"

const ICON_CLASS =
  "w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-900 shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-200"

const EXTERNAL_INDICATOR = (
  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
)

const ACTION_INDICATOR = (
  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-transform duration-200 group-hover:translate-x-0.5" />
)

export default function SupportTemplate() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Support</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Reach out to us through any of the channels below. We typically respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Email */}
        <a href={`mailto:${SUPPORT.email}`} className={CARD_CLASS}>
          <div className={ICON_CLASS}>
            <Mail className="w-4 h-4" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">Email Us</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{SUPPORT.email}</p>
          </div>
          <div className="ml-3 shrink-0">{ACTION_INDICATOR}</div>
        </a>

        {/* Messenger */}
        <a
          href={SUPPORT.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className={CARD_CLASS}
        >
          <div className={ICON_CLASS}>
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">Messenger</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">Chat with us on Facebook</p>
          </div>
          <div className="ml-3 shrink-0">{EXTERNAL_INDICATOR}</div>
        </a>

        {/* Call Us */}
        <a href={`tel:${PRIMARY_PHONE}`} className={CARD_CLASS}>
          <div className={ICON_CLASS}>
            <Phone className="w-4 h-4" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">Call Us</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{SUPPORT.phone.join(" / ")}</p>
          </div>
          <div className="ml-3 shrink-0">{ACTION_INDICATOR}</div>
        </a>

        {/* Landline */}
        <a href={`tel:${LANDLINE_TEL}`} className={CARD_CLASS}>
          <div className={ICON_CLASS}>
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">Landline</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{SUPPORT.landline}</p>
          </div>
          <div className="ml-3 shrink-0">{ACTION_INDICATOR}</div>
        </a>

        {/* Instagram */}
        <a
          href={SUPPORT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={CARD_CLASS}
        >
          <div className={ICON_CLASS}>
            <Instagram className="w-4 h-4" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">Instagram</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{INSTAGRAM_HANDLE}</p>
          </div>
          <div className="ml-3 shrink-0">{EXTERNAL_INDICATOR}</div>
        </a>

        {/* Facebook (Div wrapper with links) */}
        <div className="group flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center">
            <div className={ICON_CLASS}>
              <Facebook className="w-4 h-4" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Facebook</h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">Connect with our pages</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {SUPPORT.facebook.map((page) => (
              <a
                key={page.url}
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/fb flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-900 hover:border-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                <span className="text-xs font-bold text-gray-900 group-hover/fb:text-white truncate pr-3">
                  {page.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover/fb:text-white shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Store Information Minimalist Table */}
      <div className="mt-10 pt-8 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Store Information</h3>
        <ul className="space-y-3">
          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-24 shrink-0">
              Hours
            </span>
            <span className="text-sm text-gray-900">{SUPPORT.hours}</span>
          </li>
          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-24 shrink-0">
              Location
            </span>
            <span className="text-sm text-gray-900">{SUPPORT.address}</span>
          </li>
          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-24 shrink-0">
              Response
            </span>
            <span className="text-sm text-gray-900">{SUPPORT.responseTime}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
