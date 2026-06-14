# sdkwork-content-course-repository-sqlx

Domain: content  
Capability: course  
Package type: rust-crate  
Status: standard

This crate owns SQLx persistence for SDKWork course data, including the portable migration for VOD, live course, enrollment, progress, comments, reactions, applications, and audit records.

## Public API

- `SqliteCourseRepository`
- `PostgresCourseRepository`
- `CourseSqlxRepositoryPort`

## Verification

- `cargo test -p sdkwork-content-course-repository-sqlx`
