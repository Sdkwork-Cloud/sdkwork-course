#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const courseRoot = path.resolve(import.meta.dirname, '..', '..');
const backendRoot = path.join(
  courseRoot,
  'crates/sdkwork-routes-course-backend-api/src',
);

const operations = [
  ['GET', '/course_categories', 'course_categories_list', 'query'],
  ['POST', '/course_categories', 'course_categories_create', 'body'],
  ['PATCH', '/course_categories/{category_id}', 'course_categories_update', 'path_body'],
  ['DELETE', '/course_categories/{category_id}', 'course_categories_delete', 'path'],
  ['PUT', '/course_categories/reorder', 'course_categories_reorder', 'body'],
  ['GET', '/course_instructors', 'course_instructors_list', 'query'],
  ['POST', '/course_instructors', 'course_instructors_create', 'body'],
  ['GET', '/course_instructors/{instructor_id}', 'course_instructors_retrieve', 'path'],
  ['PATCH', '/course_instructors/{instructor_id}', 'course_instructors_update', 'path_body'],
  ['PATCH', '/course_instructors/{instructor_id}/status', 'course_instructors_status_update', 'path_body'],
  ['GET', '/courses', 'courses_list', 'query'],
  ['POST', '/courses', 'courses_create', 'body'],
  ['GET', '/courses/{course_id}', 'courses_retrieve', 'path'],
  ['PATCH', '/courses/{course_id}', 'courses_update', 'path_body'],
  ['DELETE', '/courses/{course_id}', 'courses_delete', 'path'],
  ['POST', '/courses/{course_id}/publish', 'courses_publish', 'path'],
  ['POST', '/courses/{course_id}/unpublish', 'courses_unpublish', 'path'],
  ['GET', '/courses/{course_id}/offerings', 'course_offerings_list', 'path'],
  ['POST', '/courses/{course_id}/offerings', 'course_offerings_create', 'path_body'],
  ['GET', '/course_offerings/{offering_id}', 'course_offerings_retrieve', 'path'],
  ['PATCH', '/course_offerings/{offering_id}', 'course_offerings_update', 'path_body'],
  ['POST', '/course_offerings/{offering_id}/publish', 'course_offerings_publish', 'path'],
  ['POST', '/course_offerings/{offering_id}/close', 'course_offerings_close', 'path'],
  ['DELETE', '/course_offerings/{offering_id}', 'course_offerings_delete', 'path'],
  ['GET', '/courses/{course_id}/sections', 'course_sections_list', 'path'],
  ['POST', '/courses/{course_id}/sections', 'course_sections_create', 'path_body'],
  ['PATCH', '/course_sections/{section_id}', 'course_sections_update', 'path_body'],
  ['DELETE', '/course_sections/{section_id}', 'course_sections_delete', 'path'],
  ['PUT', '/courses/{course_id}/sections/reorder', 'course_sections_reorder', 'path_body'],
  ['GET', '/courses/{course_id}/lessons', 'course_lessons_list', 'path'],
  ['POST', '/courses/{course_id}/lessons', 'course_lessons_create', 'path_body'],
  ['GET', '/course_lessons/{lesson_id}', 'course_lessons_retrieve', 'path'],
  ['PATCH', '/course_lessons/{lesson_id}', 'course_lessons_update', 'path_body'],
  ['DELETE', '/course_lessons/{lesson_id}', 'course_lessons_delete', 'path'],
  ['PUT', '/courses/{course_id}/lessons/reorder', 'course_lessons_reorder', 'path_body'],
  ['GET', '/course_lessons/{lesson_id}/resources', 'course_resources_list', 'path'],
  ['POST', '/course_lessons/{lesson_id}/resources', 'course_resources_create', 'path_body'],
  ['PATCH', '/course_resources/{resource_ref_id}', 'course_resources_update', 'path_body'],
  ['DELETE', '/course_resources/{resource_ref_id}', 'course_resources_delete', 'path'],
  ['GET', '/course_live_sessions', 'course_live_sessions_list', 'query'],
  ['POST', '/course_live_sessions', 'course_live_sessions_create', 'body'],
  ['GET', '/course_live_sessions/{live_session_id}', 'course_live_sessions_retrieve', 'path'],
  ['PATCH', '/course_live_sessions/{live_session_id}', 'course_live_sessions_update', 'path_body'],
  ['POST', '/course_live_sessions/{live_session_id}/start', 'course_live_sessions_start', 'path'],
  ['POST', '/course_live_sessions/{live_session_id}/end', 'course_live_sessions_end', 'path'],
  ['POST', '/course_live_sessions/{live_session_id}/cancel', 'course_live_sessions_cancel', 'path'],
  ['POST', '/course_live_sessions/{live_session_id}/replay', 'course_live_sessions_replay_attach', 'path_body'],
  ['POST', '/course_live_sessions/{live_session_id}/replay/publish', 'course_live_sessions_replay_publish', 'path'],
  ['GET', '/course_enrollments', 'course_enrollments_list', 'query'],
  ['POST', '/course_enrollments/grants', 'course_enrollments_grant', 'body'],
  ['POST', '/course_enrollments/{enrollment_id}/revoke', 'course_enrollments_revoke', 'path'],
  ['GET', '/course_progress', 'course_progress_list', 'query'],
  ['GET', '/course_enrollments/{enrollment_id}/progress', 'course_progress_retrieve', 'path'],
  ['PATCH', '/course_lesson_progress/{lesson_progress_id}', 'course_lesson_progress_repair', 'path_body'],
  ['GET', '/course_comments', 'course_comments_list', 'query'],
  ['PATCH', '/course_comments/{comment_id}/moderation', 'course_comments_moderate', 'path_body'],
  ['DELETE', '/course_comments/{comment_id}', 'course_comments_delete', 'path'],
  ['GET', '/course_reactions', 'course_reactions_list', 'query'],
  ['GET', '/course_applications', 'course_applications_list', 'query'],
  ['GET', '/course_applications/{application_id}', 'course_applications_retrieve', 'path'],
  ['PATCH', '/course_applications/{application_id}/review', 'course_applications_review', 'path_body'],
  ['POST', '/course_applications/{application_id}/convert', 'course_applications_convert_to_course', 'path'],
  ['GET', '/course_reports/overview', 'course_reports_overview_retrieve', 'ctx'],
  ['GET', '/course_reports/learning', 'course_reports_learning_list', 'query'],
  ['GET', '/course_reports/live_sessions', 'course_reports_live_sessions_list', 'query'],
  ['GET', '/course_audit_logs', 'course_audit_logs_list', 'query'],
  ['GET', '/course_audit_logs/{audit_log_id}', 'course_audit_logs_retrieve', 'path'],
];

