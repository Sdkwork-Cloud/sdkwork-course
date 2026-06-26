import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const courseRoot = path.resolve(import.meta.dirname, "..");

const requiredDesignFiles = [
  "apis/README.md",
  "apis/app-api/course/operations.json",
  "apis/backend-api/course/operations.json",
  "specs/database/course-schema.contract.json",
  "specs/database/README.md",
  "specs/design/course-module-plan.md",
  "sdks/_shared/course-contracts/src/course-domain.ts",
  "sdks/_shared/course-contracts/src/course-api.ts",
  "crates/sdkwork-content-course-service/src/domain/commands.rs",
  "crates/sdkwork-content-course-service/src/domain/models.rs",
  "crates/sdkwork-content-course-service/src/ports/repository.rs",
  "crates/sdkwork-content-course-service/src/ports/provider.rs",
  "crates/sdkwork-content-course-service/src/service/course_service.rs",
  "crates/sdkwork-content-course-repository-sqlx/src/db/schema.rs",
  "crates/sdkwork-content-course-repository-sqlx/src/repository/course_repository.rs",
  "crates/sdkwork-routes-course-app-api/src/manifest.rs",
  "crates/sdkwork-routes-course-backend-api/src/manifest.rs",
];

const requiredTables = [
  "course_category",
  "course_instructor",
  "course_catalog",
  "course_offering",
  "course_section",
  "course_lesson",
  "course_resource_ref",
  "course_live_session",
  "course_enrollment",
  "course_learning_progress",
  "course_lesson_progress",
  "course_comment",
  "course_reaction",
  "course_application",
  "course_audit_log",
];

const requiredAppOperations = [
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
];

const requiredBackendOperations = [
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
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(courseRoot, relativePath), "utf8"));
}

test("course design contract files exist", () => {
  const missingFiles = requiredDesignFiles.filter((relativePath) => !fs.existsSync(path.join(courseRoot, relativePath)));
  assert.deepEqual(missingFiles, []);
});

test("course database contract defines the professional VOD and live course core tables", () => {
  const contract = readJson("specs/database/course-schema.contract.json");
  assert.equal(contract.kind, "sdkwork.course.database.contract");
  assert.equal(contract.domain, "content");
  assert.equal(contract.capability, "course");

  const tables = new Map(contract.tables.map((table) => [table.name, table]));
  assert.deepEqual(requiredTables.filter((tableName) => !tables.has(tableName)), []);

  for (const tableName of requiredTables) {
    const table = tables.get(tableName);
    assert.ok(table.profile, `${tableName} must declare a table profile`);
    assert.ok(table.writeOwner, `${tableName} must declare a write owner`);
    assert.ok(table.lifecycle, `${tableName} must declare lifecycle policy`);
    assert.ok(table.columns.some((column) => column.name === "tenant_id"), `${tableName} must include tenant_id`);
    assert.ok(table.columns.some((column) => column.name === "status"), `${tableName} must include status`);
    assert.ok(table.indexes.length > 0, `${tableName} must include query indexes`);
  }
});

test("course API operation lists define complete app and backend surfaces", () => {
  const app = readJson("apis/app-api/course/operations.json");
  const backend = readJson("apis/backend-api/course/operations.json");

  assert.equal(app.apiAuthority, "sdkwork-course-app-api");
  assert.equal(app.apiPrefix, "/app/v3/api");
  assert.equal(backend.apiAuthority, "sdkwork-course-backend-api");
  assert.equal(backend.apiPrefix, "/backend/v3/api");

  const appOperationIds = app.operations.map((operation) => operation.operationId).sort();
  const backendOperationIds = backend.operations.map((operation) => operation.operationId).sort();
  assert.deepEqual(requiredAppOperations.filter((operationId) => !appOperationIds.includes(operationId)), []);
  assert.deepEqual(requiredBackendOperations.filter((operationId) => !backendOperationIds.includes(operationId)), []);

  for (const operation of [...app.operations, ...backend.operations]) {
    assert.ok(operation.method, `${operation.operationId} must declare method`);
    assert.ok(operation.path, `${operation.operationId} must declare path`);
    assert.ok(operation.resource, `${operation.operationId} must declare resource`);
    assert.ok(operation.authMode, `${operation.operationId} must declare authMode`);
    assert.ok(operation.todo, `${operation.operationId} must include TODO guidance`);
  }
});

test("course authored module skeletons include TODO implementation guidance", () => {
  for (const relativePath of [
    "sdks/_shared/course-contracts/src/course-domain.ts",
    "sdks/_shared/course-contracts/src/course-api.ts",
    "crates/sdkwork-content-course-service/src/domain/commands.rs",
    "crates/sdkwork-content-course-service/src/domain/models.rs",
    "crates/sdkwork-content-course-service/src/ports/repository.rs",
    "crates/sdkwork-content-course-service/src/ports/provider.rs",
    "crates/sdkwork-content-course-service/src/service/course_service.rs",
    "crates/sdkwork-content-course-repository-sqlx/src/db/schema.rs",
    "crates/sdkwork-content-course-repository-sqlx/src/repository/course_repository.rs",
    "crates/sdkwork-routes-course-app-api/src/manifest.rs",
    "crates/sdkwork-routes-course-backend-api/src/manifest.rs",
  ]) {
    const source = fs.readFileSync(path.join(courseRoot, relativePath), "utf8");
    assert.match(source, /TODO\(course\)/u, `${relativePath} must include TODO(course) implementation notes`);
  }
});

test("course Rust implementation uses SDKWork crates responsibility layout", () => {
  const cargo = fs.readFileSync(path.join(courseRoot, "Cargo.toml"), "utf8");
  for (const member of [
    "crates/sdkwork-content-course-service",
    "crates/sdkwork-content-course-repository-sqlx",
    "crates/sdkwork-routes-course-app-api",
    "crates/sdkwork-routes-course-backend-api",
  ]) {
    assert.ok(cargo.includes(member), `Cargo workspace must include ${member}`);
  }

  assert.ok(
    !fs.existsSync(path.join(courseRoot, "packages/native-rust/course/sdkwork-course-rust/Cargo.toml")),
    "non-standard packages/native-rust/course/sdkwork-course-rust crate must be removed",
  );
  assert.ok(
    !fs.existsSync(path.join(courseRoot, "packages")),
    "application root must not keep top-level packages/ as a generic workspace directory",
  );
});
