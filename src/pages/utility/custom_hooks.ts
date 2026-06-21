import { useEffect, useRef, useState, type DependencyList } from 'react'

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
