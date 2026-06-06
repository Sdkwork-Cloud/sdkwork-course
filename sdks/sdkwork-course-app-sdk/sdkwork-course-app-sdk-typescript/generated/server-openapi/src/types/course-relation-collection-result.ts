import type { CourseRelationItem } from './course-relation-item';

export interface CourseRelationCollectionResult {
  code: string;
  msg: string;
  data?: unknown & CourseRelationItem[];
}
