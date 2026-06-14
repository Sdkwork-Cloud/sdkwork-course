import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCourseSdk } from '@sdkwork/course-pc-core'

interface ReactionButtonsProps {
  targetType: 'course' | 'lesson' | 'comment' | 'live_session'
  targetId: string
  reactions?: {
    like?: boolean
    favorite?: boolean
    save?: boolean
    share?: boolean
  }
}

export function ReactionButtons({ targetType, targetId, reactions }: ReactionButtonsProps) {
  const queryClient = useQueryClient()
  const sdk = useCourseSdk()

  const reactionMutation = useMutation({
    mutationFn: async ({ reactionType, reactionValue }: { reactionType: string; reactionValue: string }) => {
      return sdk.reactions.replace({
        targetType,
        targetId,
        reactionType,
        reactionValue,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions', targetType, targetId] })
    },
  })

  const handleReaction = (reactionType: string) => {
    const currentValue = reactions?.[reactionType as keyof typeof reactions]
    reactionMutation.mutate({
      reactionType,
      reactionValue: currentValue ? 'false' : 'true',
    })
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleReaction('like')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
          reactions?.like
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        ❤️ {reactions?.like ? '已点赞' : '点赞'}
      </button>
      <button
        onClick={() => handleReaction('favorite')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
          reactions?.favorite
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        ⭐ {reactions?.favorite ? '已收藏' : '收藏'}
      </button>
      <button
        onClick={() => handleReaction('save')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
          reactions?.save
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        🔖 {reactions?.save ? '已保存' : '保存'}
      </button>
      <button
        onClick={() => handleReaction('share')}
        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        🔗 分享
      </button>
    </div>
  )
}
