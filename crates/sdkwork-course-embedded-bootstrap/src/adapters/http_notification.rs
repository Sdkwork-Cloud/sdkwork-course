use std::sync::Arc;

use sdkwork_content_course_service::CourseError;
use sdkwork_content_course_service::domain::commands::CourseServiceContext;
use sdkwork_content_course_service::domain::models::CourseResult;
use sdkwork_content_course_service::ports::provider::CourseNotificationPort;

pub struct HttpCourseNotificationPort {
    base_url: Arc<String>,
    client: ureq::Agent,
}

impl HttpCourseNotificationPort {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base_url: Arc::new(normalize_base_url(base_url.into())),
            client: ureq::Agent::new(),
        }
    }

    fn post_notification(
        &self,
        context: &CourseServiceContext,
        live_session_id: &str,
    ) -> CourseResult<()> {
        let notification_id = format!("course-live-session-{live_session_id}");
        let source_event_id = context
            .request_id
            .clone()
            .filter(|value| !value.trim().is_empty())
            .unwrap_or_else(|| notification_id.clone());
        let recipient_id = context
            .actor_id
            .clone()
            .or_else(|| context.user_id.clone())
            .unwrap_or_else(|| "system".to_string());
        let url = format!(
            "{}/app/v3/api/notifications/requests",
            self.base_url.as_str()
        );
        let body = serde_json::json!({
            "notificationId": notification_id,
            "sourceEventId": source_event_id,
            "sourceEventType": "course.live_session.changed",
            "category": "course",
            "channel": "in_app",
            "recipientId": recipient_id,
            "recipientKind": "user",
            "title": "Course live session updated",
            "body": format!("Live session {live_session_id} changed"),
            "payload": serde_json::json!({
                "tenantId": context.tenant_id,
                "organizationId": context.organization_id,
                "liveSessionId": live_session_id,
            }).to_string(),
        });

        let mut request = self
            .client
            .post(&url)
            .set("Content-Type", "application/json");
        request = apply_service_auth_headers(request);

        request.send_json(body).map_err(|error| {
            CourseError::storage(format!("notification integration failed: {error}"))
        })?;
        Ok(())
    }
}

#[async_trait::async_trait]
impl CourseNotificationPort for HttpCourseNotificationPort {
    async fn notify_live_session_change(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()> {
        self.post_notification(context, live_session_id.as_str())
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
