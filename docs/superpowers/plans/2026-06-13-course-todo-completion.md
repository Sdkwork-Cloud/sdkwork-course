# SDKWork Course TODO Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all TODO items across the 4-crate sdkwork-course workspace, producing a fully functional course management system with service layer, repository adapters, HTTP handlers, route manifests, and provider ports.

**Architecture:** Service crate owns business rules and port traits. Repository crate implements those traits with SQLx. Router crates are thin HTTP adapters that call service traits. Provider ports get no-op stubs for now. The critical architectural gap (router crates have zero dependency on service crate) is resolved by adding service crate dependency and wiring handlers through service trait objects.

**Tech Stack:** Rust 2021, SQLx (SQLite/Postgres), serde/serde_json, chrono, uuid. HTTP framework deferred (handlers return `serde_json::Value` until axum/actix-web is chosen).

---

## Phase 0: Architectural Decision Resolution

### Design Decision 1: Service-Repository Port Bridge

**Chosen: Option C — Adapter structs in repo crate that implement service-level port traits by delegating to `CourseSqlxRepositoryPort`.**

Rationale:
- Service crate defines clean port traits (e.g., `CourseCategoryRepository`) — these are the contract.
- Repository crate already has `CourseSqlxRepositoryPort` with 33 fully-implemented methods.
- Adapter structs in the repo crate implement the service-level port traits by delegating to the existing `CourseSqlxRepositoryPort` methods.
- This preserves the service-repo separation: service never imports repo crate, repo crate adapts to service contracts.

### Design Decision 2: HTTP Framework

**Chosen: Defer framework choice. Handlers return `CourseRouteResult<serde_json::Value>`.**

Rationale:
- No axum/actix-web dependency exists yet. Adding one is a separate decision.
- Handlers can be pure functions that take context + params and return JSON values.
- When a framework is chosen, handlers become thin wrappers around these functions.
- The `build_router()` function returns a placeholder `Value` until framework integration.

### Design Decision 3: Provider Ports

**Chosen: No-op stub implementations in the service crate's `test_support` module.**

Rationale:
- Provider ports (Drive, Live, Entitlement, Notification, Audit) are external integrations.
- No concrete implementations exist. Creating real ones requires external service contracts.
- No-op stubs allow the system to compile and handlers to be tested without external dependencies.
- Stubs return sensible defaults (pass-through for Drive validation, always-true for entitlement).

---

## Phase 1: Service Crate Port Trait Completion (15 todo!() → 0)

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/ports/repository.rs`
- Modify: `crates/sdkwork-content-course-service/src/ports/provider.rs`
- Create: `crates/sdkwork-content-course-service/src/test_support/mod.rs`
- Create: `crates/sdkwork-content-course-service/src/test_support/fakes.rs`
- Modify: `crates/sdkwork-content-course-service/src/lib.rs`

### Task 1.1: Remove default todo!() implementations from repository port traits

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/ports/repository.rs`

The service-level port traits currently have `todo!()` default implementations. These defaults are wrong — they should be removed so that implementors MUST provide real implementations. The traits become pure interface contracts.

- [ ] **Step 1:** Remove all `todo!()` default method bodies from all 10 repository port traits (`CourseCategoryRepository`, `CourseCatalogRepository`, `CourseOfferingRepository`, `CourseLessonRepository`, `CourseLiveSessionRepository`, `CourseEnrollmentRepository`, `CourseProgressRepository`, `CourseCommentRepository`, `CourseApplicationRepository`, `CourseAuditLogRepository`). Keep only the method signatures without bodies.

- [ ] **Step 2:** Run `cargo check -p sdkwork-content-course-service` to verify the service crate compiles with pure trait interfaces.

