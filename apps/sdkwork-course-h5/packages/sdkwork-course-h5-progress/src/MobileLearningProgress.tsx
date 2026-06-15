import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCourseSdk } from '@sdkwork/sdkwork-course-h5-core'

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

interface MobileLearningProgressProps {
  enrollmentId: string
}

export function MobileLearningProgress({ enrollmentId }: MobileLearningProgressProps) {
  const sdk = useCourseSdk()

  const { data, isLoading } = useQuery<ProgressResponse>({
    queryKey: ['progress', enrollmentId],
    queryFn: async () => sdk.progress.retrieve(enrollmentId),
    enabled: !!enrollmentId,
  })

  const progress = data?.data

  if (isLoading) {
    return <div className="p-3 text-gray-500 text-sm">鍔犺浇瀛︿範杩涘害...</div>
  }

  if (!progress) {
    return <div className="p-3 text-gray-500 text-sm">鏆傛棤瀛︿範杩涘害</div>
  }

  const percent = parseFloat(progress.progressPercent) || 0
  const watchHours = Math.floor(progress.watchSeconds / 3600)
  const watchMinutes = Math.floor((progress.watchSeconds % 3600) / 60)

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3 text-sm">瀛︿範杩涘害</h3>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>瀹屾垚杩涘害</span>
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
          <div className="text-lg font-bold text-blue-600">
            {progress.completedLessonCount}
          </div>
          <div className="text-gray-500">宸插畬鎴?/div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-600">
            {progress.requiredLessonCount}
          </div>
          <div className="text-gray-500">鎬昏鏃?/div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">
            {watchHours}h{watchMinutes}m
          </div>
          <div className="text-gray-500">瀛︿範鏃堕暱</div>
        </div>
      </div>

      {progress.progressStatus === 'completed' && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
          馃帀 鎭枩瀹屾垚瀛︿範
        </div>
      )}
    </div>
  )
}

