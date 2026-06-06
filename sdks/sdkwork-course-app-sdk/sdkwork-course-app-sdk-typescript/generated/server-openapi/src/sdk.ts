import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { CourseApplicationsApi, createCourseApplicationsApi } from './api/course-applications';
import { CoursesApi, createCoursesApi } from './api/courses';
import { CourseCategoriesApi, createCourseCategoriesApi } from './api/course-categories';
import { CourseLessonsApi, createCourseLessonsApi } from './api/course-lessons';
import { CourseRelationsApi, createCourseRelationsApi } from './api/course-relations';
import { CourseSectionsApi, createCourseSectionsApi } from './api/course-sections';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly courseApplications: CourseApplicationsApi;
  public readonly courses: CoursesApi;
  public readonly courseCategories: CourseCategoriesApi;
  public readonly courseLessons: CourseLessonsApi;
  public readonly courseRelations: CourseRelationsApi;
  public readonly courseSections: CourseSectionsApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.courseApplications = createCourseApplicationsApi(this.httpClient);

    this.courses = createCoursesApi(this.httpClient);

    this.courseCategories = createCourseCategoriesApi(this.httpClient);

    this.courseLessons = createCourseLessonsApi(this.httpClient);

    this.courseRelations = createCourseRelationsApi(this.httpClient);

    this.courseSections = createCourseSectionsApi(this.httpClient);
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

export function createClient(config: SdkworkAppConfig): SdkworkAppClient {
  return new SdkworkAppClient(config);
}

export default SdkworkAppClient;
