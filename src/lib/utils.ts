/**
 * Utility functions
 */

/**
 * className utility (replacement for clx from @medusajs/ui)
 * Combines class names, filtering out falsy values
 */
export function clx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Alias for clx
 */
export const cn = clx
