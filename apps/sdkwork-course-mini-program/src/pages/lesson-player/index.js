const app = getApp()

Page({
  data: {
    courseId: '',
    lessonId: '',
    lesson: {},
    lessons: [],
    loading: false
  },

  onLoad(options) {
    this.setData({
      courseId: options.courseId,
      lessonId: options.lessonId
    })
    this.loadLessons()
  },

  async loadLessons() {
    this.setData({ loading: true })
    try {
      const result = await app.request(`/courses/${this.data.courseId}/lessons`)
      const lessons = result.data || []
      const currentLesson = lessons.find(l => l.id === this.data.lessonId) || lessons[0]
      
      this.setData({
        lessons: lessons,
        lesson: currentLesson || {}
      })
    } catch (error) {
      console.error('Failed to load lessons:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  switchLesson(e) {
    const lessonId = e.currentTarget.dataset.id
    this.setData({ lessonId: lessonId })
    const lesson = this.data.lessons.find(l => l.id === lessonId)
    if (lesson) {
      this.setData({ lesson: lesson })
    }
  }
})
