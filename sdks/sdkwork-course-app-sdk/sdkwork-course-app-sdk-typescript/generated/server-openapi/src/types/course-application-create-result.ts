import type { CourseApplicationCreateResponse } from './course-application-create-response';

export interface CourseApplicationCreateResult {
  code: string;
  msg: string;
  data?: unknown & CourseApplicationCreateResponse;
}
