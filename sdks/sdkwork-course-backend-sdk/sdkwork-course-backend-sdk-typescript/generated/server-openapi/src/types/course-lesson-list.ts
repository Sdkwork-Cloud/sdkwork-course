import type { CourseLessonItem } from './course-lesson-item';

export interface CourseLessonList {
  items?: CourseLessonItem[];
  total?: string;
}
