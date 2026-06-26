export interface CourseCatalogCreateRequest {
  title: string;
  subtitle?: string;
  description?: string;
  categoryId?: string;
  instructorId?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags?: string[];
}
