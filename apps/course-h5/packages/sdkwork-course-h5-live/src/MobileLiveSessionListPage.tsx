import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/course-h5-commons'
import { useCourseSdk } from '@sdkwork/course-h5-core'

interface LiveSession {
  id: string
  title: string
  description?: string
  liveStatus: string
  scheduledStartAt: string
  scheduledEndAt: string
  actualStartAt?: string
  instructorId?: string
  status: string
}

interface LiveSessionListResponse {
  code: string
  msg: string
  data?: LiveSession[]
}

export function MobileLiveSessionListPage() {
  const navigate = useNavigate()
  const sdk = useCourseSdk()

  const { data, isLoading, error } = useQuery<LiveSessionListResponse>({
    queryKey: ['liveSessions'],
    queryFn: async () => sdk.liveSessions.list(),
  })

  const sessions = data?.data || []

  if (isLoading) {
    return <MobileLoading text="加载直播课程..." />
  }

  if (error) {
    return (
      <div>
        <MobilePageHeader title="直播课堂" />
        <MobileEmptyState
          icon="❌"
          title="加载失败"
          description="无法加载直播课程列表"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title="直播课堂" />

      <div className="p-4">
        {sessions.length === 0 ? (
          <MobileEmptyState
            icon="📺"
            title="暂无直播课程"
            description="没有即将开始的直播课程"
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow overflow-hidden cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => navigate(`/live/${session.id}`)}
              >
                <div className="h-28 bg-gradient-to-r from-red-500 to-pink-500 relative">
                  <div className="absolute top-2 left-2">
                    {session.liveStatus === 'live' && (
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold animate-pulse">
                        🔴 直播中
                      </span>
                    )}
                    {session.liveStatus === 'scheduled' && (
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        即将开始
                      </span>
                    )}
                    {session.liveStatus === 'ended' && (
                      <span className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        已结束
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{session.title}</h3>
                  {session.description && (
                    <p className="text-gray-600 text-xs mb-2 line-clamp-1">{session.description}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    <p>{new Date(session.scheduledStartAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
