export type CourseApiSurface = "app" | "backend";
export type CourseHttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export * from "./course-api.ts";
export * from "./course-domain.ts";

export interface CourseOperationContract {
  apiSurface: CourseApiSurface;
  method: CourseHttpMethod;
  operationId: string;
  path: string;
  tag: CourseSdkNamespace;
}

export type CourseSdkNamespace =
  | "courseApplications"
  | "courseAuditLogs"
  | "courseCategories"
  | "courseComments"
  | "courseEnrollments"
  | "courseInstructors"
  | "courseLessonProgress"
  | "courseLessonResources"
  | "courseLessons"
  | "courseLiveSessions"
  | "courseOfferings"
  | "courseProgress"
  | "courseReactions"
  | "courseReports"
  | "courseResources"
  | "courseSections"
  | "courses";

export const SDKWORK_COURSE_TABLES = {
  application: "course_application",
  auditLog: "course_audit_log",
  catalog: "course_catalog",
  category: "course_category",
  comment: "course_comment",
  enrollment: "course_enrollment",
  instructor: "course_instructor",
  learningProgress: "course_learning_progress",
  lesson: "course_lesson",
  lessonProgress: "course_lesson_progress",
  liveSession: "course_live_session",
  offering: "course_offering",
  reaction: "course_reaction",
  resourceRef: "course_resource_ref",
  section: "course_section",
} as const;

export type CourseTableName = (typeof SDKWORK_COURSE_TABLES)[keyof typeof SDKWORK_COURSE_TABLES];
export const COURSE_TABLE_NAMES = Object.values(SDKWORK_COURSE_TABLES);

const app = "/app/v3/api";
const backend = "/backend/v3/api";

