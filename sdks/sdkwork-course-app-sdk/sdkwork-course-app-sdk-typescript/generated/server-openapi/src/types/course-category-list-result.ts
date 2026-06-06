import type { CourseCategoryItem } from './course-category-item';

export interface CourseCategoryListResult {
  code: string;
  msg: string;
  data?: unknown & CourseCategoryItem[];
}
