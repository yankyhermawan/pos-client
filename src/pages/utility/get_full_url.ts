import { ENDPOINT_URL } from '../common/constant'

export const getFullUrl = (url: string) =>
  url.startsWith('/') ? `${ENDPOINT_URL}${url}` : `${ENDPOINT_URL}/${url}`
