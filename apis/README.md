# SDKWork Course API Contracts

This directory contains authored API source contracts for `sdkwork-course`.
The route-manifest and OpenAPI materializer consumes these files to produce the
application-owned SDK authorities under `sdks/`.

Files in this directory are review inputs for the next API authority update and
must not contain generated SDK transport output.

## Surfaces

- `app-api/course/operations.json`: app/client operations for learners, course
  discovery, VOD learning, live sessions, progress, comments, reactions, and
  course applications.
- `backend-api/course/operations.json`: backend-admin operations for course
  management, instructors, offerings, lessons, live sessions, enrollments,
  progress repair, moderation, reports, and audit logs.
