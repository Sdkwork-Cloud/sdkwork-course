pub mod context;
pub mod layer;

pub use context::{course_service_context_from_web, CourseAuthError};
pub use layer::with_dual_token_request_context;

pub fn gateway_mount() -> axum::Router {
    axum::Router::new()
}