export const SDKWORK_COURSE_APP_OPERATIONS = {
  courseCategoriesList: operation("app", "GET", `${app}/course_categories`, "courseCategories.list", "courseCategories"),
  courseCategoriesRetrieve: operation(
    "app",
    "GET",
    `${app}/course_categories/{categoryId}`,
    "courseCategories.retrieve",
    "courseCategories",
  ),
  coursesList: operation("app", "GET", `${app}/courses`, "courses.list", "courses"),
  coursesRetrieve: operation("app", "GET", `${app}/courses/{courseId}`, "courses.retrieve", "courses"),
  courseOfferingsList: operation(
    "app",
    "GET",
    `${app}/courses/{courseId}/offerings`,
    "courseOfferings.list",
    "courseOfferings",
  ),
  courseOfferingsRetrieve: operation(
    "app",
    "GET",
    `${app}/course_offerings/{offeringId}`,
    "courseOfferings.retrieve",
    "courseOfferings",
  ),
  courseEnrollmentsCreate: operation(
    "app",
    "POST",
    `${app}/course_offerings/{offeringId}/enrollments`,
    "courseEnrollments.create",
    "courseEnrollments",
  ),
  courseEnrollmentsCurrentList: operation(
    "app",
    "GET",
    `${app}/course_enrollments`,
    "courseEnrollments.current.list",
    "courseEnrollments",
  ),
  courseEnrollmentsRetrieve: operation(
    "app",
    "GET",
    `${app}/course_enrollments/{enrollmentId}`,
    "courseEnrollments.retrieve",
    "courseEnrollments",
  ),
  courseEnrollmentsCancel: operation(
    "app",
    "DELETE",
    `${app}/course_enrollments/{enrollmentId}`,
    "courseEnrollments.cancel",
    "courseEnrollments",
  ),
  courseSectionsList: operation(
    "app",
    "GET",
    `${app}/courses/{courseId}/sections`,
    "courseSections.list",
    "courseSections",
  ),
  courseLessonsList: operation(
    "app",
    "GET",
    `${app}/courses/{courseId}/lessons`,
    "courseLessons.list",
    "courseLessons",
  ),
  courseLessonsRetrieve: operation(
    "app",
    "GET",
    `${app}/course_lessons/{lessonId}`,
    "courseLessons.retrieve",
    "courseLessons",
  ),
  courseLessonResourcesList: operation(
    "app",
    "GET",
    `${app}/course_lessons/{lessonId}/resources`,
    "courseLessonResources.list",
    "courseLessonResources",
  ),
  courseProgressRetrieve: operation(
    "app",
    "GET",
    `${app}/course_enrollments/{enrollmentId}/progress`,
    "courseProgress.retrieve",
    "courseProgress",
  ),
  courseLessonProgressUpdate: operation(
    "app",
    "PATCH",
    `${app}/course_lessons/{lessonId}/progress`,
    "courseLessonProgress.update",
    "courseLessonProgress",
  ),
  courseLessonProgressWatchPositionsUpdate: operation(
    "app",
    "PATCH",
    `${app}/course_lessons/{lessonId}/watch_position`,
    "courseLessonProgress.watchPositions.update",
    "courseLessonProgress",
  ),
  courseLiveSessionsList: operation(
    "app",
    "GET",
    `${app}/course_live_sessions`,
    "courseLiveSessions.list",
    "courseLiveSessions",
  ),
  courseLiveSessionsRetrieve: operation(
    "app",
    "GET",
    `${app}/course_live_sessions/{liveSessionId}`,
    "courseLiveSessions.retrieve",
    "courseLiveSessions",
  ),
  courseLiveSessionsJoin: operation(
    "app",
    "POST",
    `${app}/course_live_sessions/{liveSessionId}/join`,
    "courseLiveSessions.join",
    "courseLiveSessions",
  ),
  courseLiveSessionsHeartbeat: operation(
    "app",
    "POST",
    `${app}/course_live_sessions/{liveSessionId}/heartbeat`,
    "courseLiveSessions.heartbeat",
    "courseLiveSessions",
  ),
  courseLiveSessionsLeave: operation(
    "app",
    "POST",
    `${app}/course_live_sessions/{liveSessionId}/leave`,
    "courseLiveSessions.leave",
    "courseLiveSessions",
  ),
  courseLiveSessionsReplayRetrieve: operation(
    "app",
    "GET",
    `${app}/course_live_sessions/{liveSessionId}/replay`,
    "courseLiveSessions.replay.retrieve",
    "courseLiveSessions",
  ),
  courseCommentsList: operation(
    "app",
    "GET",
    `${app}/courses/{courseId}/comments`,
    "courseComments.list",
    "courseComments",
  ),
  courseCommentsCreate: operation(
    "app",
    "POST",
    `${app}/courses/{courseId}/comments`,
    "courseComments.create",
    "courseComments",
  ),
  courseCommentsDelete: operation(
    "app",
    "DELETE",
    `${app}/course_comments/{commentId}`,
    "courseComments.delete",
    "courseComments",
  ),
  courseReactionsReplace: operation(
    "app",
    "PUT",
    `${app}/course_reactions`,
    "courseReactions.replace",
    "courseReactions",
  ),
  courseReactionsDelete: operation(
    "app",
    "DELETE",
    `${app}/course_reactions/{reactionId}`,
    "courseReactions.delete",
    "courseReactions",
  ),
  courseApplicationsCreate: operation(
    "app",
    "POST",
    `${app}/course_applications`,
    "courseApplications.create",
    "courseApplications",
  ),
  courseApplicationsCurrentList: operation(
    "app",
    "GET",
    `${app}/course_applications`,
    "courseApplications.current.list",
    "courseApplications",
  ),
  courseApplicationsRetrieve: operation(
    "app",
    "GET",
    `${app}/course_applications/{applicationId}`,
    "courseApplications.retrieve",
    "courseApplications",
  ),
} as const;

