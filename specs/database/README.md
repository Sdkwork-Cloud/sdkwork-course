# SDKWork Course Database Contracts

Machine-readable database design contracts for `sdkwork-course`.

- `course-schema.contract.json` — reviewed source for the professional online course data model (VOD, live, blended offerings, enrollment, progress, comments, reactions, applications, audit logs).

## Canonical lifecycle assets

Runtime schema authority lives in the application-root `database/` directory per `DATABASE_FRAMEWORK_SPEC.md`:

- `database/ddl/baseline/{engine}/0001_course_baseline.sql` — greenfield baseline DDL
- `database/migrations/{engine}/` — post-GA incremental changes only (empty at initialization)
- `database/database.manifest.json` — module identity for `sdkwork-database` CLI

Do not add new schema files under `specs/database/`. Update baseline DDL and re-materialize contracts instead.

## Verification

```bash
pnpm run db:validate
pnpm run db:materialize:contract
pnpm run db:drift:check
```

The SQLx repository tests apply `database/ddl/baseline/sqlite/0001_course_baseline.sql` directly; application services must not embed legacy migration helpers.
