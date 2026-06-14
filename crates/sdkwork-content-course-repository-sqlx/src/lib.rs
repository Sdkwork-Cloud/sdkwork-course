//! SQLx repository implementation for SDKWork content course.

pub mod db;
pub mod repository;

pub use db::schema::{
    COURSE_APPLICATION_TABLE, COURSE_AUDIT_LOG_TABLE, COURSE_CATALOG_TABLE, COURSE_CATEGORY_TABLE,
    COURSE_COMMENT_TABLE, COURSE_ENROLLMENT_TABLE, COURSE_INSTRUCTOR_TABLE,
    COURSE_LEARNING_PROGRESS_TABLE, COURSE_LESSON_PROGRESS_TABLE, COURSE_LESSON_TABLE,
    COURSE_LIVE_SESSION_TABLE, COURSE_OFFERING_TABLE, COURSE_REACTION_TABLE,
    COURSE_RESOURCE_REF_TABLE, COURSE_SECTION_TABLE, COURSE_TABLES,
};
pub use repository::course_repository::{
    CourseRepositoryFuture, CourseSqlxRepositoryPort, EmptyCourseRepository,
    PostgresCourseRepository, SqliteCourseRepository, SqlxCourseRepository,
};

// Re-export for compatibility
pub use sdkwork_content_course_service::CourseAuditLogItem;
