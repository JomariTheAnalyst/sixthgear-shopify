// The forms import only the two constants. verifyTurnstile runs on the server;
// serverEnv is undefined in the browser, so the secret never ships to clients.
import { serverEnv } from "@lib/env"

/** Shown by the form and returned by the server when the Turnstile check fails. */
export const TURNSTILE_ERROR_MESSAGE =
  "We couldn't confirm you're not a bot. Please try again."

/** Name of the hidden input the Turnstile widget adds to its form. */
export const TURNSTILE_FIELD = "cf-turnstile-response"

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const ALLOWED_HOSTNAMES = new Set([
  "www.sixthgearmoto.com",
  "sixthgearmoto.com",
  "localhost",
])

/**
 * Server-side Turnstile check. Fails closed: a missing token or secret,
 * a failed check, a wrong hostname, a timeout or a Cloudflare error all
 * return false.
 */
export async function verifyTurnstile(
  token: unknown,
  ip: string | null | undefined
): Promise<boolean> {
  const secret = serverEnv.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not set")
    return false
  }

  // Cloudflare tokens are at most 2048 characters.
  if (typeof token !== "string" || !token || token.length > 2048) {
    return false
  }

  const body: Record<string, string> = { secret, response: token }
  if (ip && ip !== "unknown" && ip !== "anonymous") {
    body.remoteip = ip
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.error(`[turnstile] siteverify responded ${res.status}`)
      return false
    }

    const data = (await res.json()) as { success?: boolean; hostname?: string }
    return data.success === true && ALLOWED_HOSTNAMES.has(data.hostname ?? "")
  } catch (error) {
    console.error("[turnstile] siteverify failed", error)
    return false
  }
}
