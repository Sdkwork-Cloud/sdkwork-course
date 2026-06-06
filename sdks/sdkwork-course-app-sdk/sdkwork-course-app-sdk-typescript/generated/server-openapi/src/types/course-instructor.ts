import type { MediaResource } from './media-resource';

export interface CourseInstructor {
  name: string;
  avatar?: MediaResource;
  title?: string;
  bio?: string;
}
