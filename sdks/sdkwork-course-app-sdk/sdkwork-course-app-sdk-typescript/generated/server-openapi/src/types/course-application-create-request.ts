export interface CourseApplicationCreateRequest {
  title: string;
  category: string;
  description: string;
  sourceProvider: string;
  externalBvid?: string;
  contactName?: string;
  contactEmail?: string;
  metadata?: Record<string, unknown>;
}