### Task 1.2: Remove default todo!() implementations from provider port traits

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/ports/provider.rs`

- [ ] **Step 1:** Remove all `todo!()` default method bodies from all 5 provider port traits (`CourseDrivePort`, `CourseLiveProviderPort`, `CourseEntitlementPort`, `CourseNotificationPort`, `CourseAuditEventPort`). Keep only the method signatures.

- [ ] **Step 2:** Run `cargo check -p sdkwork-content-course-service` to verify compilation.

### Task 1.3: Create no-op stub implementations for provider ports

**Files:**
- Create: `crates/sdkwork-content-course-service/src/test_support/mod.rs`
- Create: `crates/sdkwork-content-course-service/src/test_support/fakes.rs`
- Modify: `crates/sdkwork-content-course-service/src/lib.rs`

- [ ] **Step 1:** Create `test_support/mod.rs` with `pub mod fakes;`

- [ ] **Step 2:** Create `test_support/fakes.rs` with no-op stub structs implementing all 5 provider port traits:
  - `NoopDrivePort` — `validate_resource` returns the input unchanged, `issue_download_grant` returns a placeholder URL.
  - `NoopLiveProviderPort` — `reserve_room` returns a placeholder ref, `create_join_grant` returns a placeholder grant, `end_room` returns `Ok(())`.
  - `NoopEntitlementPort` — `verify_learning_access` returns `Ok(true)`.
  - `NoopNotificationPort` — `notify_live_session_change` returns `Ok(())`.
  - `NoopAuditEventPort` — `publish_audit_event` returns `Ok(())`.

- [ ] **Step 3:** Add `pub mod test_support;` to `lib.rs`.

- [ ] **Step 4:** Run `cargo check -p sdkwork-content-course-service` to verify compilation.

---

## Phase 2: Repository Crate Port Adapters (bridging CourseSqlxRepositoryPort → service port traits)

**Files:**
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/category_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/catalog_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/offering_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/lesson_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/live_session_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/enrollment_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/progress_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/comment_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/application_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/audit_adapter.rs`
- Modify: `crates/sdkwork-content-course-repository-sqlx/src/repository/mod.rs`
- Modify: `crates/sdkwork-content-course-repository-sqlx/src/lib.rs`

### Task 2.1: Create category repository adapter

**Files:**
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/category_adapter.rs`
- Modify: `crates/sdkwork-content-course-repository-sqlx/src/repository/mod.rs`

Pattern: Each adapter wraps a reference to `CourseSqlxRepositoryPort` (generic over pool type) and implements the corresponding service-level port trait by delegating to the existing SQLx methods.

- [ ] **Step 1:** Create `category_adapter.rs` with:
  ```rust
  use sdkwork_content_course_service::{CourseCategoryRepository, CourseCategoryItem, CourseQuery, CourseResult, CourseServiceContext};
  use super::course_repository::CourseSqlxRepositoryPort;

  pub struct CategoryRepositoryAdapter<R: CourseSqlxRepositoryPort> {
      repo: R,
  }

  impl<R: CourseSqlxRepositoryPort> CategoryRepositoryAdapter<R> {
      pub fn new(repo: R) -> Self { Self { repo } }
  }

  impl<R: CourseSqlxRepositoryPort> CourseCategoryRepository for CategoryRepositoryAdapter<R> {
      fn list_categories(&self, context: &CourseServiceContext, query: CourseQuery) -> CourseResult<Vec<CourseCategoryItem>> {
          // Delegate to CourseSqlxRepositoryPort::list_categories
          // Note: This is async, so we need to handle the Future. Since service traits are sync,
          // we'll need to adjust the approach — see Task 2.2 for the async bridge pattern.
          todo!("Implement async bridge")
      }
  }
  ```

- [ ] **Step 2:** Add `pub mod category_adapter;` to `repository/mod.rs`.

### Task 2.2: Resolve async/sync bridge for repository adapters

**Critical Design Issue:** The service-level port traits in `ports/repository.rs` define synchronous method signatures (return `CourseResult<T>`), but `CourseSqlxRepositoryPort` methods return `CourseRepositoryFuture<'a, T>` (async). This is a fundamental mismatch.

**Resolution:** The service-level port traits must be converted to async traits. This requires:

- [ ] **Step 1:** Add `async_trait` or use Rust native async traits (Rust 1.75+) to the service crate. Check the Rust edition (2021) and decide:
  - If using `async_trait` crate: add dependency to service crate Cargo.toml.
  - If using native async fn in traits: requires Rust 1.75+ which supports `async fn` in traits with `Send` bounds.

- [ ] **Step 2:** Update all 10 repository port trait methods in `ports/repository.rs` to be async:
  ```rust
  pub trait CourseCategoryRepository: Send + Sync {
      async fn list_categories(&self, context: &CourseServiceContext, query: CourseQuery) -> CourseResult<Vec<CourseCategoryItem>>;
  }
  ```

