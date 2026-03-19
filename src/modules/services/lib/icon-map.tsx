import type { ReactNode } from "react"

const wrenchIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.41 0l-1.42-1.41a1 1 0 0 1 0-1.42l7.1-7.1a6 6 0 0 1 9.36-7.94l-3.76 3.76z"></path>
  </svg>
)

const engineIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
)

const customIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 8v8M8 12h8"></path>
  </svg>
)

const tireIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const bodyIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
)

const electricalIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
)

const safetyIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
)

const supportIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
)

const chainIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"></path>
    <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"></path>
  </svg>
)

const brakeIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 3v18"></path>
    <path d="M7.5 5.2l9 13.6"></path>
    <path d="M16.5 5.2l-9 13.6"></path>
  </svg>
)

const oilIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3c2.5 3.2 5 6.4 5 10a5 5 0 1 1-10 0c0-3.6 2.5-6.8 5-10z"></path>
  </svg>
)

export const SERVICES_ICON_MAP: Record<string, ReactNode> = {
  wrench: wrenchIcon,
  engine: engineIcon,
  tire: tireIcon,
  chain: chainIcon,
  brake: brakeIcon,
  electrical: electricalIcon,
  body: bodyIcon,
  oil: oilIcon,
  safety: safetyIcon,
  custom: customIcon,
  diagnostics: engineIcon,
  accessories: customIcon,
  detailing: bodyIcon,
  upgrade: electricalIcon,
  recovery: safetyIcon,
  support: supportIcon,
}

export const ICON_OPTIONS = [
  { title: "Wrench & Tools", value: "wrench" },
  { title: "Engine & Diagnostics", value: "engine" },
  { title: "Tire & Wheels", value: "tire" },
  { title: "Chain & Drive", value: "chain" },
  { title: "Brake System", value: "brake" },
  { title: "Electrical", value: "electrical" },
  { title: "Body & Paint", value: "body" },
  { title: "Oil & Fluids", value: "oil" },
  { title: "Safety Check", value: "safety" },
  { title: "Custom Build", value: "custom" },
] as const

export function getServiceIcon(key: string | null | undefined): ReactNode {
  return SERVICES_ICON_MAP[key ?? "wrench"] ?? SERVICES_ICON_MAP.wrench
}
