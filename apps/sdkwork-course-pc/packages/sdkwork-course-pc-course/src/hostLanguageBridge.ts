import { syncCourseHostLanguage, subscribeCourseHostLanguage } from './i18n';

export function syncCoursePcHostLanguage(): void {
  syncCourseHostLanguage();
}

export function subscribeCoursePcHostLanguage(): (() => void) | undefined {
  return subscribeCourseHostLanguage();
}
