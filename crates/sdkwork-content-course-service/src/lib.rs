//! SDKWork content course service contracts and ports.

pub mod domain;
pub mod ports;
pub mod service;
pub mod test_support;

pub use domain::commands::{
    CourseAuditCommand, CourseCatalogCommand, CourseEnrollmentCommand, CourseLessonCommand,
    CourseLessonKind, CourseLessonProgressCommand, CourseLiveJoinGrant, CourseLiveSessionCommand,
    CourseMediaResourceRef, CourseOfferingCommand, CourseOfferingType, CourseProgressStatus,
    CourseServiceContext,
};
pub use domain::models::{
    CourseApiResult, CourseApplicationCreateRequest, CourseApplicationItem,
    CourseApplicationReviewRequest, CourseAuditLogItem, CourseCategoryItem, CourseCommentItem,
    CourseCommentModerationRequest, CourseEngagementItem, CourseError, CourseItem,
    CourseLessonItem, CourseLessonMutationRequest, CourseMutationRequest, CoursePage, CourseQuery,
    CourseResult, CourseSectionItem, CourseSectionMutationRequest,
};
pub use ports::provider::{
    CourseAuditEventPort, CourseDrivePort, CourseEntitlementPort, CourseLiveProviderPort,
    CourseNotificationPort,
};
pub use ports::repository::{
    CourseApplicationRepository, CourseAuditLogRepository, CourseCatalogRepository,
    CourseCategoryRepository, CourseCommentRepository, CourseEnrollmentRepository,
    CourseInstructorRepository, CourseLessonRepository, CourseLiveSessionRepository,
    CourseOfferingRepository, CourseProgressRepository, CourseReactionRepository,
    CourseResourceRepository,
};
pub use service::course_service::{CourseApplicationService, CourseServiceImpl};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn course_error_exposes_stable_code_and_message() {
        let error = CourseError::invalid("title is required");
        assert_eq!(error.code(), "invalid");
        assert_eq!(error.message(), "title is required");
    }

    #[test]
    fn course_query_clamps_page_size() {
        let query = CourseQuery {
            page: Some(2),
            page_size: Some(500),
            ..CourseQuery::default()
        };
        assert_eq!(query.limit(), 200);
        assert_eq!(query.offset(), 200);
    }
}
