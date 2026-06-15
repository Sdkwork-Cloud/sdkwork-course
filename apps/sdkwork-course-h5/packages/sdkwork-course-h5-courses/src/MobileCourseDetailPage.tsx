import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/sdkwork-course-h5-commons'
import { useCourseSdk } from '@sdkwork/sdkwork-course-h5-core'

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
    return <MobileLoading text="鍔犺浇璇剧▼璇︽儏..." />
  }

  if (error || !course) {
    return (
      <div>
        <MobilePageHeader title="璇剧▼璇︽儏" showBack onBack={() => navigate(-1)} />
        <MobileEmptyState
          icon="鉂?
          title="璇剧▼涓嶅瓨鍦?
          description="鏃犳硶鎵惧埌璇ヨ绋?
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
          <span>猸?{course.ratingScore || '鏆傛棤璇勫垎'}</span>
          <span>馃摎 {course.lessonsCount}璇?/span>
          <span>馃懃 {course.studentsCount}浜?/span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">璇剧▼绠€浠?/h2>
          <p className="text-gray-600 text-sm">{course.description || '鏆傛棤绠€浠?}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">璇剧▼鐩綍</h2>
          <p className="text-gray-600 text-sm">璇剧▼鍐呭鍔犺浇涓?..</p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:bg-blue-700 transition-colors"
          onClick={() => {
            alert('鎶ュ悕鍔熻兘寮€鍙戜腑...')
          }}
        >
          绔嬪嵆鎶ュ悕
        </button>
      </div>
    </div>
  )
}

