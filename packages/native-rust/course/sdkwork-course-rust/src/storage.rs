use std::future::Future;
use std::pin::Pin;

use sqlx::{ColumnIndex, Decode, PgPool, Row, SqlitePool, Type};

use crate::types::{
    CourseApplicationCreateRequest, CourseApplicationItem, CourseApplicationReviewRequest,
    CourseCategoryItem, CourseCommentItem, CourseCommentModerationRequest, CourseEngagementItem,
    CourseError, CourseItem, CourseLessonItem, CourseLessonMutationRequest,
    CourseMutationRequest, CoursePage, CourseQuery, CourseRelationInput, CourseRelationItem,
    CourseResult, CourseSectionItem, CourseSectionMutationRequest,
};

pub type CourseStoreFuture<'a, T> = Pin<Box<dyn Future<Output = CourseResult<T>> + Send + 'a>>;

pub trait CourseStore {
    fn list_categories<'a>(&'a self, status: Option<String>) -> CourseStoreFuture<'a, Vec<CourseCategoryItem>>;

    fn list_courses<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, CoursePage>;

    fn get_course<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, Option<CourseItem>>;

    fn list_sections<'a>(
        &'a self,
        course_id: String,
        status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseSectionItem>>;

    fn list_lessons<'a>(
        &'a self,
        course_id: String,
        status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseLessonItem>>;

    fn list_relations<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, Vec<CourseRelationItem>>;

    fn create_application<'a>(
        &'a self,
        request: CourseApplicationCreateRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem>;

    fn list_applications<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseApplicationItem>>;

    fn review_application<'a>(
        &'a self,
        application_id: String,
        request: CourseApplicationReviewRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem>;

    fn create_course<'a>(&'a self, request: CourseMutationRequest) -> CourseStoreFuture<'a, CourseItem>;

    fn update_course<'a>(
        &'a self,
        course_id: String,
        request: CourseMutationRequest,
    ) -> CourseStoreFuture<'a, CourseItem>;

    fn delete_course<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, bool>;

    fn create_section<'a>(
        &'a self,
        course_id: String,
        request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem>;

    fn update_section<'a>(
        &'a self,
        section_id: String,
        request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem>;

    fn delete_section<'a>(&'a self, section_id: String) -> CourseStoreFuture<'a, bool>;

    fn create_lesson<'a>(
        &'a self,
        course_id: String,
        request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem>;

    fn update_lesson<'a>(
        &'a self,
        lesson_id: String,
        request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem>;

    fn delete_lesson<'a>(&'a self, lesson_id: String) -> CourseStoreFuture<'a, bool>;

    fn replace_relations<'a>(
        &'a self,
        course_id: String,
        items: Vec<CourseRelationInput>,
    ) -> CourseStoreFuture<'a, Vec<CourseRelationItem>>;

    fn list_comments<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseCommentItem>>;

    fn moderate_comment<'a>(
        &'a self,
        comment_id: String,
        request: CourseCommentModerationRequest,
    ) -> CourseStoreFuture<'a, Vec<CourseCommentItem>>;

    fn list_engagement<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseEngagementItem>>;
}

#[derive(Debug, Clone)]
pub struct SqliteCourseStore {
    pool: SqlitePool,
}

impl SqliteCourseStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn apply_foundation_migration(&self) -> CourseResult<()> {
        for statement in include_str!("../migrations/0001_course_foundation.sql").split(';') {
            let sql = statement.trim();
            if sql.is_empty() {
                continue;
            }

            sqlx::query(sql).execute(&self.pool).await?;
        }

        Ok(())
    }

    async fn get_application(&self, application_id: String) -> CourseResult<Option<CourseApplicationItem>> {
        let row = sqlx::query(
            "SELECT id, title, category, source_provider, status, contact_name, submitted_at, reviewed_at
             FROM course_application
             WHERE id = ?",
        )
        .bind(application_id)
        .fetch_optional(&self.pool)
        .await?;

        row.map(|row| application_from_row(&row)).transpose()
    }

    async fn get_section(&self, section_id: String) -> CourseResult<Option<CourseSectionItem>> {
        let row = sqlx::query(
            "SELECT id, course_id, section_no, title, description, lesson_count, duration_seconds, sort_weight, status
             FROM course_section
             WHERE id = ?",
        )
        .bind(section_id)
        .fetch_optional(&self.pool)
        .await?;

        row.map(|row| section_from_row(&row)).transpose()
    }

    async fn get_lesson(&self, lesson_id: String) -> CourseResult<Option<CourseLessonItem>> {
        let row = sqlx::query(
            "SELECT id, course_id, section_id, lesson_no, title, description, video_resource_snapshot,
              external_bvid, duration_seconds, duration_text, content, free_preview, sort_weight, status
             FROM course_lesson
             WHERE id = ?",
        )
        .bind(lesson_id)
        .fetch_optional(&self.pool)
        .await?;

        row.map(|row| lesson_from_row(&row)).transpose()
    }
}

#[derive(Debug, Clone)]
pub struct PostgresCourseStore {
    pool: PgPool,
}

impl PostgresCourseStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    async fn get_application(&self, application_id: String) -> CourseResult<Option<CourseApplicationItem>> {
        let row = sqlx::query(
            "SELECT id, title, category, source_provider, status, contact_name, submitted_at, reviewed_at
             FROM course_application
             WHERE id = $1",
        )
        .bind(application_id)
        .fetch_optional(&self.pool)
        .await?;

        row.map(|row| application_from_row(&row)).transpose()
    }

    async fn get_section(&self, section_id: String) -> CourseResult<Option<CourseSectionItem>> {
        let row = sqlx::query(
            "SELECT id, course_id, section_no, title, description, lesson_count, duration_seconds, sort_weight, status
             FROM course_section
             WHERE id = $1",
        )
        .bind(section_id)
        .fetch_optional(&self.pool)
        .await?;

        row.map(|row| section_from_row(&row)).transpose()
    }

    async fn get_lesson(&self, lesson_id: String) -> CourseResult<Option<CourseLessonItem>> {
        let row = sqlx::query(
            "SELECT id, course_id, section_id, lesson_no, title, description, video_resource_snapshot,
              external_bvid, duration_seconds, duration_text, content, free_preview, sort_weight, status
             FROM course_lesson
             WHERE id = $1",
        )
        .bind(lesson_id)
        .fetch_optional(&self.pool)
        .await?;

        row.map(|row| lesson_from_row(&row)).transpose()
    }
}

#[derive(Debug, Clone, Default)]
pub struct EmptyCourseStore;

