//! HTTP handlers for course app API routes.
//! Path parameter names follow OpenAPI camelCase identifiers.

#![allow(non_snake_case)]

use std::collections::BTreeMap;

use axum::{
    extract::{Path, Query, State},
    response::Response,
    Json,
};
use sdkwork_routes_course_http_auth::{
    course_service_context_from_web, handler_value_to_response, map_auth_error, map_route_error,
};
use sdkwork_web_core::WebRequestContext;
use serde_json::Value;

use crate::handlers;
use crate::service_state::CourseAppApiState;

macro_rules! course_handler_query {
    ($state:expr, $app_ctx:expr, $query:expr, $handler:ident) => {{
        let web_ctx = Some(&$app_ctx);
        let context = match course_service_context_from_web(&$app_ctx) {
            Ok(context) => context,
            Err(error) => return map_auth_error(web_ctx, error),
        };
        let service = $state.service();
        let params = serde_json::to_value($query.0).unwrap_or(Value::Null);
        let course_query = crate::mapper::request::parse_course_query(&params);
        match handlers::$handler(service.as_ref(), &context, course_query.clone()).await {
            Ok(value) => handler_value_to_response(web_ctx, value, Some(&course_query)),
            Err(error) => map_route_error(web_ctx, error.code(), error.message().to_owned()),
        }
    }};
}

macro_rules! course_handler_path {
    ($state:expr, $app_ctx:expr, $path:expr, $handler:ident) => {{
        let web_ctx = Some(&$app_ctx);
        let context = match course_service_context_from_web(&$app_ctx) {
            Ok(context) => context,
            Err(error) => return map_auth_error(web_ctx, error),
        };
        let service = $state.service();
        match handlers::$handler(service.as_ref(), &context, $path).await {
            Ok(value) => handler_value_to_response(web_ctx, value, None),
            Err(error) => map_route_error(web_ctx, error.code(), error.message().to_owned()),
        }
    }};
}

macro_rules! course_handler_path_body {
    ($state:expr, $app_ctx:expr, $path:expr, $body:expr, $handler:ident) => {{
        let web_ctx = Some(&$app_ctx);
        let context = match course_service_context_from_web(&$app_ctx) {
            Ok(context) => context,
            Err(error) => return map_auth_error(web_ctx, error),
        };
        let service = $state.service();
        match handlers::$handler(service.as_ref(), &context, $path, $body.0).await {
            Ok(value) => handler_value_to_response(web_ctx, value, None),
            Err(error) => map_route_error(web_ctx, error.code(), error.message().to_owned()),
        }
    }};
}

macro_rules! course_handler_body {
    ($state:expr, $app_ctx:expr, $body:expr, $handler:ident) => {{
        let web_ctx = Some(&$app_ctx);
        let context = match course_service_context_from_web(&$app_ctx) {
            Ok(context) => context,
            Err(error) => return map_auth_error(web_ctx, error),
        };
        let service = $state.service();
        match handlers::$handler(service.as_ref(), &context, $body.0).await {
            Ok(value) => handler_value_to_response(web_ctx, value, None),
            Err(error) => map_route_error(web_ctx, error.code(), error.message().to_owned()),
        }
    }};
}


pub async fn course_categories_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, course_categories_list)
}

pub async fn course_categories_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(categoryId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, categoryId, course_categories_retrieve)
}

pub async fn courses_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, courses_list)
}

pub async fn courses_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(courseId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, courseId, courses_retrieve)
}

pub async fn course_offerings_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(courseId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, courseId, course_offerings_list)
}

pub async fn course_offerings_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(offeringId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, offeringId, course_offerings_retrieve)
}

pub async fn course_enrollments_create(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(offeringId): Path<String>,
    body: Json<Value>,
) -> Response {
    course_handler_path_body!(state, app_ctx, offeringId, body, course_enrollments_create)
}

pub async fn course_enrollments_current_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, course_enrollments_current_list)
}

pub async fn course_enrollments_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(enrollmentId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, enrollmentId, course_enrollments_retrieve)
}

pub async fn course_enrollments_cancel(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(enrollmentId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, enrollmentId, course_enrollments_cancel)
}

pub async fn course_sections_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(courseId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, courseId, course_sections_list)
}

pub async fn course_lessons_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(courseId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, courseId, course_lessons_list)
}

pub async fn course_lessons_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lessonId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, lessonId, course_lessons_retrieve)
}

pub async fn course_lesson_resources_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lessonId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, lessonId, course_lesson_resources_list)
}

pub async fn course_progress_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(enrollmentId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, enrollmentId, course_progress_retrieve)
}

pub async fn course_lesson_progress_update(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lessonId): Path<String>,
    body: Json<Value>,
) -> Response {
    course_handler_path_body!(state, app_ctx, lessonId, body, course_lesson_progress_update)
}

pub async fn course_lesson_progress_watch_positions_update(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(lessonId): Path<String>,
    body: Json<Value>,
) -> Response {
    course_handler_path_body!(state, app_ctx, lessonId, body, course_lesson_progress_watch_positions_update)
}

pub async fn course_live_sessions_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, course_live_sessions_list)
}

pub async fn course_live_sessions_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(liveSessionId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, liveSessionId, course_live_sessions_retrieve)
}

pub async fn course_live_sessions_join(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(liveSessionId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, liveSessionId, course_live_sessions_join)
}

pub async fn course_live_sessions_heartbeat(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(liveSessionId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, liveSessionId, course_live_sessions_heartbeat)
}

pub async fn course_live_sessions_leave(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(liveSessionId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, liveSessionId, course_live_sessions_leave)
}

pub async fn course_live_sessions_replay_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(liveSessionId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, liveSessionId, course_live_sessions_replay_retrieve)
}

pub async fn course_comments_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, course_comments_list)
}

pub async fn course_comments_create(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(courseId): Path<String>,
    body: Json<Value>,
) -> Response {
    course_handler_path_body!(state, app_ctx, courseId, body, course_comments_create)
}

pub async fn course_comments_delete(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(commentId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, commentId, course_comments_delete)
}

pub async fn course_reactions_replace(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Response {
    course_handler_body!(state, app_ctx, body, course_reactions_replace)
}

pub async fn course_reactions_delete(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(reactionId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, reactionId, course_reactions_delete)
}

pub async fn course_applications_create(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Response {
    course_handler_body!(state, app_ctx, body, course_applications_create)
}

pub async fn course_applications_current_list(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, course_applications_current_list)
}

pub async fn course_applications_retrieve(
    State(state): State<CourseAppApiState>,
    app_ctx: WebRequestContext,
    Path(applicationId): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, applicationId, course_applications_retrieve)
}