- [ ] **Step 3:** Update all 5 provider port trait methods in `ports/provider.rs` to be async.

- [ ] **Step 4:** Update `CourseServiceImpl` and `CourseApplicationService` trait in `course_service.rs` to use async methods.

- [ ] **Step 5:** Run `cargo check -p sdkwork-content-course-service` to verify.

### Task 2.3: Implement all 10 repository adapters

**Files:**
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/catalog_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/offering_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/lesson_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/live_session_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/enrollment_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/progress_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/comment_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/application_adapter.rs`
- Create: `crates/sdkwork-content-course-repository-sqlx/src/repository/audit_adapter.rs`
- Modify: `crates/sdkwork-content-course-repository-sqlx/src/repository/mod.rs`
- Modify: `crates/sdkwork-content-course-repository-sqlx/src/lib.rs`

Each adapter follows the same pattern:
```rust
pub struct XxxAdapter<R: CourseSqlxRepositoryPort> {
    repo: R,
}

impl<R: CourseSqlxRepositoryPort> XxxAdapter<R> {
    pub fn new(repo: R) -> Self { Self { repo } }
}

impl<R: CourseSqlxRepositoryPort + Send + Sync> XxxRepository for XxxAdapter<R> {
    async fn method(&self, ctx: &CourseServiceContext, ...) -> CourseResult<...> {
        self.repo.corresponding_method(ctx, ...).await
    }
}
```

- [ ] **Step 1:** Implement `catalog_adapter.rs` (implements `CourseCatalogRepository` — delegates `list_courses` to `repo.list_courses`, `save_course` to `repo.save_course`).
- [ ] **Step 2:** Implement `offering_adapter.rs` (implements `CourseOfferingRepository` — delegates `save_offering` to `repo.save_offering`, `publish_offering` to `repo.transition_offering`).
- [ ] **Step 3:** Implement `lesson_adapter.rs` (implements `CourseLessonRepository` — delegates `list_sections` to `repo.list_sections`, `save_lesson` to `repo.save_lesson`).
- [ ] **Step 4:** Implement `live_session_adapter.rs` (implements `CourseLiveSessionRepository` — delegates `save_live_session` to `repo.save_live_session`, `attach_replay_resource` to `repo.attach_live_replay`).
- [ ] **Step 5:** Implement `enrollment_adapter.rs` (implements `CourseEnrollmentRepository` — delegates `create_enrollment` to `repo.create_enrollment`, `revoke_enrollment` to `repo.revoke_enrollment`).
- [ ] **Step 6:** Implement `progress_adapter.rs` (implements `CourseProgressRepository` — delegates `upsert_lesson_progress` to `repo.upsert_lesson_progress`).
- [ ] **Step 7:** Implement `comment_adapter.rs` (implements `CourseCommentRepository` — delegates `list_comments` to `repo.list_comments`).
- [ ] **Step 8:** Implement `application_adapter.rs` (implements `CourseApplicationRepository` — delegates `list_applications` to `repo.list_applications`).
- [ ] **Step 9:** Implement `audit_adapter.rs` (implements `CourseAuditLogRepository` — delegates `append_audit_log` to `repo.append_audit_log`).
- [ ] **Step 10:** Update `category_adapter.rs` with the async bridge.
- [ ] **Step 11:** Add all adapter modules to `repository/mod.rs`.
- [ ] **Step 12:** Re-export adapter structs from `lib.rs`.
- [ ] **Step 13:** Run `cargo check -p sdkwork-content-course-repository-sqlx` to verify compilation.

---

## Phase 3: Service Layer Completion (3 incomplete methods → full)

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/service/course_service.rs`

### Task 3.1: Complete submit_application service method

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/service/course_service.rs:314-328`

Currently returns `Err(CourseError::invalid("Not implemented"))`. The repo crate already has `submit_application` implemented with real SQL.

- [ ] **Step 1:** Update `submit_application` to call `self.application_repo.submit_application(context, request)` (after the async trait migration from Phase 2).

- [ ] **Step 2:** Run `cargo check -p sdkwork-content-course-service`.

### Task 3.2: Complete review_application service method

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/service/course_service.rs:330-350`

Currently returns `Err(CourseError::invalid("Not implemented"))`. The repo crate already has `review_application` implemented.

- [ ] **Step 1:** Update `review_application` to call `self.application_repo.review_application(context, application_id, request)`.