impl CourseStore for EmptyCourseStore {
    fn list_categories<'a>(&'a self, _status: Option<String>) -> CourseStoreFuture<'a, Vec<CourseCategoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_courses<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, CoursePage> {
        Box::pin(async move {
            Ok(CoursePage {
                items: Vec::new(),
                page: query.page.unwrap_or(1).max(1),
                page_size: query.limit(),
                total: 0,
            })
        })
    }

    fn get_course<'a>(&'a self, _course_id: String) -> CourseStoreFuture<'a, Option<CourseItem>> {
        Box::pin(async { Ok(None) })
    }

    fn list_sections<'a>(
        &'a self,
        _course_id: String,
        _status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseSectionItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_lessons<'a>(
        &'a self,
        _course_id: String,
        _status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseLessonItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn list_relations<'a>(&'a self, _course_id: String) -> CourseStoreFuture<'a, Vec<CourseRelationItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn create_application<'a>(
        &'a self,
        _request: CourseApplicationCreateRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem> {
        Box::pin(async { Err(CourseError::storage("course application store is unavailable")) })
    }

    fn list_applications<'a>(&'a self, _query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseApplicationItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn review_application<'a>(
        &'a self,
        _application_id: String,
        _request: CourseApplicationReviewRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem> {
        Box::pin(async { Err(CourseError::storage("course application review store is unavailable")) })
    }

    fn create_course<'a>(&'a self, _request: CourseMutationRequest) -> CourseStoreFuture<'a, CourseItem> {
        Box::pin(async { Err(CourseError::storage("course store is unavailable")) })
    }

    fn update_course<'a>(
        &'a self,
        _course_id: String,
        _request: CourseMutationRequest,
    ) -> CourseStoreFuture<'a, CourseItem> {
        Box::pin(async { Err(CourseError::storage("course store is unavailable")) })
    }

    fn delete_course<'a>(&'a self, _course_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async { Err(CourseError::storage("course store is unavailable")) })
    }

    fn create_section<'a>(
        &'a self,
        _course_id: String,
        _request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem> {
        Box::pin(async { Err(CourseError::storage("course section store is unavailable")) })
    }

    fn update_section<'a>(
        &'a self,
        _section_id: String,
        _request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem> {
        Box::pin(async { Err(CourseError::storage("course section store is unavailable")) })
    }

    fn delete_section<'a>(&'a self, _section_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async { Err(CourseError::storage("course section store is unavailable")) })
    }

    fn create_lesson<'a>(
        &'a self,
        _course_id: String,
        _request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem> {
        Box::pin(async { Err(CourseError::storage("course lesson store is unavailable")) })
    }

    fn update_lesson<'a>(
        &'a self,
        _lesson_id: String,
        _request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem> {
        Box::pin(async { Err(CourseError::storage("course lesson store is unavailable")) })
    }

    fn delete_lesson<'a>(&'a self, _lesson_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async { Err(CourseError::storage("course lesson store is unavailable")) })
    }

    fn replace_relations<'a>(
        &'a self,
        _course_id: String,
        _items: Vec<CourseRelationInput>,
    ) -> CourseStoreFuture<'a, Vec<CourseRelationItem>> {
        Box::pin(async { Err(CourseError::storage("course relation store is unavailable")) })
    }

    fn list_comments<'a>(&'a self, _query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseCommentItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn moderate_comment<'a>(
        &'a self,
        _comment_id: String,
        _request: CourseCommentModerationRequest,
    ) -> CourseStoreFuture<'a, Vec<CourseCommentItem>> {
        Box::pin(async { Err(CourseError::storage("course comment store is unavailable")) })
    }

    fn list_engagement<'a>(&'a self, _query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseEngagementItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

