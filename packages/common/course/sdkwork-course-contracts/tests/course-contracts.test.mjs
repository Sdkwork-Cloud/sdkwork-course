import assert from "node:assert/strict";
import test from "node:test";

import {
  SDKWORK_COURSE_APP_OPERATIONS,
  SDKWORK_COURSE_BACKEND_OPERATIONS,
  SDKWORK_COURSE_STANDARD,
  SDKWORK_COURSE_TABLES,
} from "../src/index.ts";

test("course contract declares canonical v3 app and backend prefixes", () => {
  assert.equal(SDKWORK_COURSE_STANDARD.api.appPrefix, "/app/v3/api");
  assert.equal(SDKWORK_COURSE_STANDARD.api.backendPrefix, "/backend/v3/api");
  assert.equal(SDKWORK_COURSE_STANDARD.api.openapi, "3.1.2");
});

test("course contract exposes learning content and governance operations", () => {
  assert.equal(SDKWORK_COURSE_APP_OPERATIONS.coursesList.operationId, "courses.list");
  assert.equal(SDKWORK_COURSE_APP_OPERATIONS.courseApplicationsCreate.operationId, "courseApplications.create");
  assert.equal(SDKWORK_COURSE_BACKEND_OPERATIONS.courseLessonsCreate.operationId, "courseLessons.create");
  assert.equal(SDKWORK_COURSE_BACKEND_OPERATIONS.courseApplicationsReview.operationId, "courseApplications.review");
});

test("course contract owns only course tables", () => {
  assert.deepEqual(Object.values(SDKWORK_COURSE_TABLES).sort(), [
    "course_application",
    "course_audit_log",
    "course_catalog",
    "course_category",
    "course_comment",
    "course_lesson",
    "course_reaction",
    "course_relation",
    "course_section",
  ]);
});
