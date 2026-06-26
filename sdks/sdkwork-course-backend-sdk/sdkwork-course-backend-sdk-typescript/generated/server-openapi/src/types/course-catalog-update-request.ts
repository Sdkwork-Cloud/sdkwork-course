export interface CourseCatalogUpdateRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  instructorId?: string;
  level?: string;
  tags?: string[];
  status?: string;
}
