use std::fs;
use std::path::PathBuf;

use sdkwork_content_course_repository_sqlx::db::schema::COURSE_TABLES;
use sdkwork_content_course_repository_sqlx::{EmptyCourseRepository, SqliteCourseRepository};
use sqlx::SqlitePool;

fn sqlite_baseline_sql() -> String {
    let baseline_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../tests/fixtures/database/sqlite/ddl/baseline/0001_course_baseline.sql");
    fs::read_to_string(baseline_path).expect("course sqlite baseline ddl")
}

async fn apply_baseline_sql(pool: &SqlitePool, baseline_sql: &str) {
    let executable_sql = baseline_sql
        .lines()
        .filter(|line| !line.trim_start().starts_with("--"))
        .collect::<Vec<_>>()
        .join("\n");

    for statement in executable_sql.split(';') {
        let sql = statement.trim();
        if sql.is_empty() {
            continue;
        }
        sqlx::query(sqlx::AssertSqlSafe(sql))
            .execute(pool)
            .await
            .expect("baseline statement applies");
    }
}

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
async fn sqlite_repository_applies_the_database_baseline_schema() {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .expect("sqlite memory pool");
    let repository = SqliteCourseRepository::new(pool.clone());
    let baseline_sql = sqlite_baseline_sql();
    apply_baseline_sql(&pool, &baseline_sql).await;

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
        !baseline_sql.contains("course_relation"),
        "legacy course_relation table must not reappear"
    );
    assert_eq!(repository.table_names().len(), 15);
}
