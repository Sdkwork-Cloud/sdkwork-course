import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCourseSdk } from '@sdkwork/sdkwork-course-pc-core'

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

interface CommentListProps {
  courseId: string
  targetType: 'course' | 'lesson' | 'live_session'
  targetId: string
}

export function CommentList({ courseId, targetType, targetId }: CommentListProps) {
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

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return sdk.comments.delete(commentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', targetType, targetId] })
    },
  })

  const comments = data?.data || []

  return (
    <div>
      <h3 className="font-semibold mb-4">璇勮 ({comments.length})</h3>

      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="鍐欎笅浣犵殑璇勮..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          onClick={() => {
            if (newComment.trim()) {
              createMutation.mutate(newComment.trim())
            }
          }}
          disabled={!newComment.trim() || createMutation.isPending}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? '鍙戦€佷腑...' : '鍙戣〃璇勮'}
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">鍔犺浇璇勮涓?..</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">鏆傛棤璇勮锛屽揩鏉ュ彂琛ㄧ涓€鏉¤瘎璁哄惂</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">
                      {comment.author?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="font-semibold text-sm">{comment.author || '鍖垮悕鐢ㄦ埛'}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



