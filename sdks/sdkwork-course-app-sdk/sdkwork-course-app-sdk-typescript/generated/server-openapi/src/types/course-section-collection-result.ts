import type { CourseSectionItem } from './course-section-item';

export interface CourseSectionCollectionResult {
  code: string;
  msg: string;
  data?: unknown & CourseSectionItem[];
}
