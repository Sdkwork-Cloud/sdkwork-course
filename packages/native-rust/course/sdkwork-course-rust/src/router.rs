use std::sync::Arc;

use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use sqlx::{PgPool, SqlitePool};

use crate::storage::{CourseStore, EmptyCourseStore, PostgresCourseStore, SqliteCourseStore};
use crate::types::{
    CourseApiResult, CourseApplicationCreateRequest, CourseApplicationReviewRequest,
    CourseCommentModerationRequest, CourseError, CourseLessonMutationRequest, CourseMutationRequest,
    CourseQuery, CourseRelationsReplaceRequest, CourseSectionMutationRequest,
};

#[derive(Clone)]
struct CourseRouterState {
    store: Arc<dyn CourseStore + Send + Sync>,
}

pub fn course_router() -> Router {
    course_router_with_store(Arc::new(EmptyCourseStore))
}

pub fn course_router_with_sqlite_pool(pool: SqlitePool) -> Router {
    course_router_with_store(Arc::new(SqliteCourseStore::new(pool)))
}

pub fn course_router_with_postgres_pool(pool: PgPool) -> Router {
    course_router_with_store(Arc::new(PostgresCourseStore::new(pool)))
}

pub fn course_router_with_store(store: Arc<dyn CourseStore + Send + Sync>) -> Router {
    let state = CourseRouterState { store };
    Router::new()
        .route("/app/v3/api/course_applications", post(create_application))
        .route("/app/v3/api/courses", get(list_courses))
        .route("/app/v3/api/courses/categories", get(list_categories))
        .route("/app/v3/api/courses/{courseId}", get(get_course))
        .route("/app/v3/api/courses/{courseId}/lessons", get(list_lessons))
        .route("/app/v3/api/courses/{courseId}/relations", get(list_relations))
        .route("/app/v3/api/courses/{courseId}/sections", get(list_sections))
        .route("/backend/v3/api/course_applications", get(list_applications))
        .route(
            "/backend/v3/api/course_applications/{applicationId}/review",
            patch(review_application),
        )
        .route("/backend/v3/api/course_lessons/{lessonId}", delete(delete_lesson).patch(update_lesson))
        .route("/backend/v3/api/course_sections/{sectionId}", delete(delete_section).patch(update_section))
        .route("/backend/v3/api/courses", get(list_courses).post(create_course))
        .route("/backend/v3/api/courses/comments", get(list_comments))
        .route(
            "/backend/v3/api/courses/comments/{commentId}/moderation",
            patch(moderate_comment),
        )
        .route("/backend/v3/api/courses/engagement", get(list_engagement))
        .route("/backend/v3/api/courses/{courseId}", delete(delete_course).patch(update_course))
        .route("/backend/v3/api/courses/{courseId}/lessons", get(list_lessons).post(create_lesson))
        .route("/backend/v3/api/courses/{courseId}/relations", get(list_relations).put(replace_relations))
        .route("/backend/v3/api/courses/{courseId}/sections", get(list_sections).post(create_section))
        .with_state(state)
}

async fn list_categories(State(state): State<CourseRouterState>, Query(query): Query<CourseQuery>) -> Response {
    respond(state.store.list_categories(query.status).await)
}

async fn list_courses(State(state): State<CourseRouterState>, Query(query): Query<CourseQuery>) -> Response {
    respond(state.store.list_courses(query).await)
}

async fn get_course(State(state): State<CourseRouterState>, Path(course_id): Path<String>) -> Response {
    match state.store.get_course(course_id).await {
        Ok(Some(item)) => Json(CourseApiResult::success(item)).into_response(),
        Ok(None) => not_found_response("course was not found"),
        Err(error) => error_response(error),
    }
}

async fn list_sections(
    State(state): State<CourseRouterState>,
    Path(course_id): Path<String>,
    Query(query): Query<CourseQuery>,
) -> Response {
    respond(state.store.list_sections(course_id, query.status).await)
}

async fn list_lessons(
    State(state): State<CourseRouterState>,
    Path(course_id): Path<String>,
    Query(query): Query<CourseQuery>,
) -> Response {
    respond(state.store.list_lessons(course_id, query.status).await)
}