impl CourseStore for SqliteCourseStore {
    fn list_categories<'a>(&'a self, status: Option<String>) -> CourseStoreFuture<'a, Vec<CourseCategoryItem>> {
        Box::pin(async move {
            let status = status.unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT c.id, c.category_code, c.name, c.description, c.icon_key, c.sort_weight,
                  (SELECT COUNT(1) FROM course_catalog cc WHERE cc.tenant_id = c.tenant_id AND cc.category = c.category_code AND cc.status = 'published') AS course_count
                 FROM course_category c
                 WHERE c.status = ?
                 ORDER BY c.sort_weight ASC, c.name ASC",
            )
            .bind(status)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter()
                .map(|row| {
                    Ok(CourseCategoryItem {
                        id: row.try_get("id")?,
                        code: row.try_get("category_code")?,
                        name: row.try_get("name")?,
                        description: row.try_get("description")?,
                        icon_key: row.try_get("icon_key")?,
                        sort_weight: row.try_get("sort_weight")?,
                        course_count: row.try_get("course_count")?,
                    })
                })
                .collect()
        })
    }

    fn list_courses<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, CoursePage> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_code, title, description, thumbnail_resource_snapshot, instructor_snapshot,
                  duration_text, lessons_count, rating_score, students_count, level, category,
                  tags_json, content, external_bvid, status
                 FROM course_catalog
                 WHERE status = ?
                 ORDER BY updated_at DESC, title ASC
                 LIMIT ? OFFSET ?",
            )
            .bind(status)
            .bind(query.limit())
            .bind(query.offset())
            .fetch_all(&self.pool)
            .await?;

            let items = rows.into_iter().map(|row| course_item_from_row(&row)).collect::<CourseResult<Vec<_>>>()?;
            let total = items.len() as i64;
            Ok(CoursePage {
                items,
                page: query.page.unwrap_or(1).max(1),
                page_size: query.limit(),
                total,
            })
        })
    }

    fn get_course<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, Option<CourseItem>> {
        Box::pin(async move {
            let row = sqlx::query(
                "SELECT id, course_code, title, description, thumbnail_resource_snapshot, instructor_snapshot,
                  duration_text, lessons_count, rating_score, students_count, level, category,
                  tags_json, content, external_bvid, status
                 FROM course_catalog
                 WHERE id = ?",
            )
            .bind(course_id)
            .fetch_optional(&self.pool)
            .await?;

            row.map(|row| course_item_from_row(&row)).transpose()
        })
    }

    fn list_sections<'a>(
        &'a self,
        course_id: String,
        status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseSectionItem>> {
        Box::pin(async move {
            let status = status.unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_id, section_no, title, description, lesson_count, duration_seconds, sort_weight, status
                 FROM course_section
                 WHERE course_id = ? AND status = ?
                 ORDER BY sort_weight ASC, title ASC",
            )
            .bind(course_id)
            .bind(status)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| section_from_row(&row)).collect()
        })
    }

    fn list_lessons<'a>(
        &'a self,
        course_id: String,
        status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseLessonItem>> {
        Box::pin(async move {
            let status = status.unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_id, section_id, lesson_no, title, description, video_resource_snapshot,
                  external_bvid, duration_seconds, duration_text, content, free_preview, sort_weight, status
                 FROM course_lesson
                 WHERE course_id = ? AND status = ?
                 ORDER BY sort_weight ASC, title ASC",
            )
            .bind(course_id)
            .bind(status)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| lesson_from_row(&row)).collect()
        })
    }

    fn list_relations<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, Vec<CourseRelationItem>> {
        Box::pin(async move {
            let rows = sqlx::query(
                "SELECT id, course_id, related_course_id, relation_type, sort_weight, status
                 FROM course_relation
                 WHERE course_id = ? AND status = 'published'
                 ORDER BY sort_weight ASC",
            )
            .bind(course_id)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| relation_from_row(&row)).collect()
        })
    }

    fn create_application<'a>(
        &'a self,
        request: CourseApplicationCreateRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem> {
        Box::pin(async move {
            if request.title.trim().is_empty() {
                return Err(CourseError::invalid("course application title is required"));
            }

            let id = generated_id("course-application");
            let now = current_timestamp();
            let metadata = request.metadata.unwrap_or_else(|| serde_json::json!({})).to_string();

            sqlx::query(
                "INSERT INTO course_application (
                  id, tenant_id, organization_id, title, category, description, source_provider,
                  external_bvid, contact_name, contact_email, status, submitted_at, metadata_json,
                  created_at, updated_at
                ) VALUES (?, 'default', 'default', ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?)",
            )
            .bind(&id)
            .bind(request.title.trim())
            .bind(request.category.trim())
            .bind(request.description.trim())
            .bind(request.source_provider.trim())
            .bind(normalize_optional(request.external_bvid))
            .bind(normalize_optional(request.contact_name.clone()))
            .bind(normalize_optional(request.contact_email))
            .bind(&now)
            .bind(metadata)
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            Ok(CourseApplicationItem {
                id,
                title: request.title,
                category: request.category,
                source_provider: request.source_provider,
                status: "submitted".to_owned(),
                contact_name: normalize_optional(request.contact_name),
                submitted_at: now,
                reviewed_at: None,
            })
        })
    }

    fn list_applications<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseApplicationItem>> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "submitted".to_owned());
            let limit = query.limit();
            let offset = query.offset();
            let rows = sqlx::query(
                "SELECT id, title, category, source_provider, status, contact_name, submitted_at, reviewed_at
                 FROM course_application
                 WHERE status = ?
                 ORDER BY submitted_at DESC
                 LIMIT ? OFFSET ?",
            )
            .bind(status)
            .bind(limit)
            .bind(offset)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| application_from_row(&row)).collect()
        })
    }

    fn review_application<'a>(
        &'a self,
        application_id: String,
        request: CourseApplicationReviewRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem> {
        Box::pin(async move {
            let now = current_timestamp();
            let updated = sqlx::query(
                "UPDATE course_application
                 SET status = ?, review_note = ?, reviewed_at = ?, updated_at = ?
                 WHERE id = ?",
            )
            .bind(request.status)
            .bind(request.review_note)
            .bind(&now)
            .bind(&now)
            .bind(&application_id)
            .execute(&self.pool)
            .await?
            .rows_affected();

            if updated == 0 {
                return Err(CourseError::not_found("course application was not found"));
            }

            self.get_application(application_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course application was not found after review"))
        })
    }

    fn create_course<'a>(&'a self, request: CourseMutationRequest) -> CourseStoreFuture<'a, CourseItem> {
        Box::pin(async move {
            let title = request
                .title
                .map(|value| value.trim().to_owned())
                .filter(|value| !value.is_empty())
                .unwrap_or_else(|| "Untitled course".to_owned());
            let id = generated_id("course");
            let now = current_timestamp();
            let course_code = request
                .course_code
                .map(|value| value.trim().to_owned())
                .filter(|value| !value.is_empty())
                .unwrap_or_else(|| id.clone());
            let tags_json = serde_json::to_string(&request.tags.unwrap_or_default())?;
            sqlx::query(
                "INSERT INTO course_catalog (
                  id, tenant_id, organization_id, course_code, title, description, lessons_count, rating_score,
                  students_count, level, category, tags_json, content, status, created_at, updated_at
                ) VALUES (?, 'default', 'default', ?, ?, ?, 0, '0', 0, ?, ?, ?, ?, ?, ?, ?)",
            )
            .bind(&id)
            .bind(course_code)
            .bind(title)
            .bind(request.description)
            .bind(request.level)
            .bind(request.category)
            .bind(tags_json)
            .bind(request.metadata.map(|value| value.to_string()))
            .bind(request.status.unwrap_or_else(|| "draft".to_owned()))
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            self.get_course(id)
                .await?
                .ok_or_else(|| CourseError::not_found("course was not found after create"))
        })
    }

    fn update_course<'a>(&'a self, course_id: String, request: CourseMutationRequest) -> CourseStoreFuture<'a, CourseItem> {
        Box::pin(async move {
            let current = self
                .get_course(course_id.clone())
                .await?
                .ok_or_else(|| CourseError::not_found("course was not found"))?;
            let tags_json = serde_json::to_string(&request.tags.unwrap_or(current.tags))?;
            sqlx::query(
                "UPDATE course_catalog
                 SET course_code = ?, title = ?, description = ?, level = ?, category = ?,
                     tags_json = ?, content = ?, status = ?, updated_at = ?
                 WHERE id = ?",
            )
                .bind(request.course_code.unwrap_or(current.course_code))
                .bind(request.title.unwrap_or(current.title))
                .bind(request.description.or(current.description))
                .bind(request.level.or(current.level))
                .bind(request.category.or(current.category))
                .bind(tags_json)
                .bind(request.metadata.map(|value| value.to_string()).or(current.content))
                .bind(request.status.unwrap_or(current.status))
                .bind(current_timestamp())
                .bind(&course_id)
                .execute(&self.pool)
                .await?;

            self.get_course(course_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course was not found after update"))
        })
    }

    fn delete_course<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async move {
            let affected = sqlx::query("UPDATE course_catalog SET status = 'archived', updated_at = ? WHERE id = ?")
                .bind(current_timestamp())
                .bind(course_id)
                .execute(&self.pool)
                .await?
                .rows_affected();
            Ok(affected > 0)
        })
    }

    fn create_section<'a>(
        &'a self,
        course_id: String,
        request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem> {
        Box::pin(async move {
            let id = generated_id("course-section");
            let now = current_timestamp();
            sqlx::query(
                "INSERT INTO course_section (
                  id, tenant_id, organization_id, course_id, section_no, title, description,
                  lesson_count, duration_seconds, sort_weight, status, created_at, updated_at
                ) VALUES (?, 'default', 'default', ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)",
            )
            .bind(&id)
            .bind(&course_id)
            .bind(request.section_no)
            .bind(request.title.unwrap_or_else(|| "Untitled section".to_owned()))
            .bind(request.description)
            .bind(request.duration_seconds.unwrap_or(0))
            .bind(request.sort_weight.unwrap_or(0))
            .bind(request.status.unwrap_or_else(|| "draft".to_owned()))
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            self.get_section(id)
                .await?
                .ok_or_else(|| CourseError::not_found("course section was not found after create"))
        })
    }

    fn update_section<'a>(
        &'a self,
        section_id: String,
        request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem> {
        Box::pin(async move {
            let current = self
                .get_section(section_id.clone())
                .await?
                .ok_or_else(|| CourseError::not_found("course section was not found"))?;
            sqlx::query(
                "UPDATE course_section
                 SET section_no = ?, title = ?, description = ?, duration_seconds = ?,
                     sort_weight = ?, status = ?, updated_at = ?
                 WHERE id = ?",
            )
                .bind(request.section_no.or(current.section_no))
                .bind(request.title.unwrap_or(current.title))
                .bind(request.description.or(current.description))
                .bind(request.duration_seconds.unwrap_or(current.duration_seconds))
                .bind(request.sort_weight.unwrap_or(current.sort_weight))
                .bind(request.status.unwrap_or(current.status))
                .bind(current_timestamp())
                .bind(&section_id)
                .execute(&self.pool)
                .await?;

            self.get_section(section_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course section was not found after update"))
        })
    }

    fn delete_section<'a>(&'a self, section_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async move {
            let affected = sqlx::query("UPDATE course_section SET status = 'archived', updated_at = ? WHERE id = ?")
                .bind(current_timestamp())
                .bind(section_id)
                .execute(&self.pool)
                .await?
                .rows_affected();
            Ok(affected > 0)
        })
    }

    fn create_lesson<'a>(
        &'a self,
        course_id: String,
        request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem> {
        Box::pin(async move {
            let id = generated_id("course-lesson");
            let now = current_timestamp();
            sqlx::query(
                "INSERT INTO course_lesson (
                  id, tenant_id, organization_id, course_id, section_id, lesson_no, title,
                  description, external_bvid, duration_seconds, free_preview, sort_weight,
                  status, created_at, updated_at
                ) VALUES (?, 'default', 'default', ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)",
            )
            .bind(&id)
            .bind(&course_id)
            .bind(request.section_id)
            .bind(request.lesson_no)
            .bind(request.title.unwrap_or_else(|| "Untitled lesson".to_owned()))
            .bind(request.description)
            .bind(request.external_bvid)
            .bind(request.duration_seconds.unwrap_or(0))
            .bind(if request.free_preview.unwrap_or(false) { 1 } else { 0 })
            .bind(request.status.unwrap_or_else(|| "draft".to_owned()))
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            self.get_lesson(id)
                .await?
                .ok_or_else(|| CourseError::not_found("course lesson was not found after create"))
        })
    }

    fn update_lesson<'a>(
        &'a self,
        lesson_id: String,
        request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem> {
        Box::pin(async move {
            let current = self
                .get_lesson(lesson_id.clone())
                .await?
                .ok_or_else(|| CourseError::not_found("course lesson was not found"))?;
            sqlx::query(
                "UPDATE course_lesson
                 SET section_id = ?, lesson_no = ?, title = ?, description = ?, external_bvid = ?,
                     duration_seconds = ?, free_preview = ?, status = ?, updated_at = ?
                 WHERE id = ?",
            )
                .bind(request.section_id.or(current.section_id))
                .bind(request.lesson_no.or(current.lesson_no))
                .bind(request.title.unwrap_or(current.title))
                .bind(request.description.or(current.description))
                .bind(request.external_bvid.or(current.external_bvid))
                .bind(request.duration_seconds.unwrap_or(current.duration_seconds))
                .bind(if request.free_preview.unwrap_or(current.free_preview) { 1 } else { 0 })
                .bind(request.status.unwrap_or(current.status))
                .bind(current_timestamp())
                .bind(&lesson_id)
                .execute(&self.pool)
                .await?;

            self.get_lesson(lesson_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course lesson was not found after update"))
        })
    }

    fn delete_lesson<'a>(&'a self, lesson_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async move {
            let affected = sqlx::query("UPDATE course_lesson SET status = 'archived', updated_at = ? WHERE id = ?")
                .bind(current_timestamp())
                .bind(lesson_id)
                .execute(&self.pool)
                .await?
                .rows_affected();
            Ok(affected > 0)
        })
    }

    fn replace_relations<'a>(
        &'a self,
        course_id: String,
        items: Vec<CourseRelationInput>,
    ) -> CourseStoreFuture<'a, Vec<CourseRelationItem>> {
        Box::pin(async move {
            sqlx::query("DELETE FROM course_relation WHERE course_id = ?")
                .bind(&course_id)
                .execute(&self.pool)
                .await?;

            for item in items {
                sqlx::query(
                    "INSERT INTO course_relation (
                      id, tenant_id, organization_id, course_id, related_course_id, relation_type,
                      sort_weight, status, created_at, updated_at
                    ) VALUES (?, 'default', 'default', ?, ?, ?, ?, ?, ?, ?)",
                )
                .bind(generated_id("course-relation"))
                .bind(&course_id)
                .bind(item.related_course_id)
                .bind(item.relation_type.unwrap_or_else(|| "related".to_owned()))
                .bind(item.sort_weight.unwrap_or(0))
                .bind(item.status.unwrap_or_else(|| "published".to_owned()))
                .bind(current_timestamp())
                .bind(current_timestamp())
                .execute(&self.pool)
                .await?;
            }

            self.list_relations(course_id).await
        })
    }

    fn list_comments<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseCommentItem>> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "published".to_owned());
            let limit = query.limit();
            let offset = query.offset();
            let rows = sqlx::query(
                "SELECT id, course_id, author_snapshot, content, status, created_at
                 FROM course_comment
                 WHERE status = ?
                 ORDER BY created_at DESC
                 LIMIT ? OFFSET ?",
            )
            .bind(status)
            .bind(limit)
            .bind(offset)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| comment_from_row(&row)).collect()
        })
    }

    fn moderate_comment<'a>(
        &'a self,
        comment_id: String,
        request: CourseCommentModerationRequest,
    ) -> CourseStoreFuture<'a, Vec<CourseCommentItem>> {
        Box::pin(async move {
            sqlx::query("UPDATE course_comment SET status = ?, moderation_note = ?, updated_at = ? WHERE id = ?")
                .bind(request.status)
                .bind(request.moderation_note)
                .bind(current_timestamp())
                .bind(comment_id)
                .execute(&self.pool)
                .await?;
            self.list_comments(CourseQuery::default()).await
        })
    }

    fn list_engagement<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseEngagementItem>> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "published".to_owned());
            let limit = query.limit();
            let offset = query.offset();
            let rows = sqlx::query(
                "SELECT id, title, students_count
                 FROM course_catalog
                 WHERE status = ?
                 ORDER BY updated_at DESC
                 LIMIT ? OFFSET ?",
            )
            .bind(status)
            .bind(limit)
            .bind(offset)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter()
                .map(|row| {
                    let course_id: String = row.try_get("id")?;
                    Ok(CourseEngagementItem {
                        id: course_id.clone(),
                        course_id,
                        title: row.try_get("title")?,
                        views: 0,
                        likes: 0,
                        saves: 0,
                        shares: 0,
                        discussions: 0,
                        students_count: row.try_get("students_count")?,
                    })
                })
                .collect()
        })
    }
}

