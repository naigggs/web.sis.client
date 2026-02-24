export const ENVIRONMENT =
  process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || "development"

export const API_URLS = {
  DEV: process.env.NEXT_PUBLIC_DEV_SERVICE_API_URL!,
  STAGING: process.env.NEXT_PUBLIC_STAGING_SERVICE_API_URL!,
  PROD: process.env.NEXT_PUBLIC_PROD_SERVICE_API_URL!,
} as const

export const API_URL =
  ENVIRONMENT === "production"
    ? API_URLS.PROD
    : ENVIRONMENT === "staging"
      ? API_URLS.STAGING
      : API_URLS.DEV

export const isDevelopment = () => ENVIRONMENT === "development"

export const isStaging = () => ENVIRONMENT === "staging"

export const isProduction = () => ENVIRONMENT === "production"

export const ENV = {
  ENVIRONMENT,
  API_URLS,
  API_URL,
  isDevelopment,
  isStaging,
  isProduction,
} as const
