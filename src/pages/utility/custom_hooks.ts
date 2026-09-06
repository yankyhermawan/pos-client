import { useEffect, useRef, useState, type DependencyList } from 'react'
import { getCookiesValue } from './local_storage'

type UseRefresh = {
  handler: () => void
}

export const useEffectSkipFirst = (
  callback: () => void,
  dependencies: DependencyList,
) => {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    callback()
  }, dependencies)
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowWidth
}

export const useRefresh = ({ handler }: UseRefresh) => {
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    const handleCookieChange = () => {
      const compId = Number(getCookiesValue('company_id')) || null
      const stId = Number(getCookiesValue('store_id')) || null
      setCompanyId(compId)
      setStoreId(stId)
    }
    cookieStore.addEventListener('change', handleCookieChange)

    return () => cookieStore.removeEventListener('change', handleCookieChange)
  }, [])

  useEffectSkipFirst(() => {
    handler()
  }, [companyId, storeId])
}
