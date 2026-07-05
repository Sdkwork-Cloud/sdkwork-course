import React, { createContext, useContext, useMemo } from 'react';
import {
  getCourseAppSdkClient,
  initCourseAppSdkClient,
  type CourseAppSdkClient,
} from './courseAppSdkClient';
import { createCourseAppSdkClientConfig } from './courseAppSdkClient';

const CourseSdkContext = createContext<CourseAppSdkClient | null>(null);

export interface CourseSdkProviderProps {
  children: React.ReactNode;
}

export function CourseSdkProvider({ children }: CourseSdkProviderProps) {
  const sdk = useMemo(
    () => initCourseAppSdkClient(createCourseAppSdkClientConfig()),
    [],
  );
  return (
    <CourseSdkContext.Provider value={sdk}>
      {children}
    </CourseSdkContext.Provider>
  );
}

export function useCourseSdk(): CourseAppSdkClient {
  const sdk = useContext(CourseSdkContext);
  if (!sdk) {
    return getCourseAppSdkClient();
  }
  return sdk;
}
