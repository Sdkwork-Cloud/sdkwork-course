//! SDKWork course app-api route crate skeleton.

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
    fn route_crate_exposes_canonical_app_prefix() {
        assert_eq!(paths::COURSE_APP_API_PREFIX, "/app/v3/api");
        assert_eq!(
            route_manifest_path(),
            "sdks/_route-manifests/app-api/sdkwork-router-course-app-api.route-manifest.json"
        );
    }
}
