import { GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

/**
 * Internal course unavailable view (fail-closed state).
 *
 * Shown when the host has not bound the Course App SDK port or the requested
 * resource does not exist. Kept inside the course package so pages never
 * depend on host-level placeholder components.
 */
export function CourseUnavailableView({
  message,
  onBack,
  onRetry,
}: {
  message: string;
  onBack?: () => void;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex flex-col items-center justify-center px-8 gap-3">
      <GraduationCap className="w-12 h-12 text-gray-400" />
      <p className="text-[14px] text-text-sub text-center leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-[13px] active:bg-blue-700"
        >
          {t("course.retry", "重试")}
        </button>
      )}
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#F2F2F7] dark:bg-white/5 text-text-sub rounded-full text-[13px] active:bg-black/5 dark:active:bg-white/10"
        >
          {t("course.back", "返回")}
        </button>
      )}
    </div>
  );
}
