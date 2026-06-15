import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { CourseCategoriesApi, createCourseCategoriesApi } from './api/course-categories';
import { CoursesApi, createCoursesApi } from './api/courses';
import { CourseOfferingsApi, createCourseOfferingsApi } from './api/course-offerings';
import { CourseEnrollmentsApi, createCourseEnrollmentsApi } from './api/course-enrollments';
import { CourseSectionsApi, createCourseSectionsApi } from './api/course-sections';
import { CourseLessonsApi, createCourseLessonsApi } from './api/course-lessons';
import { CourseLessonResourcesApi, createCourseLessonResourcesApi } from './api/course-lesson-resources';
import { CourseProgressApi, createCourseProgressApi } from './api/course-progress';
import { CourseLessonProgressApi, createCourseLessonProgressApi } from './api/course-lesson-progress';
import { CourseLiveSessionsApi, createCourseLiveSessionsApi } from './api/course-live-sessions';
import { CourseCommentsApi, createCourseCommentsApi } from './api/course-comments';
import { CourseReactionsApi, createCourseReactionsApi } from './api/course-reactions';
import { CourseApplicationsApi, createCourseApplicationsApi } from './api/course-applications';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly courseCategories: CourseCategoriesApi;
  public readonly courses: CoursesApi;
  public readonly courseOfferings: CourseOfferingsApi;
  public readonly courseEnrollments: CourseEnrollmentsApi;
  public readonly courseSections: CourseSectionsApi;
  public readonly courseLessons: CourseLessonsApi;
  public readonly courseLessonResources: CourseLessonResourcesApi;
  public readonly courseProgress: CourseProgressApi;
  public readonly courseLessonProgress: CourseLessonProgressApi;
  public readonly courseLiveSessions: CourseLiveSessionsApi;
  public readonly courseComments: CourseCommentsApi;
  public readonly courseReactions: CourseReactionsApi;
  public readonly courseApplications: CourseApplicationsApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.courseCategories = createCourseCategoriesApi(this.httpClient);

    this.courses = createCoursesApi(this.httpClient);

    this.courseOfferings = createCourseOfferingsApi(this.httpClient);

    this.courseEnrollments = createCourseEnrollmentsApi(this.httpClient);

    this.courseSections = createCourseSectionsApi(this.httpClient);

    this.courseLessons = createCourseLessonsApi(this.httpClient);

    this.courseLessonResources = createCourseLessonResourcesApi(this.httpClient);

    this.courseProgress = createCourseProgressApi(this.httpClient);

    this.courseLessonProgress = createCourseLessonProgressApi(this.httpClient);

    this.courseLiveSessions = createCourseLiveSessionsApi(this.httpClient);

    this.courseComments = createCourseCommentsApi(this.httpClient);

    this.courseReactions = createCourseReactionsApi(this.httpClient);

    this.courseApplications = createCourseApplicationsApi(this.httpClient);
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
