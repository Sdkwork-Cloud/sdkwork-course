import React from 'react'

export interface CourseCardProps {
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

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  lessonsCount,
  studentsCount,
  rating,
  onClick,
}: CourseCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick?.(id)}
    >
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        )}
        {rating && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
            ⭐ {rating}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {instructor && <span>{instructor}</span>}
          <div className="flex gap-2">
            {lessonsCount && <span>📚 {lessonsCount}课</span>}
            {studentsCount && <span>👥 {studentsCount}人</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
