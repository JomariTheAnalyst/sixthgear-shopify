import { z } from "zod"

const shopifyDomain = z
  .string()
  .min(1, "SHOPIFY_STORE_DOMAIN is required")
  .regex(
    /^[a-z0-9-]+\.myshopify\.com$/i,
    "SHOPIFY_STORE_DOMAIN must be a valid Shopify domain (e.g. your-store.myshopify.com). No https:// or path."
  )

const serverSchema = z.object({
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z
    .string()
    .min(1, "SHOPIFY_STOREFRONT_ACCESS_TOKEN is required"),
  SHOPIFY_STORE_DOMAIN: shopifyDomain,
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
  SHOPIFY_WEBHOOK_SECRET: z.string().min(1).optional(),
  SHOPIFY_API_VERSION: z.string().default("2025-10"),
  REVALIDATION_SECRET: z.string().optional(),
  SANITY_API_READ_TOKEN: z.string().min(1).optional(),
  JUDGEME_PRIVATE_TOKEN: z.string().min(1).optional(),
  JUDGEME_SHOP_DOMAIN: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_EMAIL_TO: z.string().email().optional(),
  CONTACT_EMAIL_FROM: z.string().email().optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
})

const clientSchema = z.object({
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: z
    .string()
    .min(1, "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN is required"),
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: shopifyDomain.optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_TIDIO_PUBLIC_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CURATOR_CONTAINER_ID: z
    .string()
    .trim()
    .regex(/^[A-Za-z][A-Za-z0-9_:.-]*$/)
    .default("curator-feed-default-feed-layout"),
  NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL: z
    .string()
    .url()
    .refine(
      (value) => {
        const url = new URL(value)
        return url.protocol === "https:" && url.hostname === "cdn.curator.io"
      },
      "NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL must use https://cdn.curator.io"
    )
    .default(
      "https://cdn.curator.io/published/53c1cdf2-8eb0-4030-a0f9-11503967d19a.js"
    ),
})

export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>

function logFieldErrors(scope: "server" | "client", fieldErrors: Record<string, string[] | undefined>) {
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages || messages.length === 0) continue
    console.error(`[env:${scope}] ${field}: ${messages.join(", ")}`)
  }
}

function createServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "[env] serverEnv accessed in browser context. Only import serverEnv in Server Components, Server Actions, or Route Handlers."
    )
  }

  const parsed = serverSchema.safeParse({
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    SHOPIFY_WEBHOOK_SECRET: process.env.SHOPIFY_WEBHOOK_SECRET,
    SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    JUDGEME_PRIVATE_TOKEN: process.env.JUDGEME_PRIVATE_TOKEN,
    JUDGEME_SHOP_DOMAIN: process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
    CONTACT_EMAIL_FROM: process.env.CONTACT_EMAIL_FROM,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!parsed.success) {
    logFieldErrors("server", parsed.error.flatten().fieldErrors)
    throw new Error("[env] Invalid server environment variables")
  }

  return parsed.data
}

function createClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN,
    NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN: process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_CURATOR_CONTAINER_ID:
      process.env.NEXT_PUBLIC_CURATOR_CONTAINER_ID,
    NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL:
      process.env.NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL,
  })

  if (!parsed.success) {
    logFieldErrors("client", parsed.error.flatten().fieldErrors)
    throw new Error("[env] Invalid client environment variables")
  }

  return parsed.data
}

/**
 * Server-only environment variables.
 * Allowed usage: Server Components, Server Actions, Route Handlers, middleware.
 */
export const serverEnv: ServerEnv =
  typeof window === "undefined"
    ? createServerEnv()
    : (undefined as unknown as ServerEnv)

/**
 * Client-safe public environment variables.
 * Allowed usage: server and client code.
 */
export const clientEnv: ClientEnv =
  typeof window === "undefined"
    ? ({
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN:
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "",
        NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
          process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN,
        NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN: process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN,
        NEXT_PUBLIC_TIDIO_PUBLIC_KEY: process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        NEXT_PUBLIC_CURATOR_CONTAINER_ID:
          process.env.NEXT_PUBLIC_CURATOR_CONTAINER_ID ||
          "curator-feed-default-feed-layout",
        NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL:
          process.env.NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL ||
          "https://cdn.curator.io/published/53c1cdf2-8eb0-4030-a0f9-11503967d19a.js",
      } as ClientEnv)
    : createClientEnv()

/**
 * Shopify server configuration convenience object.
 * Allowed usage: server-side Shopify integration code.
 */
export const shopifyConfig = {
  ...(typeof window === "undefined"
    ? {
        domain: serverEnv.SHOPIFY_STORE_DOMAIN,
        token: serverEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        adminToken: serverEnv.SHOPIFY_ADMIN_ACCESS_TOKEN,
        apiVersion: serverEnv.SHOPIFY_API_VERSION,
        webhookSecret: serverEnv.SHOPIFY_WEBHOOK_SECRET,
      }
    : {}),
} as const
