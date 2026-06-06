export type CourseApiSurface = "app" | "backend";
export type CourseHttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export interface CourseOperationContract {
  apiSurface: CourseApiSurface;
  method: CourseHttpMethod;
  operationId: string;
  path: string;
  tag: CourseSdkNamespace;
}

export type CourseSdkNamespace =
  | "courseApplications"
  | "courseCategories"
  | "courseComments"
  | "courseEngagement"
  | "courseLessons"
  | "courseRelations"
  | "courses"
  | "courseSections";

export const SDKWORK_COURSE_TABLES = {
  auditLog: "course_audit_log",
  application: "course_application",
  catalog: "course_catalog",
  category: "course_category",
  comment: "course_comment",
  lesson: "course_lesson",
  reaction: "course_reaction",
  relation: "course_relation",
  section: "course_section",
} as const;

export type CourseTableName = (typeof SDKWORK_COURSE_TABLES)[keyof typeof SDKWORK_COURSE_TABLES];

const app = "/app/v3/api";
const backend = "/backend/v3/api";

export const SDKWORK_COURSE_APP_OPERATIONS = {
  courseCategoriesList: operation("app", "GET", `${app}/courses/categories`, "courseCategories.list", "courseCategories"),
  coursesList: operation("app", "GET", `${app}/courses`, "courses.list", "courses"),
  coursesRetrieve: operation("app", "GET", `${app}/courses/{courseId}`, "courses.retrieve", "courses"),
  courseSectionsList: operation("app", "GET", `${app}/courses/{courseId}/sections`, "courseSections.list", "courseSections"),
  courseLessonsList: operation("app", "GET", `${app}/courses/{courseId}/lessons`, "courseLessons.list", "courseLessons"),
  courseRelationsList: operation("app", "GET", `${app}/courses/{courseId}/relations`, "courseRelations.list", "courseRelations"),
  courseApplicationsCreate: operation("app", "POST", `${app}/course_applications`, "courseApplications.create", "courseApplications"),
} as const;

export const SDKWORK_COURSE_BACKEND_OPERATIONS = {
  coursesList: operation("backend", "GET", `${backend}/courses`, "courses.list", "courses"),
  coursesCreate: operation("backend", "POST", `${backend}/courses`, "courses.create", "courses"),
  coursesUpdate: operation("backend", "PATCH", `${backend}/courses/{courseId}`, "courses.update", "courses"),
  coursesDelete: operation("backend", "DELETE", `${backend}/courses/{courseId}`, "courses.delete", "courses"),
  courseSectionsList: operation("backend", "GET", `${backend}/courses/{courseId}/sections`, "courseSections.list", "courseSections"),
  courseSectionsCreate: operation("backend", "POST", `${backend}/courses/{courseId}/sections`, "courseSections.create", "courseSections"),
  courseSectionsUpdate: operation("backend", "PATCH", `${backend}/course_sections/{sectionId}`, "courseSections.update", "courseSections"),
  courseSectionsDelete: operation("backend", "DELETE", `${backend}/course_sections/{sectionId}`, "courseSections.delete", "courseSections"),
  courseLessonsList: operation("backend", "GET", `${backend}/courses/{courseId}/lessons`, "courseLessons.list", "courseLessons"),
  courseLessonsCreate: operation("backend", "POST", `${backend}/courses/{courseId}/lessons`, "courseLessons.create", "courseLessons"),
  courseLessonsUpdate: operation("backend", "PATCH", `${backend}/course_lessons/{lessonId}`, "courseLessons.update", "courseLessons"),
  courseLessonsDelete: operation("backend", "DELETE", `${backend}/course_lessons/{lessonId}`, "courseLessons.delete", "courseLessons"),
  courseRelationsList: operation("backend", "GET", `${backend}/courses/{courseId}/relations`, "courseRelations.list", "courseRelations"),
  courseRelationsReplace: operation("backend", "PUT", `${backend}/courses/{courseId}/relations`, "courseRelations.replace", "courseRelations"),
  courseApplicationsList: operation("backend", "GET", `${backend}/course_applications`, "courseApplications.list", "courseApplications"),
  courseApplicationsReview: operation("backend", "PATCH", `${backend}/course_applications/{applicationId}/review`, "courseApplications.review", "courseApplications"),
  courseCommentsList: operation("backend", "GET", `${backend}/courses/comments`, "courseComments.list", "courseComments"),
  courseCommentsModerate: operation("backend", "PATCH", `${backend}/courses/comments/{commentId}/moderation`, "courseComments.moderate", "courseComments"),
  courseEngagementList: operation("backend", "GET", `${backend}/courses/engagement`, "courseEngagement.list", "courseEngagement"),
} as const;

export const SDKWORK_COURSE_STANDARD = {
  api: {
    appPrefix: app,
    backendPrefix: backend,
    openapi: "3.1.2",
  },
  appOperations: Object.values(SDKWORK_COURSE_APP_OPERATIONS),
  backendOperations: Object.values(SDKWORK_COURSE_BACKEND_OPERATIONS),
  domain: "course",
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
