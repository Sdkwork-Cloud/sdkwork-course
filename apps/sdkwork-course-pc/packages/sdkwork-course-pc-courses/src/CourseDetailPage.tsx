import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/sdkwork-course-pc-commons'
import { useCourseSdk } from '@sdkwork/sdkwork-course-pc-core'

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

export function CourseDetailPage() {
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
    return <LoadingSpinner text="鍔犺浇璇剧▼璇︽儏..." />
  }

  if (error || !course) {
    return (
      <EmptyState
        icon="鉂?
        title="璇剧▼涓嶅瓨鍦?
        description="鏃犳硶鎵惧埌璇ヨ绋嬶紝璇锋鏌ラ摼鎺ユ槸鍚︽纭?
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={course.title}
        subtitle={course.subtitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 relative">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">璇剧▼绠€浠?/h2>
            <p className="text-gray-600">{course.description || '鏆傛棤绠€浠?}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">璇剧▼鐩綍</h2>
            <p className="text-gray-600">璇剧▼鍐呭鍔犺浇涓?..</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {course.ratingScore || '鏆傛棤璇勫垎'}
              </div>
              <div className="text-sm text-gray-500">璇剧▼璇勫垎</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">璇炬椂鏁?/span>
                <span className="font-semibold">{course.lessonsCount}璇?/span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">瀛︿範浜烘暟</span>
                <span className="font-semibold">{course.studentsCount}浜?/span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">璇剧▼鐘舵€?/span>
                <span className="font-semibold">{course.publishStatus}</span>
              </div>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={async () => {
                try {
                  // Get offerings for this course
                  const offeringsResponse = await sdk.offerings.list(id!)
                  const offerings = offeringsResponse?.data || []
                  
                  if (offerings.length > 0) {
                    // Enroll in the first offering
                    const offeringId = offerings[0].id
                    await sdk.enrollments.create(offeringId, {
                      source: 'self_service'
                    })
                    alert('鎶ュ悕鎴愬姛锛?)
                  } else {
                    alert('鏆傛棤鍙姤鍚嶇殑璇剧▼鐝')
                  }
                } catch (error) {
                  alert('鎶ュ悕澶辫触锛岃绋嶅悗鍐嶈瘯')
                }
              }}
            >
              绔嬪嵆鎶ュ悕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



