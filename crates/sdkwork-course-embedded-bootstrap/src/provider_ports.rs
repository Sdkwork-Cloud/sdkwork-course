use sdkwork_content_course_service::CourseError;
use sdkwork_content_course_service::domain::commands::{
    CourseLiveJoinGrant, CourseMediaResourceRef, CourseServiceContext,
};
use sdkwork_content_course_service::domain::models::CourseResult;
use sdkwork_content_course_service::ports::provider::{
    CourseAuditEventPort, CourseDrivePort, CourseEntitlementPort, CourseLiveProviderPort,
    CourseNotificationPort,
};

macro_rules! integration_unavailable {
    ($capability:expr) => {
        CourseError::integration_unavailable(format!(
            "{} integration is not configured for embedded course runtime",
            $capability
        ))
    };
}

/// Unified-process embedded runtime: catalog mutations without external Drive validation.
pub struct EmbeddedPassThroughDrivePort;

#[async_trait::async_trait]
impl CourseDrivePort for EmbeddedPassThroughDrivePort {
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
        Err(integration_unavailable!("drive"))
    }
}

/// Unified-process embedded runtime: learning access until commerce entitlement adapter is wired.
pub struct EmbeddedLocalEntitlementPort;

#[async_trait::async_trait]
impl CourseEntitlementPort for EmbeddedLocalEntitlementPort {
    async fn verify_learning_access(
        &self,
        _context: &CourseServiceContext,
        _offering_id: String,
        _learner_user_id: String,
    ) -> CourseResult<bool> {
        Ok(true)
    }
}

pub struct UnconfiguredLiveProviderPort;

#[async_trait::async_trait]
impl CourseLiveProviderPort for UnconfiguredLiveProviderPort {
    async fn reserve_room(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
    ) -> CourseResult<String> {
        Err(integration_unavailable!("live"))
    }

    async fn create_join_grant(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
        _learner_user_id: String,
    ) -> CourseResult<CourseLiveJoinGrant> {
        Err(integration_unavailable!("live"))
    }

    async fn end_room(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
    ) -> CourseResult<()> {
        Err(integration_unavailable!("live"))
    }
}

pub struct UnconfiguredNotificationPort;

#[async_trait::async_trait]
impl CourseNotificationPort for UnconfiguredNotificationPort {
    async fn notify_live_session_change(
        &self,
        _context: &CourseServiceContext,
        _live_session_id: String,
    ) -> CourseResult<()> {
        Err(integration_unavailable!("notification"))
    }
}

pub struct UnconfiguredAuditEventPort;

#[async_trait::async_trait]
impl CourseAuditEventPort for UnconfiguredAuditEventPort {
    async fn publish_audit_event(
        &self,
        _context: &CourseServiceContext,
        _event_type: String,
    ) -> CourseResult<()> {
        Err(integration_unavailable!("audit"))
    }
}
