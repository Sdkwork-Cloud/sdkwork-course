#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const courseRoot = path.resolve(import.meta.dirname, '..', '..');

const surfaces = [
  {
    surface: 'app-api',
    crateDir: 'crates/sdkwork-routes-course-app-api',
    prefix: '/app/v3/api',
    stateType: 'CourseAppApiState',
    routerFn: 'build_sdkwork_course_app_api_router',
    manifestFn: 'course_app_api_http_route_manifest',
    manifestJson:
      'sdks/_route-manifests/app-api/sdkwork-routes-course-app-api.route-manifest.json',
  },
  {
    surface: 'backend-api',
    crateDir: 'crates/sdkwork-routes-course-backend-api',
    prefix: '/backend/v3/api',
    stateType: 'CourseBackendApiState',
    routerFn: 'build_sdkwork_course_backend_api_router',
    manifestFn: 'course_backend_api_http_route_manifest',
    manifestJson:
      'sdks/_route-manifests/backend-api/sdkwork-routes-course-backend-api.route-manifest.json',
  },
];

function axumMethod(method) {
  return method.toLowerCase();
}

function toAxumPath(routePath) {
  return routePath.replace(/\{([^}]+)\}/g, (_, name) => `{${name}}`);
}

function toRouteFormatPath(routePath) {
  return toAxumPath(routePath).replace(/\{([^}]+)\}/g, '{{$1}}');
}

function relativePath(fullPath, prefix) {
  return fullPath.startsWith(prefix) ? fullPath.slice(prefix.length) : fullPath;
}

function pathParamName(routePath) {
  const match = routePath.match(/\{([^}]+)\}/);
  return match ? match[1] : null;
}

function inferHandlerKind(handlerName, method, relativePath) {
  if (handlerName === 'course_reports_overview_retrieve') {
    return 'ctx';
  }
  const hasPathParam = relativePath.includes('{');
  if (method === 'GET' && !hasPathParam) {
    return 'query';
  }
  if ((method === 'POST' || method === 'PUT') && !hasPathParam) {
    return 'body';
  }
  if (method === 'DELETE' || (method === 'GET' && hasPathParam)) {
    return 'path';
  }
  if (hasPathParam && method === 'PATCH') {
    return 'path_body';
  }
  if (hasPathParam && (method === 'POST' || method === 'PUT')) {
    return 'path';
  }
  return 'body';
}

