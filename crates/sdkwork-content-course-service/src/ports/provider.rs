use crate::domain::commands::{CourseLiveJoinGrant, CourseMediaResourceRef, CourseServiceContext};
use crate::domain::models::CourseResult;

#[async_trait::async_trait]
pub trait CourseDrivePort: Send + Sync {
    async fn validate_resource(
        &self,
        context: &CourseServiceContext,
        resource: CourseMediaResourceRef,
    ) -> CourseResult<CourseMediaResourceRef>;

    async fn issue_download_grant(
        &self,
        context: &CourseServiceContext,
        resource_ref_id: String,
    ) -> CourseResult<String>;
}

#[async_trait::async_trait]
pub trait CourseLiveProviderPort: Send + Sync {
    async fn reserve_room(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<String>;

    async fn create_join_grant(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
        learner_user_id: String,
    ) -> CourseResult<CourseLiveJoinGrant>;

    async fn end_room(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()>;
}

#[async_trait::async_trait]
pub trait CourseEntitlementPort: Send + Sync {
    async fn verify_learning_access(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
        learner_user_id: String,
    ) -> CourseResult<bool>;
}

#[async_trait::async_trait]
pub trait CourseNotificationPort: Send + Sync {
    async fn notify_live_session_change(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()>;
}

#[async_trait::async_trait]
pub trait CourseAuditEventPort: Send + Sync {
    async fn publish_audit_event(
        &self,
        context: &CourseServiceContext,
        event_type: String,
    ) -> CourseResult<()>;
}
