import type { CourseDetail } from './course-detail';

export interface CourseDetailResult {
  code: string;
  msg: string;
  data?: unknown & CourseDetail;
}
