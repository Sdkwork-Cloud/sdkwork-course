# SDKWork Course Module Plan

This plan records the authored module layout for the professional course system.
It is intentionally a skeleton handoff for implementation agents.

## Boundaries

- Course owns VOD course metadata, live course sessions, blended offerings,
  enrollment, learning progress, comments, reactions, course applications, and
  course audit logs.
- Appbase IAM owns login, tenant, organization, user, role, permission, and
  token-derived request context.
- Drive owns file upload, object storage lifecycle, download grants, and
  Drive-backed `MediaResource` delivery.
- Commerce or an integrating application owns purchase, subscription,
  settlement, refund, and entitlement source-of-truth.
- Live provider adapters own provider-specific room provisioning, short-lived
  join token creation, recording callbacks, and provider error normalization.

## Authored Files

- `specs/database/course-schema.contract.json`: table-level schema contract.
- `apis/app-api/course/operations.json`: app/client API operation plan.
- `apis/backend-api/course/operations.json`: backend-admin API operation plan.
- `sdks/_shared/course-contracts/src/course-domain.ts`:
  TypeScript domain constants and DTO interfaces for authored services.
- `sdks/_shared/course-contracts/src/course-api.ts`:
  TypeScript API operation constants for materialization and tests.
- `crates/sdkwork-content-course-service/src/domain/commands.rs`:
  Rust domain command/context skeletons.
- `crates/sdkwork-content-course-service/src/domain/models.rs`:
  Rust DTO and error skeletons.
- `crates/sdkwork-content-course-service/src/ports/repository.rs`:
  Rust repository trait skeleton.
- `crates/sdkwork-content-course-service/src/ports/provider.rs`:
  Rust integration port skeletons for Drive, live providers, entitlement, and
  audit/event publication.
- `crates/sdkwork-content-course-repository-sqlx/src/repository/course_repository.rs`:
  Rust SQLx repository skeleton.
- `crates/sdkwork-routes-course-app-api/src/manifest.rs` and
  `crates/sdkwork-routes-course-backend-api/src/manifest.rs`:
  Rust route manifest skeletons.

## Implementation Status

- [x] Service, repository, route, mapper, and integration modules are focused
      and allow later agents to fill behavior without rewriting the authored
      contract surface.
- [x] API operation plans are materialized into route manifests.
- [x] SQL migration is synchronized with the schema contract.
- [x] Placeholder tenant/organization values are replaced with typed
      `CourseServiceContext` inputs.
- [x] Permission and audit enforcement is added for backend write operations.

## Remaining Work

- Materialize API operation plans into OpenAPI 3.1.2 authority files and
  regenerate owner-only SDK families.
- Add dialect-specific database descriptors only when needed.
- Add comprehensive tests for all service and repository methods.
- Implement real provider port implementations (Drive, Live, Entitlement,
  Notification, Audit) when external service contracts are available.
