import { useRef, useEffect } from 'react'

export function useLatestState<T>(state: T) {
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  return stateRef
} 