impl CourseStore for PostgresCourseStore {
    fn list_categories<'a>(&'a self, status: Option<String>) -> CourseStoreFuture<'a, Vec<CourseCategoryItem>> {
        Box::pin(async move {
            let status = status.unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT c.id, c.category_code, c.name, c.description, c.icon_key, c.sort_weight::BIGINT AS sort_weight,
                  (SELECT COUNT(1)::BIGINT FROM course_catalog cc WHERE cc.tenant_id = c.tenant_id AND cc.category = c.category_code AND cc.status = 'published') AS course_count
                 FROM course_category c
                 WHERE c.status = $1
                 ORDER BY c.sort_weight ASC, c.name ASC",
            )
            .bind(status)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter()
                .map(|row| {
                    Ok(CourseCategoryItem {
                        id: row.try_get("id")?,
                        code: row.try_get("category_code")?,
                        name: row.try_get("name")?,
                        description: row.try_get("description")?,
                        icon_key: row.try_get("icon_key")?,
                        sort_weight: row.try_get("sort_weight")?,
                        course_count: row.try_get("course_count")?,
                    })
                })
                .collect()
        })
    }

    fn list_courses<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, CoursePage> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_code, title, description, thumbnail_resource_snapshot, instructor_snapshot,
                  duration_text, lessons_count::BIGINT AS lessons_count, rating_score,
                  students_count::BIGINT AS students_count, level, category,
                  tags_json, content, external_bvid, status
                 FROM course_catalog
                 WHERE status = $1
                 ORDER BY updated_at DESC, title ASC
                 LIMIT $2 OFFSET $3",
            )
            .bind(status)
            .bind(query.limit())
            .bind(query.offset())
            .fetch_all(&self.pool)
            .await?;

            let items = rows.into_iter().map(|row| course_item_from_row(&row)).collect::<CourseResult<Vec<_>>>()?;
            let total = items.len() as i64;
            Ok(CoursePage {
                items,
                page: query.page.unwrap_or(1).max(1),
                page_size: query.limit(),
                total,
            })
        })
    }

    fn get_course<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, Option<CourseItem>> {
        Box::pin(async move {
            let row = sqlx::query(
                "SELECT id, course_code, title, description, thumbnail_resource_snapshot, instructor_snapshot,
                  duration_text, lessons_count::BIGINT AS lessons_count, rating_score,
                  students_count::BIGINT AS students_count, level, category,
                  tags_json, content, external_bvid, status
                 FROM course_catalog
                 WHERE id = $1",
            )
            .bind(course_id)
            .fetch_optional(&self.pool)
            .await?;

            row.map(|row| course_item_from_row(&row)).transpose()
        })
    }

    fn list_sections<'a>(
        &'a self,
        course_id: String,
        status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseSectionItem>> {
        Box::pin(async move {
            let status = status.unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_id, section_no, title, description, lesson_count::BIGINT AS lesson_count,
                  duration_seconds::BIGINT AS duration_seconds, sort_weight::BIGINT AS sort_weight, status
                 FROM course_section
                 WHERE course_id = $1 AND status = $2
                 ORDER BY sort_weight ASC, title ASC",
            )
            .bind(course_id)
            .bind(status)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| section_from_row(&row)).collect()
        })
    }

    fn list_lessons<'a>(
        &'a self,
        course_id: String,
        status: Option<String>,
    ) -> CourseStoreFuture<'a, Vec<CourseLessonItem>> {
        Box::pin(async move {
            let status = status.unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_id, section_id, lesson_no, title, description, video_resource_snapshot,
                  external_bvid, duration_seconds::BIGINT AS duration_seconds, duration_text, content,
                  free_preview::BIGINT AS free_preview, sort_weight::BIGINT AS sort_weight, status
                 FROM course_lesson
                 WHERE course_id = $1 AND status = $2
                 ORDER BY sort_weight ASC, title ASC",
            )
            .bind(course_id)
            .bind(status)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| lesson_from_row(&row)).collect()
        })
    }

    fn list_relations<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, Vec<CourseRelationItem>> {
        Box::pin(async move {
            let rows = sqlx::query(
                "SELECT id, course_id, related_course_id, relation_type, sort_weight::BIGINT AS sort_weight, status
                 FROM course_relation
                 WHERE course_id = $1 AND status = 'published'
                 ORDER BY sort_weight ASC",
            )
            .bind(course_id)
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| relation_from_row(&row)).collect()
        })
    }

    fn create_application<'a>(
        &'a self,
        request: CourseApplicationCreateRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem> {
        Box::pin(async move {
            if request.title.trim().is_empty() {
                return Err(CourseError::invalid("course application title is required"));
            }

            let id = generated_id("course-application");
            let now = current_timestamp();
            let metadata = request.metadata.unwrap_or_else(|| serde_json::json!({})).to_string();

            sqlx::query(
                "INSERT INTO course_application (
                  id, tenant_id, organization_id, title, category, description, source_provider,
                  external_bvid, contact_name, contact_email, status, submitted_at, metadata_json,
                  created_at, updated_at
                ) VALUES ($1, 'default', 'default', $2, $3, $4, $5, $6, $7, $8, 'submitted', $9, $10, $11, $12)",
            )
            .bind(&id)
            .bind(request.title.trim())
            .bind(request.category.trim())
            .bind(request.description.trim())
            .bind(request.source_provider.trim())
            .bind(normalize_optional(request.external_bvid))
            .bind(normalize_optional(request.contact_name.clone()))
            .bind(normalize_optional(request.contact_email))
            .bind(&now)
            .bind(metadata)
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            Ok(CourseApplicationItem {
                id,
                title: request.title,
                category: request.category,
                source_provider: request.source_provider,
                status: "submitted".to_owned(),
                contact_name: normalize_optional(request.contact_name),
                submitted_at: now,
                reviewed_at: None,
            })
        })
    }

    fn list_applications<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseApplicationItem>> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "submitted".to_owned());
            let rows = sqlx::query(
                "SELECT id, title, category, source_provider, status, contact_name, submitted_at, reviewed_at
                 FROM course_application
                 WHERE status = $1
                 ORDER BY submitted_at DESC
                 LIMIT $2 OFFSET $3",
            )
            .bind(status)
            .bind(query.limit())
            .bind(query.offset())
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| application_from_row(&row)).collect()
        })
    }

    fn review_application<'a>(
        &'a self,
        application_id: String,
        request: CourseApplicationReviewRequest,
    ) -> CourseStoreFuture<'a, CourseApplicationItem> {
        Box::pin(async move {
            let now = current_timestamp();
            let updated = sqlx::query(
                "UPDATE course_application
                 SET status = $1, review_note = $2, reviewed_at = $3, updated_at = $4
                 WHERE id = $5",
            )
            .bind(request.status)
            .bind(request.review_note)
            .bind(&now)
            .bind(&now)
            .bind(&application_id)
            .execute(&self.pool)
            .await?
            .rows_affected();

            if updated == 0 {
                return Err(CourseError::not_found("course application was not found"));
            }

            self.get_application(application_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course application was not found after review"))
        })
    }

    fn create_course<'a>(&'a self, request: CourseMutationRequest) -> CourseStoreFuture<'a, CourseItem> {
        Box::pin(async move {
            let title = request
                .title
                .map(|value| value.trim().to_owned())
                .filter(|value| !value.is_empty())
                .unwrap_or_else(|| "Untitled course".to_owned());
            let id = generated_id("course");
            let now = current_timestamp();
            let course_code = request
                .course_code
                .map(|value| value.trim().to_owned())
                .filter(|value| !value.is_empty())
                .unwrap_or_else(|| id.clone());
            let tags_json = serde_json::to_string(&request.tags.unwrap_or_default())?;
            sqlx::query(
                "INSERT INTO course_catalog (
                  id, tenant_id, organization_id, course_code, title, description, lessons_count, rating_score,
                  students_count, level, category, tags_json, content, status, created_at, updated_at
                ) VALUES ($1, 'default', 'default', $2, $3, $4, 0, '0', 0, $5, $6, $7, $8, $9, $10, $11)",
            )
            .bind(&id)
            .bind(course_code)
            .bind(title)
            .bind(request.description)
            .bind(request.level)
            .bind(request.category)
            .bind(tags_json)
            .bind(request.metadata.map(|value| value.to_string()))
            .bind(request.status.unwrap_or_else(|| "draft".to_owned()))
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            self.get_course(id)
                .await?
                .ok_or_else(|| CourseError::not_found("course was not found after create"))
        })
    }

    fn update_course<'a>(&'a self, course_id: String, request: CourseMutationRequest) -> CourseStoreFuture<'a, CourseItem> {
        Box::pin(async move {
            let current = self
                .get_course(course_id.clone())
                .await?
                .ok_or_else(|| CourseError::not_found("course was not found"))?;
            let tags_json = serde_json::to_string(&request.tags.unwrap_or(current.tags))?;
            sqlx::query(
                "UPDATE course_catalog
                 SET course_code = $1, title = $2, description = $3, level = $4, category = $5,
                     tags_json = $6, content = $7, status = $8, updated_at = $9
                 WHERE id = $10",
            )
                .bind(request.course_code.unwrap_or(current.course_code))
                .bind(request.title.unwrap_or(current.title))
                .bind(request.description.or(current.description))
                .bind(request.level.or(current.level))
                .bind(request.category.or(current.category))
                .bind(tags_json)
                .bind(request.metadata.map(|value| value.to_string()).or(current.content))
                .bind(request.status.unwrap_or(current.status))
                .bind(current_timestamp())
                .bind(&course_id)
                .execute(&self.pool)
                .await?;

            self.get_course(course_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course was not found after update"))
        })
    }

    fn delete_course<'a>(&'a self, course_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async move {
            let affected = sqlx::query("UPDATE course_catalog SET status = 'archived', updated_at = $1 WHERE id = $2")
                .bind(current_timestamp())
                .bind(course_id)
                .execute(&self.pool)
                .await?
                .rows_affected();
            Ok(affected > 0)
        })
    }

    fn create_section<'a>(
        &'a self,
        course_id: String,
        request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem> {
        Box::pin(async move {
            let id = generated_id("course-section");
            let now = current_timestamp();
            sqlx::query(
                "INSERT INTO course_section (
                  id, tenant_id, organization_id, course_id, section_no, title, description,
                  lesson_count, duration_seconds, sort_weight, status, created_at, updated_at
                ) VALUES ($1, 'default', 'default', $2, $3, $4, $5, 0, $6, $7, $8, $9, $10)",
            )
            .bind(&id)
            .bind(&course_id)
            .bind(request.section_no)
            .bind(request.title.unwrap_or_else(|| "Untitled section".to_owned()))
            .bind(request.description)
            .bind(request.duration_seconds.unwrap_or(0))
            .bind(request.sort_weight.unwrap_or(0))
            .bind(request.status.unwrap_or_else(|| "draft".to_owned()))
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            self.get_section(id)
                .await?
                .ok_or_else(|| CourseError::not_found("course section was not found after create"))
        })
    }

    fn update_section<'a>(
        &'a self,
        section_id: String,
        request: CourseSectionMutationRequest,
    ) -> CourseStoreFuture<'a, CourseSectionItem> {
        Box::pin(async move {
            let current = self
                .get_section(section_id.clone())
                .await?
                .ok_or_else(|| CourseError::not_found("course section was not found"))?;
            sqlx::query(
                "UPDATE course_section
                 SET section_no = $1, title = $2, description = $3, duration_seconds = $4,
                     sort_weight = $5, status = $6, updated_at = $7
                 WHERE id = $8",
            )
                .bind(request.section_no.or(current.section_no))
                .bind(request.title.unwrap_or(current.title))
                .bind(request.description.or(current.description))
                .bind(request.duration_seconds.unwrap_or(current.duration_seconds))
                .bind(request.sort_weight.unwrap_or(current.sort_weight))
                .bind(request.status.unwrap_or(current.status))
                .bind(current_timestamp())
                .bind(&section_id)
                .execute(&self.pool)
                .await?;

            self.get_section(section_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course section was not found after update"))
        })
    }

    fn delete_section<'a>(&'a self, section_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async move {
            let affected = sqlx::query("UPDATE course_section SET status = 'archived', updated_at = $1 WHERE id = $2")
                .bind(current_timestamp())
                .bind(section_id)
                .execute(&self.pool)
                .await?
                .rows_affected();
            Ok(affected > 0)
        })
    }

    fn create_lesson<'a>(
        &'a self,
        course_id: String,
        request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem> {
        Box::pin(async move {
            let id = generated_id("course-lesson");
            let now = current_timestamp();
            sqlx::query(
                "INSERT INTO course_lesson (
                  id, tenant_id, organization_id, course_id, section_id, lesson_no, title,
                  description, external_bvid, duration_seconds, free_preview, sort_weight,
                  status, created_at, updated_at
                ) VALUES ($1, 'default', 'default', $2, $3, $4, $5, $6, $7, $8, $9, 0, $10, $11, $12)",
            )
            .bind(&id)
            .bind(&course_id)
            .bind(request.section_id)
            .bind(request.lesson_no)
            .bind(request.title.unwrap_or_else(|| "Untitled lesson".to_owned()))
            .bind(request.description)
            .bind(request.external_bvid)
            .bind(request.duration_seconds.unwrap_or(0))
            .bind(if request.free_preview.unwrap_or(false) { 1_i64 } else { 0_i64 })
            .bind(request.status.unwrap_or_else(|| "draft".to_owned()))
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;

            self.get_lesson(id)
                .await?
                .ok_or_else(|| CourseError::not_found("course lesson was not found after create"))
        })
    }

    fn update_lesson<'a>(
        &'a self,
        lesson_id: String,
        request: CourseLessonMutationRequest,
    ) -> CourseStoreFuture<'a, CourseLessonItem> {
        Box::pin(async move {
            let current = self
                .get_lesson(lesson_id.clone())
                .await?
                .ok_or_else(|| CourseError::not_found("course lesson was not found"))?;
            sqlx::query(
                "UPDATE course_lesson
                 SET section_id = $1, lesson_no = $2, title = $3, description = $4, external_bvid = $5,
                     duration_seconds = $6, free_preview = $7, status = $8, updated_at = $9
                 WHERE id = $10",
            )
                .bind(request.section_id.or(current.section_id))
                .bind(request.lesson_no.or(current.lesson_no))
                .bind(request.title.unwrap_or(current.title))
                .bind(request.description.or(current.description))
                .bind(request.external_bvid.or(current.external_bvid))
                .bind(request.duration_seconds.unwrap_or(current.duration_seconds))
                .bind(if request.free_preview.unwrap_or(current.free_preview) { 1_i64 } else { 0_i64 })
                .bind(request.status.unwrap_or(current.status))
                .bind(current_timestamp())
                .bind(&lesson_id)
                .execute(&self.pool)
                .await?;

            self.get_lesson(lesson_id)
                .await?
                .ok_or_else(|| CourseError::not_found("course lesson was not found after update"))
        })
    }

    fn delete_lesson<'a>(&'a self, lesson_id: String) -> CourseStoreFuture<'a, bool> {
        Box::pin(async move {
            let affected = sqlx::query("UPDATE course_lesson SET status = 'archived', updated_at = $1 WHERE id = $2")
                .bind(current_timestamp())
                .bind(lesson_id)
                .execute(&self.pool)
                .await?
                .rows_affected();
            Ok(affected > 0)
        })
    }

    fn replace_relations<'a>(
        &'a self,
        course_id: String,
        items: Vec<CourseRelationInput>,
    ) -> CourseStoreFuture<'a, Vec<CourseRelationItem>> {
        Box::pin(async move {
            sqlx::query("DELETE FROM course_relation WHERE course_id = $1")
                .bind(&course_id)
                .execute(&self.pool)
                .await?;

            for item in items {
                sqlx::query(
                    "INSERT INTO course_relation (
                      id, tenant_id, organization_id, course_id, related_course_id, relation_type,
                      sort_weight, status, created_at, updated_at
                    ) VALUES ($1, 'default', 'default', $2, $3, $4, $5, $6, $7, $8)",
                )
                .bind(generated_id("course-relation"))
                .bind(&course_id)
                .bind(item.related_course_id)
                .bind(item.relation_type.unwrap_or_else(|| "related".to_owned()))
                .bind(item.sort_weight.unwrap_or(0))
                .bind(item.status.unwrap_or_else(|| "published".to_owned()))
                .bind(current_timestamp())
                .bind(current_timestamp())
                .execute(&self.pool)
                .await?;
            }

            self.list_relations(course_id).await
        })
    }

    fn list_comments<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseCommentItem>> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, course_id, author_snapshot, content, status, created_at
                 FROM course_comment
                 WHERE status = $1
                 ORDER BY created_at DESC
                 LIMIT $2 OFFSET $3",
            )
            .bind(status)
            .bind(query.limit())
            .bind(query.offset())
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter().map(|row| comment_from_row(&row)).collect()
        })
    }

    fn moderate_comment<'a>(
        &'a self,
        comment_id: String,
        request: CourseCommentModerationRequest,
    ) -> CourseStoreFuture<'a, Vec<CourseCommentItem>> {
        Box::pin(async move {
            sqlx::query("UPDATE course_comment SET status = $1, moderation_note = $2, updated_at = $3 WHERE id = $4")
                .bind(request.status)
                .bind(request.moderation_note)
                .bind(current_timestamp())
                .bind(comment_id)
                .execute(&self.pool)
                .await?;
            self.list_comments(CourseQuery::default()).await
        })
    }

    fn list_engagement<'a>(&'a self, query: CourseQuery) -> CourseStoreFuture<'a, Vec<CourseEngagementItem>> {
        Box::pin(async move {
            let status = query.status.clone().unwrap_or_else(|| "published".to_owned());
            let rows = sqlx::query(
                "SELECT id, title, students_count::BIGINT AS students_count
                 FROM course_catalog
                 WHERE status = $1
                 ORDER BY updated_at DESC
                 LIMIT $2 OFFSET $3",
            )
            .bind(status)
            .bind(query.limit())
            .bind(query.offset())
            .fetch_all(&self.pool)
            .await?;

            rows.into_iter()
                .map(|row| {
                    let course_id: String = row.try_get("id")?;
                    Ok(CourseEngagementItem {
                        id: course_id.clone(),
                        course_id,
                        title: row.try_get("title")?,
                        views: 0,
                        likes: 0,
                        saves: 0,
                        shares: 0,
                        discussions: 0,
                        students_count: row.try_get("students_count")?,
                    })
                })
                .collect()
        })
    }
}

