# @sdkwork/course-sdk-ports

Course App SDK port contract shared by every course mobile consumer.

## Responsibility

- `CourseAppSdkPort`: the UI-facing seam over the generated
  `@sdkwork/course-app-sdk` client (categories, courses, offerings,
  enrollments, sections, lessons, lesson progress, learning progress, live
  sessions, comments, reactions).
- UI domain types consumed by `@sdkwork/course-mobile-react-courses` pages
  and produced by `@sdkwork/course-runtime`
  (`createGeneratedCourseAppSdkPort`).

## Rules

- No transport, no storage, no host bindings: this package is pure contract
  types.
- Pages and services must never import generated SDK records or raw HTTP;
  they consume this port only.
- Hosts bind the real generated SDK port through
  `configureCourseRuntimePort` (`@sdkwork/course-mobile-react-courses`).
