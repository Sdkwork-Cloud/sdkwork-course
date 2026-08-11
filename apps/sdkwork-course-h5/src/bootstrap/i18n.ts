import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { COURSE_I18N_RESOURCES } from '@sdkwork/course-mobile-react-courses/i18n'

/**
 * Standalone course H5 i18n bootstrap.
 *
 * The canonical course package registers its `course` translation bundle on
 * import; this initializes i18next with the same resources so pages render
 * before the first lazy chunk arrives.
 */
export function initCourseH5I18n(): void {
  void i18next.use(initReactI18next).init({
    resources: COURSE_I18N_RESOURCES as never,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
  })
}
