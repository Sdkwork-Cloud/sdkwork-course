import i18next from "i18next";
import zhCourse from "../locales/zh/course.json";
import enCourse from "../locales/en/course.json";

/**
 * Course mobile i18n resources.
 *
 * Registered under the `translation` namespace as a nested `course` block
 * (community-mobile-react-community pattern), so pages use
 * `useTranslation()` + `t("course.xxx")`. Importing this module (or the
 * package entry, which imports it) registers the bundle side-effect free.
 */

export const courseZhTranslation = { course: zhCourse };
export const courseEnTranslation = { course: enCourse };

export const COURSE_I18N_RESOURCES = {
  zh: { translation: courseZhTranslation },
  en: { translation: courseEnTranslation },
} as const;

export function registerCourseMobileI18n(): void {
  // i18next v26 ESM no longer exposes addResourceBundle on the default
  // instance; hosts merge COURSE_I18N_RESOURCES at init instead. The
  // side-effect registration stays as a best-effort fallback so older
  // i18next versions and CJS interop keep working.
  try {
    i18next.addResourceBundle("zh", "translation", courseZhTranslation, true, true);
    i18next.addResourceBundle("en", "translation", courseEnTranslation, true, true);
  } catch {
    // Resources remain available through COURSE_I18N_RESOURCES.
  }
}

registerCourseMobileI18n();
