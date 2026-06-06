export interface CourseSectionItem {
  id: string;
  courseId: string;
  sectionNo?: string;
  title: string;
  description?: string;
  lessonCount: string;
  durationSeconds: string;
  sortWeight?: string;
  status: string;
}
