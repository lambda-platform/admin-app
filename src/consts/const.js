export const base_url = process.dev ? import.meta.env.LAMBDA_BASE_URL || '' : window.location.protocol + "//" + window.location.host
export const title = import.meta.env.LAMBDA_TITLE || 'Lambda'
export const subTitle = import.meta.env.LAMBDA_SUB_TITLE || 'Lambda Platform'
