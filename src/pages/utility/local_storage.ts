import moment from 'moment'
import Cookies from 'js-cookie'

type LocalStorageKeys = 'cart'

export type CookieKeys =
  | 'token'
  | 'store_id'
  | 'company_id'
  | 'id'
  | 'name'
  | 'stores'
  | 'companies'

export const cookieKeys = [
  'token',
  'store_id',
  'company_id',
  'id',
  'name',
  'stores',
  'companies',
] as CookieKeys[]

export const getLocalStorage = <T>(key: LocalStorageKeys): T | null => {
  const storage = localStorage.getItem(key)
  if (!storage) return null
  return JSON.parse(storage) as T
}

export const setLocalStorage = (
  key: LocalStorageKeys,
  data: string | object | number,
) => {
  const dataToStore = JSON.stringify(data)
  localStorage.setItem(key, dataToStore)
}

export const getCookiesValue = <T extends string | number | object | undefined>(
  key: CookieKeys,
): T | undefined => {
  const value = Cookies.get(key)
  return value ? (JSON.parse(value) as T) : undefined
}

export const setCookiesValue = (
  key: CookieKeys,
  data: string | object | number,
  expiresAdditional?: number,
  expiresUnit?: moment.DurationInputArg2,
) => {
  const curr = moment()
  const isHasTimeStamp = expiresAdditional && expiresUnit
  if (isHasTimeStamp) {
    curr.add(expiresAdditional, expiresUnit)
  }
  const tomorrow = moment().add(expiresAdditional, expiresUnit).valueOf()
  const dataToStore = JSON.stringify(data)

  const cookieOpt = isHasTimeStamp ? { expires: tomorrow } : {}

  Cookies.set(key, dataToStore, cookieOpt)
}

export const removeCookies = (key: CookieKeys) => {
  Cookies.remove(key)
}
