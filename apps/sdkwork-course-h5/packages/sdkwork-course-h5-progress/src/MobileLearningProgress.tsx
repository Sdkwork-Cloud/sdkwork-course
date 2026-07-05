import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useCourseSdk,
  extractSdkItem,
  readEntityString,
  readEntityNumber,
} from '@sdkwork/sdkwork-course-h5-core'

interface MobileLearningProgressProps {
  enrollmentId: string
}

export function MobileLearningProgress({ enrollmentId }: MobileLearningProgressProps) {
  const sdk = useCourseSdk()

  const { data, isLoading } = useQuery({
    queryKey: ['progress', enrollmentId],
    queryFn: async () => sdk.courseProgress.retrieve(enrollmentId),
    enabled: !!enrollmentId,
  })

  const record = extractSdkItem(data)
  const progress = record
    ? {
        completedLessonCount: readEntityNumber(record, 'completedLessonCount', 'completed_lesson_count') ?? 0,
        requiredLessonCount: readEntityNumber(record, 'requiredLessonCount', 'required_lesson_count') ?? 0,
        progressPercent: readEntityString(record, 'progressPercent', 'progress_percent') || '0',
        watchSeconds: readEntityNumber(record, 'watchSeconds', 'watch_seconds') ?? 0,
        progressStatus: readEntityString(record, 'progressStatus', 'progress_status', 'status') || 'in_progress',
      }
    : null

  if (isLoading) {
    return <div className="p-3 text-gray-500 text-sm">加载学习进度...</div>
  }

  if (!progress) {
    return <div className="p-3 text-gray-500 text-sm">暂无学习进度</div>
  }

  const percent = parseFloat(progress.progressPercent) || 0
  const watchHours = Math.floor(progress.watchSeconds / 3600)
  const watchMinutes = Math.floor((progress.watchSeconds % 3600) / 60)

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3 text-sm">学习进度</h3>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>完成进度</span>
          <span>{percent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-lg font-bold text-blue-600">{progress.completedLessonCount}</div>
          <div className="text-gray-500">已完成</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-600">{progress.requiredLessonCount}</div>
          <div className="text-gray-500">总课时</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">
            {watchHours}h{watchMinutes}m
          </div>
          <div className="text-gray-500">学习时长</div>
        </div>
      </div>

      {progress.progressStatus === 'completed' && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
          恭喜完成学习
        </div>
      )}
    </div>
  )
}
