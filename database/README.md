# COURSE Database Module

Canonical lifecycle assets for `sdkwork-course` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `course`
- serviceCode: `COURSE`
- tablePrefix: `course_`

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
```

Legacy SQL: `crates/sdkwork-content-course-repository-sqlx/migrations/0001_course_foundation.sql` → `database/ddl/baseline/postgres/0001_course_legacy_baseline.sql`

Runtime bootstrap: `sdkwork-course-database-host` / `connect_and_bootstrap_course_database_from_env()`. SQLite tests continue to use `apply_foundation_migration()`.
