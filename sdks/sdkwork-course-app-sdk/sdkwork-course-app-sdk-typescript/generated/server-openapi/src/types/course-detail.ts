import type { CourseEngagement } from './course-engagement';
import type { CourseInstructor } from './course-instructor';
import type { CourseLessonItem } from './course-lesson-item';
import type { CourseSectionItem } from './course-section-item';
import type { MediaResource } from './media-resource';

export interface CourseDetail {
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
  content?: string;
  sections?: CourseSectionItem[];
  lessons?: CourseLessonItem[];
}
