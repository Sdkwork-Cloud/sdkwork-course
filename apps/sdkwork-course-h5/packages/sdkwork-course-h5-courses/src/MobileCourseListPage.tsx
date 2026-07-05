import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MobileCourseCard, MobilePageHeader, MobileLoading, MobileEmptyState } from '@sdkwork/sdkwork-course-h5-commons'
import {
  useCourseSdk,
  extractSdkListItems,
  readEntityString,
  readEntityNumber,
} from '@sdkwork/sdkwork-course-h5-core'

export function MobileCourseListPage() {
  const navigate = useNavigate()
  const sdk = useCourseSdk()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', searchQuery],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (searchQuery) params.q = searchQuery
      return sdk.courses.list(params)
    },
  })

  const courses = extractSdkListItems(data).map((record) => ({
    id: readEntityString(record, 'id', 'courseId'),
    title: readEntityString(record, 'title', 'name'),
    description: readEntityString(record, 'description', 'summary') || undefined,
    thumbnail: readEntityString(record, 'thumbnail', 'cover', 'coverUrl') || undefined,
    instructor: readEntityString(record, 'instructor', 'instructorName') || undefined,
    lessonsCount: readEntityNumber(record, 'lessonsCount', 'lessons_count') ?? 0,
    studentsCount: readEntityNumber(record, 'studentsCount', 'students_count', 'students') ?? 0,
    ratingScore: readEntityString(record, 'ratingScore', 'rating', 'rating_score') || '暂无评分',
  }))

  if (isLoading) {
    return <MobileLoading text="加载课程中..." />
  }

  if (error) {
    return (
      <MobileEmptyState icon="!" title="加载失败" description="无法加载课程列表" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title="课程中心" />

      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {courses.length === 0 ? (
          <MobileEmptyState icon="📚" title="暂无课程" description="没有找到符合条件的课程" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {courses.map((course) => (
              <MobileCourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail}
                instructor={course.instructor}
                lessonsCount={course.lessonsCount}
                studentsCount={course.studentsCount}
                rating={course.ratingScore}
                onClick={(courseId) => navigate(`/courses/${courseId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
