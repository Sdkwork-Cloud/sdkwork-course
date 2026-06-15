import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCourseSdk } from '@sdkwork/sdkwork-course-h5-core'

interface MobileReactionButtonsProps {
  targetType: 'course' | 'lesson' | 'comment' | 'live_session'
  targetId: string
  reactions?: {
    like?: boolean
    favorite?: boolean
    save?: boolean
    share?: boolean
  }
}

export function MobileReactionButtons({ targetType, targetId, reactions }: MobileReactionButtonsProps) {
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
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => handleReaction('like')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
          reactions?.like
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-600 active:bg-gray-200'
        }`}
      >
        鉂わ笍 {reactions?.like ? '宸茶禐' : '鐐硅禐'}
      </button>
      <button
        onClick={() => handleReaction('favorite')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
          reactions?.favorite
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-gray-100 text-gray-600 active:bg-gray-200'
        }`}
      >
        猸?{reactions?.favorite ? '宸茶棌' : '鏀惰棌'}
      </button>
      <button
        onClick={() => handleReaction('save')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
          reactions?.save
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-600 active:bg-gray-200'
        }`}
      >
        馃敄 {reactions?.save ? '宸插瓨' : '淇濆瓨'}
      </button>
      <button
        onClick={() => handleReaction('share')}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-gray-100 text-gray-600 active:bg-gray-200 transition-colors"
      >
        馃敆 鍒嗕韩
      </button>
    </div>
  )
}

