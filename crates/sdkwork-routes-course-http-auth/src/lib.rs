pub mod api_response;
pub mod context;
pub mod handler_response;
pub mod layer;

pub use api_response::{
    map_auth_error, map_course_error, map_route_error, resolve_trace_id, success_command,
    success_item, success_items,
};
pub use context::{course_service_context_from_web, CourseAuthError};
pub use handler_response::handler_value_to_response;
pub use layer::with_dual_token_request_context;

pub fn gateway_mount() -> axum::Router {
    axum::Router::new()
}
