import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CourseCard, PageHeader, LoadingSpinner, EmptyState } from '@sdkwork/sdkwork-course-pc-commons'
import { useCourseSdk } from '@sdkwork/sdkwork-course-pc-core'

interface Course {
  id: string
  courseCode: string
  title: string
  description?: string
  thumbnail?: string
  instructor?: string
  lessonsCount: number
  studentsCount: number
  ratingScore: string
  category?: string
  tags: string[]
  status: string
}

interface CourseListResponse {
  code: string
  msg: string
  data?: {
    items: Course[]
    page: number
    pageSize: number
    total: number
  }
}

export function CourseListPage() {
  const navigate = useNavigate()
  const sdk = useCourseSdk()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const { data, isLoading, error } = useQuery<CourseListResponse>({
    queryKey: ['courses', searchQuery, selectedCategory],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (searchQuery) params.q = searchQuery
      if (selectedCategory) params.category = selectedCategory
      return sdk.courses.list(params)
    },
  })

  const courses = data?.data?.items || []

  if (isLoading) {
    return <LoadingSpinner text="鍔犺浇璇剧▼涓?.." />
  }

  if (error) {
    return (
      <EmptyState
        icon="鉂?
        title="鍔犺浇澶辫触"
        description="鏃犳硶鍔犺浇璇剧▼鍒楄〃锛岃绋嶅悗鍐嶈瘯"
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="璇剧▼涓績"
        subtitle="鎺㈢储鎴戜滑鐨勭簿鍝佽绋?
      />

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="鎼滅储璇剧▼..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">鎵€鏈夊垎绫?/option>
          <option value="programming">缂栫▼寮€鍙?/option>
          <option value="design">璁捐鍒涙剰</option>
          <option value="business">鍟嗕笟绠＄悊</option>
          <option value="language">璇█瀛︿範</option>
        </select>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon="馃摎"
          title="鏆傛棤璇剧▼"
          description="娌℃湁鎵惧埌绗﹀悎鏉′欢鐨勮绋?
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              instructor={course.instructor}
              lessonsCount={course.lessonsCount}
              studentsCount={course.studentsCount}
              rating={course.ratingScore}
              onClick={(id) => navigate(`/courses/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}



