import {
  createClient as createGeneratedCourseAppClient,
  SdkworkAppClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkAppConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkAppClient, createGeneratedCourseAppClient };
export type { SdkworkAppConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type CourseAppSdkClient = SdkworkAppClient;

export function createCourseAppClient(config: SdkworkAppConfig): CourseAppSdkClient {
  return createGeneratedCourseAppClient(config);
}

export function createClient(config: SdkworkAppConfig): CourseAppSdkClient {
  return createCourseAppClient(config);
}