- [ ] **Step 2:** Run `cargo check -p sdkwork-content-course-service`.

### Task 3.3: Complete reorder_sections service method

**Files:**
- Modify: `crates/sdkwork-content-course-service/src/service/course_service.rs:366-385`

Currently validates section ownership but returns sections as-is without calling the repo to persist the reorder.

- [ ] **Step 1:** After validation, call `self.lesson_repo.reorder_sections(context, course_id, section_ids)` to persist the reorder (if the service-level `CourseLessonRepository` trait has this method; if not, add it or use the repo adapter directly).

- [ ] **Step 2:** If `CourseLessonRepository` needs a `reorder_sections` method, add it to the trait in `ports/repository.rs`.

- [ ] **Step 3:** Run `cargo check -p sdkwork-content-course-service`.

---

## Phase 4: Router Crate Dependency Wiring

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/Cargo.toml`
- Modify: `crates/sdkwork-routes-course-backend-api/Cargo.toml`
- Modify: `crates/sdkwork-routes-course-app-api/src/error.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/error.rs`

### Task 4.1: Add service crate dependency to both router crates

- [ ] **Step 1:** Add to `crates/sdkwork-routes-course-app-api/Cargo.toml`:
  ```toml
  [dependencies]
  sdkwork-content-course-service = { path = "../sdkwork-content-course-service" }
  serde = { version = "1.0", features = ["derive"] }
  serde_json = "1.0"
  ```

- [ ] **Step 2:** Add to `crates/sdkwork-routes-course-backend-api/Cargo.toml`:
  ```toml
  [dependencies]
  sdkwork-content-course-service = { path = "../sdkwork-content-course-service" }
  serde = { version = "1.0", features = ["derive"] }
  serde_json = "1.0"
  ```

- [ ] **Step 3:** Run `cargo check -p sdkwork-routes-course-app-api` and `cargo check -p sdkwork-routes-course-backend-api`.

### Task 4.2: Update error types to support service error conversion

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/error.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/error.rs`

- [ ] **Step 1:** Add `From<CourseError>` implementation for `CourseRouteError` in both error.rs files:
  ```rust
  impl From<sdkwork_content_course_service::CourseError> for CourseRouteError {
      fn from(error: sdkwork_content_course_service::CourseError) -> Self {
          match error.code() {
              "not_found" => Self::not_found(error.message()),
              "storage" => Self {
                  code: "internal",
                  message: error.message().to_string(),
              },
              _ => Self::invalid(error.message()),
          }
      }
  }
  ```

- [ ] **Step 2:** Add RFC 9457 Problem Details struct and serialization:
  ```rust
  #[derive(Debug, Clone, Serialize)]
  pub struct ProblemDetail {
      pub r#type: String,
      pub title: String,
      pub status: u16,
      pub detail: String,
      pub instance: Option<String>,
  }

  impl CourseRouteError {
      pub fn to_problem_detail(&self) -> ProblemDetail {
          let status = match self.code {
              "not_found" => 404,
              "invalid" => 400,
              "internal" => 500,
              _ => 400,
          };
          ProblemDetail {
              r#type: format!("https://sdkwork.com/errors/{}", self.code),
              title: self.code.to_string(),
              status,
              detail: self.message.clone(),
              instance: None,
          }
      }
  }
  ```

- [ ] **Step 3:** Add `serde` derive to `CourseRouteError` or add `Serialize` import.

- [ ] **Step 4:** Run `cargo check` for both router crates.

---

## Phase 5: Request/Response Mapper Implementation

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/mapper/request.rs`
- Modify: `crates/sdkwork-routes-course-app-api/src/mapper/response.rs`
- Modify: `crates/sdkwork-routes-course-app-api/src/mapper/problem.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/mapper/request.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/mapper/response.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/mapper/problem.rs`

### Task 5.1: Implement app-api request mapper

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/mapper/request.rs`

- [ ] **Step 1:** Replace the pass-through `map_request` with typed functions that convert JSON request bodies into service commands:
  ```rust
  pub fn parse_course_query(params: &Value) -> CourseQuery { ... }
  pub fn parse_enrollment_command(body: &Value) -> CourseEnrollmentCommand { ... }
  pub fn parse_lesson_progress_command(body: &Value) -> CourseLessonProgressCommand { ... }
  pub fn parse_application_create_request(body: &Value) -> CourseApplicationCreateRequest { ... }
  // etc.
  ```

