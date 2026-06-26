use std::collections::BTreeMap;

use axum::{
    extract::{Path, Query, State},
    Json,
};
use sdkwork_routes_course_http_auth::course_service_context_from_web;
use sdkwork_web_core::WebRequestContext;
use serde_json::Value;

use crate::error::CourseRouteError;
use crate::handlers;
use crate::service_state::{success_response, CourseBackendApiState};

macro_rules! course_handler_ctx {
    ($state:expr, $app_ctx:expr, $handler:ident) => {{
        let context = course_service_context_from_web(&$app_ctx)?;
        let service = $state.service();
        Ok(success_response(
            handlers::$handler(service.as_ref(), &context).await?,
        ))
    }};
}

macro_rules! course_handler_query {
    ($state:expr, $app_ctx:expr, $query:expr, $handler:ident) => {{
        let context = course_service_context_from_web(&$app_ctx)?;
        let service = $state.service();
        let params = serde_json::to_value($query.0).unwrap_or(Value::Null);
        let course_query = crate::mapper::request::parse_course_query(&params);
        Ok(success_response(
            handlers::$handler(service.as_ref(), &context, course_query).await?,
        ))
    }};
}

macro_rules! course_handler_path {
    ($state:expr, $app_ctx:expr, $path:expr, $handler:ident) => {{
        let context = course_service_context_from_web(&$app_ctx)?;
        let service = $state.service();
        Ok(success_response(
            handlers::$handler(service.as_ref(), &context, $path).await?,
        ))
    }};
}

macro_rules! course_handler_path_body {
    ($state:expr, $app_ctx:expr, $path:expr, $body:expr, $handler:ident) => {{
        let context = course_service_context_from_web(&$app_ctx)?;
        let service = $state.service();
        Ok(success_response(
            handlers::$handler(service.as_ref(), &context, $path, $body.0).await?,
        ))
    }};
}

macro_rules! course_handler_body {
    ($state:expr, $app_ctx:expr, $body:expr, $handler:ident) => {{
        let context = course_service_context_from_web(&$app_ctx)?;
        let service = $state.service();
        Ok(success_response(
            handlers::$handler(service.as_ref(), &context, $body.0).await?,
        ))
    }};
}

pub async fn course_categories_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_categories_list)
}

pub async fn course_categories_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_categories_create)
}

pub async fn course_categories_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(category_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, category_id, body, course_categories_update)
}

pub async fn course_categories_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(category_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, category_id, course_categories_delete)
}

pub async fn course_categories_reorder(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_categories_reorder)
}

pub async fn course_instructors_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_instructors_list)
}

pub async fn course_instructors_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_instructors_create)
}

pub async fn course_instructors_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(instructor_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, instructor_id, course_instructors_retrieve)
}

pub async fn course_instructors_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(instructor_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, instructor_id, body, course_instructors_update)
}

pub async fn course_instructors_status_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(instructor_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, instructor_id, body, course_instructors_status_update)
}

pub async fn courses_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, courses_list)
}

pub async fn courses_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, courses_create)
}

pub async fn courses_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, courses_retrieve)
}

pub async fn courses_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, courses_update)
}

pub async fn courses_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, courses_delete)
}

pub async fn courses_publish(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, courses_publish)
}

pub async fn courses_unpublish(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, courses_unpublish)
}

pub async fn course_offerings_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, course_offerings_list)
}

pub async fn course_offerings_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, course_offerings_create)
}

pub async fn course_offerings_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, offering_id, course_offerings_retrieve)
}

pub async fn course_offerings_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, offering_id, body, course_offerings_update)
}

pub async fn course_offerings_publish(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, offering_id, course_offerings_publish)
}

pub async fn course_offerings_close(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, offering_id, course_offerings_close)
}

pub async fn course_offerings_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, offering_id, course_offerings_delete)
}

pub async fn course_sections_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, course_sections_list)
}

pub async fn course_sections_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, course_sections_create)
}

pub async fn course_sections_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(section_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, section_id, body, course_sections_update)
}

pub async fn course_sections_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(section_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, section_id, course_sections_delete)
}

pub async fn course_sections_reorder(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, course_sections_reorder)
}

pub async fn course_lessons_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, course_lessons_list)
}

pub async fn course_lessons_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, course_lessons_create)
}

pub async fn course_lessons_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, lesson_id, course_lessons_retrieve)
}

pub async fn course_lessons_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, lesson_id, body, course_lessons_update)
}

pub async fn course_lessons_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, lesson_id, course_lessons_delete)
}

pub async fn course_lessons_reorder(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, course_lessons_reorder)
}

pub async fn course_resources_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, lesson_id, course_resources_list)
}

pub async fn course_resources_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, lesson_id, body, course_resources_create)
}

pub async fn course_resources_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(resource_ref_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, resource_ref_id, body, course_resources_update)
}

pub async fn course_resources_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(resource_ref_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, resource_ref_id, course_resources_delete)
}

pub async fn course_live_sessions_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_live_sessions_list)
}

pub async fn course_live_sessions_create(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_live_sessions_create)
}

pub async fn course_live_sessions_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_retrieve)
}

pub async fn course_live_sessions_update(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, live_session_id, body, course_live_sessions_update)
}

pub async fn course_live_sessions_start(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_start)
}

pub async fn course_live_sessions_end(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_end)
}

pub async fn course_live_sessions_cancel(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_cancel)
}

pub async fn course_live_sessions_replay_attach(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, live_session_id, body, course_live_sessions_replay_attach)
}

pub async fn course_live_sessions_replay_publish(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_replay_publish)
}

pub async fn course_enrollments_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_enrollments_list)
}

pub async fn course_enrollments_grant(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_enrollments_grant)
}

pub async fn course_enrollments_revoke(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(enrollment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, enrollment_id, course_enrollments_revoke)
}

pub async fn course_progress_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_progress_list)
}

pub async fn course_progress_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(enrollment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, enrollment_id, course_progress_retrieve)
}

pub async fn course_lesson_progress_repair(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_progress_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, lesson_progress_id, body, course_lesson_progress_repair)
}

pub async fn course_comments_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_comments_list)
}

pub async fn course_comments_moderate(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(comment_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, comment_id, body, course_comments_moderate)
}

pub async fn course_comments_delete(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(comment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, comment_id, course_comments_delete)
}

pub async fn course_reactions_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_reactions_list)
}

pub async fn course_applications_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_applications_list)
}

pub async fn course_applications_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(application_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, application_id, course_applications_retrieve)
}

pub async fn course_applications_review(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(application_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, application_id, body, course_applications_review)
}

pub async fn course_applications_convert_to_course(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(application_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, application_id, course_applications_convert_to_course)
}

pub async fn course_reports_overview_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_ctx!(state, app_ctx, course_reports_overview_retrieve)
}

pub async fn course_reports_learning_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_reports_learning_list)
}

pub async fn course_reports_live_sessions_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_reports_live_sessions_list)
}

pub async fn course_audit_logs_list(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_audit_logs_list)
}

pub async fn course_audit_logs_retrieve(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(audit_log_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, audit_log_id, course_audit_logs_retrieve)
}
