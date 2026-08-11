import { configureCourseRuntimePort } from '@sdkwork/course-mobile-react-courses'
import { COURSE_SESSION_CHANGED_EVENT, getCourseGlobalTokenManager } from '@sdkwork/sdkwork-course-h5-core'
import { createSdkClients } from './sdkClients'
import { getRuntime } from './runtime'

/**
 * Binds the canonical course mobile package to the generated Course App SDK
 * port built from the standalone H5 gateway base URL and the shared token
 * manager. Without this binding the course pages fail closed.
 *
 * The course session persist flow rebuilds the global token manager instance
 * (`resetCourseGlobalTokenManager` + `getCourseGlobalTokenManager`), so the
 * binding is refreshed on `COURSE_SESSION_CHANGED_EVENT` to keep the SDK port
 * on the live token manager.
 */
let bootstrapped = false

export function bootstrapCoursePort(): void {
  if (bootstrapped) {
    return
  }
  bootstrapped = true
  bindCourseRuntimePort()
  window.addEventListener(COURSE_SESSION_CHANGED_EVENT, bindCourseRuntimePort)
}

function bindCourseRuntimePort(): void {
  const runtime = getRuntime()
  runtime.sdkClients = createSdkClients(getCourseGlobalTokenManager())
  configureCourseRuntimePort(runtime.sdkClients.courseAppSdkPort)
}

export function isCoursePortBootstrapped(): boolean {
  return bootstrapped
}
