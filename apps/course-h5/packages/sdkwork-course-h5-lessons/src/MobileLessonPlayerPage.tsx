import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/course-h5-commons'
import { useCourseSdk } from '@sdkwork/course-h5-core'

interface Lesson {
  id: string
  courseId: string
  sectionId?: string
  lessonNo?: string
  title: string
  description?: string
  content?: string
  durationSeconds: number
  freePreview: boolean
  sortWeight: number
  status: string
}

interface LessonListResponse {
  code: string
  msg: string
  data?: Lesson[]
}

export function MobileLessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const sdk = useCourseSdk()
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'comments'>('content')

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery<LessonListResponse>({
    queryKey: ['lessons', courseId],
    queryFn: async () => sdk.lessons.list(courseId!),
    enabled: !!courseId,
  })

  const lessons = lessonsData?.data || []
  const currentLesson = lessons.find((l) => l.id === lessonId) || lessons[0]

  if (lessonsLoading) {
    return <MobileLoading text="加载课程内容..." />
  }

  if (!currentLesson) {
    return (
      <div>
        <MobilePageHeader title="课程学习" showBack onBack={() => navigate(-1)} />
        <MobileEmptyState
          icon="📚"
          title="暂无课程内容"
          description="该课程还没有添加学习内容"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-black">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-5xl mb-3">▶️</div>
            <p className="text-base">{currentLesson.title}</p>
            <p className="text-xs text-gray-400 mt-1">
              {currentLesson.durationSeconds > 0
                ? `${Math.floor(currentLesson.durationSeconds / 60)}分钟`
                : '时长未知'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b">
          <div className="flex">
            <button
              className={`flex-1 py-3 text-center text-sm ${
                activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('content')}
            >
              课程内容
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm ${
                activeTab === 'comments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('comments')}
            >
              评论
            </button>
          </div>
        </div>

        {activeTab === 'content' && (
          <div className="p-4">
            <h3 className="font-semibold mb-2">{currentLesson.title}</h3>
            <p className="text-gray-600 text-sm">{currentLesson.description || '暂无内容描述'}</p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="p-4">
            <p className="text-gray-600 text-sm">评论功能开发中...</p>
          </div>
        )}

        <div className="bg-white border-t">
          <div
            className="p-3 flex items-center justify-between cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="font-semibold text-sm">课程目录</span>
            <span className="text-gray-500">{showMenu ? '▲' : '▼'}</span>
          </div>
          {showMenu && (
            <div className="max-h-60 overflow-y-auto border-t">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`p-3 border-b cursor-pointer ${
                    lesson.id === currentLesson.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    navigate(`/courses/${courseId}/learn/${lesson.id}`)
                    setShowMenu(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                    <span className="text-sm">{lesson.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
