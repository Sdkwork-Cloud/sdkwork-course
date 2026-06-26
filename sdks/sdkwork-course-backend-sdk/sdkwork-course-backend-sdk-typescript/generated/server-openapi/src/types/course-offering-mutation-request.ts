export interface CourseOfferingMutationRequest {
  offeringType?: 'vod' | 'live' | 'blended' | 'cohort';
  title?: string;
  startsAt?: string;
  endsAt?: string;
  enrollmentStartsAt?: string;
  enrollmentEndsAt?: string;
  capacityLimit?: number;
  status?: string;
}
