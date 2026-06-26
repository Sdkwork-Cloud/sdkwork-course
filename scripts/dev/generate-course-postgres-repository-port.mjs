#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const courseRoot = path.resolve(import.meta.dirname, '..', '..');
const sourcePath = path.join(
  courseRoot,
  'crates/sdkwork-content-course-repository-sqlx/src/repository/course_repository.rs',
);
const outputPath = path.join(
  courseRoot,
  'crates/sdkwork-content-course-repository-sqlx/src/repository/postgres_course_repository_port.rs',
);

const source = fs.readFileSync(sourcePath, 'utf8');
const startMarker = 'impl CourseSqlxRepositoryPort for SqliteCourseRepository {';
const endMarker = '\n}\n\nfn sqlx_storage_error';

const startIndex = source.indexOf(startMarker);
const endIndex = source.indexOf(endMarker, startIndex);

if (startIndex < 0 || endIndex < 0) {
  throw new Error('Could not locate SqliteCourseRepository port implementation block');
}

let implBlock = source.slice(startIndex, endIndex + 2);
implBlock = implBlock.replace(
  'impl CourseSqlxRepositoryPort for SqliteCourseRepository',
  'impl CourseSqlxRepositoryPort for PostgresCourseRepository',
);
implBlock = implBlock.replace(/\?(\d+)/gu, (_, index) => `$${index}`);
implBlock = implBlock.replace(/&self\.pool\b/gu, 'self.pool()');
implBlock = implBlock.replace(/\bself\.pool\./gu, 'self.pool().');

const output = `//! Generated Postgres \`CourseSqlxRepositoryPort\` implementation.
//! Source: scripts/dev/generate-course-postgres-repository-port.mjs

use serde_json::Value;
use sqlx::Row;

use sdkwork_content_course_service::{
    CourseApplicationCreateRequest, CourseApplicationItem, CourseApplicationReviewRequest,
    CourseAuditCommand, CourseAuditLogItem, CourseCatalogCommand, CourseCategoryItem,
    CourseCommentItem, CourseCommentModerationRequest, CourseEnrollmentCommand, CourseError,
    CourseItem, CourseLessonCommand, CourseLessonItem, CourseLessonProgressCommand,
    CourseLiveSessionCommand, CourseOfferingCommand, CoursePage, CourseQuery,
    CourseSectionItem, CourseServiceContext,
};

use super::course_repository::{
    CourseRepositoryFuture, CourseSqlxRepositoryPort, PostgresCourseRepository,
};

fn sqlx_storage_error(error: sqlx::Error) -> CourseError {
    CourseError::storage(error.to_string())
}

${implBlock}
`;

fs.writeFileSync(outputPath, output);
console.log(`generated ${outputPath}`);
