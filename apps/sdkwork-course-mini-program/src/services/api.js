/**
 * API service for mini program
 */
const app = getApp()

export const api = {
  // Categories
  categories: {
    list: (params) => app.request('/course_categories', { data: params }),
    retrieve: (id) => app.request(`/course_categories/${id}`)
  },

  // Courses
  courses: {
    list: (params) => app.request('/courses', { data: params }),
    retrieve: (id) => app.request(`/courses/${id}`),
    offerings: (id) => app.request(`/courses/${id}/offerings`),
    sections: (id) => app.request(`/courses/${id}/sections`),
    lessons: (id) => app.request(`/courses/${id}/lessons`)
  },

  // Enrollments
  enrollments: {
    create: (offeringId, data) => app.request(`/course_offerings/${offeringId}/enrollments`, {
      method: 'POST',
      data: data
    }),
    list: () => app.request('/course_enrollments'),
    retrieve: (id) => app.request(`/course_enrollments/${id}`),
    cancel: (id) => app.request(`/course_enrollments/${id}`, { method: 'DELETE' })
  },

  // Live sessions
  liveSessions: {
    list: () => app.request('/course_live_sessions'),
    retrieve: (id) => app.request(`/course_live_sessions/${id}`),
    join: (id) => app.request(`/course_live_sessions/${id}/join`, { method: 'POST' })
  },

  // Comments
  comments: {
    list: (courseId) => app.request(`/courses/${courseId}/comments`),
    create: (courseId, data) => app.request(`/courses/${courseId}/comments`, {
      method: 'POST',
      data: data
    })
  },

  // Reactions
  reactions: {
    replace: (data) => app.request('/course_reactions', {
      method: 'PUT',
      data: data
    })
  },

  // Applications
  applications: {
    create: (data) => app.request('/course_applications', {
      method: 'POST',
      data: data
    }),
    list: () => app.request('/course_applications')
  }
}
