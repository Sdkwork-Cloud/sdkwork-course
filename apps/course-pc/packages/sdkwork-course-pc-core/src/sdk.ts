export interface CourseApiClient {
  baseUrl: string
  prefix: string
}

export interface CourseSdkConfig {
  appApi: CourseApiClient
}

export function createCourseSdk(config: CourseSdkConfig) {
  return {
    categories: {
      list: async (params?: Record<string, string>) => {
        const url = new URL(`${config.appApi.prefix}/course_categories`, config.appApi.baseUrl)
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
          })
        }
        const response = await fetch(url.toString())
        return response.json()
      },
      retrieve: async (categoryId: string) => {
        const url = new URL(`${config.appApi.prefix}/course_categories/${categoryId}`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
    },
    courses: {
      list: async (params?: Record<string, string>) => {
        const url = new URL(`${config.appApi.prefix}/courses`, config.appApi.baseUrl)
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
          })
        }
        const response = await fetch(url.toString())
        return response.json()
      },
      retrieve: async (courseId: string) => {
        const url = new URL(`${config.appApi.prefix}/courses/${courseId}`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
    },
    offerings: {
      list: async (courseId: string) => {
        const url = new URL(`${config.appApi.prefix}/courses/${courseId}/offerings`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
      retrieve: async (offeringId: string) => {
        const url = new URL(`${config.appApi.prefix}/course_offerings/${offeringId}`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
    },
    enrollments: {
      create: async (offeringId: string, body: Record<string, unknown>) => {
        const url = new URL(`${config.appApi.prefix}/course_offerings/${offeringId}/enrollments`, config.appApi.baseUrl)
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return response.json()
      },
      list: async () => {
        const url = new URL(`${config.appApi.prefix}/course_enrollments`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
      retrieve: async (enrollmentId: string) => {
        const url = new URL(`${config.appApi.prefix}/course_enrollments/${enrollmentId}`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
      cancel: async (enrollmentId: string) => {
        const url = new URL(`${config.appApi.prefix}/course_enrollments/${enrollmentId}`, config.appApi.baseUrl)
        const response = await fetch(url.toString(), { method: 'DELETE' })
        return response.json()
      },
    },
    sections: {
      list: async (courseId: string) => {
        const url = new URL(`${config.appApi.prefix}/courses/${courseId}/sections`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
    },
    lessons: {
      list: async (courseId: string) => {
        const url = new URL(`${config.appApi.prefix}/courses/${courseId}/lessons`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
      retrieve: async (lessonId: string) => {
        const url = new URL(`${config.appApi.prefix}/course_lessons/${lessonId}`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
    },
    progress: {
      retrieve: async (enrollmentId: string) => {
        const url = new URL(`${config.appApi.prefix}/course_enrollments/${enrollmentId}/progress`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
      updateLesson: async (lessonId: string, body: Record<string, unknown>) => {
        const url = new URL(`${config.appApi.prefix}/course_lessons/${lessonId}/progress`, config.appApi.baseUrl)
        const response = await fetch(url.toString(), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return response.json()
      },
    },
    comments: {
      list: async (courseId: string) => {
        const url = new URL(`${config.appApi.prefix}/courses/${courseId}/comments`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
      create: async (courseId: string, body: Record<string, unknown>) => {
        const url = new URL(`${config.appApi.prefix}/courses/${courseId}/comments`, config.appApi.baseUrl)
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return response.json()
      },
    },
    reactions: {
      replace: async (body: Record<string, unknown>) => {
        const url = new URL(`${config.appApi.prefix}/course_reactions`, config.appApi.baseUrl)
        const response = await fetch(url.toString(), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return response.json()
      },
    },
    applications: {
      create: async (body: Record<string, unknown>) => {
        const url = new URL(`${config.appApi.prefix}/course_applications`, config.appApi.baseUrl)
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return response.json()
      },
      list: async () => {
        const url = new URL(`${config.appApi.prefix}/course_applications`, config.appApi.baseUrl)
        const response = await fetch(url.toString())
        return response.json()
      },
    },
  }
}

export type CourseSdk = ReturnType<typeof createCourseSdk>
