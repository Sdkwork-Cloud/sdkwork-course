export interface AdminCourseMutationRequest {
  courseCode?: string;
  title?: string;
  description?: string;
  level?: string;
  category?: string;
  tags?: string[];
  status?: string;
  metadata?: Record<string, unknown>;
}
