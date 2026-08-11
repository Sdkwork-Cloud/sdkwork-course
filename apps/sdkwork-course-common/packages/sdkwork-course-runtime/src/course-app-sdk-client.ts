/**
 * Course App SDK client construction shared by every course host.
 *
 * Wraps the generated `@sdkwork/course-app-sdk` client with the standard
 * dual-token auth mode and the host-injected `AuthTokenManager`, following
 * the same pattern as `@sdkwork/community-runtime`.
 */

import {
  createCourseAppClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from "@sdkwork/course-app-sdk";
import type { AuthTokenManager } from "@sdkwork/sdk-common";

const APP_API_PREFIX = "/app/v3/api";
const COURSE_APP_SDK_FAMILY_ID = "sdkwork-course-app-sdk";

export interface CourseRuntimeConfig {
  appApiBaseUrl: string;
  backendApiBaseUrl?: string;
  openApiBaseUrl?: string;
  dependencySdkBaseUrls?: Record<string, { appApiBaseUrl?: string }>;
}

export interface CourseAppSdkClient {
  client: SdkworkAppClient;
  setTokenManager(manager: AuthTokenManager): void;
}

export interface CourseAppSdkClientOptions {
  config: CourseRuntimeConfig;
  sdkClient?: SdkworkAppClient;
  tokenManager: AuthTokenManager;
}

function normalizeGeneratedSdkBaseUrl(baseUrl: string, apiPrefix: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedApiPrefix = apiPrefix.replace(/\/+$/, "");
  if (normalizedBaseUrl.endsWith(normalizedApiPrefix)) {
    return normalizedBaseUrl.slice(0, -normalizedApiPrefix.length) || normalizedBaseUrl;
  }
  return normalizedBaseUrl;
}

function resolveCourseAppApiBaseUrl(config: CourseRuntimeConfig): string {
  return config.dependencySdkBaseUrls?.[COURSE_APP_SDK_FAMILY_ID]?.appApiBaseUrl
    ?? config.appApiBaseUrl;
}

export function createCourseAppSdkClient({
  config,
  sdkClient,
  tokenManager,
}: CourseAppSdkClientOptions): CourseAppSdkClient {
  const clientConfig: SdkworkAppConfig = {
    authMode: "dual-token",
    baseUrl: normalizeGeneratedSdkBaseUrl(resolveCourseAppApiBaseUrl(config), APP_API_PREFIX),
    tokenManager,
  };
  const generatedClient = sdkClient ?? createCourseAppClient(clientConfig);
  generatedClient.setTokenManager(tokenManager);

  return {
    client: generatedClient,
    setTokenManager(manager) {
      generatedClient.setTokenManager(manager);
    },
  };
}

export { COURSE_APP_SDK_FAMILY_ID };
export type { AuthTokenManager };