async fn list_relations(State(state): State<CourseRouterState>, Path(course_id): Path<String>) -> Response {
    respond(state.store.list_relations(course_id).await)
}

async fn create_application(
    State(state): State<CourseRouterState>,
    Json(request): Json<CourseApplicationCreateRequest>,
) -> Response {
    respond(state.store.create_application(request).await)
}

async fn list_applications(State(state): State<CourseRouterState>, Query(query): Query<CourseQuery>) -> Response {
    respond(state.store.list_applications(query).await)
}

async fn review_application(
    State(state): State<CourseRouterState>,
    Path(application_id): Path<String>,
    Json(request): Json<CourseApplicationReviewRequest>,
) -> Response {
    respond(state.store.review_application(application_id, request).await)
}

async fn create_course(
    State(state): State<CourseRouterState>,
    Json(request): Json<CourseMutationRequest>,
) -> Response {
    respond(state.store.create_course(request).await)
}

async fn update_course(
    State(state): State<CourseRouterState>,
    Path(course_id): Path<String>,
    Json(request): Json<CourseMutationRequest>,
) -> Response {
    respond(state.store.update_course(course_id, request).await)
}

async fn delete_course(State(state): State<CourseRouterState>, Path(course_id): Path<String>) -> Response {
    respond(state.store.delete_course(course_id).await)
}

async fn create_section(
    State(state): State<CourseRouterState>,
    Path(course_id): Path<String>,
    Json(request): Json<CourseSectionMutationRequest>,
) -> Response {
    respond(state.store.create_section(course_id, request).await)
}

async fn update_section(
    State(state): State<CourseRouterState>,
    Path(section_id): Path<String>,
    Json(request): Json<CourseSectionMutationRequest>,
) -> Response {
    respond(state.store.update_section(section_id, request).await)
}

async fn delete_section(State(state): State<CourseRouterState>, Path(section_id): Path<String>) -> Response {
    respond(state.store.delete_section(section_id).await)
}

async fn create_lesson(
    State(state): State<CourseRouterState>,
    Path(course_id): Path<String>,
    Json(request): Json<CourseLessonMutationRequest>,
) -> Response {
    respond(state.store.create_lesson(course_id, request).await)
}

async fn update_lesson(
    State(state): State<CourseRouterState>,
    Path(lesson_id): Path<String>,
    Json(request): Json<CourseLessonMutationRequest>,
) -> Response {
    respond(state.store.update_lesson(lesson_id, request).await)
}

async fn delete_lesson(State(state): State<CourseRouterState>, Path(lesson_id): Path<String>) -> Response {
    respond(state.store.delete_lesson(lesson_id).await)
}

async fn replace_relations(
    State(state): State<CourseRouterState>,
    Path(course_id): Path<String>,
    Json(request): Json<CourseRelationsReplaceRequest>,
) -> Response {
    respond(state.store.replace_relations(course_id, request.items).await)
}

async fn list_comments(State(state): State<CourseRouterState>, Query(query): Query<CourseQuery>) -> Response {
    respond(state.store.list_comments(query).await)
}

async fn moderate_comment(
    State(state): State<CourseRouterState>,
    Path(comment_id): Path<String>,
    Json(request): Json<CourseCommentModerationRequest>,
) -> Response {
    respond(state.store.moderate_comment(comment_id, request).await)
}

async fn list_engagement(State(state): State<CourseRouterState>, Query(query): Query<CourseQuery>) -> Response {
    respond(state.store.list_engagement(query).await)
}

fn respond<T>(result: Result<T, CourseError>) -> Response
where
    T: serde::Serialize,
{
    match result {
        Ok(data) => Json(CourseApiResult::success(data)).into_response(),
        Err(error) => error_response(error),
    }
}

fn error_response(error: CourseError) -> Response {
    match error.code() {
        "invalid" => (
            StatusCode::BAD_REQUEST,
            Json(CourseApiResult::error("4001", error.message())),
        )
            .into_response(),
        "not_found" => not_found_response(error.message()),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(CourseApiResult::error("5000", error.message())),
        )
            .into_response(),
    }
}

fn not_found_response(message: impl Into<String>) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(CourseApiResult::error("4040", message)),
    )
        .into_response()
}
