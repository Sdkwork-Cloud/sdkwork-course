const app = getApp()

Page({
  data: {
    sessionId: '',
    session: {},
    loading: false
  },

  onLoad(options) {
    this.setData({ sessionId: options.id })
    this.loadSession()
  },

  async loadSession() {
    this.setData({ loading: true })
    try {
      const result = await app.request(`/course_live_sessions/${this.data.sessionId}`)
      this.setData({ session: result.data || {} })
    } catch (error) {
      console.error('Failed to load session:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  joinLive() {
    wx.showToast({
      title: '正在加入直播...',
      icon: 'loading'
    })
  },

  setReminder() {
    wx.showToast({
      title: '已设置提醒',
      icon: 'success'
    })
  },

  watchReplay() {
    wx.showToast({
      title: '正在加载回放...',
      icon: 'loading'
    })
  }
})
