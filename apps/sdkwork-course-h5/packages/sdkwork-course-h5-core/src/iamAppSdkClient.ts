import {
  createClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/iam-app-sdk';

import {
  getCourseGlobalTokenManager,
  readCourseSessionTokens,
  resolveAppApiBaseUrl,
  resolveCourseAccessToken,
  resolveCourseAuthToken,
  type CourseSession,
} from './session';

export type IamAppSdkClient = SdkworkAppClient;
export type IamAppSdkClientConfig = SdkworkAppConfig;

let iamAppSdkClient: IamAppSdkClient | null = null;

export function createIamAppSdkClientConfig(
  session?: CourseSession | null,
): IamAppSdkClientConfig {
  const currentSession = session ?? readCourseSessionTokens();
  return {
    baseUrl: resolveAppApiBaseUrl(),
    accessToken: resolveCourseAccessToken(currentSession),
    authToken: resolveCourseAuthToken(currentSession),
    platform: 'h5',
    tokenManager: getCourseGlobalTokenManager(),
  };
}

export function getIamAppSdkClient(): IamAppSdkClient {
  if (!iamAppSdkClient) {
    iamAppSdkClient = createClient(createIamAppSdkClientConfig());
  }
  return iamAppSdkClient;
}

export function resetIamAppSdkClient(): void {
  iamAppSdkClient = null;
}
