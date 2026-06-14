use crate::domain::commands::{CourseLiveJoinGrant, CourseMediaResourceRef, CourseServiceContext};
use crate::domain::models::CourseResult;
use crate::ports::provider::{
    CourseAuditEventPort, CourseDrivePort, CourseEntitlementPort, CourseLiveProviderPort,
    CourseNotificationPort,
};

pub struct NoopDrivePort;

#[async_trait::async_trait]
impl CourseDrivePort for NoopDrivePort {
    async fn validate_resource(
        &self,
        _context: &CourseServiceContext,
        resource: CourseMediaResourceRef,
    ) -> CourseResult<CourseMediaResourceRef> {
        Ok(resource)
    }

    async fn issue_download_grant(
        &self,
        _context: &CourseServiceContext,
        _resource_ref_id: String,
    ) -> CourseResult<String> {
        Ok("https://drive.example.com/grant/placeholder".to_string())
    }
}

pub struct NoopLiveProviderPort;

#[async_trait::async_trait]
impl CourseLiveProviderPort for NoopLiveProviderPort {
    async fn reserve_room(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
    ) -> CourseResult<String> {
        Ok("noop-room-ref".to_string())
    }

    async fn create_join_grant(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
        _learner_user_id: String,
    ) -> CourseResult<CourseLiveJoinGrant> {
        Ok(CourseLiveJoinGrant {
            live_session_id: String::new(),
            provider_code: "noop".to_string(),
            join_url: "https://live.example.com/join/placeholder".to_string(),
            expires_at: "2099-01-01T00:00:00Z".to_string(),
        })
    }

    async fn end_room(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
    ) -> CourseResult<()> {
        Ok(())
    }
}

pub struct NoopEntitlementPort;

#[async_trait::async_trait]
impl CourseEntitlementPort for NoopEntitlementPort {
    async fn verify_learning_access(
        &self,
        _context: &CourseServiceContext,
        _offering_id: String,
        _learner_user_id: String,
    ) -> CourseResult<bool> {
        Ok(true)
    }
}

pub struct NoopNotificationPort;

#[async_trait::async_trait]
impl CourseNotificationPort for NoopNotificationPort {
    async fn notify_live_session_change(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
    ) -> CourseResult<()> {
        Ok(())
    }
}

pub struct NoopAuditEventPort;

#[async_trait::async_trait]
impl CourseAuditEventPort for NoopAuditEventPort {
    async fn publish_audit_event(
        &self,
        _context: &CourseServiceContext,
        _event_type: String,
    ) -> CourseResult<()> {
        Ok(())
    }
}
