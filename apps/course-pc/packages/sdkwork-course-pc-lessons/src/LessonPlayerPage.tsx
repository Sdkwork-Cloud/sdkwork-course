import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/course-pc-commons'
import { useCourseSdk } from '@sdkwork/course-pc-core'

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

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const sdk = useCourseSdk()
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'comments'>('content')

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery<LessonListResponse>({
    queryKey: ['lessons', courseId],
    queryFn: async () => sdk.lessons.list(courseId!),
    enabled: !!courseId,
  })

  const lessons = lessonsData?.data || []
  const currentLesson = lessons.find((l) => l.id === lessonId) || lessons[0]

  if (lessonsLoading) {
    return <LoadingSpinner text="加载课程内容..." />
  }

  if (!currentLesson) {
    return (
      <EmptyState
        icon="📚"
        title="暂无课程内容"
        description="该课程还没有添加学习内容"
      />
    )
  }

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold">课程目录</h2>
        </div>
        <div className="divide-y">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`p-3 cursor-pointer hover:bg-gray-50 ${
                lesson.id === currentLesson.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
              onClick={() => navigate(`/courses/${courseId}/learn/${lesson.id}`)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{index + 1}</span>
                <span className="text-sm">{lesson.title}</span>
              </div>
              {lesson.durationSeconds > 0 && (
                <span className="text-xs text-gray-400 ml-6">
                  {Math.floor(lesson.durationSeconds / 60)}分钟
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-96 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">▶️</div>
            <p className="text-lg">{currentLesson.title}</p>
            <p className="text-sm text-gray-400 mt-2">
              {currentLesson.durationSeconds > 0
                ? `${Math.floor(currentLesson.durationSeconds / 60)}分钟`
                : '时长未知'}
            </p>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex gap-4 mb-4 border-b">
            <button
              className={`pb-2 ${activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('content')}
            >
              课程内容
            </button>
            <button
              className={`pb-2 ${activeTab === 'notes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('notes')}
            >
              学习笔记
            </button>
            <button
              className={`pb-2 ${activeTab === 'comments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('comments')}
            >
              评论
            </button>
          </div>

          {activeTab === 'content' && (
            <div>
              <h3 className="font-semibold mb-2">{currentLesson.title}</h3>
              <p className="text-gray-600">{currentLesson.description || '暂无内容描述'}</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="text-gray-600">
              <p>学习笔记功能开发中...</p>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="text-gray-600">
              <p>评论功能开发中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