- [ ] **Step 2:** Each function deserializes from JSON, applies defaults, and returns the typed command.

### Task 5.2: Implement app-api response mapper

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/mapper/response.rs`

- [ ] **Step 1:** Replace the pass-through `map_response` with typed functions:
  ```rust
  pub fn course_page_to_json(page: CoursePage) -> Value { ... }
  pub fn course_item_to_json(item: CourseItem) -> Value { ... }
  pub fn category_list_to_json(items: Vec<CourseCategoryItem>) -> Value { ... }
  // etc.
  ```

- [ ] **Step 2:** Each function wraps the service result in the `CourseApiResult` envelope.

### Task 5.3: Implement app-api problem mapper

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/mapper/problem.rs`

- [ ] **Step 1:** Replace the pass-through `map_problem` with:
  ```rust
  pub fn route_error_to_problem(error: &CourseRouteError) -> Value {
      serde_json::to_value(error.to_problem_detail()).unwrap_or_default()
  }
  ```

### Task 5.4: Implement backend-api mappers (same pattern as app-api)

**Files:**
- Modify: `crates/sdkwork-routes-course-backend-api/src/mapper/request.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/mapper/response.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/mapper/problem.rs`

- [ ] **Step 1:** Implement backend-specific request parsers (includes instructor, category CRUD, offering management, section/lesson management, live session management, enrollment management, comment moderation, application review, audit log queries).

- [ ] **Step 2:** Implement backend-specific response formatters.

- [ ] **Step 3:** Implement problem mapper (same pattern as app-api).

---

