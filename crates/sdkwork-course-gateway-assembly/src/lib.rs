//! Gateway assembly for sdkwork-course.
//! Route inventory is in `assembly-manifest.json`. Full embedded bootstrap wiring
//! remains deferred until postgres repository ports are materialized.

mod generated;

pub struct ApplicationAssembly {
    pub router: axum::Router,
}

pub async fn assemble_application_router() -> Result<ApplicationAssembly, String> {
    Ok(ApplicationAssembly {
        router: axum::Router::new(),
    })
}

pub fn assembly_route_count() -> usize {
    generated::ROUTE_CRATE_COUNT
}
