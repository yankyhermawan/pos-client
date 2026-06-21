import { ENDPOINT_URL } from '../common/constant'
import { error, success } from '../components/notification/Notification'
import { getCookiesValue } from './local_storage'
import Cookies from 'js-cookie'
import qs from 'qs'

type ResponseType<T> = {
  data?: T
  errorMessage?: string
  message?: string
}

class ErrorResponse {
  status: number
  errorMessage: string
  constructor(resStatus: number, resMessage: string) {
    this.status = resStatus
    this.errorMessage = resMessage || 'Internal Server Error'
  }
}

export const handleLogout = () => {
  Cookies.remove('token')
  window.location.href = '/login'
}

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const handleErrorResponse = async (err: unknown) => {
  let status = 500
  if (err instanceof ErrorResponse) {
    status = err.status
    error(err.errorMessage)
    if (err.status === 401 && window.location.pathname !== 'login') {
      await sleep(2000)
      handleLogout()
    }
  }

  return { data: undefined, status }
}

export const post = async <T extends Record<string, unknown>>(
  prefix: string,
  body: Record<string, unknown>,
) => {
  const url = `${ENDPOINT_URL}${prefix}`
  try {
    const token = getCookiesValue('token')
    const res = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const jsonData = (await res.json()) as ResponseType<T>
    if (res.status >= 400 && jsonData.errorMessage) {
      throw new ErrorResponse(res.status, jsonData.errorMessage)
    }
    if (res.status >= 200 && res.status <= 300 && jsonData.message) {
      success(jsonData.message)
    }

    return {
      data: jsonData.data,
      status: res.status,
    }
  } catch (err) {
    return await handleErrorResponse(err)
  }
}

export const get = async <T extends object>(
  prefix: string,
  data?: Record<string, unknown>,
) => {
  const queryString = qs.stringify(data)
  const url = `${ENDPOINT_URL}${prefix}?${queryString}`
  try {
    const token = getCookiesValue('token')
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
      method: 'GET',
    })
    const jsonData = (await res.json()) as ResponseType<T>

    if (res.status >= 400 && jsonData.errorMessage) {
      throw new ErrorResponse(res.status, jsonData.errorMessage)
    }

    return {
      data: jsonData.data,
      status: res.status,
    }
  } catch (err) {
    return await handleErrorResponse(err)
  }
}