## Phase 6: Handler Implementation — App-API (31 handlers)

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/handlers.rs`

### Task 6.1: Implement app-api handlers with service trait injection

Each handler follows this pattern:
```rust
pub fn handler_name(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    // path params, query params, body
) -> CourseRouteResult<Value> {
    let result = service.method(context, ...).await?;
    Ok(mapper::response::to_json(result))
}
```

Since we don't have an HTTP framework yet, handlers are pure functions that take a service reference and context.

- [ ] **Step 1:** Implement `course_categories_list` — calls `service.list_categories` (need to add this to the service trait or use a separate category service).

- [ ] **Step 2:** Implement `courses_list` — calls `service.list_courses`.

- [ ] **Step 3:** Implement `courses_retrieve` — needs a `retrieve_course` method on the service trait. Add it if missing.

- [ ] **Step 4:** Implement `course_offerings_list`, `course_offerings_retrieve`.

- [ ] **Step 5:** Implement `course_enrollments_create` — calls `service.enroll`.

- [ ] **Step 6:** Implement `course_enrollments_current_list`, `course_enrollments_retrieve`, `course_enrollments_cancel`.

- [ ] **Step 7:** Implement `course_sections_list`, `course_lessons_list`, `course_lessons_retrieve`.

- [ ] **Step 8:** Implement `course_lesson_resources_list`.

- [ ] **Step 9:** Implement `course_progress_retrieve`, `course_lesson_progress_update`, `course_lesson_progress_watch_positions_update`.

- [ ] **Step 10:** Implement `course_live_sessions_list`, `course_live_sessions_retrieve`, `course_live_sessions_join`, `course_live_sessions_heartbeat`, `course_live_sessions_leave`, `course_live_sessions_replay_retrieve`.

- [ ] **Step 11:** Implement `course_comments_list`, `course_comments_create`, `course_comments_delete`.

- [ ] **Step 12:** Implement `course_reactions_replace`, `course_reactions_delete`.

- [ ] **Step 13:** Implement `course_applications_create`, `course_applications_current_list`, `course_applications_retrieve`.

- [ ] **Step 14:** Run `cargo check -p sdkwork-routes-course-app-api`.

### Task 6.2: Add missing service trait methods

Some handlers need service methods not yet on `CourseApplicationService`:
- `list_categories` — delegate to category_repo
- `retrieve_course` — delegate to catalog_repo
- `list_sections` — delegate to lesson_repo
- `list_lessons` — delegate to lesson_repo (need to add)
- `retrieve_lesson` — need to add
- `list_enrollments` — need to add
- `list_live_sessions` — need to add
- `list_reactions` — need to add

- [ ] **Step 1:** Add missing methods to `CourseApplicationService` trait.
- [ ] **Step 2:** Implement them in `CourseServiceImpl`.

---

## Phase 7: Handler Implementation — Backend-API (57 handlers)

**Files:**
- Modify: `crates/sdkwork-routes-course-backend-api/src/handlers.rs`

### Task 7.1: Implement backend-api handlers

Same pattern as app-api but with admin/operator capabilities.

- [ ] **Step 1:** Implement category CRUD: `course_categories_list`, `course_categories_create`, `course_categories_update`, `course_categories_delete`, `course_categories_reorder`.

- [ ] **Step 2:** Implement instructor CRUD: `course_instructors_list`, `course_instructors_create`, `course_instructors_retrieve`, `course_instructors_update`, `course_instructors_status_update`.

- [ ] **Step 3:** Implement course CRUD + publish: `courses_list`, `courses_create`, `courses_retrieve`, `courses_update`, `courses_delete`, `courses_publish`, `courses_unpublish`.

- [ ] **Step 4:** Implement offering CRUD: `course_offerings_list`, `course_offerings_create`, `course_offerings_retrieve`, `course_offerings_update`, `course_offerings_publish`, `course_offerings_close`, `course_offerings_delete`.

- [ ] **Step 5:** Implement section CRUD: `course_sections_list`, `course_sections_create`, `course_sections_update`, `course_sections_delete`, `course_sections_reorder`.

- [ ] **Step 6:** Implement lesson CRUD: `course_lessons_list`, `course_lessons_create`, `course_lessons_retrieve`, `course_lessons_update`, `course_lessons_delete`, `course_lessons_reorder`.

- [ ] **Step 7:** Implement resource CRUD: `course_resources_list`, `course_resources_create`, `course_resources_update`, `course_resources_delete`.

- [ ] **Step 8:** Implement live session management: `course_live_sessions_list`, `course_live_sessions_create`, `course_live_sessions_retrieve`, `course_live_sessions_update`, `course_live_sessions_start`, `course_live_sessions_end`, `course_live_sessions_cancel`, `course_live_sessions_replay_attach`, `course_live_sessions_replay_publish`.

- [ ] **Step 9:** Implement enrollment management: `course_enrollments_list`, `course_enrollments_grant`, `course_enrollments_revoke`.

- [ ] **Step 10:** Implement progress management: `course_progress_list`, `course_progress_retrieve`, `course_lesson_progress_repair`.

- [ ] **Step 11:** Implement comment moderation: `course_comments_list`, `course_comments_moderate`, `course_comments_delete`.

- [ ] **Step 12:** Implement reaction list: `course_reactions_list`.

- [ ] **Step 13:** Implement application management: `course_applications_list`, `course_applications_retrieve`, `course_applications_review`, `course_applications_convert_to_course`.

- [ ] **Step 14:** Implement reports: `course_reports_overview_retrieve`, `course_reports_learning_list`, `course_reports_live_sessions_list`.

- [ ] **Step 15:** Implement audit logs: `course_audit_logs_list`, `course_audit_logs_retrieve`.

- [ ] **Step 16:** Run `cargo check -p sdkwork-routes-course-backend-api`.

---

## Phase 8: Route Manifest Implementation

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/manifest.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/manifest.rs`

### Task 8.1: Implement app-api route manifest

- [ ] **Step 1:** Read `apis/app-api/course/operations.json` to get the full operation list.

- [ ] **Step 2:** Implement `build_route_manifest()` to return a JSON object with all app-api operations:
  ```json
  {
    "kind": "sdkwork.route.manifest",
    "schemaVersion": 1,
    "package": "sdkwork-routes-course-app-api",
    "surface": "app-api",
    "prefix": "/app/v3/api",
    "operations": [
      {
        "operationId": "course_categories_list",
        "method": "GET",
        "path": "/course_categories",
        "handler": "course_categories_list"
      },
      ...
    ]
  }
  ```

- [ ] **Step 3:** Run `cargo check -p sdkwork-routes-course-app-api`.

### Task 8.2: Implement backend-api route manifest

- [ ] **Step 1:** Read `apis/backend-api/course/operations.json`.

- [ ] **Step 2:** Implement `build_route_manifest()` with all backend-api operations.

- [ ] **Step 3:** Run `cargo check -p sdkwork-routes-course-backend-api`.

---

