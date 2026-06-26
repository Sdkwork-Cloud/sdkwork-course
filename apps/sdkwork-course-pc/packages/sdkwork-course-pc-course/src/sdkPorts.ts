import type { SdkworkAppClient } from '@sdkwork/course-app-sdk';

export interface CourseHostSessionUser {
  displayName?: string;
  nickname?: string;
  name?: string;
  avatar?: string;
}

export interface CourseHostSessionSnapshot {
  user?: CourseHostSessionUser;
}

export interface CoursePcSdkPorts {
  getCourseClient: () => SdkworkAppClient;
  readHostSession: () => CourseHostSessionSnapshot | null;
  subscribeHostSession?: (listener: () => void) => () => void;
  resolveHostLanguage?: () => string;
  subscribeHostLanguage?: (listener: (language: string) => void) => () => void;
}

let sdkPorts: CoursePcSdkPorts | null = null;

export function configureCoursePcSdkPorts(ports: CoursePcSdkPorts): void {
  sdkPorts = ports;
}

export function getCoursePcSdkPorts(): CoursePcSdkPorts {
  if (!sdkPorts) {
    throw new Error('Course PC SDK ports are not configured. Call configureCoursePcSdkPorts first.');
  }
  return sdkPorts;
}

export function tryGetCoursePcSdkPorts(): CoursePcSdkPorts | null {
  return sdkPorts;
}
