import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/course-pc-commons'
import { useCourseSdk } from '@sdkwork/course-pc-core'

interface Enrollment {
  id: string
  courseId: string
  offeringId: string
  userId: string
  enrollmentStatus: string
  enrolledAt: string
  completedAt?: string
}

interface EnrollmentListResponse {
  code: string
  msg: string
  data?: Enrollment[]
}

export function MyLearningPage() {
  const navigate = useNavigate()
  const sdk = useCourseSdk()

  const { data, isLoading, error } = useQuery<EnrollmentListResponse>({
    queryKey: ['enrollments'],
    queryFn: async () => sdk.enrollments.list(),
  })

  const enrollments = data?.data || []

  if (isLoading) {
    return <LoadingSpinner text="加载我的课程..." />
  }

  if (error) {
    return (
      <EmptyState
        icon="❌"
        title="加载失败"
        description="无法加载你的课程列表"
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="我的学习"
        subtitle="查看你的学习进度和课程"
      />

      {enrollments.length === 0 ? (
        <EmptyState
          icon="📚"
          title="还没有报名课程"
          description="去课程中心探索精品课程吧"
          action={
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              浏览课程
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/courses/${enrollment.courseId}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  enrollment.enrollmentStatus === 'active' ? 'bg-green-100 text-green-800' :
                  enrollment.enrollmentStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {enrollment.enrollmentStatus === 'active' ? '学习中' :
                   enrollment.enrollmentStatus === 'completed' ? '已完成' :
                   enrollment.enrollmentStatus}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold mb-2">课程 ID: {enrollment.courseId}</h3>
              <button
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/courses/${enrollment.courseId}`)
                }}
              >
                继续学习
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
