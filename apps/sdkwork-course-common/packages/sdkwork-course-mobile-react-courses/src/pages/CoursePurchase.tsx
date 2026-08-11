import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CourseService,
  CourseCapabilityUnavailableError,
  CourseEnrollmentError,
  type CourseData,
} from "../services/CourseService";
import { showToast } from "@sdkwork/ui-mobile-react";
import { CourseUnavailableView } from "./CourseUnavailableView";

/**
 * Enrollment confirmation page.
 *
 * Courses enroll through the first available offering
 * (`courseOfferings.list` + `courseEnrollments.create`). Pricing and
 * settlement remain owned by the course domain / commerce adapters; the
 * mobile surface confirms the enrollment and routes into learning.
 */
export function CoursePurchase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  const loadCourse = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadFailed(false);
    try {
      const detail = await CourseService.getCourseDetail(id);
      setCourse(detail);
      // Already enrolled: the purchase page becomes a continue-learning entry
      // instead of re-enrolling (commercial guard against duplicate grants).
      if (detail.isPurchased) {
        setEnrolled(true);
      }
    } catch (error) {
      if (error instanceof CourseCapabilityUnavailableError) {
        setUnavailable(true);
      } else {
        setLoadFailed(true);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  const handleEnroll = async () => {
    if (!id || enrolling) return;
    setEnrolling(true);
    setEnrollError("");
    try {
      await CourseService.enrollInCourse(id);
      setEnrolled(true);
      showToast(t("course.enrollSuccess", "报名成功"));
    } catch (error) {
      if (error instanceof CourseCapabilityUnavailableError) {
        setUnavailable(true);
      } else if (error instanceof CourseEnrollmentError) {
        setEnrollError(error.message);
      } else {
        setEnrollError(t("course.enrollFailed", "报名失败，请稍后再试"));
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (unavailable) {
    return (
      <CourseUnavailableView
        message={t("course.unavailable")}
        onBack={() => navigate(-1)}
        />
    );
  }

  if (loadFailed) {
    return (
      <CourseUnavailableView
        message={t("course.courseNotFound", "未找到课程")}
        onBack={() => navigate(-1)}
        onRetry={() => void loadCourse()}
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

  if (!course) {
    return (
      <CourseUnavailableView
        message={t("course.courseNotFound", "未找到课程")}
        onBack={() => navigate(-1)}
        />
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-24">
      <div className="relative aspect-[4/3] w-full bg-black">
        {course.cover ? (
          <img
            src={course.cover}
            alt={course.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2F2F7] dark:from-black via-transparent to-black/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur text-white text-[14px] flex items-center justify-center active:bg-black/60"
        >
          ←
        </button>
      </div>

      <div className="px-5 py-5 bg-white dark:bg-[#1C1C1E] rounded-t-[32px] -mt-8 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-[20px] font-bold text-text-main leading-tight mb-2">
          {course.title}
        </h1>
        <p className="text-[13px] text-text-sub mb-4">{course.instructor || "—"}</p>

        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-500/20">
          <p className="text-[13px] text-blue-700 dark:text-blue-300 leading-relaxed">
            {t("course.enrollNotice", "报名后将解锁全部课程内容，可在「我的课程」中继续学习。")}
          </p>
        </div>

        {enrollError && (
          <div className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-[13px]">
            {enrollError}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 pt-4 pb-safe bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#1C1C1E] dark:via-[#1C1C1E]/95 z-20">
        <div className="mx-4 mb-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[13px] text-text-sub">
              {enrolled
                ? t("course.enrolled", "已报名")
                : t("course.enrollNow", "报名")}
            </span>
            <span className="text-[20px] font-bold text-text-main">
              {course.type === "live" ? t("course.live", "直播") : t("course.course", "课程")}
            </span>
          </div>
          {enrolled ? (
            <button
              onClick={() => navigate(`/course/${course.id}/play`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full active:scale-95 transition-all text-[14px]"
            >
              {t("course.continueLearning", "继续学习")}
            </button>
          ) : (
            <button
              onClick={() => void handleEnroll()}
              disabled={enrolling}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full active:scale-95 transition-all text-[14px] disabled:opacity-50"
            >
              {enrolling ? t("course.enrolling", "报名中...") : t("course.enrollNow", "立即报名")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
