import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/sdkwork-course-pc-commons'
import { useCourseSdk } from '@sdkwork/sdkwork-course-pc-core'

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

export function LiveSessionListPage() {
  const navigate = useNavigate()
  const sdk = useCourseSdk()

  const { data, isLoading, error } = useQuery<LiveSessionListResponse>({
    queryKey: ['liveSessions'],
    queryFn: async () => sdk.liveSessions.list(),
  })

  const sessions = data?.data || []

  if (isLoading) {
    return <LoadingSpinner text="鍔犺浇鐩存挱璇剧▼..." />
  }

  if (error) {
    return (
      <EmptyState
        icon="鉂?
        title="鍔犺浇澶辫触"
        description="鏃犳硶鍔犺浇鐩存挱璇剧▼鍒楄〃"
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="鐩存挱璇惧爞"
        subtitle="鍙備笌瀹炴椂浜掑姩瀛︿範"
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon="馃摵"
          title="鏆傛棤鐩存挱璇剧▼"
          description="娌℃湁鍗冲皢寮€濮嬬殑鐩存挱璇剧▼"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/live/${session.id}`)}
            >
              <div className="h-40 bg-gradient-to-r from-red-500 to-pink-500 relative">
                <div className="absolute top-2 left-2">
                  {session.liveStatus === 'live' && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold animate-pulse">
                      馃敶 鐩存挱涓?                    </span>
                  )}
                  {session.liveStatus === 'scheduled' && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      鍗冲皢寮€濮?                    </span>
                  )}
                  {session.liveStatus === 'ended' && (
                    <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      宸茬粨鏉?                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
                {session.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{session.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  <p>寮€濮嬫椂闂? {new Date(session.scheduledStartAt).toLocaleString()}</p>
                  <p>缁撴潫鏃堕棿: {new Date(session.scheduledEndAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



