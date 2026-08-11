# @sdkwork/course-runtime

Course App SDK client construction and generated-SDK → port adapter for
every course host (sdkwork-im h5, standalone sdkwork-course h5).

## Exports

- `createCourseAppSdkClient({ config, sdkClient?, tokenManager })` — wraps the
  generated `@sdkwork/course-app-sdk` client with dual-token auth mode and
  the host-injected `AuthTokenManager`.
- `createGeneratedCourseAppSdkPort(client)` — adapts the generated client's
  untyped record payloads onto the `CourseAppSdkPort` contract
  (`@sdkwork/course-sdk-ports`).

## Rules

- No UI, no storage, no host bindings: this package only constructs the
  client and the port seam.
- Hosts bind the port into the mobile React package through
  `configureCourseRuntimePort` (`@sdkwork/course-mobile-react-courses`).
