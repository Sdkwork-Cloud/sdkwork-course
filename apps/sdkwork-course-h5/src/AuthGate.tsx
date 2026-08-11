import React, { useEffect, useState } from 'react'
import { loadCourseSession } from '@sdkwork/sdkwork-course-h5-core'
import { useAppStore } from '@sdkwork/sdkwork-course-h5-core'

/**
 * Session gate: restores the persisted course session before rendering so
 * protected pages and the bottom navigation reflect the signed-in state.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const session = loadCourseSession()
    setUser(session?.user ?? null)
    setHydrated(true)
  }, [setUser])

  if (!hydrated) {
    return null
  }

  return <>{children}</>
}
