import type { BooleanOptional, IParseOptions } from 'qs'

export const ENDPOINT_URL = 'http://192.168.18.5:8080'

export const QS_DEFAULT_PARSE: IParseOptions<BooleanOptional> = {
  ignoreQueryPrefix: true,
}
