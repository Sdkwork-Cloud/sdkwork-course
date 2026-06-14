use sdkwork_content_course_repository_sqlx::db::schema::COURSE_TABLES;
use sdkwork_content_course_repository_sqlx::{EmptyCourseRepository, SqliteCourseRepository};
use sqlx::SqlitePool;

#[test]
fn course_repository_schema_lists_the_professional_course_tables() {
    assert_eq!(COURSE_TABLES.len(), 15);
    assert!(COURSE_TABLES.contains(&"course_catalog"));
    assert!(COURSE_TABLES.contains(&"course_offering"));
    assert!(COURSE_TABLES.contains(&"course_live_session"));
    assert!(COURSE_TABLES.contains(&"course_learning_progress"));
    assert!(COURSE_TABLES.contains(&"course_lesson_progress"));
    assert!(COURSE_TABLES.contains(&"course_audit_log"));

    let repository = EmptyCourseRepository::new();
    assert_eq!(repository, EmptyCourseRepository);
}

#[tokio::test]
async fn sqlite_repository_applies_the_foundation_schema() {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .expect("sqlite memory pool");
    let repository = SqliteCourseRepository::new(pool.clone());
    repository
        .apply_foundation_migration()
        .await
        .expect("course foundation migration applies");

    let table_names = COURSE_TABLES
        .iter()
        .map(|table_name| format!("'{table_name}'"))
        .collect::<Vec<_>>()
        .join(", ");
    let sql = format!(
        "SELECT COUNT(1) FROM sqlite_master WHERE type = 'table' AND name IN ({table_names})"
    );
    let table_count: i64 = sqlx::query_scalar(&sql)
        .fetch_one(&pool)
        .await
        .expect("course table count");

    assert_eq!(table_count, 15);
    assert!(
        !repository
            .foundation_migration_sql()
            .contains("course_relation"),
        "legacy course_relation table must not reappear"
    );
}
