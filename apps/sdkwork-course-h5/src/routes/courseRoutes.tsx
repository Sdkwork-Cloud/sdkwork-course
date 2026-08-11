import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

/**
 * Course route definitions for the standalone course H5 shell.
 *
 * The pages are the canonical `@sdkwork/course-mobile-react-courses`
 * components (lazy loaded); the `/course`-family paths match the host route
 * contract of sdkwork-im h5. Legacy `/courses` `/live` `/my` paths redirect.
 */

type CoursePageName =
  | 'CourseHome'
  | 'MyCourses'
  | 'CourseDetail'
  | 'CoursePurchase'
  | 'CoursePlayer'
  | 'CourseLiveRoom'
  | 'CourseSearch'

function lazyPage(name: CoursePageName) {
  return React.lazy(async () => {
    const mod = await import('@sdkwork/course-mobile-react-courses')
    return { default: mod[name] }
  })
}

const CourseHome = lazyPage('CourseHome')
const MyCourses = lazyPage('MyCourses')
const CourseDetail = lazyPage('CourseDetail')
const CoursePurchase = lazyPage('CoursePurchase')
const CoursePlayer = lazyPage('CoursePlayer')
const CourseLiveRoom = lazyPage('CourseLiveRoom')
const CourseSearch = lazyPage('CourseSearch')

function LegacyCourseDetailRedirect() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/course/${id}`} replace />
}

function LegacyLessonRedirect() {
  const { courseId } = useParams<{ courseId: string }>()
  return <Navigate to={`/course/${courseId}/play`} replace />
}

function LegacyLiveRedirect() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/course/${id}/live`} replace />
}

export const COURSE_H5_ROUTES = [
  { path: '/course', element: <CourseHome /> },
  { path: '/course/my', element: <MyCourses /> },
  { path: '/course/:id', element: <CourseDetail /> },
  { path: '/course/:id/purchase', element: <CoursePurchase /> },
  { path: '/course/:id/play', element: <CoursePlayer /> },
  { path: '/course/:id/live', element: <CourseLiveRoom /> },
  { path: '/course/search', element: <CourseSearch /> },
  // Legacy path compatibility.
  { path: '/courses', element: <Navigate to="/course" replace /> },
  { path: '/courses/:id', element: <LegacyCourseDetailRedirect /> },
  { path: '/courses/:courseId/learn/:lessonId', element: <LegacyLessonRedirect /> },
  { path: '/live', element: <Navigate to="/course" replace /> },
  { path: '/live/:id', element: <LegacyLiveRedirect /> },
  { path: '/my', element: <Navigate to="/course/my" replace /> },
]
