import type { AuthTokenManager } from '@sdkwork/sdk-common'
import { getCourseGlobalTokenManager, loadCourseSession } from '@sdkwork/sdkwork-course-h5-core'
import { createSdkClients, type CourseH5SdkClients } from './sdkClients'
import { loadRuntimeConfig, type RuntimeConfig } from './environment'

export interface CourseH5Runtime {
  config: RuntimeConfig
  sdkClients: CourseH5SdkClients
  tokenManager: AuthTokenManager
  /** Hydrates the token manager from the persisted course session. */
  initialize(): void
}
let runtime: CourseH5Runtime | null = null

export function createRuntime(): CourseH5Runtime {
  const config = loadRuntimeConfig()
  const tokenManager = getCourseGlobalTokenManager()
  const sdkClients = createSdkClients(tokenManager)
  return {
    config,
    sdkClients,
    tokenManager,
    initialize() {
      const session = loadCourseSession()
      if (session?.accessToken) {
        tokenManager.setAuthToken(session.authToken ?? '')
        tokenManager.setAccessToken(session.accessToken)
      }
    },
  }
}

export function getRuntime(): CourseH5Runtime {
  if (!runtime) {
    runtime = createRuntime()
  }
  return runtime
}
