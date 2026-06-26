export interface CourseCategoryCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  iconKey?: string;
  sortWeight?: string;
}
