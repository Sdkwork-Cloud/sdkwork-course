export type CourseApiOperationSurface = "app-api" | "backend-api";

export type CourseApiOperationMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export interface CourseOperationPlan {
  surface: CourseApiOperationSurface;
  method: CourseApiOperationMethod;
  path: string;
  operationId: string;
  resource: string;
  authMode: "anonymous" | "dual-token" | "dual-token-or-anonymous" | "internal";
  permission?: string;
  auditEvent?: string;
  idempotency?: "required" | "recommended";
  todo: string;
}

export const COURSE_APP_API_PREFIX = "/app/v3/api";
export const COURSE_BACKEND_API_PREFIX = "/backend/v3/api";
export const COURSE_APP_API_AUTHORITY = "sdkwork-course-app-api";
export const COURSE_BACKEND_API_AUTHORITY = "sdkwork-course-backend-api";

export const COURSE_APP_API_OPERATION_IDS = [
  "courseCategories.list",
  "courseCategories.retrieve",
  "courses.list",
  "courses.retrieve",
  "courseOfferings.list",
  "courseOfferings.retrieve",
  "courseEnrollments.create",
  "courseEnrollments.current.list",
  "courseEnrollments.retrieve",
  "courseEnrollments.cancel",
  "courseSections.list",
  "courseLessons.list",
  "courseLessons.retrieve",
  "courseLessonResources.list",
  "courseProgress.retrieve",
  "courseLessonProgress.update",
  "courseLessonProgress.watchPositions.update",
  "courseLiveSessions.list",
  "courseLiveSessions.retrieve",
  "courseLiveSessions.join",
  "courseLiveSessions.heartbeat",
  "courseLiveSessions.leave",
  "courseLiveSessions.replay.retrieve",
  "courseComments.list",
  "courseComments.create",
  "courseComments.delete",
  "courseReactions.replace",
  "courseReactions.delete",
  "courseApplications.create",
  "courseApplications.current.list",
  "courseApplications.retrieve",
] as const;

export type CourseAppOperationId = (typeof COURSE_APP_API_OPERATION_IDS)[number];

export const COURSE_BACKEND_API_OPERATION_IDS = [
  "courseCategories.list",
  "courseCategories.create",
  "courseCategories.update",
  "courseCategories.delete",
  "courseCategories.reorder",
  "courseInstructors.list",
  "courseInstructors.create",
  "courseInstructors.retrieve",
  "courseInstructors.update",
  "courseInstructors.status.update",
  "courses.list",
  "courses.create",
  "courses.retrieve",
  "courses.update",
  "courses.delete",
  "courses.publish",
  "courses.unpublish",
  "courseOfferings.list",
  "courseOfferings.create",
  "courseOfferings.retrieve",
  "courseOfferings.update",
  "courseOfferings.publish",
  "courseOfferings.close",
  "courseOfferings.delete",
  "courseSections.list",
  "courseSections.create",
  "courseSections.update",
  "courseSections.delete",
  "courseSections.reorder",
  "courseLessons.list",
  "courseLessons.create",
  "courseLessons.retrieve",
  "courseLessons.update",
  "courseLessons.delete",
  "courseLessons.reorder",
  "courseResources.list",
  "courseResources.create",
  "courseResources.update",
  "courseResources.delete",
  "courseLiveSessions.list",
  "courseLiveSessions.create",
  "courseLiveSessions.retrieve",
  "courseLiveSessions.update",
  "courseLiveSessions.start",
  "courseLiveSessions.end",
  "courseLiveSessions.cancel",
  "courseLiveSessions.replay.attach",
  "courseLiveSessions.replay.publish",
  "courseEnrollments.list",
  "courseEnrollments.grant",
  "courseEnrollments.revoke",
  "courseProgress.list",
  "courseProgress.retrieve",
  "courseLessonProgress.repair",
  "courseComments.list",
  "courseComments.moderate",
  "courseComments.delete",
  "courseReactions.list",
  "courseApplications.list",
  "courseApplications.retrieve",
  "courseApplications.review",
  "courseApplications.convertToCourse",
  "courseReports.overview.retrieve",
  "courseReports.learning.list",
  "courseReports.liveSessions.list",
  "courseAuditLogs.list",
  "courseAuditLogs.retrieve",
] as const;

export type CourseBackendOperationId = (typeof COURSE_BACKEND_API_OPERATION_IDS)[number];

export const COURSE_API_MATERIALIZATION_PLAN = {
  app: {
    apiAuthority: COURSE_APP_API_AUTHORITY,
    apiPrefix: COURSE_APP_API_PREFIX,
    operationIds: COURSE_APP_API_OPERATION_IDS,
    sdkFamily: "sdkwork-course-app-sdk",
  },
  backend: {
    apiAuthority: COURSE_BACKEND_API_AUTHORITY,
    apiPrefix: COURSE_BACKEND_API_PREFIX,
    operationIds: COURSE_BACKEND_API_OPERATION_IDS,
    sdkFamily: "sdkwork-course-backend-sdk",
  },
} as const;

// TODO(course): Replace the planning constants with generated OpenAPI-derived exports after operations.json is materialized.
