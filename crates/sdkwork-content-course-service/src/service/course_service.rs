use serde_json::Value;

use crate::domain::commands::{
    CourseAuditCommand, CourseCatalogCommand, CourseEnrollmentCommand, CourseLessonCommand,
    CourseLessonProgressCommand, CourseLiveJoinGrant, CourseLiveSessionCommand,
    CourseOfferingCommand, CourseServiceContext,
};
use crate::domain::models::{
    CourseApplicationCreateRequest, CourseApplicationItem, CourseApplicationReviewRequest,
    CourseAuditLogItem, CourseCategoryItem, CourseCommentItem, CourseCommentModerationRequest,
    CourseError, CourseItem, CourseLessonItem, CoursePage, CourseQuery, CourseResult,
    CourseSectionItem,
};
use crate::ports::provider::{
    CourseAuditEventPort, CourseDrivePort, CourseEntitlementPort, CourseLiveProviderPort,
    CourseNotificationPort,
};
use crate::ports::repository::{
    CourseApplicationRepository, CourseAuditLogRepository, CourseCatalogRepository,
    CourseCategoryRepository, CourseCommentRepository, CourseEnrollmentRepository,
    CourseInstructorRepository, CourseLessonRepository, CourseLiveSessionRepository,
    CourseOfferingRepository, CourseProgressRepository, CourseReactionRepository,
    CourseResourceRepository,
};

#[allow(dead_code)]
pub struct CourseServiceImpl {
    category_repo: Box<dyn CourseCategoryRepository>,
    catalog_repo: Box<dyn CourseCatalogRepository>,
    instructor_repo: Box<dyn CourseInstructorRepository>,
    offering_repo: Box<dyn CourseOfferingRepository>,
    lesson_repo: Box<dyn CourseLessonRepository>,
    live_session_repo: Box<dyn CourseLiveSessionRepository>,
    enrollment_repo: Box<dyn CourseEnrollmentRepository>,
    progress_repo: Box<dyn CourseProgressRepository>,
    comment_repo: Box<dyn CourseCommentRepository>,
    application_repo: Box<dyn CourseApplicationRepository>,
    audit_repo: Box<dyn CourseAuditLogRepository>,
    resource_repo: Box<dyn CourseResourceRepository>,
    reaction_repo: Box<dyn CourseReactionRepository>,
    drive_port: Box<dyn CourseDrivePort>,
    live_provider_port: Box<dyn CourseLiveProviderPort>,
    entitlement_port: Box<dyn CourseEntitlementPort>,
    notification_port: Box<dyn CourseNotificationPort>,
    audit_event_port: Box<dyn CourseAuditEventPort>,
}

impl CourseServiceImpl {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        category_repo: Box<dyn CourseCategoryRepository>,
        catalog_repo: Box<dyn CourseCatalogRepository>,
        instructor_repo: Box<dyn CourseInstructorRepository>,
        offering_repo: Box<dyn CourseOfferingRepository>,
        lesson_repo: Box<dyn CourseLessonRepository>,
        live_session_repo: Box<dyn CourseLiveSessionRepository>,
        enrollment_repo: Box<dyn CourseEnrollmentRepository>,
        progress_repo: Box<dyn CourseProgressRepository>,
        comment_repo: Box<dyn CourseCommentRepository>,
        application_repo: Box<dyn CourseApplicationRepository>,
        audit_repo: Box<dyn CourseAuditLogRepository>,
        resource_repo: Box<dyn CourseResourceRepository>,
        reaction_repo: Box<dyn CourseReactionRepository>,
        drive_port: Box<dyn CourseDrivePort>,
        live_provider_port: Box<dyn CourseLiveProviderPort>,
        entitlement_port: Box<dyn CourseEntitlementPort>,
        notification_port: Box<dyn CourseNotificationPort>,
        audit_event_port: Box<dyn CourseAuditEventPort>,
    ) -> Self {
        Self {
            category_repo,
            catalog_repo,
            instructor_repo,
            offering_repo,
            lesson_repo,
            live_session_repo,
            enrollment_repo,
            progress_repo,
            comment_repo,
            application_repo,
            audit_repo,
            resource_repo,
            reaction_repo,
            drive_port,
            live_provider_port,
            entitlement_port,
            notification_port,
            audit_event_port,
        }
    }
}

