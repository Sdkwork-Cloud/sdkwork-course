import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/sdkwork-course-pc-commons'
import { useCourseSdk } from '@sdkwork/sdkwork-course-pc-core'

interface LiveSessionDetail {
  id: string
  title: string
  description?: string
  liveStatus: string
  scheduledStartAt: string
  scheduledEndAt: string
  actualStartAt?: string
  actualEndAt?: string
  instructorId?: string
  providerRoomRef?: string
  status: string
}

interface LiveSessionDetailResponse {
  code: string
  msg: string
  data?: LiveSessionDetail
}

export function LiveSessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sdk = useCourseSdk()

  const { data, isLoading, error } = useQuery<LiveSessionDetailResponse>({
    queryKey: ['liveSession', id],
    queryFn: async () => sdk.liveSessions.retrieve(id!),
    enabled: !!id,
  })

  const session = data?.data

  if (isLoading) {
    return <LoadingSpinner text="鍔犺浇鐩存挱璇︽儏..." />
  }

  if (error || !session) {
    return (
      <EmptyState
        icon="鉂?
        title="鐩存挱涓嶅瓨鍦?
        description="鏃犳硶鎵惧埌璇ョ洿鎾绋?
      />
    )
  }

  const isLive = session.liveStatus === 'live'
  const isScheduled = session.liveStatus === 'scheduled'
  const isEnded = session.liveStatus === 'ended'

  return (
    <div>
      <PageHeader
        title={session.title}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden mb-6">
            <div className="h-96 flex items-center justify-center">
              {isLive ? (
                <div className="text-white text-center">
                  <div className="text-6xl mb-4 animate-pulse">馃敶</div>
                  <p className="text-lg">鐩存挱杩涜涓?/p>
                  <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                    鍔犲叆鐩存挱
                  </button>
                </div>
              ) : isScheduled ? (
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">鈴?/div>
                  <p className="text-lg">鍗冲皢寮€濮?/p>
                  <p className="text-sm text-gray-400 mt-2">
                    寮€濮嬫椂闂? {new Date(session.scheduledStartAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">馃摷</div>
                  <p className="text-lg">鐩存挱宸茬粨鏉?/p>
                  {session.actualEndAt && (
                    <p className="text-sm text-gray-400 mt-2">
                      缁撴潫鏃堕棿: {new Date(session.actualEndAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">鐩存挱璇︽儏</h2>
            <p className="text-gray-600">{session.description || '鏆傛棤璇︽儏鎻忚堪'}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="text-center mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isLive ? 'bg-red-100 text-red-800' :
                isScheduled ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {isLive ? '馃敶 鐩存挱涓? : isScheduled ? '鍗冲皢寮€濮? : '宸茬粨鏉?}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm text-gray-500">寮€濮嬫椂闂?/span>
                <p className="font-semibold">{new Date(session.scheduledStartAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">缁撴潫鏃堕棿</span>
                <p className="font-semibold">{new Date(session.scheduledEndAt).toLocaleString()}</p>
              </div>
              {session.actualStartAt && (
                <div>
                  <span className="text-sm text-gray-500">瀹為檯寮€濮?/span>
                  <p className="font-semibold">{new Date(session.actualStartAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {isLive && (
              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                鍔犲叆鐩存挱
              </button>
            )}

            {isScheduled && (
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                棰勭害鎻愰啋
              </button>
            )}

            {isEnded && (
              <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                瑙傜湅鍥炴斁
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



