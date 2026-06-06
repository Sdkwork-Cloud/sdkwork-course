import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { CourseApplicationsApi, createCourseApplicationsApi } from './api/course-applications';
import { CourseLessonsApi, createCourseLessonsApi } from './api/course-lessons';
import { CourseSectionsApi, createCourseSectionsApi } from './api/course-sections';
import { CoursesApi, createCoursesApi } from './api/courses';
import { CourseCommentsApi, createCourseCommentsApi } from './api/course-comments';
import { CourseEngagementApi, createCourseEngagementApi } from './api/course-engagement';
import { CourseRelationsApi, createCourseRelationsApi } from './api/course-relations';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly courseApplications: CourseApplicationsApi;
  public readonly courseLessons: CourseLessonsApi;
  public readonly courseSections: CourseSectionsApi;
  public readonly courses: CoursesApi;
  public readonly courseComments: CourseCommentsApi;
  public readonly courseEngagement: CourseEngagementApi;
  public readonly courseRelations: CourseRelationsApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.courseApplications = createCourseApplicationsApi(this.httpClient);

    this.courseLessons = createCourseLessonsApi(this.httpClient);

    this.courseSections = createCourseSectionsApi(this.httpClient);

    this.courses = createCoursesApi(this.httpClient);

    this.courseComments = createCourseCommentsApi(this.httpClient);

    this.courseEngagement = createCourseEngagementApi(this.httpClient);

    this.courseRelations = createCourseRelationsApi(this.httpClient);
  }

  setApiKey(apiKey: string): this {
    this.httpClient.setApiKey(apiKey);
    return this;
  }

  setAuthToken(token: string): this {
    this.httpClient.setAuthToken(token);
    return this;
  }

  setAccessToken(token: string): this {
    this.httpClient.setAccessToken(token);
    return this;
  }

  setTokenManager(manager: AuthTokenManager): this {
    this.httpClient.setTokenManager(manager);
    return this;
  }

  get http(): HttpClient {
    return this.httpClient;
  }
}

export function createClient(config: SdkworkBackendConfig): SdkworkBackendClient {
  return new SdkworkBackendClient(config);
}

export default SdkworkBackendClient;
