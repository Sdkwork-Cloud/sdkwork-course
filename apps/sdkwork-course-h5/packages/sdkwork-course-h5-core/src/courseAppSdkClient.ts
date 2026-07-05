import {
  createClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/course-app-sdk';

import {
  getCourseGlobalTokenManager,
  readCourseSessionTokens,
  resolveAppApiBaseUrl,
  resolveCourseAccessToken,
  resolveCourseAuthToken,
  type CourseSession,
} from './session';

export type CourseAppSdkClient = SdkworkAppClient;
export type CourseAppSdkClientConfig = SdkworkAppConfig;

let courseAppSdkClient: CourseAppSdkClient | null = null;

export function createCourseAppSdkClientConfig(
  session?: CourseSession | null,
): CourseAppSdkClientConfig {
  const currentSession = session ?? readCourseSessionTokens();
  return {
    baseUrl: resolveAppApiBaseUrl(),
    accessToken: resolveCourseAccessToken(currentSession),
    authToken: resolveCourseAuthToken(currentSession),
    platform: 'h5',
    tokenManager: getCourseGlobalTokenManager(),
  };
}

export function initCourseAppSdkClient(
  config: CourseAppSdkClientConfig = createCourseAppSdkClientConfig(),
): CourseAppSdkClient {
  courseAppSdkClient = createClient(config);
  return courseAppSdkClient;
}

export function getCourseAppSdkClient(): CourseAppSdkClient {
  return courseAppSdkClient ?? initCourseAppSdkClient();
}

export function getCourseAppSdkClientWithSession(
  session = readCourseSessionTokens(),
): CourseAppSdkClient {
  return initCourseAppSdkClient(createCourseAppSdkClientConfig(session));
}

export function resetCourseAppSdkClient(): void {
  courseAppSdkClient = null;
}

/** @deprecated Use getCourseAppSdkClient() — kept for transitional imports. */
export const createCourseSdk = getCourseAppSdkClient;
export type CourseSdk = CourseAppSdkClient;
export type CourseSdkConfig = CourseAppSdkClientConfig;
