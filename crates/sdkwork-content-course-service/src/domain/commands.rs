use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseServiceContext {
    pub tenant_id: String,
    pub organization_id: String,
    pub actor_id: Option<String>,
    pub user_id: Option<String>,
    pub request_id: Option<String>,
    pub trace_id: Option<String>,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum CourseOfferingType {
    #[default]
    Vod,
    Live,
    Blended,
    Cohort,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum CourseLessonKind {
    #[default]
    VodVideo,
    LiveSession,
    Article,
    Download,
    Quiz,
    Assignment,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum CourseProgressStatus {
    #[default]
    NotStarted,
    InProgress,
    Completed,
    Expired,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseMediaResourceRef {
    pub drive_resource_id: String,
    pub role: String,
    pub mime_type: Option<String>,
    pub duration_seconds: Option<i64>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseCatalogCommand {
    pub course_id: Option<String>,
    pub category_id: Option<String>,
    pub instructor_id: Option<String>,
    pub title: String,
    pub subtitle: Option<String>,
    pub description: Option<String>,
    pub cover: Option<CourseMediaResourceRef>,
    pub level: Option<String>,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseOfferingCommand {
    pub offering_id: Option<String>,
    pub course_id: String,
    pub offering_type: CourseOfferingType,
    pub title: String,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
    pub enrollment_starts_at: Option<String>,
    pub enrollment_ends_at: Option<String>,
    pub capacity_limit: Option<i64>,
    pub completion_rule: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseLessonCommand {
    pub lesson_id: Option<String>,
    pub course_id: String,
    pub section_id: Option<String>,
    pub lesson_kind: CourseLessonKind,
    pub title: String,
    pub summary: Option<String>,
    pub duration_seconds: Option<i64>,
    pub free_preview: bool,
    pub resources: Vec<CourseMediaResourceRef>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseLiveSessionCommand {
    pub live_session_id: Option<String>,
    pub course_id: String,
    pub offering_id: String,
    pub lesson_id: Option<String>,
    pub title: String,
    pub starts_at: String,
    pub ends_at: String,
    pub instructor_id: Option<String>,
    pub provider_code: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseEnrollmentCommand {
    pub offering_id: String,
    pub learner_user_id: String,
    pub source: String,
    pub idempotency_key: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseLessonProgressCommand {
    pub enrollment_id: String,
    pub lesson_id: String,
    pub progress_status: CourseProgressStatus,
    pub watched_seconds: Option<i64>,
    pub completed_at: Option<String>,
    pub idempotency_key: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseLiveJoinGrant {
    pub live_session_id: String,
    pub provider_code: String,
    pub join_url: String,
    pub expires_at: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseAuditCommand {
    pub target_type: String,
    pub target_id: String,
    pub operation: String,
    pub before_snapshot: Option<serde_json::Value>,
    pub after_snapshot: Option<serde_json::Value>,
}
