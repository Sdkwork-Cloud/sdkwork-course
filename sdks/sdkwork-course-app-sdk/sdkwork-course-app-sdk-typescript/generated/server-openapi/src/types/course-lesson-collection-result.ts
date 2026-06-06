import type { CourseLessonItem } from './course-lesson-item';

export interface CourseLessonCollectionResult {
  code: string;
  msg: string;
  data?: unknown & CourseLessonItem[];
}
