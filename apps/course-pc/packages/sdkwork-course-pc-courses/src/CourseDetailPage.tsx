import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/course-pc-commons'
import { useCourseSdk } from '@sdkwork/course-pc-core'

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
    return <LoadingSpinner text="加载课程详情..." />
  }

  if (error || !course) {
    return (
      <EmptyState
        icon="❌"
        title="课程不存在"
        description="无法找到该课程，请检查链接是否正确"
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
            <h2 className="text-xl font-semibold mb-2">课程简介</h2>
            <p className="text-gray-600">{course.description || '暂无简介'}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">课程目录</h2>
            <p className="text-gray-600">课程内容加载中...</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {course.ratingScore || '暂无评分'}
              </div>
              <div className="text-sm text-gray-500">课程评分</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">课时数</span>
                <span className="font-semibold">{course.lessonsCount}课</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">学习人数</span>
                <span className="font-semibold">{course.studentsCount}人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">课程状态</span>
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
                    alert('报名成功！')
                  } else {
                    alert('暂无可报名的课程班次')
                  }
                } catch (error) {
                  alert('报名失败，请稍后再试')
                }
              }}
            >
              立即报名
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
