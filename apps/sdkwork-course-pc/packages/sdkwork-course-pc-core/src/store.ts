import { create } from 'zustand'

import { restoreCourseIamSession } from './iamSession'
import { loadCourseSession, resetCourseGlobalTokenManager, saveCourseSession } from './session'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

const initialSession = loadCourseSession()

export const useAppStore = create<AppState>((set) => ({
  user: initialSession?.user ?? null,
  isAuthenticated: Boolean(initialSession?.accessToken && initialSession?.authToken && initialSession?.user),
  isLoading: Boolean(initialSession),
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    saveCourseSession(null)
    resetCourseGlobalTokenManager()
    set({ user: null, isAuthenticated: false })
  },
}))

export async function restoreCourseAuthState(): Promise<void> {
  const session = await restoreCourseIamSession()
  useAppStore.setState({
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.accessToken && session?.authToken && session?.user),
    isLoading: false,
  })
}



