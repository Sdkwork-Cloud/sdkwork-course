const app = getApp()

Page({
  data: {
    courses: [],
    searchQuery: '',
    loading: false
  },

  onLoad() {
    this.loadCourses()
  },

  onShow() {
    this.loadCourses()
  },

  async loadCourses() {
    this.setData({ loading: true })
    try {
      const params = {}
      if (this.data.searchQuery) {
        params.q = this.data.searchQuery
      }
      const result = await app.request('/courses', { data: params })
      this.setData({ courses: result.data?.items || [] })
    } catch (error) {
      console.error('Failed to load courses:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearch(e) {
    this.setData({ searchQuery: e.detail.value })
    this.loadCourses()
  },

  goToDetail(e) {
    const courseId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/course-detail/index?id=${courseId}`
    })
  }
})
