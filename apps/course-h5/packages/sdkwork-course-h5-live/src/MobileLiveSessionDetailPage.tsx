import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/course-h5-commons'
import { useCourseSdk } from '@sdkwork/course-h5-core'

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

export function MobileLiveSessionDetailPage() {
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
    return <MobileLoading text="加载直播详情..." />
  }

  if (error || !session) {
    return (
      <div>
        <MobilePageHeader title="直播详情" showBack onBack={() => navigate(-1)} />
        <MobileEmptyState
          icon="❌"
          title="直播不存在"
          description="无法找到该直播课程"
        />
      </div>
    )
  }

  const isLive = session.liveStatus === 'live'
  const isScheduled = session.liveStatus === 'scheduled'
  const isEnded = session.liveStatus === 'ended'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobilePageHeader
        title={session.title}
        showBack
        onBack={() => navigate(-1)}
      />

      <div className="flex-1">
        <div className="bg-black">
          <div className="aspect-video flex items-center justify-center">
            {isLive ? (
              <div className="text-white text-center">
                <div className="text-5xl mb-3 animate-pulse">🔴</div>
                <p className="text-base">直播进行中</p>
              </div>
            ) : isScheduled ? (
              <div className="text-white text-center">
                <div className="text-5xl mb-3">⏰</div>
                <p className="text-base">即将开始</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(session.scheduledStartAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="text-white text-center">
                <div className="text-5xl mb-3">📼</div>
                <p className="text-base">直播已结束</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              isLive ? 'bg-red-100 text-red-800' :
              isScheduled ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {isLive ? '🔴 直播中' : isScheduled ? '即将开始' : '已结束'}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold mb-2">直播详情</h2>
            <p className="text-gray-600 text-sm">{session.description || '暂无详情描述'}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold mb-2">时间安排</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">开始时间</span>
                <span>{new Date(session.scheduledStartAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">结束时间</span>
                <span>{new Date(session.scheduledEndAt).toLocaleString()}</span>
              </div>
              {session.actualStartAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">实际开始</span>
                  <span>{new Date(session.actualStartAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t p-4">
        {isLive && (
          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold active:bg-red-700 transition-colors">
            加入直播
          </button>
        )}
        {isScheduled && (
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:bg-blue-700 transition-colors">
            预约提醒
          </button>
        )}
        {isEnded && (
          <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold active:bg-gray-700 transition-colors">
            观看回放
          </button>
        )}
      </div>
    </div>
  )
}
