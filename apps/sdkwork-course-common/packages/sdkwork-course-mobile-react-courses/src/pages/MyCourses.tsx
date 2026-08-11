import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CourseLearningProgress } from "@sdkwork/course-sdk-ports";
import {
  CourseService,
  CourseCapabilityUnavailableError,
  type MyCourseData,
} from "../services/CourseService";
import { showToast } from "@sdkwork/ui-mobile-react";
import { CourseUnavailableView } from "./CourseUnavailableView";

interface MyCourseRow extends MyCourseData {
  progressRecord?: CourseLearningProgress;
}

export function MyCourses() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [rows, setRows] = useState<MyCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const enrollments = await CourseService.getMyCourses();
        const withProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            let progressRecord: CourseLearningProgress | undefined;
            try {
              progressRecord = await CourseService.getMyLearningProgress(enrollment.id);
            } catch {
              progressRecord = undefined;
            }
            return { ...enrollment, progressRecord };
          }),
        );
        if (cancelled) return;
        setRows(withProgress);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof CourseCapabilityUnavailableError) {
          setUnavailable(true);
        } else {
          showToast(t("course.loadMyCoursesFailed", "加载我的课程失败"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  if (unavailable) {
    return (
      <CourseUnavailableView
        message={t("course.unavailable")}
        onBack={() => navigate(-1)}
        />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-text-sub text-[13px]">
          {t("course.loading", "加载中...")}
        </span>
      </div>
    );
  }

  const percent = (row: MyCourseRow): number => {
    const raw = parseFloat(row.progressRecord?.progressPercent ?? "0");
    return Number.isFinite(raw) ? raw : 0;
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
      <div className="bg-white dark:bg-[#1C1C1E] px-4 py-4 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-[13px] text-text-sub">
          ←
        </button>
        <h1 className="text-[17px] font-bold text-text-main">
          {t("course.my", "我的课程")}
        </h1>
      </div>

      <div className="p-4">
        {rows.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="text-4xl">📚</div>
            <p className="text-text-sub text-[13px]">
              {t("course.emptyCourses", "暂无课程")}
            </p>
            <button
              onClick={() => navigate("/course")}
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-[13px] active:bg-blue-700"
            >
              {t("course.onlineCourses", "在线课程")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 cursor-pointer active:bg-black/5 dark:active:bg-white/5 transition-colors shadow-sm"
                onClick={() => navigate(`/course/${row.courseId}/play`)}
              >
                <div className="flex items-start gap-3 mb-3">
                  {row.cover ? (
                    <>
                      <img
                        src={row.cover}
                        alt={row.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "1";
                            target.className = "hidden";
                            target.nextElementSibling?.classList.remove("hidden");
                          }
                        }}
                        className="w-[72px] h-[54px] rounded-xl object-cover shrink-0 border border-black/5 dark:border-white/5"
                      />
                      <div className="w-[72px] h-[54px] rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shrink-0 hidden" />
                    </>
                  ) : (
                    <div className="w-[72px] h-[54px] rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-text-main truncate">
                      {row.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {row.enrollmentStatus && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            row.enrollmentStatus === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/15"
                              : row.enrollmentStatus === "completed"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15"
                                : "bg-gray-100 text-gray-600 dark:bg-white/10"
                          }`}
                        >
                          {row.enrollmentStatus === "active"
                            ? t("course.learning", "学习中")
                            : row.enrollmentStatus === "completed"
                              ? t("course.completed", "已完成")
                              : row.enrollmentStatus}
                        </span>
                      )}
                      <span className="text-[11px] text-text-sub">
                        {t("course.enrolledAt", "报名于")} {row.lastWatched}
                      </span>
                    </div>
                  </div>
                </div>

                {row.progressRecord && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-text-sub">
                        {t("course.progress", "进度")}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {percent(row).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(percent(row), 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-full text-[12px] active:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/course/${row.courseId}/play`);
                  }}
                >
                  {t("course.continueLearning", "继续学习")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
