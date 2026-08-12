#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const courseRoot = path.resolve(import.meta.dirname, '..', '..');
const sourcePath = path.join(
  courseRoot,
  'crates/sdkwork-content-course-repository-sqlx/src/repository/adapters.rs',
);
const outputPath = path.join(
  courseRoot,
  'crates/sdkwork-content-course-repository-sqlx/src/repository/postgres_adapters.rs',
);

function translateRawSqlLiterals(source) {
  return source.replace(/r#"([\s\S]*?)"#/gu, (_match, sql) => {
    const translated = sql.replace(/\?(\d+)/gu, (_, index) => `$${index}`);
    return `r#"${translated}"#`;
  });
}

let source = fs.readFileSync(sourcePath, 'utf8');
// Guard against silent no-op generation: postgres_adapters.rs is hand-maintained
// since the sqlite template impl block was removed. If the source marker is
// missing the script must fail loudly instead of overwriting the file with a
// stripped skeleton.
const sourceMarker =
  'use super::course_repository::{CourseSqlxRepositoryPort, SqliteCourseRepository};';
if (!source.includes(sourceMarker)) {
  throw new Error(
    'Could not locate SqliteCourseRepository adapter template in adapters.rs; ' +
      'postgres_adapters.rs is hand-maintained and must not be overwritten',
  );
}
source = source.replace(
  sourceMarker,
  'use super::course_repository::{CourseSqlxRepositoryPort, PostgresCourseRepository};',
);
source = source.replaceAll('SqliteCourseRepository', 'PostgresCourseRepository');
source = translateRawSqlLiterals(source);
source = `//! Generated Postgres repository adapter implementations.
//! Source: scripts/dev/generate-course-postgres-adapters.mjs

${source}`;

fs.writeFileSync(outputPath, source);
console.log(`generated ${outputPath}`);
