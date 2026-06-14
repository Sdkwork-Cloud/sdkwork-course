# SDKWork Course Database Contracts

This directory contains authored database design contracts for `sdkwork-course`.

`course-schema.contract.json` is the reviewed source for the professional online
course data model covering VOD courses, live online sessions, blended offerings,
enrollment, learning progress, comments, reactions, applications, and audit logs.
The checked migration in `crates/sdkwork-content-course-repository-sqlx/migrations`
must stay aligned with this contract.

## Status

- [x] SQL migration is aligned with `course-schema.contract.json`.
- [ ] Schema drift checks that compare SQL migrations with this contract before
      changing API or SDK surfaces.
