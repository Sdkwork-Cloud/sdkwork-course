# sdkwork-course-h5

Standalone course H5 application (thin shell).

## Architecture

The application is a thin shell over the canonical course mobile package:

- Pages are the canonical `@sdkwork/course-mobile-react-courses` components
  (`CourseHome`, `MyCourses`, `CourseDetail`, `CoursePurchase`,
  `CoursePlayer`, `CourseLiveRoom`) mounted by `src/routes/courseRoutes.tsx`
  under `/course`-family paths (legacy `/courses` `/live` `/my` paths
  redirect).
- `src/bootstrap/coursePort.ts` binds the generated Course App SDK port
  (`@sdkwork/course-runtime`) into the canonical package through
  `configureCourseRuntimePort`; without the binding the course pages fail
  closed.
- `src/bootstrap/i18n.ts` initializes i18next with the canonical package's
  `course` translation bundle.
- `packages/sdkwork-course-h5-core` keeps the IAM session / token manager /
  app store used by `packages/sdkwork-course-h5-auth` (login / register).

## Ownership

Course records, learning structure, enrollments, progress, live sessions and
audit records remain owned by sdkwork-course; the H5 shell only composes the
canonical package, injects the SDK port, and routes.

## Scripts

- `pnpm dev` — vite dev server (port 3001), `/app/v3/api` proxied to
  `VITE_API_BASE_URL || http://localhost:8080`.
- `pnpm typecheck` — `tsc --noEmit`.
- `pnpm build` — `tsc && vite build`.
