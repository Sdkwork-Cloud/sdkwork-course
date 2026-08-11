import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronDown, X } from "lucide-react";
import {
  CourseService,
  CourseCapabilityUnavailableError,
  type CourseData,
} from "../services/CourseService";
import { CourseCard } from "../components";
import { CourseUnavailableView } from "./CourseUnavailableView";

const COURSE_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

/**
 * Course search page.
 *
 * Reached from the home navbar search icon; owns the debounced search input
 * and the paged result list so the home page keeps its space for catalog
 * browsing. Failure and empty states follow the rest of the course center.
 */
export function CourseSearch() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadState, setLoadState] = useState<{
    loading: boolean;
    loadingMore: boolean;
    error: boolean;
    searched: boolean;
  }>({ loading: false, loadingMore: false, error: false, searched: false });
  const [unavailable, setUnavailable] = useState(false);

  const requestSeq = useRef(0);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input on entry so the keyboard opens immediately on mobile.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  const runSearch = useCallback(
    async (value: string, page: number, append: boolean) => {
      const seq = ++requestSeq.current;
      setLoadState((prev) => ({
        ...prev,
        loading: !append && page === 1,
        loadingMore: append,
        error: false,
        searched: true,
      }));
      try {
        const rows = await CourseService.getCourses({
          q: value || undefined,
          page,
          pageSize: COURSE_PAGE_SIZE,
        });
        if (seq !== requestSeq.current) return;
        setCourses((prev) => (append ? [...prev, ...rows] : rows));
        setHasMore(rows.length >= COURSE_PAGE_SIZE);
      } catch (error) {
        if (seq !== requestSeq.current) return;
        if (error instanceof CourseCapabilityUnavailableError) {
          setUnavailable(true);
        } else {
          setLoadState((prev) => ({ ...prev, error: true }));
        }
      } finally {
        if (seq === requestSeq.current) {
          setLoadState((prev) => ({ ...prev, loading: false, loadingMore: false }));
        }
      }
    },
    [],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      void runSearch(value.trim(), 1, false);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleClear = () => {
    setQuery("");
    setCourses([]);
    setLoadState((prev) => ({ ...prev, searched: false, error: false }));
    inputRef.current?.focus();
  };

  const handleLoadMore = () => {
    if (loadState.loadingMore || !hasMore) return;
    const nextPage = Math.floor(courses.length / COURSE_PAGE_SIZE) + 1;
    void runSearch(query.trim(), nextPage, true);
  };

  if (unavailable) {
    return (
      <CourseUnavailableView
        message={t("course.unavailable")}
        onBack={() => navigate(-1)}
        />
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
      <div className="bg-white dark:bg-[#1C1C1E] px-4 py-3 sticky top-0 z-20 border-b border-black/5 dark:border-white/5 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-[13px] text-text-sub shrink-0"
          aria-label={t("course.back", "返回")}
        >
          ←
        </button>
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("course.searchPlaceholder", "搜索课程或讲师...")}
            className="w-full bg-[#F2F2F7] dark:bg-[#2A2A2D] rounded-full pl-9 pr-9 py-2.5 text-[14px] text-text-main placeholder:text-text-sub focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub"
              aria-label={t("course.clear", "清空")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {loadState.loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-text-sub text-[13px]">
              {t("course.loading", "加载中...")}
            </span>
          </div>
        ) : loadState.error ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <div className="text-4xl">⚠️</div>
            <p className="text-text-sub text-[13px]">
              {t("course.loadFailed", "加载失败，请重试")}
            </p>
            <button
              onClick={() => void runSearch(query.trim(), 1, false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-[13px] active:bg-blue-700"
            >
              {t("course.retry", "重试")}
            </button>
          </div>
        ) : !loadState.searched ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <Search className="w-8 h-8 text-text-sub opacity-40" />
            <p className="text-text-sub text-[13px]">
              {t("course.searchHint", "输入关键词搜索课程")}
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="text-4xl">📚</div>
            <p className="text-text-sub text-[13px]">
              {t("course.noSearchResults", "未找到相关课程")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/course/${course.id}`)}
                />
              ))}
            </div>

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadState.loadingMore}
                className="mt-5 w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-white dark:bg-[#1C1C1E] text-text-sub text-[13px] font-medium active:bg-black/5 dark:active:bg-white/5 transition-colors shadow-sm disabled:opacity-50"
              >
                {loadState.loadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    {t("course.loading", "加载中...")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    {t("course.loadMore", "加载更多")}
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