function loadHandlerKinds(crateDir) {
  const handlersPath = path.join(courseRoot, crateDir, 'src/handlers.rs');
  const content = fs.readFileSync(handlersPath, 'utf8');
  const kinds = new Map();
  const blocks = content.split(/(?=pub async fn )/);
  for (const block of blocks) {
    const nameMatch = block.match(/^pub async fn (\w+)\(/);
    if (!nameMatch) {
      continue;
    }
    const handlerName = nameMatch[1];
    const signature = block.split(') ->')[0] ?? '';
    const contextSplit = signature.split('context: &CourseServiceContext,');
    if (contextSplit.length < 2) {
      continue;
    }
    const params = contextSplit[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    let kind;
    if (params.length === 0) {
      kind = 'ctx';
    } else if (params.length === 1) {
      const param = params[0];
      if (param.includes('CourseQuery')) {
        kind = 'query';
      } else if (param.includes('Value')) {
        kind = 'body';
      } else {
        kind = 'path';
      }
    } else {
      kind = 'path_body';
    }
    kinds.set(handlerName, kind);
  }
  return kinds;
}

function httpMethodConst(method) {
  return `HttpMethod::${method[0]}${method.slice(1).toLowerCase()}`;
}

function generateHttpRouteManifest(surfaceConfig, routes) {
  const lines = routes.map((route) => {
    const permission = route.auth?.permission ?? null;
    const permissionSuffix = permission
      ? `.with_required_permission("${permission}")`
      : '';
    return `    HttpRoute::dual_token(
        ${httpMethodConst(route.method)},
        "${route.path}",
        "course",
        "${route.operationId}",
    )${permissionSuffix},`;
  });

  return `use sdkwork_web_contract::HttpMethod;
use sdkwork_web_core::{HttpRoute, HttpRouteManifest};

const HTTP_ROUTES: &[HttpRoute] = &[
${lines.join('\n')}
];

pub fn ${surfaceConfig.manifestFn}() -> HttpRouteManifest {
    HttpRouteManifest::new(HTTP_ROUTES)
}
`;
}

function handlerMacroBlock(stateType) {
  return `use std::collections::BTreeMap;

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

use crate::error::CourseRouteError;
use crate::handlers;
use crate::service_state::${stateType};

macro_rules! course_handler_ctx {
    ($state:expr, $app_ctx:expr, $handler:ident) => {{
        let web_ctx = Some(&$app_ctx);
        let context = match course_service_context_from_web(&$app_ctx) {
            Ok(context) => context,
            Err(error) => return map_auth_error(web_ctx, error),
        };
        let service = $state.service();
        match handlers::$handler(service.as_ref(), &context).await {
            Ok(value) => handler_value_to_response(web_ctx, value, None),
            Err(error) => map_route_error(web_ctx, error.code(), error.message().to_owned()),
        }
    }};
}

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
`;
}

function generateHandlerFn(surfaceConfig, route, kind) {
  const param = pathParamName(route.relativePath);
  const handlerName = route.handlerName;
  const stateType = surfaceConfig.stateType;
  if (kind === 'ctx') {
    return `pub async fn ${handlerName}(
    State(state): State<${stateType}>,
    app_ctx: WebRequestContext,
) -> Response {
    course_handler_ctx!(state, app_ctx, ${handlerName})
}`;
  }
  if (kind === 'query') {
    return `pub async fn ${handlerName}(
    State(state): State<${stateType}>,
    app_ctx: WebRequestContext,
    query: Query<BTreeMap<String, String>>,
) -> Response {
    course_handler_query!(state, app_ctx, query, ${handlerName})
}`;
  }
  if (kind === 'body') {
    return `pub async fn ${handlerName}(
    State(state): State<${stateType}>,
    app_ctx: WebRequestContext,
    body: Json<Value>,
) -> Response {
    course_handler_body!(state, app_ctx, body, ${handlerName})
}`;
  }
  if (kind === 'path') {
    return `pub async fn ${handlerName}(
    State(state): State<${stateType}>,
    app_ctx: WebRequestContext,
    Path(${param}): Path<String>,
) -> Response {
    course_handler_path!(state, app_ctx, ${param}, ${handlerName})
}`;
  }
  return `pub async fn ${handlerName}(
    State(state): State<${stateType}>,
    app_ctx: WebRequestContext,
    Path(${param}): Path<String>,
    body: Json<Value>,
) -> Response {
    course_handler_path_body!(state, app_ctx, ${param}, body, ${handlerName})
}`;
}

function generateRoutes(surfaceConfig, operations) {
  const routeGroups = new Map();
  for (const operation of operations) {
    const axumPath = toAxumPath(operation.relativePath);
    if (!routeGroups.has(axumPath)) {
      routeGroups.set(axumPath, []);
    }
    routeGroups.get(axumPath).push([operation.method, operation.handlerName]);
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

  return `use std::sync::Arc;

use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};

use sdkwork_routes_course_http_auth::with_dual_token_request_context;

use crate::http_handlers;
use crate::http_route_manifest::${surfaceConfig.manifestFn};
use crate::service_state::${surfaceConfig.stateType};

pub fn ${surfaceConfig.routerFn}(
    service: Arc<dyn sdkwork_content_course_service::CourseApplicationService>,
) -> Router {
    let prefix = "${surfaceConfig.prefix}";
    let router = Router::new()
${routeLines.join('\n')}
        .with_state(${surfaceConfig.stateType}::new(service));

    with_dual_token_request_context(router, ${surfaceConfig.manifestFn}())
}

pub fn build_router(
    service: Arc<dyn sdkwork_content_course_service::CourseApplicationService>,
) -> Router {
    ${surfaceConfig.routerFn}(service)
}
`;
}

for (const surfaceConfig of surfaces) {
  const manifestPath = path.join(courseRoot, surfaceConfig.manifestJson);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const handlerKinds = loadHandlerKinds(surfaceConfig.crateDir);
  const operations = manifest.routes.map((route) => {
    const handlerName = route.handler?.name ?? route.operationId.replaceAll('.', '_');
    const routeRelativePath = relativePath(route.path, surfaceConfig.prefix);
    const kind =
      handlerKinds.get(handlerName) ??
      inferHandlerKind(handlerName, route.method, routeRelativePath);
    return {
      method: route.method,
      path: route.path,
      relativePath: routeRelativePath,
      handlerName,
      operationId: route.operationId,
      auth: route.auth,
      kind: kind === 'path_body' ? 'path_body' : kind,
    };
  });

  const crateSrc = path.join(courseRoot, surfaceConfig.crateDir, 'src');
  const handlerFns = operations.map((operation) =>
    generateHandlerFn(surfaceConfig, operation, operation.kind),
  );
  const httpHandlers = `${handlerMacroBlock(surfaceConfig.stateType)}\n\n${handlerFns.join('\n\n')}\n`;
  fs.writeFileSync(path.join(crateSrc, 'http_route_manifest.rs'), generateHttpRouteManifest(surfaceConfig, manifest.routes));
  fs.writeFileSync(path.join(crateSrc, 'http_handlers.rs'), httpHandlers);
  fs.writeFileSync(path.join(crateSrc, 'routes.rs'), generateRoutes(surfaceConfig, operations));
  console.log(`generated ${operations.length} ${surfaceConfig.surface} routes`);
}
