const app = getApp()

Page({
  data: {
    courseId: '',
    course: {},
    loading: false
  },

  onLoad(options) {
    this.setData({ courseId: options.id })
    this.loadCourse()
  },

  async loadCourse() {
    this.setData({ loading: true })
    try {
      const result = await app.request(`/courses/${this.data.courseId}`)
      this.setData({ course: result.data || {} })
    } catch (error) {
      console.error('Failed to load course:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  async enroll() {
    try {
      const offeringsResult = await app.request(`/courses/${this.data.courseId}/offerings`)
      const offerings = offeringsResult.data || []
      
      if (offerings.length > 0) {
        const offeringId = offerings[0].id
        await app.request(`/course_offerings/${offeringId}/enrollments`, {
          method: 'POST',
          data: { source: 'self_service' }
        })
        wx.showToast({
          title: '报名成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: '暂无可报名的班次',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('Failed to enroll:', error)
      wx.showToast({
        title: '报名失败',
        icon: 'error'
      })
    }
  }
})
