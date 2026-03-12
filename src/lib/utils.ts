/**
 * Utility functions
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * className utility (replacement for clx from @medusajs/ui)
 * Combines class names and merges tailwind conflicts
 */
export function clx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Alias for clx
 */
export const cn = clx
