import {
  createClient as createGeneratedCourseBackendClient,
  SdkworkBackendClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkBackendConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkBackendClient, createGeneratedCourseBackendClient };
export type { SdkworkBackendConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type CourseBackendSdkClient = SdkworkBackendClient;

export function createCourseBackendClient(
  config: SdkworkBackendConfig,
): CourseBackendSdkClient {
  return createGeneratedCourseBackendClient(config);
}

export function createClient(config: SdkworkBackendConfig): CourseBackendSdkClient {
  return createCourseBackendClient(config);
}
