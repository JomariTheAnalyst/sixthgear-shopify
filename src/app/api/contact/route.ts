import { NextRequest } from "next/server"
import { checkRateLimit, TTL } from "@lib/cache/redis"
import { getAllServicesCMS } from "@lib/cms/client"
import {
  contactFormSchema,
  ContactApiResponse,
  ContactFormValues,
  ServiceOption,
  toContactFieldErrors,
} from "@lib/contact/schema"
import {
  renderContactAdminEmail,
  renderContactCustomerEmail,
} from "@lib/contact/email"
import { serverEnv } from "@lib/env"
import { Resend } from "resend"

const CONTACT_RATE_LIMIT = 5
const SERVICE_BOOKING_SUBJECT = "Service Booking"
const FALLBACK_SERVICES: ServiceOption[] = [
  { slug: "preventive-maintenance", title: "Preventive Maintenance (PMS)" },
  { slug: "repairs-diagnostics", title: "Repairs & Diagnostics" },
  {
    slug: "accessories-installation",
    title: "Accessories & Custom Installation",
  },
  { slug: "wheels-drivetrain", title: "Wheels, Drivetrain & Handling" },
  { slug: "detailing-protection", title: "Detailing & Protection" },
  { slug: "performance-upgrades", title: "Performance Upgrades" },
  { slug: "roadside-assistance", title: "Roadside Assistance & Recovery" },
  { slug: "rider-support", title: "Rider Support & Convenience" },
]

function json(body: ContactApiResponse, status: number): Response {
  return Response.json(body, { status })
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) {
      return first
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) {
    return realIp
  }

  return "unknown"
}

function isSupportedContentType(request: NextRequest) {
  const contentType = request.headers.get("content-type") || ""
  return contentType.toLowerCase().includes("application/json")
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!origin) {
    return true
  }

  const allowedHosts = new Set<string>([request.nextUrl.host])

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowedHosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host)
    } catch {
      console.error("[contact] Invalid NEXT_PUBLIC_SITE_URL for origin check")
    }
  }

  try {
    return allowedHosts.has(new URL(origin).host)
  } catch {
    return false
  }
}

function looksLikeSpam(payload: ContactFormValues) {
  const combined = `${payload.subject}\n${payload.message}`
  const links = combined.match(/https?:\/\//gi)?.length ?? 0
  return links > 2
}

function ensureEmailConfig() {
  if (
    !serverEnv.RESEND_API_KEY ||
    !serverEnv.CONTACT_EMAIL_TO ||
    !serverEnv.CONTACT_EMAIL_FROM
  ) {
    throw new Error("[contact] Missing Resend or contact email environment configuration")
  }

  return {
    resend: new Resend(serverEnv.RESEND_API_KEY),
    contactTo: serverEnv.CONTACT_EMAIL_TO,
    contactFrom: serverEnv.CONTACT_EMAIL_FROM,
  }
}

async function getServiceOptions(): Promise<ServiceOption[]> {
  const services = await getAllServicesCMS()
  const mappedServices = services
    .filter((service) => Boolean(service.slug?.trim()) && Boolean(service.title?.trim()))
    .map((service) => ({
      slug: service.slug!.trim(),
      title: service.title!.trim(),
    }))

  return mappedServices.length > 0 ? mappedServices : FALLBACK_SERVICES
}

function findServiceTitle(
  serviceType: string | undefined,
  services: ServiceOption[]
) {
  if (!serviceType) {
    return undefined
  }

  return services.find((service) => service.slug === serviceType)?.title
}

export async function POST(request: NextRequest) {
  if (!isSupportedContentType(request)) {
    return json(
      {
        success: false,
        message: "Unsupported content type. Use application/json.",
      },
      415
    )
  }

  if (!isAllowedOrigin(request)) {
    return json(
      {
        success: false,
        message: "Invalid request origin.",
      },
      403
    )
  }

  const ip = getClientIp(request)
  const rateLimit = await checkRateLimit(
    "contact",
    ip,
    CONTACT_RATE_LIMIT,
    TTL.RATE_LIMIT_CONTACT
  )

  if (!rateLimit.allowed) {
    return json(
      {
        success: false,
        message: "Too many contact requests. Please try again later.",
      },
      429
    )
  }

  let rawBody: unknown

  try {
    rawBody = await request.json()
  } catch {
    return json(
      {
        success: false,
        message: "Invalid JSON payload.",
      },
      400
    )
  }

  const parsed = contactFormSchema.safeParse(rawBody)

  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Please correct the highlighted fields.",
        fieldErrors: toContactFieldErrors(parsed.error.flatten().fieldErrors),
      },
      400
    )
  }

  const payload = parsed.data

  if ((payload.companyWebsite || "").trim().length > 0) {
    return json(
      {
        success: false,
        message: "Invalid submission.",
      },
      400
    )
  }

  if (looksLikeSpam(payload)) {
    return json(
      {
        success: false,
        message: "Submission looks automated. Please revise your message and try again.",
      },
      400
    )
  }

  try {
    const { resend, contactFrom, contactTo } = ensureEmailConfig()
    const submittedAt = new Date().toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Manila",
    })
    const serviceOptions =
      payload.subject === SERVICE_BOOKING_SUBJECT ? await getServiceOptions() : []
    const serviceTitle = findServiceTitle(payload.serviceType, serviceOptions)
    const adminSubject =
      payload.subject === SERVICE_BOOKING_SUBJECT
        ? `[SixthgearMoto] Service Booking Request: ${
            serviceTitle || payload.serviceType || "Service booking"
          } - ${payload.firstName} ${payload.lastName}`
        : `[SixthgearMoto] New Contact: ${payload.subject} - ${payload.firstName} ${payload.lastName}`

    await Promise.all([
      resend.emails.send({
        to: contactTo,
        from: contactFrom,
        replyTo: payload.email,
        subject: adminSubject,
        html: renderContactAdminEmail(payload, submittedAt, { serviceTitle }),
      }),
      resend.emails.send({
        to: payload.email,
        from: contactFrom,
        subject: "We received your message - Sixth Gear Moto Supply",
        html: renderContactCustomerEmail(payload, contactTo, { serviceTitle }),
      }),
    ])

    return json(
      {
        success: true,
        message: "Your message has been sent successfully.",
      },
      200
    )
  } catch (error) {
    console.error("[contact] Failed to send contact emails:", error)
    return json(
      {
        success: false,
        message: "We could not send your message right now. Please try again later.",
      },
      500
    )
  }
}
