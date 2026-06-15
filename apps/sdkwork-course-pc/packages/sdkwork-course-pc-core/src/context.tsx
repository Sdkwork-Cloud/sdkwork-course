import React, { createContext, useContext } from 'react'
import { createCourseSdk, CourseSdk, CourseSdkConfig } from './sdk'

const CourseSdkContext = createContext<CourseSdk | null>(null)

export interface CourseSdkProviderProps {
  config: CourseSdkConfig
  children: React.ReactNode
}

export function CourseSdkProvider({ config, children }: CourseSdkProviderProps) {
  const sdk = createCourseSdk(config)
  return (
    <CourseSdkContext.Provider value={sdk}>
      {children}
    </CourseSdkContext.Provider>
  )
}

export function useCourseSdk(): CourseSdk {
  const sdk = useContext(CourseSdkContext)
  if (!sdk) {
    throw new Error('useCourseSdk must be used within a CourseSdkProvider')
  }
  return sdk
}



