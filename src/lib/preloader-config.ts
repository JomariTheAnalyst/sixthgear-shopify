// Shared by the preloader component and the inline <head> script in
// app/layout.tsx, so the storage key and expiry live in one place.

/** localStorage key holding the last-visit timestamp (ms since epoch). */
export const PRELOADER_KEY = "sg-preloader-seen-at"

/** Skip the preloader if the last visit was within this window. */
export const PRELOADER_TTL_MS = 60 * 60 * 1000 // 1 hour

/** Old sessionStorage flag from the previous version; cleaned up on load. */
const LEGACY_SESSION_KEY = "sg-preloader-seen"

/**
 * Runs before paint. A visit within the TTL skips the preloader and slides
 * the expiry forward; a missing, invalid, or expired timestamp is removed so
 * the preloader plays. If storage is blocked, the preloader plays.
 */
export const PRELOADER_HEAD_SCRIPT = `try{sessionStorage.removeItem(${JSON.stringify(
  LEGACY_SESSION_KEY
)})}catch(e){}try{var k=${JSON.stringify(
  PRELOADER_KEY
)},n=Date.now(),v=Number(localStorage.getItem(k));if(v>0&&n-v<${PRELOADER_TTL_MS}){document.documentElement.classList.add("sg-preloader-skip");localStorage.setItem(k,String(n))}else{localStorage.removeItem(k)}}catch(e){}`

/** True if a stored timestamp is still within the TTL. */
export const isPreloaderFresh = (value: string | null, now = Date.now()) => {
  const timestamp = Number(value)
  return timestamp > 0 && now - timestamp < PRELOADER_TTL_MS
}
