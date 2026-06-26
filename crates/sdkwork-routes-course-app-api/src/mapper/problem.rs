use serde_json::Value;

use crate::error::CourseRouteError;

pub fn route_error_to_problem(error: &CourseRouteError) -> Value {
    serde_json::to_value(error.to_problem_detail()).unwrap_or_default()
}
