import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CourseApplicationCreateRequest, CourseApplicationCreateResult } from '../types';


export class CourseApplicationsApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Course Applications create. */
  async create(body: CourseApplicationCreateRequest): Promise<CourseApplicationCreateResult> {
    return this.client.post<CourseApplicationCreateResult>(appApiPath(`/course_applications`), body, undefined, undefined, 'application/json');
  }
}

export function createCourseApplicationsApi(client: HttpClient): CourseApplicationsApi {
  return new CourseApplicationsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
