CREATE TABLE IF NOT EXISTS course_category (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  category_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, category_code)
);

CREATE TABLE IF NOT EXISTS course_catalog (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  course_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_media_resource_id TEXT,
  thumbnail_object_blob_id TEXT,
  thumbnail_resource_snapshot TEXT,
  instructor_snapshot TEXT,
  duration_text TEXT,
  lessons_count INTEGER NOT NULL DEFAULT 0,
  rating_score TEXT NOT NULL DEFAULT '0',
  students_count INTEGER NOT NULL DEFAULT 0,
  level TEXT,
  category TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  content TEXT,
  external_bvid TEXT,
  status TEXT NOT NULL,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, course_code)
);

CREATE TABLE IF NOT EXISTS course_section (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  course_id TEXT NOT NULL,
  section_no TEXT,
  title TEXT NOT NULL,
  description TEXT,
  lesson_count INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, course_id, section_no)
);

CREATE TABLE IF NOT EXISTS course_lesson (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  course_id TEXT NOT NULL,
  section_id TEXT,
  lesson_no TEXT,
  title TEXT NOT NULL,
  description TEXT,
  video_media_resource_id TEXT,
  video_object_blob_id TEXT,
  video_resource_snapshot TEXT,
  external_bvid TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  duration_text TEXT,
  content TEXT,
  free_preview INTEGER NOT NULL DEFAULT 0,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, course_id, lesson_no)
);

CREATE TABLE IF NOT EXISTS course_relation (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  course_id TEXT NOT NULL,
  related_course_id TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, course_id, related_course_id, relation_type)
);

CREATE TABLE IF NOT EXISTS course_application (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  source_provider TEXT NOT NULL,
  external_bvid TEXT,
  video_media_resource_id TEXT,
  video_object_blob_id TEXT,
  video_resource_snapshot TEXT,
  contact_name TEXT,
  contact_email TEXT,
  status TEXT NOT NULL,
  review_note TEXT,
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS course_comment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  course_id TEXT NOT NULL,
  author_user_id TEXT,
  author_snapshot TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  moderation_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS course_reaction (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  actor_user_id TEXT,
  reaction_type TEXT NOT NULL,
  reaction_value TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, target_type, target_id, actor_user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS course_audit_log (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  operation_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_course_category_status
  ON course_category (tenant_id, organization_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_course_catalog_category_status
  ON course_catalog (tenant_id, organization_id, category, status, updated_at);

CREATE INDEX IF NOT EXISTS idx_course_catalog_level_status
  ON course_catalog (tenant_id, organization_id, level, status, updated_at);

CREATE INDEX IF NOT EXISTS idx_course_section_course_status
  ON course_section (tenant_id, course_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_course_lesson_course_status
  ON course_lesson (tenant_id, course_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_course_relation_course_status
  ON course_relation (tenant_id, course_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_course_application_status_submitted
  ON course_application (tenant_id, organization_id, status, submitted_at);

CREATE INDEX IF NOT EXISTS idx_course_comment_course_status
  ON course_comment (tenant_id, course_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_course_reaction_target_status
  ON course_reaction (tenant_id, target_type, target_id, status);

CREATE INDEX IF NOT EXISTS idx_course_audit_source
  ON course_audit_log (tenant_id, source_type, source_id, created_at);

