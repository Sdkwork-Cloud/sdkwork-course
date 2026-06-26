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
use crate::service_state::{success_response, CourseAppApiState};

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
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_categories_list)
}

pub async fn course_categories_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(category_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, category_id, course_categories_retrieve)
}

pub async fn courses_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, courses_list)
}

pub async fn courses_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, courses_retrieve)
}

pub async fn course_offerings_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, course_offerings_list)
}

pub async fn course_offerings_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, offering_id, course_offerings_retrieve)
}

pub async fn course_enrollments_create(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(offering_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, offering_id, body, course_enrollments_create)
}

pub async fn course_enrollments_current_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_enrollments_current_list)
}

pub async fn course_enrollments_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(enrollment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, enrollment_id, course_enrollments_retrieve)
}

pub async fn course_enrollments_cancel(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(enrollment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, enrollment_id, course_enrollments_cancel)
}

pub async fn course_sections_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, course_sections_list)
}

pub async fn course_lessons_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, course_id, course_lessons_list)
}

pub async fn course_lessons_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, lesson_id, course_lessons_retrieve)
}

pub async fn course_lesson_resources_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, lesson_id, course_lesson_resources_list)
}

pub async fn course_progress_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(enrollment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, enrollment_id, course_progress_retrieve)
}

pub async fn course_lesson_progress_update(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, lesson_id, body, course_lesson_progress_update)
}

pub async fn course_lesson_progress_watch_positions_update(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lesson_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(
        state,
        app_ctx,
        lesson_id,
        body,
        course_lesson_progress_watch_positions_update
    )
}

pub async fn course_live_sessions_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_live_sessions_list)
}

pub async fn course_live_sessions_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_retrieve)
}

pub async fn course_live_sessions_join(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_join)
}

pub async fn course_live_sessions_heartbeat(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_heartbeat)
}

pub async fn course_live_sessions_leave(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_leave)
}

pub async fn course_live_sessions_replay_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(live_session_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, live_session_id, course_live_sessions_replay_retrieve)
}

pub async fn course_comments_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(_course_id): Path<String>,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_comments_list)
}

pub async fn course_comments_create(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(course_id): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, course_id, body, course_comments_create)
}

pub async fn course_comments_delete(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(comment_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, comment_id, course_comments_delete)
}

pub async fn course_reactions_replace(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_reactions_replace)
}

pub async fn course_reactions_delete(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(reaction_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, reaction_id, course_reactions_delete)
}

pub async fn course_applications_create(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, course_applications_create)
}

pub async fn course_applications_current_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, course_applications_current_list)
}

pub async fn course_applications_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(application_id): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, application_id, course_applications_retrieve)
}
