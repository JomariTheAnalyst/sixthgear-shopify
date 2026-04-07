import { z } from "zod"

export const CONTACT_SUBJECT_OPTIONS = [
  "General Inquiry",
  "Product Question",
  "Order Support",
  "Service Booking",
  "Returns & Warranty",
  "Other",
] as const

const philippineMobileRegex = /^(?:\+63|0)9\d{9}$/
const orderSupportLabel = "Order Support"

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function normalizePhone(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }

  const normalized = value.replace(/[\s()-]/g, "")
  return normalized.length > 0 ? normalized : undefined
}

export const contactFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(60),
    lastName: z.string().trim().min(1, "Last name is required").max(60),
    email: z.string().trim().email("Enter a valid email address").max(120),
    phone: z
      .union([z.string(), z.undefined()])
      .transform((value) => normalizePhone(value))
      .refine(
        (value) => value === undefined || philippineMobileRegex.test(value),
        "Enter a valid Philippine mobile number"
      ),
    subject: z.enum(CONTACT_SUBJECT_OPTIONS, {
      message: "Select a valid subject",
    }),
    orderNumber: z
      .union([z.string(), z.undefined()])
      .transform((value) => normalizeOptionalString(value))
      .refine(
        (value) => value === undefined || value.length <= 40,
        "Order number is too long"
      ),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
    companyWebsite: z.string().max(0, "Spam detected").default(""),
  })
  .superRefine((value, ctx) => {
    if (value.subject !== orderSupportLabel && value.orderNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["orderNumber"],
        message: "Order number is only allowed for order support inquiries",
      })
    }
  })

export type ContactFormInput = z.input<typeof contactFormSchema>
export type ContactFormValues = z.output<typeof contactFormSchema>

export type ContactApiResponse = {
  success: boolean
  message: string
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>
}

export function toContactFieldErrors(
  fieldErrors: Partial<Record<keyof ContactFormValues, string[] | undefined>>
): Partial<Record<keyof ContactFormValues, string>> {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, messages]) => Array.isArray(messages) && messages.length > 0)
      .map(([field, messages]) => [field, messages?.[0] ?? "Invalid value"])
  ) as Partial<Record<keyof ContactFormValues, string>>
}