fn course_item_from_row<'r, R>(row: &'r R) -> CourseResult<CourseItem>
where
    R: Row,
    &'static str: ColumnIndex<R>,
    String: Decode<'r, R::Database> + Type<R::Database>,
    Option<String>: Decode<'r, R::Database> + Type<R::Database>,
    i64: Decode<'r, R::Database> + Type<R::Database>,
{
    let tags_json: String = row.try_get("tags_json")?;
    let tags = serde_json::from_str(&tags_json).unwrap_or_default();
    Ok(CourseItem {
        id: row.try_get("id")?,
        course_code: row.try_get("course_code")?,
        title: row.try_get("title")?,
        description: row.try_get("description")?,
        thumbnail: json_value(row.try_get("thumbnail_resource_snapshot")?),
        instructor: json_value(row.try_get("instructor_snapshot")?),
        duration_text: row.try_get("duration_text")?,
        lessons_count: row.try_get("lessons_count")?,
        rating_score: row.try_get("rating_score")?,
        students_count: row.try_get("students_count")?,
        level: row.try_get("level")?,
        category: row.try_get("category")?,
        tags,
        content: row.try_get("content")?,
        external_bvid: row.try_get("external_bvid")?,
        status: row.try_get("status")?,
    })
}

fn section_from_row<'r, R>(row: &'r R) -> CourseResult<CourseSectionItem>
where
    R: Row,
    &'static str: ColumnIndex<R>,
    String: Decode<'r, R::Database> + Type<R::Database>,
    Option<String>: Decode<'r, R::Database> + Type<R::Database>,
    i64: Decode<'r, R::Database> + Type<R::Database>,
{
    Ok(CourseSectionItem {
        id: row.try_get("id")?,
        course_id: row.try_get("course_id")?,
        section_no: row.try_get("section_no")?,
        title: row.try_get("title")?,
        description: row.try_get("description")?,
        lesson_count: row.try_get("lesson_count")?,
        duration_seconds: row.try_get("duration_seconds")?,
        sort_weight: row.try_get("sort_weight")?,
        status: row.try_get("status")?,
    })
}

