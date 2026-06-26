//! SDKWork course backend-api route crate skeleton.

#![recursion_limit = "512"]

use std::sync::Arc;

use axum::Router;
use sdkwork_content_course_service::CourseApplicationService;
use serde_json::Value;

pub mod error;
pub mod handlers;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod routes;

pub use manifest::{build_route_manifest, route_manifest_path, CourseRouteManifestMetadata};
pub use routes::build_router;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn route_crate_exposes_canonical_backend_prefix() {
        assert_eq!(paths::COURSE_BACKEND_API_PREFIX, "/backend/v3/api");
        assert_eq!(
            route_manifest_path(),
            "sdks/_route-manifests/backend-api/sdkwork-routes-course-backend-api.route-manifest.json"
        );
    }
}

pub fn gateway_route_manifest() -> Value {
    build_route_manifest()
}

pub fn gateway_mount(_service: Arc<dyn CourseApplicationService>) -> Router {
    build_router()
}
