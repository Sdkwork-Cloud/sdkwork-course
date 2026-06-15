const app = getApp()

Page({
  data: {
    userInfo: null,
    enrollments: []
  },

  onLoad() {
    this.loadUserInfo()
    this.loadEnrollments()
  },

  onShow() {
    this.loadEnrollments()
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userInfo: userInfo })
    }
  },

  async loadEnrollments() {
    try {
      const result = await app.request('/course_enrollments')
      this.setData({ enrollments: result.data || [] })
    } catch (error) {
      console.error('Failed to load enrollments:', error)
    }
  },

  goToMyCourses() {
    // Navigate to my courses
  },

  goToProgress() {
    // Navigate to progress
  },

  goToFavorites() {
    // Navigate to favorites
  },

  logout() {
    wx.removeStorageSync('token')
    app.globalData.userInfo = null
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    })
  }
})
