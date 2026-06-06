use sdkwork_course::{
    CourseApplicationCreateRequest, CourseApplicationReviewRequest, CourseLessonMutationRequest,
    CourseMutationRequest, CourseQuery, CourseRelationInput, CourseSectionMutationRequest,
    CourseStore, SqliteCourseStore,
};
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_store_applies_course_schema_and_creates_records() {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .expect("sqlite memory pool");
    let store = SqliteCourseStore::new(pool.clone());
    store
        .apply_foundation_migration()
        .await
        .expect("course migration applies");

    let table_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM sqlite_master WHERE type = 'table' AND name IN (
          'course_category',
          'course_catalog',
          'course_section',
          'course_lesson',
          'course_relation',
          'course_application',
          'course_comment',
          'course_reaction',
          'course_audit_log'
        )",
    )
    .fetch_one(&pool)
    .await
    .expect("table count");
    assert_eq!(table_count, 9);

    let created = store
        .create_course(CourseMutationRequest {
            course_code: Some("ai-native-learning-systems".to_owned()),
            title: Some("AI Native Learning Systems".to_owned()),
            description: Some("Course architecture and implementation track.".to_owned()),
            level: Some("advanced".to_owned()),
            category: Some("architecture".to_owned()),
            tags: Some(vec!["rust".to_owned(), "sdk".to_owned()]),
            status: Some("published".to_owned()),
            ..CourseMutationRequest::default()
        })
        .await
        .expect("course create");
    assert_eq!(created.title, "AI Native Learning Systems");
    assert_eq!(created.course_code, "ai-native-learning-systems");
    assert_eq!(created.description.as_deref(), Some("Course architecture and implementation track."));
    assert_eq!(created.level.as_deref(), Some("advanced"));
    assert_eq!(created.category.as_deref(), Some("architecture"));
    assert_eq!(created.tags, vec!["rust".to_owned(), "sdk".to_owned()]);
    assert_eq!(created.status, "published");

    let page = store
        .list_courses(Default::default())
        .await
        .expect("course list");
    assert_eq!(page.items.len(), 1, "published records are public by default");

    let updated = store
        .update_course(
            created.id.clone(),
            CourseMutationRequest {
                title: Some("AI Native Learning Systems Course".to_owned()),
                description: Some("Updated course description.".to_owned()),
                category: Some("implementation".to_owned()),
                tags: Some(vec!["course".to_owned()]),
                status: Some("published".to_owned()),
                ..CourseMutationRequest::default()
            },
        )
        .await
        .expect("course update");
    assert_eq!(updated.title, "AI Native Learning Systems Course");
    assert_eq!(updated.description.as_deref(), Some("Updated course description."));
    assert_eq!(updated.category.as_deref(), Some("implementation"));
    assert_eq!(updated.tags, vec!["course".to_owned()]);

    let application = store
        .create_application(CourseApplicationCreateRequest {
            title: "Submit a router course".to_owned(),
            category: "architecture".to_owned(),
            description: "Course material submitted by an author.".to_owned(),
            source_provider: "manual".to_owned(),
            contact_name: Some("Author".to_owned()),
            ..CourseApplicationCreateRequest::default()
        })
        .await
        .expect("application create");
    assert_eq!(application.status, "submitted");

    let applications = store
        .list_applications(Default::default())
        .await
        .expect("application list");
    assert_eq!(applications.len(), 1);

    let reviewed = store
        .review_application(
            application.id.clone(),
            CourseApplicationReviewRequest {
                status: "approved".to_owned(),
                review_note: Some("accepted".to_owned()),
            },
        )
        .await
        .expect("application review");
    assert_eq!(reviewed.status, "approved");

    let section = store
        .create_section(
            created.id.clone(),
            CourseSectionMutationRequest {
                section_no: Some("s1".to_owned()),
                title: Some("Foundation".to_owned()),
                description: Some("Setup and context.".to_owned()),
                duration_seconds: Some(90),
                sort_weight: Some(10),
                status: Some("published".to_owned()),
            },
        )
        .await
        .expect("section create");
    assert_eq!(section.title, "Foundation");
    assert_eq!(section.duration_seconds, 90);

    let updated_section = store
        .update_section(
            section.id.clone(),
            CourseSectionMutationRequest {
                title: Some("Foundation Updated".to_owned()),
                description: Some("Updated section context.".to_owned()),
                duration_seconds: Some(120),
                sort_weight: Some(20),
                status: Some("published".to_owned()),
                ..CourseSectionMutationRequest::default()
            },
        )
        .await
        .expect("section update");
    assert_eq!(updated_section.title, "Foundation Updated");
    assert_eq!(updated_section.duration_seconds, 120);
    assert_eq!(updated_section.sort_weight, 20);

    let lesson = store
        .create_lesson(
            created.id.clone(),
            CourseLessonMutationRequest {
                section_id: Some(section.id.clone()),
                lesson_no: Some("l1".to_owned()),
                title: Some("Router Contracts".to_owned()),
                description: Some("Designing generated SDK contracts.".to_owned()),
                external_bvid: Some("BV1course".to_owned()),
                duration_seconds: Some(180),
                free_preview: Some(true),
                status: Some("published".to_owned()),
                ..CourseLessonMutationRequest::default()
            },
        )
        .await
        .expect("lesson create");
    assert_eq!(lesson.title, "Router Contracts");
    assert_eq!(lesson.external_bvid.as_deref(), Some("BV1course"));
    assert!(lesson.free_preview);

    let updated_lesson = store
        .update_lesson(
            lesson.id.clone(),
            CourseLessonMutationRequest {
                title: Some("Router Contracts Updated".to_owned()),
                description: Some("Updated lesson.".to_owned()),
                duration_seconds: Some(240),
                free_preview: Some(false),
                status: Some("published".to_owned()),
                ..CourseLessonMutationRequest::default()
            },
        )
        .await
        .expect("lesson update");
    assert_eq!(updated_lesson.title, "Router Contracts Updated");
    assert_eq!(updated_lesson.duration_seconds, 240);
    assert!(!updated_lesson.free_preview);

    let relations = store
        .replace_relations(
            created.id.clone(),
            vec![CourseRelationInput {
                related_course_id: "related-course-1".to_owned(),
                relation_type: Some("next".to_owned()),
                sort_weight: Some(1),
                status: Some("published".to_owned()),
            }],
        )
        .await
        .expect("relation replace");
    assert_eq!(relations.len(), 1);
    assert_eq!(relations[0].related_course_id, "related-course-1");

    sqlx::query(
        "INSERT INTO course_comment (
          id, tenant_id, organization_id, course_id, content, status, created_at, updated_at
        ) VALUES ('comment-1', 'default', 'default', ?, 'Useful course', 'pending', '1', '1')",
    )
    .bind(&created.id)
    .execute(&pool)
    .await
    .expect("seed comment");

    let moderated_comments = store
        .moderate_comment(
            "comment-1".to_owned(),
            sdkwork_course::CourseCommentModerationRequest {
                status: "published".to_owned(),
                moderation_note: Some("ok".to_owned()),
            },
        )
        .await
        .expect("comment moderation");
    assert_eq!(moderated_comments.len(), 1);

    let engagement = store
        .list_engagement(CourseQuery {
            status: Some("published".to_owned()),
            ..CourseQuery::default()
        })
        .await
        .expect("engagement list");
    assert_eq!(engagement.len(), 1);
}