## Phase 9: Router/Route Builder Implementation

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/routes.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/routes.rs`

### Task 9.1: Implement app-api route builder

- [ ] **Step 1:** Since no HTTP framework is chosen, `build_router()` returns a `serde_json::Value` describing the route table:
  ```rust
  pub fn build_router() -> Value {
      let manifest = build_route_manifest();
      // Return the manifest as the "router" — a framework adapter can consume this later
      manifest
  }
  ```

- [ ] **Step 2:** Run `cargo check -p sdkwork-routes-course-app-api`.

### Task 9.2: Implement backend-api route builder

- [ ] **Step 1:** Same pattern as app-api.

- [ ] **Step 2:** Run `cargo check -p sdkwork-routes-course-backend-api`.

---

## Phase 10: Path Expansion

**Files:**
- Modify: `crates/sdkwork-routes-course-app-api/src/paths.rs`
- Modify: `crates/sdkwork-routes-course-backend-api/src/paths.rs`

### Task 10.1: Add missing path constants for all operations

- [ ] **Step 1:** Add sub-resource paths to app-api `paths.rs`:
  ```rust
  pub const COURSE_CATEGORIES_RETRIEVE_PATH: &str = "/course_categories/{categoryId}";
  pub const COURSES_RETRIEVE_PATH: &str = "/courses/{courseId}";
  pub const COURSE_OFFERINGS_RETRIEVE_PATH: &str = "/course_offerings/{offeringId}";
  // ... etc for all parameterized paths
  ```

- [ ] **Step 2:** Add sub-resource paths to backend-api `paths.rs`.

---

## Phase 11: Workspace Verification

### Task 11.1: Full workspace compilation

- [ ] **Step 1:** Run `cargo check --workspace` to verify all 4 crates compile.
- [ ] **Step 2:** Fix any compilation errors.

### Task 11.2: Run existing tests

- [ ] **Step 1:** Run `cargo test -p sdkwork-content-course-service` — verify existing tests pass.
- [ ] **Step 2:** Run `cargo test -p sdkwork-routes-course-app-api` — verify existing tests pass.
- [ ] **Step 3:** Run `cargo test -p sdkwork-routes-course-backend-api` — verify existing tests pass.
- [ ] **Step 4:** Run `cargo test --workspace`.

### Task 11.3: Format and lint

- [ ] **Step 1:** Run `cargo fmt --all --check`.
- [ ] **Step 2:** Run `cargo clippy --workspace --tests -- -D warnings`.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Async trait compatibility | HIGH | Use `async_trait` crate or Rust 1.75+ native async traits. Test early in Phase 2. |
| Service trait method count explosion | MEDIUM | Keep `CourseApplicationService` focused. Use separate service structs for admin-only operations if needed. |
| Handler parameter extraction without framework | MEDIUM | Handlers take explicit parameters. When framework is added, extractors map to these parameters. |
| Missing operations in operations.json | LOW | Cross-reference handler list with operations.json. Add missing operations. |
| Repository adapter type complexity | MEDIUM | Use `dyn CourseSqlxRepositoryPort` with trait objects instead of generics if type bounds get unwieldy. |

---

## Verification Commands

```bash
# Per-crate checks
cargo check -p sdkwork-content-course-service
cargo check -p sdkwork-content-course-repository-sqlx
cargo check -p sdkwork-routes-course-app-api
cargo check -p sdkwork-routes-course-backend-api

# Full workspace
cargo check --workspace
cargo test --workspace
cargo fmt --all --check
cargo clippy --workspace --tests -- -D warnings
```

---

## Summary of TODO Items Resolved

| Category | Count | Phase |
|----------|-------|-------|
| Service port trait defaults (todo!()) | 15 | Phase 1 |
| Provider port stubs | 5 new files | Phase 1 |
| Repository adapters | 10 new files | Phase 2 |
| Service incomplete methods | 3 | Phase 3 |
| Router dependency wiring | 2 Cargo.toml + 2 error.rs | Phase 4 |
| Mapper implementations | 6 files | Phase 5 |
| App-api handlers | 31 | Phase 6 |
| Backend-api handlers | 57 | Phase 7 |
| Route manifests | 2 | Phase 8 |
| Route builders | 2 | Phase 9 |
| Path expansion | 2 | Phase 10 |
| **Total todo!() eliminated** | **~113** | |
