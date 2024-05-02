export const env = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  PDF_EXPORT_ENABLED: false,
  EMAIL_ENABLED: false,
  APP_NAME: process.env.APP_NAME,
  ROOT_SHARE_ID: undefined,
  URL: process.env.URL || "",
  OIDC_LOGOUT_URI: process.env.OIDC_LOGOUT_URI,
}