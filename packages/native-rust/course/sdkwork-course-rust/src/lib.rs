mod router;
mod storage;
mod types;

pub use router::{
    course_router, course_router_with_postgres_pool, course_router_with_sqlite_pool,
    course_router_with_store,
};
pub use storage::{CourseStore, EmptyCourseStore, PostgresCourseStore, SqliteCourseStore};
pub use types::{
    CourseApiResult, CourseApplicationCreateRequest, CourseApplicationItem,
    CourseApplicationReviewRequest, CourseCategoryItem, CourseCommentItem,
    CourseCommentModerationRequest, CourseEngagementItem, CourseError, CourseItem,
    CourseLessonItem, CourseLessonMutationRequest, CourseMutationRequest, CoursePage,
    CourseQuery, CourseRelationInput, CourseRelationItem, CourseRelationsReplaceRequest,
    CourseResult, CourseSectionItem, CourseSectionMutationRequest,
};

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
