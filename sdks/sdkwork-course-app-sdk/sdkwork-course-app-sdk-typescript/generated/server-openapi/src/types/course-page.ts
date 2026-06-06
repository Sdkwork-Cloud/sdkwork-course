import type { CourseItem } from './course-item';

export interface CoursePage {
  items: CourseItem[];
  page: string;
  pageSize: string;
  total: string;
}
