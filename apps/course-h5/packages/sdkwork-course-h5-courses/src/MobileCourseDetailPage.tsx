import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/course-h5-commons'
import { useCourseSdk } from '@sdkwork/course-h5-core'

interface CourseDetail {
  id: string
  courseCode: string
  title: string
  subtitle?: string
  description?: string
  thumbnail?: string
  instructor?: string
  lessonsCount: number
  studentsCount: number
  ratingScore: string
  category?: string
  tags: string[]
  status: string
  visibility: string
  publishStatus: string
}

interface CourseDetailResponse {
  code: string
  msg: string
  data?: CourseDetail
}

export function MobileCourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sdk = useCourseSdk()

  const { data, isLoading, error } = useQuery<CourseDetailResponse>({
    queryKey: ['course', id],
    queryFn: async () => sdk.courses.retrieve(id!),
    enabled: !!id,
  })

  const course = data?.data

  if (isLoading) {
    return <MobileLoading text="加载课程详情..." />
  }

  if (error || !course) {
    return (
      <div>
        <MobilePageHeader title="课程详情" showBack onBack={() => navigate(-1)} />
        <MobileEmptyState
          icon="❌"
          title="课程不存在"
          description="无法找到该课程"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader
        title={course.title}
        showBack
        onBack={() => navigate(-1)}
      />

      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">{course.title}</h1>
        {course.subtitle && (
          <p className="text-gray-600 mb-4">{course.subtitle}</p>
        )}

        <div className="flex gap-4 mb-4 text-sm text-gray-500">
          <span>⭐ {course.ratingScore || '暂无评分'}</span>
          <span>📚 {course.lessonsCount}课</span>
          <span>👥 {course.studentsCount}人</span>
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
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:bg-blue-700 transition-colors"
          onClick={() => {
            alert('报名功能开发中...')
          }}
        >
          立即报名
        </button>
      </div>
    </div>
  )
}
