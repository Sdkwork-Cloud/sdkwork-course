# @sdkwork/course-mobile-react-courses

Canonical mobile Course UI (pages + components + service) owned by
sdkwork-course and consumed by every course host (sdkwork-im h5,
standalone sdkwork-course h5).

## Composition

- `pages/` — `CourseHome`, `CourseDetail`, `CoursePurchase`, `CoursePlayer`,
  `CourseLiveRoom`, `MyCourses` (routed by the host at `/course`-family
  paths).
- `components/` — course card, category tabs, hero/basic info/footer bar,
  curriculum, player catalog, video player, discussion.
- `services/CourseService.ts` — all data access goes through the
  `CourseAppSdkPort` injected by the host (`configureCourseRuntimePort`).
  Without a host binding the capability fails closed with
  `CourseCapabilityUnavailableError`; the course domain stays owned by
  sdkwork-course.
- `i18n/` — `course` translation bundle registered side-effect free on
  import (`t("course.xxx")`).

## Host integration

1. Bind the generated SDK port:
   `configureCourseRuntimePort(createGeneratedCourseAppSdkPort(client))`
   (`@sdkwork/course-runtime` builds the client + port).
2. Import this package (its entry registers i18n).
3. Route the six pages under the host's `/course`-family paths.
