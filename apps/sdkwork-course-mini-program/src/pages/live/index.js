const app = getApp()

Page({
  data: {
    sessions: [],
    loading: false
  },

  onLoad() {
    this.loadSessions()
  },

  onShow() {
    this.loadSessions()
  },

  async loadSessions() {
    this.setData({ loading: true })
    try {
      const result = await app.request('/course_live_sessions')
      this.setData({ sessions: result.data || [] })
    } catch (error) {
      console.error('Failed to load live sessions:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  goToDetail(e) {
    const sessionId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/live-detail/index?id=${sessionId}`
    })
  }
})
