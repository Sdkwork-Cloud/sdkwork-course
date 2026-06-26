use std::sync::Arc;

use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::{json, Value};

use sdkwork_routes_course_http_auth::CourseAuthError;

use crate::error::CourseRouteError;

#[derive(Clone)]
pub struct CourseAppApiState {
    service: Arc<dyn sdkwork_content_course_service::CourseApplicationService>,
}

impl CourseAppApiState {
    pub fn new(
        service: Arc<dyn sdkwork_content_course_service::CourseApplicationService>,
    ) -> Self {
        Self { service }
    }

    pub fn service(
        &self,
    ) -> Arc<dyn sdkwork_content_course_service::CourseApplicationService> {
        Arc::clone(&self.service)
    }
}

impl From<CourseAuthError> for CourseRouteError {
    fn from(error: CourseAuthError) -> Self {
        match error.status {
            StatusCode::UNAUTHORIZED => CourseRouteError::invalid(error.message),
            _ => CourseRouteError::internal(error.message),
        }
    }
}

impl IntoResponse for CourseRouteError {
    fn into_response(self) -> Response {
        let problem = self.to_problem_detail();
        let status = StatusCode::from_u16(problem.status).unwrap_or(StatusCode::BAD_REQUEST);
        let body = json!({
            "code": self.code(),
            "msg": self.message(),
            "data": null,
            "type": problem.r#type,
            "title": problem.title,
            "status": problem.status,
            "detail": problem.detail,
        });
        (status, Json(body)).into_response()
    }
}

pub fn success_response(value: Value) -> Json<Value> {
    Json(value)
}
