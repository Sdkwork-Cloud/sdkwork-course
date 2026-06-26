use std::sync::Arc;

use sdkwork_content_course_service::CourseError;
use sdkwork_content_course_service::domain::commands::CourseServiceContext;
use sdkwork_content_course_service::domain::models::CourseResult;
use sdkwork_content_course_service::ports::provider::CourseAuditEventPort;

pub struct HttpCourseAuditEventPort {
    base_url: Arc<String>,
    client: ureq::Agent,
}

impl HttpCourseAuditEventPort {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base_url: Arc::new(normalize_base_url(base_url.into())),
            client: ureq::Agent::new(),
        }
    }

    fn post_audit_record(
        &self,
        context: &CourseServiceContext,
        event_type: &str,
    ) -> CourseResult<()> {
        let record_id = context
            .request_id
            .clone()
            .filter(|value| !value.trim().is_empty())
            .unwrap_or_else(|| format!("course-audit-{}", uuid::Uuid::new_v4()));
        let aggregate_id = if context.organization_id.trim().is_empty() {
            context.tenant_id.clone()
        } else {
            context.organization_id.clone()
        };
        let url = format!(
            "{}/backend/v3/api/audit/records",
            self.base_url.as_str()
        );
        let body = serde_json::json!({
            "recordId": record_id,
            "aggregateType": "course",
            "aggregateId": aggregate_id,
            "action": event_type,
            "payload": serde_json::json!({
                "tenantId": context.tenant_id,
                "organizationId": context.organization_id,
                "actorId": context.actor_id,
            }).to_string(),
        });

        let mut request = self
            .client
            .post(&url)
            .set("Content-Type", "application/json");
        request = apply_service_auth_headers(request);

        request.send_json(body).map_err(|error| {
            CourseError::integration_unavailable(format!("audit integration failed: {error}"))
        })?;
        Ok(())
    }
}

#[async_trait::async_trait]
impl CourseAuditEventPort for HttpCourseAuditEventPort {
    async fn publish_audit_event(
        &self,
        context: &CourseServiceContext,
        event_type: String,
    ) -> CourseResult<()> {
        self.post_audit_record(context, event_type.as_str())
    }
}

fn normalize_base_url(raw: String) -> String {
    raw.trim().trim_end_matches('/').to_string()
}

fn apply_service_auth_headers(request: ureq::Request) -> ureq::Request {
    let request = if let Ok(access_token) = std::env::var("SDKWORK_ACCESS_TOKEN") {
        if access_token.trim().is_empty() {
            request
        } else {
            request.set("Access-Token", access_token.trim())
        }
    } else {
        request
    };

    if let Ok(auth_token) = std::env::var("SDKWORK_AUTH_TOKEN") {
        if auth_token.trim().is_empty() {
            request
        } else {
            request.set("Authorization", &format!("Bearer {}", auth_token.trim()))
        }
    } else {
        request
    }
}