export const SDKWORK_COURSE_BACKEND_OPERATIONS = {
  courseCategoriesList: operation("backend", "GET", `${backend}/course_categories`, "courseCategories.list", "courseCategories"),
  courseCategoriesCreate: operation(
    "backend",
    "POST",
    `${backend}/course_categories`,
    "courseCategories.create",
    "courseCategories",
  ),
  courseCategoriesUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_categories/{categoryId}`,
    "courseCategories.update",
    "courseCategories",
  ),
  courseCategoriesDelete: operation(
    "backend",
    "DELETE",
    `${backend}/course_categories/{categoryId}`,
    "courseCategories.delete",
    "courseCategories",
  ),
  courseCategoriesReorder: operation(
    "backend",
    "PUT",
    `${backend}/course_categories/reorder`,
    "courseCategories.reorder",
    "courseCategories",
  ),
  courseInstructorsList: operation("backend", "GET", `${backend}/course_instructors`, "courseInstructors.list", "courseInstructors"),
  courseInstructorsCreate: operation(
    "backend",
    "POST",
    `${backend}/course_instructors`,
    "courseInstructors.create",
    "courseInstructors",
  ),
  courseInstructorsRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_instructors/{instructorId}`,
    "courseInstructors.retrieve",
    "courseInstructors",
  ),
  courseInstructorsUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_instructors/{instructorId}`,
    "courseInstructors.update",
    "courseInstructors",
  ),
  courseInstructorsStatusUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_instructors/{instructorId}/status`,
    "courseInstructors.status.update",
    "courseInstructors",
  ),
  coursesList: operation("backend", "GET", `${backend}/courses`, "courses.list", "courses"),
  coursesCreate: operation("backend", "POST", `${backend}/courses`, "courses.create", "courses"),
  coursesRetrieve: operation("backend", "GET", `${backend}/courses/{courseId}`, "courses.retrieve", "courses"),
  coursesUpdate: operation("backend", "PATCH", `${backend}/courses/{courseId}`, "courses.update", "courses"),
  coursesDelete: operation("backend", "DELETE", `${backend}/courses/{courseId}`, "courses.delete", "courses"),
  coursesPublish: operation("backend", "POST", `${backend}/courses/{courseId}/publish`, "courses.publish", "courses"),
  coursesUnpublish: operation("backend", "POST", `${backend}/courses/{courseId}/unpublish`, "courses.unpublish", "courses"),
  courseOfferingsList: operation(
    "backend",
    "GET",
    `${backend}/courses/{courseId}/offerings`,
    "courseOfferings.list",
    "courseOfferings",
  ),
  courseOfferingsCreate: operation(
    "backend",
    "POST",
    `${backend}/courses/{courseId}/offerings`,
    "courseOfferings.create",
    "courseOfferings",
  ),
  courseOfferingsRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_offerings/{offeringId}`,
    "courseOfferings.retrieve",
    "courseOfferings",
  ),
  courseOfferingsUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_offerings/{offeringId}`,
    "courseOfferings.update",
    "courseOfferings",
  ),
  courseOfferingsPublish: operation(
    "backend",
    "POST",
    `${backend}/course_offerings/{offeringId}/publish`,
    "courseOfferings.publish",
    "courseOfferings",
  ),
  courseOfferingsClose: operation(
    "backend",
    "POST",
    `${backend}/course_offerings/{offeringId}/close`,
    "courseOfferings.close",
    "courseOfferings",
  ),
  courseOfferingsDelete: operation(
    "backend",
    "DELETE",
    `${backend}/course_offerings/{offeringId}`,
    "courseOfferings.delete",
    "courseOfferings",
  ),
  courseSectionsList: operation(
    "backend",
    "GET",
    `${backend}/courses/{courseId}/sections`,
    "courseSections.list",
    "courseSections",
  ),
  courseSectionsCreate: operation(
    "backend",
    "POST",
    `${backend}/courses/{courseId}/sections`,
    "courseSections.create",
    "courseSections",
  ),
  courseSectionsUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_sections/{sectionId}`,
    "courseSections.update",
    "courseSections",
  ),
  courseSectionsDelete: operation(
    "backend",
    "DELETE",
    `${backend}/course_sections/{sectionId}`,
    "courseSections.delete",
    "courseSections",
  ),
  courseSectionsReorder: operation(
    "backend",
    "PUT",
    `${backend}/courses/{courseId}/sections/reorder`,
    "courseSections.reorder",
    "courseSections",
  ),
  courseLessonsList: operation(
    "backend",
    "GET",
    `${backend}/courses/{courseId}/lessons`,
    "courseLessons.list",
    "courseLessons",
  ),
  courseLessonsCreate: operation(
    "backend",
    "POST",
    `${backend}/courses/{courseId}/lessons`,
    "courseLessons.create",
    "courseLessons",
  ),
  courseLessonsRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_lessons/{lessonId}`,
    "courseLessons.retrieve",
    "courseLessons",
  ),
  courseLessonsUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_lessons/{lessonId}`,
    "courseLessons.update",
    "courseLessons",
  ),
  courseLessonsDelete: operation(
    "backend",
    "DELETE",
    `${backend}/course_lessons/{lessonId}`,
    "courseLessons.delete",
    "courseLessons",
  ),
  courseLessonsReorder: operation(
    "backend",
    "PUT",
    `${backend}/courses/{courseId}/lessons/reorder`,
    "courseLessons.reorder",
    "courseLessons",
  ),
  courseResourcesList: operation(
    "backend",
    "GET",
    `${backend}/course_lessons/{lessonId}/resources`,
    "courseResources.list",
    "courseResources",
  ),
  courseResourcesCreate: operation(
    "backend",
    "POST",
    `${backend}/course_lessons/{lessonId}/resources`,
    "courseResources.create",
    "courseResources",
  ),
  courseResourcesUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_resources/{resourceRefId}`,
    "courseResources.update",
    "courseResources",
  ),
  courseResourcesDelete: operation(
    "backend",
    "DELETE",
    `${backend}/course_resources/{resourceRefId}`,
    "courseResources.delete",
    "courseResources",
  ),
  courseLiveSessionsList: operation(
    "backend",
    "GET",
    `${backend}/course_live_sessions`,
    "courseLiveSessions.list",
    "courseLiveSessions",
  ),
  courseLiveSessionsCreate: operation(
    "backend",
    "POST",
    `${backend}/course_live_sessions`,
    "courseLiveSessions.create",
    "courseLiveSessions",
  ),
  courseLiveSessionsRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_live_sessions/{liveSessionId}`,
    "courseLiveSessions.retrieve",
    "courseLiveSessions",
  ),
  courseLiveSessionsUpdate: operation(
    "backend",
    "PATCH",
    `${backend}/course_live_sessions/{liveSessionId}`,
    "courseLiveSessions.update",
    "courseLiveSessions",
  ),
  courseLiveSessionsStart: operation(
    "backend",
    "POST",
    `${backend}/course_live_sessions/{liveSessionId}/start`,
    "courseLiveSessions.start",
    "courseLiveSessions",
  ),
  courseLiveSessionsEnd: operation(
    "backend",
    "POST",
    `${backend}/course_live_sessions/{liveSessionId}/end`,
    "courseLiveSessions.end",
    "courseLiveSessions",
  ),
  courseLiveSessionsCancel: operation(
    "backend",
    "POST",
    `${backend}/course_live_sessions/{liveSessionId}/cancel`,
    "courseLiveSessions.cancel",
    "courseLiveSessions",
  ),
  courseLiveSessionsReplayAttach: operation(
    "backend",
    "POST",
    `${backend}/course_live_sessions/{liveSessionId}/replay`,
    "courseLiveSessions.replay.attach",
    "courseLiveSessions",
  ),
  courseLiveSessionsReplayPublish: operation(
    "backend",
    "POST",
    `${backend}/course_live_sessions/{liveSessionId}/replay/publish`,
    "courseLiveSessions.replay.publish",
    "courseLiveSessions",
  ),
  courseEnrollmentsList: operation("backend", "GET", `${backend}/course_enrollments`, "courseEnrollments.list", "courseEnrollments"),
  courseEnrollmentsGrant: operation(
    "backend",
    "POST",
    `${backend}/course_enrollments/grants`,
    "courseEnrollments.grant",
    "courseEnrollments",
  ),
  courseEnrollmentsRevoke: operation(
    "backend",
    "POST",
    `${backend}/course_enrollments/{enrollmentId}/revoke`,
    "courseEnrollments.revoke",
    "courseEnrollments",
  ),
  courseProgressList: operation("backend", "GET", `${backend}/course_progress`, "courseProgress.list", "courseProgress"),
  courseProgressRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_enrollments/{enrollmentId}/progress`,
    "courseProgress.retrieve",
    "courseProgress",
  ),
  courseLessonProgressRepair: operation(
    "backend",
    "PATCH",
    `${backend}/course_lesson_progress/{lessonProgressId}`,
    "courseLessonProgress.repair",
    "courseLessonProgress",
  ),
  courseCommentsList: operation("backend", "GET", `${backend}/course_comments`, "courseComments.list", "courseComments"),
  courseCommentsModerate: operation(
    "backend",
    "PATCH",
    `${backend}/course_comments/{commentId}/moderation`,
    "courseComments.moderate",
    "courseComments",
  ),
  courseCommentsDelete: operation(
    "backend",
    "DELETE",
    `${backend}/course_comments/{commentId}`,
    "courseComments.delete",
    "courseComments",
  ),
  courseReactionsList: operation("backend", "GET", `${backend}/course_reactions`, "courseReactions.list", "courseReactions"),
  courseApplicationsList: operation(
    "backend",
    "GET",
    `${backend}/course_applications`,
    "courseApplications.list",
    "courseApplications",
  ),
  courseApplicationsRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_applications/{applicationId}`,
    "courseApplications.retrieve",
    "courseApplications",
  ),
  courseApplicationsReview: operation(
    "backend",
    "PATCH",
    `${backend}/course_applications/{applicationId}/review`,
    "courseApplications.review",
    "courseApplications",
  ),
  courseApplicationsConvertToCourse: operation(
    "backend",
    "POST",
    `${backend}/course_applications/{applicationId}/convert`,
    "courseApplications.convertToCourse",
    "courseApplications",
  ),
  courseReportsOverviewRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_reports/overview`,
    "courseReports.overview.retrieve",
    "courseReports",
  ),
  courseReportsLearningList: operation(
    "backend",
    "GET",
    `${backend}/course_reports/learning`,
    "courseReports.learning.list",
    "courseReports",
  ),
  courseReportsLiveSessionsList: operation(
    "backend",
    "GET",
    `${backend}/course_reports/live_sessions`,
    "courseReports.liveSessions.list",
    "courseReports",
  ),
  courseAuditLogsList: operation("backend", "GET", `${backend}/course_audit_logs`, "courseAuditLogs.list", "courseAuditLogs"),
  courseAuditLogsRetrieve: operation(
    "backend",
    "GET",
    `${backend}/course_audit_logs/{auditLogId}`,
    "courseAuditLogs.retrieve",
    "courseAuditLogs",
  ),
} as const;

export const SDKWORK_COURSE_STANDARD = {
  api: {
    appPrefix: app,
    backendPrefix: backend,
    openapi: "3.1.2",
  },
  appOperations: Object.values(SDKWORK_COURSE_APP_OPERATIONS),
  backendOperations: Object.values(SDKWORK_COURSE_BACKEND_OPERATIONS),
  capability: "course",
  domain: "content",
  tables: SDKWORK_COURSE_TABLES,
} as const;

function operation(
  apiSurface: CourseApiSurface,
  method: CourseHttpMethod,
  path: string,
  operationId: string,
  tag: CourseSdkNamespace,
): CourseOperationContract {
  return {
    apiSurface,
    method,
    operationId,
    path,
    tag,
  };
}
