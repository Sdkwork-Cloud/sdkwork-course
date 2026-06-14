import React from 'react'

export interface MobileCourseCardProps {
  id: string
  title: string
  description?: string
  thumbnail?: string
  instructor?: string
  lessonsCount?: number
  studentsCount?: number
  rating?: string
  onClick?: (id: string) => void
}

export function MobileCourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  lessonsCount,
  studentsCount,
  rating,
  onClick,
}: MobileCourseCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer active:bg-gray-50 transition-colors"
      onClick={() => onClick?.(id)}
    >
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        )}
        {rating && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-xs font-semibold">
            ⭐ {rating}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-1">{description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {instructor && <span>{instructor}</span>}
          <div className="flex gap-2">
            {lessonsCount && <span>📚 {lessonsCount}</span>}
            {studentsCount && <span>👥 {studentsCount}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