fn lesson_from_row<'r, R>(row: &'r R) -> CourseResult<CourseLessonItem>
where
    R: Row,
    &'static str: ColumnIndex<R>,
    String: Decode<'r, R::Database> + Type<R::Database>,
    Option<String>: Decode<'r, R::Database> + Type<R::Database>,
    i64: Decode<'r, R::Database> + Type<R::Database>,
{
    let free_preview: i64 = row.try_get("free_preview")?;
    Ok(CourseLessonItem {
        id: row.try_get("id")?,
        course_id: row.try_get("course_id")?,
        section_id: row.try_get("section_id")?,
        lesson_no: row.try_get("lesson_no")?,
        title: row.try_get("title")?,
        description: row.try_get("description")?,
        video: json_value(row.try_get("video_resource_snapshot")?),
        external_bvid: row.try_get("external_bvid")?,
        duration_seconds: row.try_get("duration_seconds")?,
        duration_text: row.try_get("duration_text")?,
        content: row.try_get("content")?,
        free_preview: free_preview == 1,
        sort_weight: row.try_get("sort_weight")?,
        status: row.try_get("status")?,
    })
}

fn relation_from_row<'r, R>(row: &'r R) -> CourseResult<CourseRelationItem>
where
    R: Row,
    &'static str: ColumnIndex<R>,
    String: Decode<'r, R::Database> + Type<R::Database>,
    i64: Decode<'r, R::Database> + Type<R::Database>,
{
    Ok(CourseRelationItem {
        id: row.try_get("id")?,
        course_id: row.try_get("course_id")?,
        related_course_id: row.try_get("related_course_id")?,
        relation_type: row.try_get("relation_type")?,
        sort_weight: row.try_get("sort_weight")?,
        status: row.try_get("status")?,
    })
}