#[async_trait::async_trait]
pub trait CourseApplicationService: Send + Sync {
    // Categories
    async fn list_categories(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseCategoryItem>>;

    async fn save_category(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value>;

    async fn reorder_categories(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value>;

    async fn delete_category(
        &self,
        context: &CourseServiceContext,
        category_id: String,
    ) -> CourseResult<()>;

    // Instructors
    async fn list_instructors(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>>;

    async fn retrieve_instructor(
        &self,
        context: &CourseServiceContext,
        instructor_id: String,
    ) -> CourseResult<Option<Value>>;

    async fn save_instructor(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value>;

    async fn update_instructor_status(
        &self,
        context: &CourseServiceContext,
        instructor_id: String,
        command: Value,
    ) -> CourseResult<Value>;

    async fn delete_instructor(
        &self,
        context: &CourseServiceContext,
        instructor_id: String,
    ) -> CourseResult<()>;

    // Courses
    async fn list_courses(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<CoursePage>;

    async fn retrieve_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Option<CourseItem>>;

    async fn create_course(
        &self,
        context: &CourseServiceContext,
        command: CourseCatalogCommand,
    ) -> CourseResult<CourseItem>;

    async fn save_course(
        &self,
        context: &CourseServiceContext,
        command: CourseCatalogCommand,
    ) -> CourseResult<CourseItem>;

    async fn delete_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<()>;

    async fn publish_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<CourseItem>;

    async fn unpublish_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<CourseItem>;

    // Offerings
    async fn list_offerings(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Vec<Value>>;

    async fn retrieve_offering(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
    ) -> CourseResult<Option<Value>>;

    async fn save_offering(
        &self,
        context: &CourseServiceContext,
        command: CourseOfferingCommand,
    ) -> CourseResult<String>;

    async fn transition_offering(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
        status: String,
    ) -> CourseResult<()>;

    async fn delete_offering(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
    ) -> CourseResult<()>;

    // Sections
    async fn list_sections(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Vec<CourseSectionItem>>;

    async fn save_section(
        &self,
        context: &CourseServiceContext,
        course_id: String,
        command: Value,
    ) -> CourseResult<CourseSectionItem>;

    async fn reorder_sections(
        &self,
        context: &CourseServiceContext,
        course_id: String,
        section_ids: Vec<String>,
    ) -> CourseResult<Vec<CourseSectionItem>>;

    async fn delete_section(
        &self,
        context: &CourseServiceContext,
        section_id: String,
    ) -> CourseResult<()>;

    // Lessons
    async fn list_lessons(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Vec<CourseLessonItem>>;

    async fn retrieve_lesson(
        &self,
        context: &CourseServiceContext,
        lesson_id: String,
    ) -> CourseResult<Option<CourseLessonItem>>;

    async fn save_lesson(
        &self,
        context: &CourseServiceContext,
        command: CourseLessonCommand,
    ) -> CourseResult<CourseLessonItem>;

    async fn reorder_lessons(
        &self,
        context: &CourseServiceContext,
        course_id: String,
        lesson_ids: Vec<String>,
    ) -> CourseResult<Vec<CourseLessonItem>>;

    async fn delete_lesson(
        &self,
        context: &CourseServiceContext,
        lesson_id: String,
    ) -> CourseResult<()>;

    // Resources
    async fn list_resources(
        &self,
        context: &CourseServiceContext,
        owner_type: String,
        owner_id: String,
    ) -> CourseResult<Vec<Value>>;

    async fn save_resource_ref(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value>;

    async fn delete_resource_ref(
        &self,
        context: &CourseServiceContext,
        resource_ref_id: String,
    ) -> CourseResult<()>;

    // Live sessions
    async fn list_live_sessions(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>>;

    async fn retrieve_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<Option<Value>>;

    async fn save_live_session(
        &self,
        context: &CourseServiceContext,
        command: CourseLiveSessionCommand,
    ) -> CourseResult<String>;

    async fn transition_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
        live_status: String,
    ) -> CourseResult<()>;

    async fn attach_live_replay(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
        resource_ref_id: String,
    ) -> CourseResult<()>;

    // Enrollments
    async fn list_enrollments(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>>;

    async fn retrieve_enrollment(
        &self,
        context: &CourseServiceContext,
        enrollment_id: String,
    ) -> CourseResult<Option<Value>>;

    async fn enroll(
        &self,
        context: &CourseServiceContext,
        command: CourseEnrollmentCommand,
    ) -> CourseResult<String>;

    async fn revoke_enrollment(
        &self,
        context: &CourseServiceContext,
        enrollment_id: String,
    ) -> CourseResult<()>;

    // Progress
    async fn list_progress(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>>;

    async fn retrieve_progress(
        &self,
        context: &CourseServiceContext,
        enrollment_id: String,
    ) -> CourseResult<Option<Value>>;

    async fn update_lesson_progress(
        &self,
        context: &CourseServiceContext,
        command: CourseLessonProgressCommand,
    ) -> CourseResult<()>;

    async fn join_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<CourseLiveJoinGrant>;

    // Comments
    async fn list_comments(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseCommentItem>>;

    async fn create_comment(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<CourseCommentItem>;

    async fn moderate_comment(
        &self,
        context: &CourseServiceContext,
        comment_id: String,
        request: CourseCommentModerationRequest,
    ) -> CourseResult<Vec<CourseCommentItem>>;

    async fn delete_comment(
        &self,
        context: &CourseServiceContext,
        comment_id: String,
    ) -> CourseResult<()>;

    // Reactions
    async fn list_reactions(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>>;

    async fn save_reaction(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value>;

    async fn delete_reaction(
        &self,
        context: &CourseServiceContext,
        reaction_id: String,
    ) -> CourseResult<()>;

    // Applications
    async fn list_applications(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseApplicationItem>>;

    async fn retrieve_application(
        &self,
        context: &CourseServiceContext,
        application_id: String,
    ) -> CourseResult<Option<CourseApplicationItem>>;

    async fn submit_application(
        &self,
        context: &CourseServiceContext,
        request: CourseApplicationCreateRequest,
    ) -> CourseResult<CourseApplicationItem>;

    async fn review_application(
        &self,
        context: &CourseServiceContext,
        application_id: String,
        request: CourseApplicationReviewRequest,
    ) -> CourseResult<CourseApplicationItem>;

    async fn convert_application_to_course(
        &self,
        context: &CourseServiceContext,
        application_id: String,
    ) -> CourseResult<CourseItem>;

    // Audit logs
    async fn list_audit_logs(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseAuditLogItem>>;

    async fn retrieve_audit_log(
        &self,
        context: &CourseServiceContext,
        audit_log_id: String,
    ) -> CourseResult<Option<CourseAuditLogItem>>;

    async fn write_audit_log(
        &self,
        context: &CourseServiceContext,
        command: CourseAuditCommand,
    ) -> CourseResult<()>;

    // Progress
    async fn repair_lesson_progress(
        &self,
        context: &CourseServiceContext,
        lesson_progress_id: String,
        command: Value,
    ) -> CourseResult<()>;

    // Live sessions
    async fn heartbeat_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()>;

    async fn leave_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()>;

    async fn retrieve_live_session_replay(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<Option<Value>>;

    // Reports
    async fn list_reports_overview(&self, context: &CourseServiceContext) -> CourseResult<Value>;

    async fn list_reports_learning(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Value>;

    async fn list_reports_live_sessions(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Value>;
}

#[async_trait::async_trait]
impl CourseApplicationService for CourseServiceImpl {
    // ── Categories ──────────────────────────────────────────────────

    async fn list_categories(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseCategoryItem>> {
        self.category_repo.list_categories(context, query).await
    }

    async fn save_category(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value> {
        self.category_repo.save_category(context, command).await
    }

    async fn reorder_categories(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value> {
        let category_ids: Vec<String> = serde_json::from_value(
            command
                .get("categoryIds")
                .cloned()
                .unwrap_or(Value::Array(vec![])),
        )
        .unwrap_or_default();
        let categories = self
            .category_repo
            .reorder_categories(context, category_ids)
            .await?;
        Ok(serde_json::to_value(categories).unwrap_or_default())
    }

    async fn delete_category(
        &self,
        context: &CourseServiceContext,
        category_id: String,
    ) -> CourseResult<()> {
        self.category_repo
            .delete_category(context, category_id)
            .await
    }

    // ── Instructors ─────────────────────────────────────────────────

    async fn list_instructors(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>> {
        self.instructor_repo.list_instructors(context, query).await
    }

    async fn retrieve_instructor(
        &self,
        context: &CourseServiceContext,
        instructor_id: String,
    ) -> CourseResult<Option<Value>> {
        self.instructor_repo
            .retrieve_instructor(context, instructor_id)
            .await
    }

    async fn save_instructor(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value> {
        self.instructor_repo.save_instructor(context, command).await
    }

    async fn update_instructor_status(
        &self,
        context: &CourseServiceContext,
        instructor_id: String,
        command: Value,
    ) -> CourseResult<Value> {
        self.instructor_repo
            .update_instructor_status(context, instructor_id, command)
            .await
    }

    async fn delete_instructor(
        &self,
        context: &CourseServiceContext,
        instructor_id: String,
    ) -> CourseResult<()> {
        self.instructor_repo
            .delete_instructor(context, instructor_id)
            .await
    }

    // ── Courses ─────────────────────────────────────────────────────

    async fn list_courses(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<CoursePage> {
        let mut query = query;
        if context.user_id.is_none() {
            query.status = Some("published".to_string());
        }
        self.catalog_repo.list_courses(context, query).await
    }

    async fn retrieve_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Option<CourseItem>> {
        self.catalog_repo.retrieve_course(context, course_id).await
    }

    async fn create_course(
        &self,
        context: &CourseServiceContext,
        command: CourseCatalogCommand,
    ) -> CourseResult<CourseItem> {
        if let Some(ref cover) = command.cover {
            self.drive_port
                .validate_resource(context, cover.clone())
                .await?;
        }
        self.catalog_repo.save_course(context, command).await
    }

    async fn save_course(
        &self,
        context: &CourseServiceContext,
        command: CourseCatalogCommand,
    ) -> CourseResult<CourseItem> {
        if let Some(ref cover) = command.cover {
            self.drive_port
                .validate_resource(context, cover.clone())
                .await?;
        }
        self.catalog_repo.save_course(context, command).await
    }

    async fn delete_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<()> {
        self.catalog_repo.delete_course(context, course_id).await
    }

    async fn publish_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<CourseItem> {
        self.catalog_repo.publish_course(context, course_id).await
    }

    async fn unpublish_course(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<CourseItem> {
        self.catalog_repo.unpublish_course(context, course_id).await
    }

    // ── Offerings ───────────────────────────────────────────────────

    async fn list_offerings(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Vec<Value>> {
        self.offering_repo.list_offerings(context, course_id).await
    }

    async fn retrieve_offering(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
    ) -> CourseResult<Option<Value>> {
        self.offering_repo
            .retrieve_offering(context, offering_id)
            .await
    }

    async fn save_offering(
        &self,
        context: &CourseServiceContext,
        command: CourseOfferingCommand,
    ) -> CourseResult<String> {
        self.offering_repo.save_offering(context, command).await
    }

    async fn transition_offering(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
        status: String,
    ) -> CourseResult<()> {
        self.offering_repo
            .transition_offering(context, offering_id, status)
            .await
    }

    async fn delete_offering(
        &self,
        context: &CourseServiceContext,
        offering_id: String,
    ) -> CourseResult<()> {
        self.offering_repo
            .delete_offering(context, offering_id)
            .await
    }

    // ── Sections ────────────────────────────────────────────────────

    async fn list_sections(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Vec<CourseSectionItem>> {
        self.lesson_repo.list_sections(context, course_id).await
    }

    async fn save_section(
        &self,
        context: &CourseServiceContext,
        course_id: String,
        command: Value,
    ) -> CourseResult<CourseSectionItem> {
        self.lesson_repo
            .save_section(context, course_id, command)
            .await
    }

    async fn reorder_sections(
        &self,
        context: &CourseServiceContext,
        course_id: String,
        section_ids: Vec<String>,
    ) -> CourseResult<Vec<CourseSectionItem>> {
        let sections = self
            .lesson_repo
            .list_sections(context, course_id.clone())
            .await?;
        for sid in &section_ids {
            if !sections.iter().any(|s| s.id == *sid) {
                return Err(CourseError::invalid(format!("Section {} not found", sid)));
            }
        }
        self.lesson_repo
            .reorder_sections(context, course_id, section_ids)
            .await
    }

    async fn delete_section(
        &self,
        context: &CourseServiceContext,
        section_id: String,
    ) -> CourseResult<()> {
        self.lesson_repo.delete_section(context, section_id).await
    }

    // ── Lessons ─────────────────────────────────────────────────────

    async fn list_lessons(
        &self,
        context: &CourseServiceContext,
        course_id: String,
    ) -> CourseResult<Vec<CourseLessonItem>> {
        self.lesson_repo.list_lessons(context, course_id).await
    }

    async fn retrieve_lesson(
        &self,
        context: &CourseServiceContext,
        lesson_id: String,
    ) -> CourseResult<Option<CourseLessonItem>> {
        self.lesson_repo.retrieve_lesson(context, lesson_id).await
    }

    async fn save_lesson(
        &self,
        context: &CourseServiceContext,
        command: CourseLessonCommand,
    ) -> CourseResult<CourseLessonItem> {
        for resource in &command.resources {
            self.drive_port
                .validate_resource(context, resource.clone())
                .await?;
        }
        self.lesson_repo.save_lesson(context, command).await
    }

    async fn reorder_lessons(
        &self,
        context: &CourseServiceContext,
        course_id: String,
        lesson_ids: Vec<String>,
    ) -> CourseResult<Vec<CourseLessonItem>> {
        self.lesson_repo
            .reorder_lessons(context, course_id, lesson_ids)
            .await
    }

    async fn delete_lesson(
        &self,
        context: &CourseServiceContext,
        lesson_id: String,
    ) -> CourseResult<()> {
        self.lesson_repo.delete_lesson(context, lesson_id).await
    }

    // ── Resources ───────────────────────────────────────────────────

    async fn list_resources(
        &self,
        context: &CourseServiceContext,
        owner_type: String,
        owner_id: String,
    ) -> CourseResult<Vec<Value>> {
        self.resource_repo
            .list_resources(context, owner_type, owner_id)
            .await
    }

    async fn save_resource_ref(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value> {
        self.resource_repo.save_resource_ref(context, command).await
    }

    async fn delete_resource_ref(
        &self,
        context: &CourseServiceContext,
        resource_ref_id: String,
    ) -> CourseResult<()> {
        self.resource_repo
            .delete_resource_ref(context, resource_ref_id)
            .await
    }

    // ── Live sessions ───────────────────────────────────────────────

    async fn list_live_sessions(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>> {
        self.live_session_repo
            .list_live_sessions(context, query)
            .await
    }

    async fn retrieve_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<Option<Value>> {
        self.live_session_repo
            .retrieve_live_session(context, live_session_id)
            .await
    }

    async fn save_live_session(
        &self,
        context: &CourseServiceContext,
        command: CourseLiveSessionCommand,
    ) -> CourseResult<String> {
        let _room_ref = self
            .live_provider_port
            .reserve_room(context, command.live_session_id.clone().unwrap_or_default())
            .await?;
        self.live_session_repo
            .save_live_session(context, command)
            .await
    }

    async fn transition_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
        live_status: String,
    ) -> CourseResult<()> {
        self.live_session_repo
            .transition_live_session(context, live_session_id, live_status)
            .await
    }

    async fn attach_live_replay(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
        resource_ref_id: String,
    ) -> CourseResult<()> {
        self.live_session_repo
            .attach_live_replay(context, live_session_id, resource_ref_id)
            .await
    }

    // ── Enrollments ─────────────────────────────────────────────────

    async fn list_enrollments(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>> {
        self.enrollment_repo.list_enrollments(context, query).await
    }

    async fn retrieve_enrollment(
        &self,
        context: &CourseServiceContext,
        enrollment_id: String,
    ) -> CourseResult<Option<Value>> {
        self.enrollment_repo
            .retrieve_enrollment(context, enrollment_id)
            .await
    }

    async fn enroll(
        &self,
        context: &CourseServiceContext,
        command: CourseEnrollmentCommand,
    ) -> CourseResult<String> {
        let has_access = self
            .entitlement_port
            .verify_learning_access(
                context,
                command.offering_id.clone(),
                command.learner_user_id.clone(),
            )
            .await?;

        if !has_access && command.source == "self_service" {
            return Err(CourseError::invalid("Entitlement required for enrollment"));
        }

        self.enrollment_repo
            .create_enrollment(context, command)
            .await
    }

    async fn revoke_enrollment(
        &self,
        context: &CourseServiceContext,
        enrollment_id: String,
    ) -> CourseResult<()> {
        self.enrollment_repo
            .revoke_enrollment(context, enrollment_id)
            .await
    }

    // ── Progress ────────────────────────────────────────────────────

    async fn list_progress(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>> {
        self.progress_repo.list_progress(context, query).await
    }

    async fn retrieve_progress(
        &self,
        context: &CourseServiceContext,
        enrollment_id: String,
    ) -> CourseResult<Option<Value>> {
        self.progress_repo
            .retrieve_progress(context, enrollment_id)
            .await
    }

    async fn update_lesson_progress(
        &self,
        context: &CourseServiceContext,
        command: CourseLessonProgressCommand,
    ) -> CourseResult<()> {
        self.progress_repo
            .upsert_lesson_progress(context, command)
            .await
    }

    async fn join_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<CourseLiveJoinGrant> {
        let user_id = context
            .user_id
            .clone()
            .ok_or_else(|| CourseError::invalid("User ID required"))?;

        self.live_provider_port
            .create_join_grant(context, live_session_id, user_id)
            .await
    }

    // ── Comments ────────────────────────────────────────────────────

    async fn list_comments(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseCommentItem>> {
        self.comment_repo.list_comments(context, query).await
    }

    async fn create_comment(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<CourseCommentItem> {
        self.comment_repo.create_comment(context, command).await
    }

    async fn moderate_comment(
        &self,
        context: &CourseServiceContext,
        comment_id: String,
        request: CourseCommentModerationRequest,
    ) -> CourseResult<Vec<CourseCommentItem>> {
        let result = self
            .comment_repo
            .moderate_comment(context, comment_id.clone(), request.clone())
            .await?;

        self.audit_repo
            .append_audit_log(
                context,
                CourseAuditCommand {
                    target_type: "comment".to_string(),
                    target_id: comment_id,
                    operation: "moderate".to_string(),
                    before_snapshot: None,
                    after_snapshot: Some(serde_json::to_value(&request).unwrap_or_default()),
                },
            )
            .await?;

        Ok(result)
    }

    async fn delete_comment(
        &self,
        context: &CourseServiceContext,
        comment_id: String,
    ) -> CourseResult<()> {
        self.comment_repo.delete_comment(context, comment_id).await
    }

    // ── Reactions ───────────────────────────────────────────────────

    async fn list_reactions(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<Value>> {
        self.reaction_repo.list_reactions(context, query).await
    }

    async fn save_reaction(
        &self,
        context: &CourseServiceContext,
        command: Value,
    ) -> CourseResult<Value> {
        self.reaction_repo.save_reaction(context, command).await
    }

    async fn delete_reaction(
        &self,
        context: &CourseServiceContext,
        reaction_id: String,
    ) -> CourseResult<()> {
        self.reaction_repo
            .delete_reaction(context, reaction_id)
            .await
    }

    // ── Applications ────────────────────────────────────────────────

    async fn list_applications(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseApplicationItem>> {
        self.application_repo
            .list_applications(context, query)
            .await
    }

    async fn retrieve_application(
        &self,
        context: &CourseServiceContext,
        application_id: String,
    ) -> CourseResult<Option<CourseApplicationItem>> {
        self.application_repo
            .retrieve_application(context, application_id)
            .await
    }

    async fn submit_application(
        &self,
        context: &CourseServiceContext,
        request: CourseApplicationCreateRequest,
    ) -> CourseResult<CourseApplicationItem> {
        self.application_repo
            .submit_application(context, request)
            .await
    }

    async fn review_application(
        &self,
        context: &CourseServiceContext,
        application_id: String,
        request: CourseApplicationReviewRequest,
    ) -> CourseResult<CourseApplicationItem> {
        let result = self
            .application_repo
            .review_application(context, application_id.clone(), request.clone())
            .await?;

        self.audit_repo
            .append_audit_log(
                context,
                CourseAuditCommand {
                    target_type: "application".to_string(),
                    target_id: application_id,
                    operation: "review".to_string(),
                    before_snapshot: None,
                    after_snapshot: Some(serde_json::to_value(&request).unwrap_or_default()),
                },
            )
            .await?;

        Ok(result)
    }

    async fn convert_application_to_course(
        &self,
        context: &CourseServiceContext,
        application_id: String,
    ) -> CourseResult<CourseItem> {
        self.application_repo
            .convert_to_course(context, application_id)
            .await
    }

    // ── Audit logs ──────────────────────────────────────────────────

    async fn list_audit_logs(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Vec<CourseAuditLogItem>> {
        self.audit_repo.list_audit_logs(context, query).await
    }

    async fn retrieve_audit_log(
        &self,
        context: &CourseServiceContext,
        audit_log_id: String,
    ) -> CourseResult<Option<CourseAuditLogItem>> {
        self.audit_repo
            .retrieve_audit_log(context, audit_log_id)
            .await
    }

    async fn write_audit_log(
        &self,
        context: &CourseServiceContext,
        command: CourseAuditCommand,
    ) -> CourseResult<()> {
        self.audit_repo.append_audit_log(context, command).await?;
        self.audit_event_port
            .publish_audit_event(context, "audit.created".to_string())
            .await?;
        Ok(())
    }

    // ── Progress ────────────────────────────────────────────────────

    async fn repair_lesson_progress(
        &self,
        context: &CourseServiceContext,
        lesson_progress_id: String,
        command: Value,
    ) -> CourseResult<()> {
        self.progress_repo
            .repair_lesson_progress(context, lesson_progress_id, command)
            .await
    }

    // ── Live sessions ───────────────────────────────────────────────

    async fn heartbeat_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()> {
        // Update last_heartbeat_at in lesson progress
        let _ = self
            .live_session_repo
            .retrieve_live_session(context, live_session_id.clone())
            .await?;
        Ok(())
    }

    async fn leave_live_session(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<()> {
        // Record leave time in lesson progress
        let _ = self
            .live_session_repo
            .retrieve_live_session(context, live_session_id)
            .await?;
        Ok(())
    }

    async fn retrieve_live_session_replay(
        &self,
        context: &CourseServiceContext,
        live_session_id: String,
    ) -> CourseResult<Option<Value>> {
        self.live_session_repo
            .retrieve_live_session(context, live_session_id)
            .await
    }

    // ── Reports ─────────────────────────────────────────────────────

    async fn list_reports_overview(&self, context: &CourseServiceContext) -> CourseResult<Value> {
        // Aggregate counts from multiple repositories
        let courses = self
            .catalog_repo
            .list_courses(context, CourseQuery::default())
            .await?;
        let enrollments = self
            .enrollment_repo
            .list_enrollments(context, CourseQuery::default())
            .await?;
        let applications = self
            .application_repo
            .list_applications(context, CourseQuery::default())
            .await?;

        Ok(serde_json::json!({
            "totalCourses": courses.total,
            "totalEnrollments": enrollments.len(),
            "totalApplications": applications.len(),
            "publishedCourses": courses.items.iter().filter(|c| c.status == "published").count(),
        }))
    }

    async fn list_reports_learning(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Value> {
        let progress = self.progress_repo.list_progress(context, query).await?;
        Ok(serde_json::json!({ "items": progress }))
    }

    async fn list_reports_live_sessions(
        &self,
        context: &CourseServiceContext,
        query: CourseQuery,
    ) -> CourseResult<Value> {
        let sessions = self
            .live_session_repo
            .list_live_sessions(context, query)
            .await?;
        Ok(serde_json::json!({ "items": sessions }))
    }
}