function axumMethod(method) {
  return method.toLowerCase();
}

function pathParamName(routePath) {
  const match = routePath.match(/\{([^}]+)\}/);
  return match ? match[1] : null;
}

function toAxumPath(routePath) {
  return routePath.replace(/\{([^}]+)\}/g, (_, name) => `{${name}}`);
}

function toRouteFormatPath(routePath) {
  return toAxumPath(routePath).replace(/\{([^}]+)\}/g, '{{$1}}');
}

const handlerFns = operations.map(([, routePath, handlerName, kind]) => {
  const param = pathParamName(routePath);
  if (kind === 'ctx') {
    return `pub async fn ${handlerName}(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_ctx!(state, app_ctx, ${handlerName})
}`;
  }
  if (kind === 'query') {
    return `pub async fn ${handlerName}(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_query!(state, app_ctx, query, ${handlerName})
}`;
  }
  if (kind === 'body') {
    return `pub async fn ${handlerName}(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_body!(state, app_ctx, body, ${handlerName})
}`;
  }
  if (kind === 'path') {
    return `pub async fn ${handlerName}(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(${param}): Path<String>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path!(state, app_ctx, ${param}, ${handlerName})
}`;
  }
  return `pub async fn ${handlerName}(
    State(state): State<CourseBackendApiState>,
    app_ctx: WebRequestContext,
    Path(${param}): Path<String>,
    body: Json<Value>,
) -> Result<Json<Value>, CourseRouteError> {
    course_handler_path_body!(state, app_ctx, ${param}, body, ${handlerName})
}`;
});

const httpHandlers = `use std::collections::BTreeMap;

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

${handlerFns.join('\n\n')}
`;

const routeGroups = new Map();
for (const [method, routePath, handlerName] of operations) {
  const axumPath = toAxumPath(routePath);
  if (!routeGroups.has(axumPath)) {
    routeGroups.set(axumPath, []);
  }
  routeGroups.get(axumPath).push([method, handlerName]);
}

const routeLines = [];
for (const [axumPath, methods] of routeGroups.entries()) {
  const routeFormatPath = toRouteFormatPath(axumPath);
  const methodCalls = methods
    .map(([method, handlerName]) => `${axumMethod(method)}(http_handlers::${handlerName})`)
    .join('.');
  routeLines.push(
    `        .route(format!("{prefix}${routeFormatPath}").as_str(), ${methodCalls})`,
  );
}

const routesRs = `use std::sync::Arc;

use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};

use sdkwork_routes_course_http_auth::with_dual_token_request_context;

use crate::http_handlers;
use crate::manifest::course_backend_api_http_route_manifest;
use crate::service_state::CourseBackendApiState;

pub fn build_sdkwork_course_backend_api_router(
    service: Arc<dyn sdkwork_content_course_service::CourseApplicationService>,
) -> Router {
    let prefix = "/backend/v3/api";
    let router = Router::new()
${routeLines.join('\n')}
        .with_state(CourseBackendApiState::new(service));

    with_dual_token_request_context(router, course_backend_api_http_route_manifest())
}

pub fn build_router() -> Router {
    Router::new()
}
`;

fs.writeFileSync(path.join(backendRoot, 'http_handlers.rs'), httpHandlers);
fs.writeFileSync(path.join(backendRoot, 'routes.rs'), routesRs);
console.log(`generated ${operations.length} backend handlers`);
