import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCourseSdk } from '@sdkwork/course-h5-core'

interface Comment {
  id: string
  courseId: string
  author?: string
  content: string
  status: string
  createdAt: string
}

interface CommentListResponse {
  code: string
  msg: string
  data?: Comment[]
}

interface MobileCommentListProps {
  courseId: string
  targetType: 'course' | 'lesson' | 'live_session'
  targetId: string
}

export function MobileCommentList({ courseId, targetType, targetId }: MobileCommentListProps) {
  const queryClient = useQueryClient()
  const sdk = useCourseSdk()
  const [newComment, setNewComment] = useState('')

  const { data, isLoading } = useQuery<CommentListResponse>({
    queryKey: ['comments', targetType, targetId],
    queryFn: async () => sdk.comments.list(courseId),
  })

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      return sdk.comments.create(courseId, {
        targetType,
        targetId,
        content,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', targetType, targetId] })
      setNewComment('')
    },
  })

  const comments = data?.data || []

  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm">评论 ({comments.length})</h3>

      <div className="mb-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
        <button
          onClick={() => {
            if (newComment.trim()) {
              createMutation.mutate(newComment.trim())
            }
          }}
          disabled={!newComment.trim() || createMutation.isPending}
          className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm active:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? '发送中...' : '发表'}
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">加载评论中...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">暂无评论</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-semibold">
                      {comment.author?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="font-semibold text-xs">{comment.author || '匿名'}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
