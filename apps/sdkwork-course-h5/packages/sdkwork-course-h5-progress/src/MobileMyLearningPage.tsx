import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/sdkwork-course-h5-commons'
import { useCourseSdk } from '@sdkwork/sdkwork-course-h5-core'

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
    return <MobileLoading text="鍔犺浇鎴戠殑璇剧▼..." />
  }

  if (error) {
    return (
      <div>
        <MobilePageHeader title="鎴戠殑瀛︿範" />
        <MobileEmptyState
          icon="鉂?
          title="鍔犺浇澶辫触"
          description="鏃犳硶鍔犺浇浣犵殑璇剧▼鍒楄〃"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title="鎴戠殑瀛︿範" />

      <div className="p-4">
        {enrollments.length === 0 ? (
          <MobileEmptyState
            icon="馃摎"
            title="杩樻病鏈夋姤鍚嶈绋?
            description="鍘昏绋嬩腑蹇冩帰绱㈢簿鍝佽绋嬪惂"
            action={
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm active:bg-blue-700"
              >
                娴忚璇剧▼
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
                    {enrollment.enrollmentStatus === 'active' ? '瀛︿範涓? :
                     enrollment.enrollmentStatus === 'completed' ? '宸插畬鎴? :
                     enrollment.enrollmentStatus}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-2">璇剧▼ ID: {enrollment.courseId}</h3>
                <button
                  className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs active:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/courses/${enrollment.courseId}`)
                  }}
                >
                  缁х画瀛︿範
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

