import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCourseSdk } from '@sdkwork/course-pc-core'

interface ProgressData {
  id: string
  courseId: string
  offeringId: string
  enrollmentId: string
  userId: string
  progressStatus: string
  completedLessonCount: number
  requiredLessonCount: number
  progressPercent: string
  watchSeconds: number
  lastLessonId?: string
  startedAt?: string
  completedAt?: string
}

interface ProgressResponse {
  code: string
  msg: string
  data?: ProgressData
}

interface LearningProgressProps {
  enrollmentId: string
}

export function LearningProgress({ enrollmentId }: LearningProgressProps) {
  const sdk = useCourseSdk()

  const { data, isLoading } = useQuery<ProgressResponse>({
    queryKey: ['progress', enrollmentId],
    queryFn: async () => sdk.progress.retrieve(enrollmentId),
    enabled: !!enrollmentId,
  })

  const progress = data?.data

  if (isLoading) {
    return <div className="p-4 text-gray-500">加载学习进度...</div>
  }

  if (!progress) {
    return <div className="p-4 text-gray-500">暂无学习进度</div>
  }

  const percent = parseFloat(progress.progressPercent) || 0
  const watchHours = Math.floor(progress.watchSeconds / 3600)
  const watchMinutes = Math.floor((progress.watchSeconds % 3600) / 60)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold mb-4">学习进度</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>完成进度</span>
          <span>{percent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {progress.completedLessonCount}
          </div>
          <div className="text-sm text-gray-500">已完成课时</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-600">
            {progress.requiredLessonCount}
          </div>
          <div className="text-sm text-gray-500">总课时</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">学习时长</span>
          <span>{watchHours}小时{watchMinutes}分钟</span>
        </div>
        {progress.startedAt && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">开始时间</span>
            <span>{new Date(progress.startedAt).toLocaleDateString()}</span>
          </div>
        )}
        {progress.completedAt && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">完成时间</span>
            <span>{new Date(progress.completedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {progress.progressStatus === 'completed' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          🎉 恭喜！你已完成本课程的学习
        </div>
      )}
    </div>
  )
}
