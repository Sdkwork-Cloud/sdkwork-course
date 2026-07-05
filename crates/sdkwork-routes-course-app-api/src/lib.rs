//! SDKWork course app-api route crate.

use std::sync::Arc;

use axum::Router;
use sdkwork_content_course_service::CourseApplicationService;
use serde_json::Value;

pub mod error;
pub mod handlers;
pub mod http_handlers;
pub mod http_route_manifest;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod routes;
pub mod service_state;

pub use http_route_manifest::course_app_api_http_route_manifest;
pub use manifest::{build_route_manifest, route_manifest_path, CourseRouteManifestMetadata};
pub use routes::build_router;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn route_crate_exposes_canonical_app_prefix() {
        assert_eq!(paths::COURSE_APP_API_PREFIX, "/app/v3/api");
        assert_eq!(
            route_manifest_path(),
            "sdks/_route-manifests/app-api/sdkwork-routes-course-app-api.route-manifest.json"
        );
    }
}

pub fn gateway_route_manifest() -> Value {
    build_route_manifest()
}

pub fn gateway_mount(service: Arc<dyn CourseApplicationService>) -> Router {
    build_router(service)
}
