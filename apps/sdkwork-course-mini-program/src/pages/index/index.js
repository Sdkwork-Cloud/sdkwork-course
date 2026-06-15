Page({
  data: {},

  onLoad() {
    console.log('Index page loaded')
  },

  goToCourses() {
    wx.switchTab({
      url: '/pages/courses/index'
    })
  },

  goToLive() {
    wx.switchTab({
      url: '/pages/live/index'
    })
  },

  goToMy() {
    wx.switchTab({
      url: '/pages/my/index'
    })
  }
})
