import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/sdkwork-course-h5-commons'
import {
  useCourseSdk,
  extractSdkItem,
  readEntityString,
  readEntityNumber,
  enrollInFirstCourseOffering,
  CourseEnrollmentError,
} from '@sdkwork/sdkwork-course-h5-core'

export function MobileCourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sdk = useCourseSdk()
  const [enrollFeedback, setEnrollFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => sdk.courses.retrieve(id!),
    enabled: !!id,
  })

  const enrollMutation = useMutation({
    mutationFn: async () => enrollInFirstCourseOffering(sdk, id!),
    onSuccess: () => {
      setEnrollFeedback({ tone: 'success', message: '报名成功' })
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof CourseEnrollmentError
          ? mutationError.message
          : '报名失败，请稍后再试'
      setEnrollFeedback({ tone: 'error', message })
    },
  })

  const record = extractSdkItem(data)
  const course = record
    ? {
        id: readEntityString(record, 'id', 'courseId'),
        title: readEntityString(record, 'title', 'name'),
        subtitle: readEntityString(record, 'subtitle') || undefined,
        description: readEntityString(record, 'description', 'summary') || undefined,
        thumbnail: readEntityString(record, 'thumbnail', 'cover', 'coverUrl') || undefined,
        lessonsCount: readEntityNumber(record, 'lessonsCount', 'lessons_count') ?? 0,
        studentsCount: readEntityNumber(record, 'studentsCount', 'students_count', 'students') ?? 0,
        ratingScore: readEntityString(record, 'ratingScore', 'rating', 'rating_score') || '暂无评分',
      }
    : null

  if (isLoading) {
    return <MobileLoading text="加载课程详情..." />
  }

  if (error || !course) {
    return (
      <div>
        <MobilePageHeader title="课程详情" showBack onBack={() => navigate(-1)} />
        <MobileEmptyState icon="!" title="课程不存在" description="无法找到该课程" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title={course.title} showBack onBack={() => navigate(-1)} />

      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-4 pb-28">
        <h1 className="text-xl font-bold mb-2">{course.title}</h1>
        {course.subtitle && <p className="text-gray-600 mb-4">{course.subtitle}</p>}

        <div className="flex gap-4 mb-4 text-sm text-gray-500">
          <span>★ {course.ratingScore}</span>
          <span>{course.lessonsCount} 课时</span>
          <span>{course.studentsCount} 人</span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">课程简介</h2>
          <p className="text-gray-600 text-sm">{course.description || '暂无简介'}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">课程目录</h2>
          <p className="text-gray-600 text-sm">课程内容加载中...</p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        {enrollFeedback && (
          <p
            className={`mb-2 text-sm text-center ${
              enrollFeedback.tone === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {enrollFeedback.message}
          </p>
        )}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={enrollMutation.isPending}
          onClick={() => {
            setEnrollFeedback(null)
            enrollMutation.mutate()
          }}
        >
          {enrollMutation.isPending ? '报名中...' : '立即报名'}
        </button>
      </div>
    </div>
  )
}
