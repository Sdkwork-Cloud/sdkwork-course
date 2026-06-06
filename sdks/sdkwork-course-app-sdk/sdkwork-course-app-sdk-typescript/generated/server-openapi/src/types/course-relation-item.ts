export interface CourseRelationItem {
  id: string;
  courseId: string;
  relatedCourseId: string;
  relationType: string;
  sortWeight?: string;
  status: string;
}
