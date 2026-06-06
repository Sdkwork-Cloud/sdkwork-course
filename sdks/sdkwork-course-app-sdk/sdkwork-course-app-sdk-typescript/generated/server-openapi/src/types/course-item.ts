import type { CourseEngagement } from './course-engagement';
import type { CourseInstructor } from './course-instructor';
import type { MediaResource } from './media-resource';

export interface CourseItem {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  thumbnail?: MediaResource;
  instructor?: CourseInstructor;
  durationText?: string;
  lessonsCount: string;
  ratingScore?: number;
  studentsCount: string;
  level: string;
  category: string;
  tags: string[];
  engagement: CourseEngagement;
}
