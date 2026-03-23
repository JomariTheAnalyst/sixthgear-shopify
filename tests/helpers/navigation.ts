/**
 * Centralized route constants for SixthGearMoto E2E tests.
 * Country code prefix: /ph (Philippines — DEFAULT_REGION)
 */

export const COUNTRY_CODE = "ph"

export const ROUTES = {
  home: `/${COUNTRY_CODE}`,
  store: `/${COUNTRY_CODE}/store`,
  search: `/${COUNTRY_CODE}/store`, // search uses store page with query params
  login: `/${COUNTRY_CODE}/account`,
  account: `/${COUNTRY_CODE}/account`,
  about: `/${COUNTRY_CODE}/about`,
  services: `/${COUNTRY_CODE}/services`,
  contact: `/${COUNTRY_CODE}/contact`,
  firstGear: `/${COUNTRY_CODE}/first-gear`,
  cart: `/${COUNTRY_CODE}/cart`,
  notFound: `/${COUNTRY_CODE}/this-page-does-not-exist-404`,
} as const

export type RouteName = keyof typeof ROUTES
