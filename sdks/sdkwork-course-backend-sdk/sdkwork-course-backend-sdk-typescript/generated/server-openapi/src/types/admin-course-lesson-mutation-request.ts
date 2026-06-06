export interface AdminCourseLessonMutationRequest {
  sectionId?: string;
  lessonNo?: string;
  title?: string;
  description?: string;
  externalBvid?: string;
  durationSeconds?: string;
  freePreview?: boolean;
  status?: string;
  metadata?: Record<string, unknown>;
}
