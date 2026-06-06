import type { CoursePage } from './course-page';

export interface CourseCollectionResult {
  code: string;
  msg: string;
  data?: unknown & CoursePage;
}
