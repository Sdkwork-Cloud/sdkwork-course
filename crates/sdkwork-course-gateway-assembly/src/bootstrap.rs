//! Gateway bootstrap for sdkwork-course.
//! Multi-surface merges mount shared infrastructure routes once at the assembly layer
//! so `/healthz`, `/livez`, `/readyz`, and `/metrics` are not duplicated per surface.

use axum::Router;

pub struct ApplicationAssembly {
    pub router: Router,
}

pub async fn assemble_application_business_router() -> Result<ApplicationAssembly, String> {
    let embedded =
        sdkwork_course_embedded_bootstrap::assemble_embedded_course_application_router_from_env()
            .await?;
    let router = embedded
        .router
        .merge(sdkwork_routes_course_http_auth::gateway_mount());
    Ok(ApplicationAssembly { router })
}
