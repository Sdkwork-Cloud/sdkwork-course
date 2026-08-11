import type { CourseAppSdkPort } from "@sdkwork/course-sdk-ports";
import { CourseCapabilityUnavailableError } from "./CourseService";

/**
 * Host-injectable runtime port for the Course App SDK.
 *
 * Hosts (sdkwork-im h5, standalone sdkwork-course h5) bind the generated
 * SDK port through `configureCourseRuntimePort`. Without a host binding the
 * course capability fails closed with `CourseCapabilityUnavailableError`:
 * the course domain (enrollments, progress, live sessions) stays owned by
 * sdkwork-course and must never be fabricated by the UI.
 */

let runtimePort: CourseAppSdkPort | null = null;

export function configureCourseRuntimePort(port: CourseAppSdkPort): void {
  runtimePort = port;
}

export function resetCourseRuntimePort(): void {
  runtimePort = null;
}

export function getCourseRuntimePort(): CourseAppSdkPort {
  if (!runtimePort) {
    throw new CourseCapabilityUnavailableError();
  }
  return runtimePort;
}

export function isCourseRuntimePortBound(): boolean {
  return runtimePort !== null;
}
