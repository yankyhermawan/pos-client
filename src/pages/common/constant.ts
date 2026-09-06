import type { BooleanOptional, IParseOptions } from 'qs'

export const ENDPOINT_URL = import.meta.env.VITE_SERVER_URL

export const QS_DEFAULT_PARSE: IParseOptions<BooleanOptional> = {
  ignoreQueryPrefix: true,
}
