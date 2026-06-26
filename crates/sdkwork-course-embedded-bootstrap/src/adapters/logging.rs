use sdkwork_content_course_service::domain::commands::CourseServiceContext;
use sdkwork_content_course_service::domain::models::CourseResult;
use sdkwork_content_course_service::ports::provider::{
    CourseAuditEventPort, CourseNotificationPort,
};

pub struct LoggingCourseNotificationPort;

#[async_trait::async_trait]
impl CourseNotificationPort for LoggingCourseNotificationPort {
    async fn notify_live_session_change(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()> {
        tracing::info!(
            tenant_id = %context.tenant_id,
            organization_id = %context.organization_id,
            live_session_id = %live_session_id,
            "course live session notification event"
        );
        Ok(())
    }
}

pub struct LoggingCourseAuditEventPort;

#[async_trait::async_trait]
impl CourseAuditEventPort for LoggingCourseAuditEventPort {
    async fn publish_audit_event(
        &self,
        context: &CourseServiceContext,
        event_type: String,
    ) -> CourseResult<()> {
        tracing::info!(
            tenant_id = %context.tenant_id,
            organization_id = %context.organization_id,
            event_type = %event_type,
            request_id = ?context.request_id,
            "course audit event"
        );
        Ok(())
    }
}
