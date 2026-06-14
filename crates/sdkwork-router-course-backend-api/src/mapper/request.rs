use sdkwork_content_course_service::{CourseQuery, CourseServiceContext};
use serde_json::Value;

pub fn parse_course_query(params: &Value) -> CourseQuery {
    CourseQuery {
        page: params.get("page").and_then(|v| v.as_i64()),
        page_size: params.get("pageSize").and_then(|v| v.as_i64()),
        q: params
            .get("q")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        category: params
            .get("category")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        level: params
            .get("level")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        status: params
            .get("status")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
    }
}

pub fn parse_service_context(
    tenant_id: &str,
    organization_id: &str,
    user_id: Option<&str>,
    actor_id: Option<&str>,
) -> CourseServiceContext {
    CourseServiceContext {
        tenant_id: tenant_id.to_string(),
        organization_id: organization_id.to_string(),
        user_id: user_id.map(|s| s.to_string()),
        actor_id: actor_id.map(|s| s.to_string()),
        request_id: None,
        trace_id: None,
        permissions: vec![],
    }
}
