import moment from 'moment'
import Cookies from 'js-cookie'

export const getLocalStorage = <T>(key: string): T | null => {
  const storage = localStorage.getItem(key)
  if (!storage) return null
  return JSON.parse(storage) as T
}

export const setLocalStorage = (
  key: string,
  data: string | object | number,
) => {
  const dataToStore =
    typeof data === 'string' || typeof data === 'number'
      ? String(data)
      : JSON.stringify(data)
  localStorage.setItem(key, dataToStore)
}

export const getCookiesValue = (key: string): string | undefined => {
  const value = Cookies.get(key)
  return value
}

export const setCookiesValue = (
  key: string,
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
  const dataToStore =
    typeof data === 'string' || typeof data === 'number'
      ? String(data)
      : JSON.stringify(data)

  const cookieOpt = isHasTimeStamp ? { expires: tomorrow } : {}

  Cookies.set(key, dataToStore, cookieOpt)
  // await cookieStore.set({
  //   ...(isHasTimeStamp ? { expires: tomorrow } : {}),
  //   name: key,
  //   value: dataToStore,
  // })
}
