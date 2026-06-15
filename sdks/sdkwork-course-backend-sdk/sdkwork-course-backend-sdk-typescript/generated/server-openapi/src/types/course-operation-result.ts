export interface CourseOperationResult {
  requestId: string;
  /** TODO(course): Materialize operation-specific result DTOs from the service contracts. */
  data: Record<string, unknown>;
}
