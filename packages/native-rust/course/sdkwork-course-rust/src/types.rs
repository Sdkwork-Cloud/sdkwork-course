use std::error::Error;
use std::fmt::{Display, Formatter};

use serde::{Deserialize, Serialize};

pub type CourseResult<T> = Result<T, CourseError>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CourseError {
    code: &'static str,
    message: String,
}

impl CourseError {
    pub fn invalid(message: impl Into<String>) -> Self {
        Self {
            code: "invalid",
            message: message.into(),
        }
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self {
            code: "not_found",
            message: message.into(),
        }
    }

    pub fn storage(message: impl Into<String>) -> Self {
        Self {
            code: "storage",
            message: message.into(),
        }
    }

    pub fn code(&self) -> &'static str {
        self.code
    }

    pub fn message(&self) -> &str {
        &self.message
    }
}

impl Display for CourseError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "{}: {}", self.code, self.message)
    }
}

impl Error for CourseError {}

impl From<sqlx::Error> for CourseError {
    fn from(error: sqlx::Error) -> Self {
        Self::storage(error.to_string())
    }
}

impl From<serde_json::Error> for CourseError {
    fn from(error: serde_json::Error) -> Self {
        Self::storage(error.to_string())
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseQuery {
    pub page: Option<i64>,
    pub page_size: Option<i64>,
    pub q: Option<String>,
    pub category: Option<String>,
    pub level: Option<String>,
    pub status: Option<String>,
}

impl CourseQuery {
    pub fn limit(&self) -> i64 {
        self.page_size.unwrap_or(20).clamp(1, 200)
    }

    pub fn offset(&self) -> i64 {
        (self.page.unwrap_or(1).max(1) - 1) * self.limit()
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseApplicationCreateRequest {
    pub title: String,
    pub category: String,
    pub description: String,
    pub source_provider: String,
    pub external_bvid: Option<String>,
    pub contact_name: Option<String>,
    pub contact_email: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseApplicationReviewRequest {
    pub status: String,
    pub review_note: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseMutationRequest {
    pub course_code: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub level: Option<String>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
    pub status: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseSectionMutationRequest {
    pub section_no: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub duration_seconds: Option<i64>,
    pub sort_weight: Option<i64>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseLessonMutationRequest {
    pub section_id: Option<String>,
    pub lesson_no: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub external_bvid: Option<String>,
    pub duration_seconds: Option<i64>,
    pub free_preview: Option<bool>,
    pub status: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseCommentModerationRequest {
    pub status: String,
    pub moderation_note: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseRelationsReplaceRequest {
    pub items: Vec<CourseRelationInput>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseRelationInput {
    pub related_course_id: String,
    pub relation_type: Option<String>,
    pub sort_weight: Option<i64>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseCategoryItem {
    pub id: String,
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub icon_key: Option<String>,
    pub sort_weight: i64,
    pub course_count: i64,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CourseItem {
    pub id: String,
    pub course_code: String,
    pub title: String,
    pub description: Option<String>,
    pub thumbnail: Option<serde_json::Value>,
    pub instructor: Option<serde_json::Value>,
    pub duration_text: Option<String>,
    pub lessons_count: i64,
    pub rating_score: String,
    pub students_count: i64,
    pub level: Option<String>,
    pub category: Option<String>,
    pub tags: Vec<String>,
    pub content: Option<String>,
    pub external_bvid: Option<String>,
    pub status: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CoursePage {
    pub items: Vec<CourseItem>,
    pub page: i64,
    pub page_size: i64,
    pub total: i64,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseSectionItem {
    pub id: String,
    pub course_id: String,
    pub section_no: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub lesson_count: i64,
    pub duration_seconds: i64,
    pub sort_weight: i64,
    pub status: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseLessonItem {
    pub id: String,
    pub course_id: String,
    pub section_id: Option<String>,
    pub lesson_no: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub video: Option<serde_json::Value>,
    pub external_bvid: Option<String>,
    pub duration_seconds: i64,
    pub duration_text: Option<String>,
    pub content: Option<String>,
    pub free_preview: bool,
    pub sort_weight: i64,
    pub status: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseRelationItem {
    pub id: String,
    pub course_id: String,
    pub related_course_id: String,
    pub relation_type: String,
    pub sort_weight: i64,
    pub status: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseApplicationItem {
    pub id: String,
    pub title: String,
    pub category: String,
    pub source_provider: String,
    pub status: String,
    pub contact_name: Option<String>,
    pub submitted_at: String,
    pub reviewed_at: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseCommentItem {
    pub id: String,
    pub course_id: String,
    pub author: Option<String>,
    pub content: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseEngagementItem {
    pub id: String,
    pub course_id: String,
    pub title: Option<String>,
    pub views: i64,
    pub likes: i64,
    pub saves: i64,
    pub shares: i64,
    pub discussions: i64,
    pub students_count: i64,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseApiResult<T>
where
    T: Serialize,
{
    pub code: String,
    pub msg: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
}

impl<T> CourseApiResult<T>
where
    T: Serialize,
{
    pub fn success(data: T) -> Self {
        Self {
            code: "2000".to_owned(),
            msg: "SUCCESS".to_owned(),
            data: Some(data),
        }
    }
}

impl CourseApiResult<()> {
    pub fn error(code: impl Into<String>, msg: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            msg: msg.into(),
            data: None,
        }
    }
}