fn application_from_row<'r, R>(row: &'r R) -> CourseResult<CourseApplicationItem>
where
    R: Row,
    &'static str: ColumnIndex<R>,
    String: Decode<'r, R::Database> + Type<R::Database>,
    Option<String>: Decode<'r, R::Database> + Type<R::Database>,
{
    Ok(CourseApplicationItem {
        id: row.try_get("id")?,
        title: row.try_get("title")?,
        category: row.try_get("category")?,
        source_provider: row.try_get("source_provider")?,
        status: row.try_get("status")?,
        contact_name: row.try_get("contact_name")?,
        submitted_at: row.try_get("submitted_at")?,
        reviewed_at: row.try_get("reviewed_at")?,
    })
}

fn comment_from_row<'r, R>(row: &'r R) -> CourseResult<CourseCommentItem>
where
    R: Row,
    &'static str: ColumnIndex<R>,
    String: Decode<'r, R::Database> + Type<R::Database>,
    Option<String>: Decode<'r, R::Database> + Type<R::Database>,
{
    Ok(CourseCommentItem {
        id: row.try_get("id")?,
        course_id: row.try_get("course_id")?,
        author: row.try_get("author_snapshot")?,
        content: row.try_get("content")?,
        status: row.try_get("status")?,
        created_at: row.try_get("created_at")?,
    })
}

fn json_value(raw: Option<String>) -> Option<serde_json::Value> {
    raw.and_then(|value| serde_json::from_str(&value).ok())
}

fn normalize_optional(value: Option<String>) -> Option<String> {
    value.map(|value| value.trim().to_owned()).filter(|value| !value.is_empty())
}

fn generated_id(prefix: &str) -> String {
    use std::sync::atomic::{AtomicU64, Ordering};
    use std::time::{SystemTime, UNIX_EPOCH};

    static SEQUENCE: AtomicU64 = AtomicU64::new(1);
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or(0);
    let sequence = SEQUENCE.fetch_add(1, Ordering::Relaxed);
    format!("{prefix}-{timestamp}-{sequence:016x}")
}

fn current_timestamp() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};

    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or(0);
    seconds.to_string()
}
