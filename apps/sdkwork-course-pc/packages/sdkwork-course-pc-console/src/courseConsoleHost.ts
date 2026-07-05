import type { SdkworkBackendClient } from '@sdkwork/course-backend-sdk';

export interface CourseConsolePcHost {
  getBackendClientWithSession: () => SdkworkBackendClient;
}

let courseConsolePcHost: CourseConsolePcHost | null = null;

export function configureCourseConsolePcHost(host: CourseConsolePcHost): void {
  courseConsolePcHost = host;
}

export function getCourseConsolePcHost(): CourseConsolePcHost {
  if (!courseConsolePcHost) {
    throw new Error('Course console PC host is not configured');
  }
  return courseConsolePcHost;
}

export function resetCourseConsolePcHost(): void {
  courseConsolePcHost = null;
}
