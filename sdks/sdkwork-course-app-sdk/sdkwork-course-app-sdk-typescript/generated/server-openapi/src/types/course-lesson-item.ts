import type { MediaResource } from './media-resource';

export interface CourseLessonItem {
  id: string;
  courseId: string;
  sectionId?: string;
  lessonNo?: string;
  title: string;
  description?: string;
  video?: MediaResource;
  externalBvid?: string;
  durationSeconds: string;
  durationText?: string;
  content?: string;
  freePreview: boolean;
  sortWeight?: string;
  status: string;
}
