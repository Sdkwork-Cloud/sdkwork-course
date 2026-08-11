import { useTranslation } from "react-i18next";
import React from "react";
import { PlayCircle, Lock, FileText, Download, Radio } from "lucide-react";
import { useNavigate } from "react-router";

export interface CurriculumLesson {
  id?: string;
  title: string;
  free?: boolean;
  /** Lesson form: vod_video / live_session / article / download / quiz / assignment. */
  kind?: string;
}

export interface CurriculumSection {
  section: string;
  lessons: CurriculumLesson[];
}

export interface CourseCurriculumProps {
  courseId: string;
  courseType: string;
  isPurchased: boolean;
  curriculum: CurriculumSection[];
}

function lessonKindIcon(kind: string | undefined) {
  switch (kind) {
    case "article":
      return <FileText className="w-5 h-5 text-blue-500 shrink-0" />;
    case "download":
      return <Download className="w-5 h-5 text-blue-500 shrink-0" />;
    case "live_session":
      return <Radio className="w-5 h-5 text-red-500 shrink-0" />;
    default:
      return <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />;
  }
}

function lessonKindLabel(kind: string | undefined) {
  switch (kind) {
    case "article":
      return "图文";
    case "download":
      return "资料";
    case "live_session":
      return "直播";
    default:
      return undefined;
  }
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ courseId, courseType, isPurchased, curriculum = [] }) => {
  const { t } = useTranslation();
const navigate = useNavigate();

  const openLesson = (lesson: CurriculumLesson) => {
    if (!isPurchased && !lesson.free) {
      return;
    }
    if (courseType === 'live') {
      navigate(`/course/${courseId}/live`);
      return;
    }
    if (lesson.id) {
      navigate(`/course/${courseId}/play?lesson=${encodeURIComponent(lesson.id)}`);
    } else {
      navigate(`/course/${courseId}/play`);
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-[#1C1C1E]">
      <div className="flex flex-col gap-6">
        {curriculum.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <h4 className="text-[15px] font-bold text-text-main">{section.section}</h4>
            <div className="flex flex-col gap-1">
              {section.lessons.map((lesson, lIdx) => {
                const unlocked = lesson.free || isPurchased;
                const kindLabel = lessonKindLabel(lesson.kind);
                return (
                <div 
                  key={lesson.id ?? lIdx} 
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-colors active:bg-black/5 dark:active:bg-white/5 ${lesson.free ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                  onClick={() => openLesson(lesson)}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="text-[13px] text-text-sub opacity-50 font-mono w-5 shrink-0 text-center">{String(lIdx + 1).padStart(2, '0')}</span>
                    {unlocked && courseType !== 'live' ? (
                      lessonKindIcon(lesson.kind)
                    ) : courseType === 'live' ? (
                      <PlayCircle className="w-5 h-5 text-red-500 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-text-sub shrink-0 opacity-40 ml-0.5" />
                    )}
                    <span className={`text-[14px] truncate ${unlocked ? "text-text-main font-medium" : "text-text-sub"}`}>{lesson.title}</span>
                    {kindLabel && (
                      <span className="text-[10px] text-text-sub border border-black/10 dark:border-white/10 rounded px-1.5 py-0.5 shrink-0">
                        {kindLabel}
                      </span>
                    )}
                  </div>
                  {lesson.free && !isPurchased && courseType !== 'live' && (
                    <span className="text-[11px] text-blue-500 font-medium px-2 py-0.5 bg-blue-500/10 rounded ml-3 shrink-0">{t('course.auto_14c7a05', '可试看')}</span>
                  )}
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
