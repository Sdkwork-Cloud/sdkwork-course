export interface CourseApiClient {
  baseUrl: string
  prefix: string
}

export interface CourseSdkConfig {
  appApi: CourseApiClient
}

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  retries?: number
}

async function requestWithRetry<T>(
  url: string,
  options: RequestOptions = {},
  maxRetries: number = 3
): Promise<T> {
  const { method = 'GET', body, headers = {}, retries = 0 } = options
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Add auth token if available
  const token = typeof window !== 'undefined' 
    ? window.localStorage.getItem('token') 
    : null
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (retries < maxRetries && isRetryableError(error)) {
      await delay(Math.pow(2, retries) * 1000) // Exponential backoff
      return requestWithRetry(url, { ...options, retries: retries + 1 }, maxRetries)
    }
    throw error
  }
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true // Network error
  }
  if (error instanceof Error) {
    return error.message.includes('HTTP 5') || // Server errors
           error.message.includes('timeout') ||
           error.message.includes('network')
  }
  return false
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function createCourseSdk(config: CourseSdkConfig) {
  const baseUrl = config.appApi.baseUrl
  const prefix = config.appApi.prefix

  return {
    categories: {
      list: async (params?: Record<string, string>) => {
        const url = new URL(`${prefix}/course_categories`, baseUrl)
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
          })
        }
        return requestWithRetry(url.toString())
      },
      retrieve: async (categoryId: string) => {
        const url = new URL(`${prefix}/course_categories/${categoryId}`, baseUrl)
        return requestWithRetry(url.toString())
      },
    },
    courses: {
      list: async (params?: Record<string, string>) => {
        const url = new URL(`${prefix}/courses`, baseUrl)
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
          })
        }
        return requestWithRetry(url.toString())
      },
      retrieve: async (courseId: string) => {
        const url = new URL(`${prefix}/courses/${courseId}`, baseUrl)
        return requestWithRetry(url.toString())
      },
    },
    offerings: {
      list: async (courseId: string) => {
        const url = new URL(`${prefix}/courses/${courseId}/offerings`, baseUrl)
        return requestWithRetry(url.toString())
      },
      retrieve: async (offeringId: string) => {
        const url = new URL(`${prefix}/course_offerings/${offeringId}`, baseUrl)
        return requestWithRetry(url.toString())
      },
    },
    enrollments: {
      create: async (offeringId: string, body: Record<string, unknown>) => {
        const url = new URL(`${prefix}/course_offerings/${offeringId}/enrollments`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'POST', body })
      },
      list: async () => {
        const url = new URL(`${prefix}/course_enrollments`, baseUrl)
        return requestWithRetry(url.toString())
      },
      retrieve: async (enrollmentId: string) => {
        const url = new URL(`${prefix}/course_enrollments/${enrollmentId}`, baseUrl)
        return requestWithRetry(url.toString())
      },
      cancel: async (enrollmentId: string) => {
        const url = new URL(`${prefix}/course_enrollments/${enrollmentId}`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'DELETE' })
      },
    },
    sections: {
      list: async (courseId: string) => {
        const url = new URL(`${prefix}/courses/${courseId}/sections`, baseUrl)
        return requestWithRetry(url.toString())
      },
    },
    lessons: {
      list: async (courseId: string) => {
        const url = new URL(`${prefix}/courses/${courseId}/lessons`, baseUrl)
        return requestWithRetry(url.toString())
      },
      retrieve: async (lessonId: string) => {
        const url = new URL(`${prefix}/course_lessons/${lessonId}`, baseUrl)
        return requestWithRetry(url.toString())
      },
    },
    progress: {
      retrieve: async (enrollmentId: string) => {
        const url = new URL(`${prefix}/course_enrollments/${enrollmentId}/progress`, baseUrl)
        return requestWithRetry(url.toString())
      },
      updateLesson: async (lessonId: string, body: Record<string, unknown>) => {
        const url = new URL(`${prefix}/course_lessons/${lessonId}/progress`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'PATCH', body })
      },
    },
    comments: {
      list: async (courseId: string) => {
        const url = new URL(`${prefix}/courses/${courseId}/comments`, baseUrl)
        return requestWithRetry(url.toString())
      },
      create: async (courseId: string, body: Record<string, unknown>) => {
        const url = new URL(`${prefix}/courses/${courseId}/comments`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'POST', body })
      },
      delete: async (commentId: string) => {
        const url = new URL(`${prefix}/course_comments/${commentId}`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'DELETE' })
      },
    },
    reactions: {
      replace: async (body: Record<string, unknown>) => {
        const url = new URL(`${prefix}/course_reactions`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'PUT', body })
      },
    },
    applications: {
      create: async (body: Record<string, unknown>) => {
        const url = new URL(`${prefix}/course_applications`, baseUrl)
        return requestWithRetry(url.toString(), { method: 'POST', body })
      },
      list: async () => {
        const url = new URL(`${prefix}/course_applications`, baseUrl)
        return requestWithRetry(url.toString())
      },
    },
  }
}

export type CourseSdk = ReturnType<typeof createCourseSdk>
