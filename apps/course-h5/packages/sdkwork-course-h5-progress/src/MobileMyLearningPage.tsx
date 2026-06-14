import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/course-h5-commons'
import { useCourseSdk } from '@sdkwork/course-h5-core'

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

export function MobileMyLearningPage() {
  const navigate = useNavigate()
  const sdk = useCourseSdk()

  const { data, isLoading, error } = useQuery<EnrollmentListResponse>({
    queryKey: ['enrollments'],
    queryFn: async () => sdk.enrollments.list(),
  })

  const enrollments = data?.data || []

  if (isLoading) {
    return <MobileLoading text="加载我的课程..." />
  }

  if (error) {
    return (
      <div>
        <MobilePageHeader title="我的学习" />
        <MobileEmptyState
          icon="❌"
          title="加载失败"
          description="无法加载你的课程列表"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title="我的学习" />

      <div className="p-4">
        {enrollments.length === 0 ? (
          <MobileEmptyState
            icon="📚"
            title="还没有报名课程"
            description="去课程中心探索精品课程吧"
            action={
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm active:bg-blue-700"
              >
                浏览课程
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg shadow p-3 cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => navigate(`/courses/${enrollment.courseId}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
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
                <h3 className="font-semibold text-sm mb-2">课程 ID: {enrollment.courseId}</h3>
                <button
                  className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs active:bg-blue-700"
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
    </div>
  )
}
