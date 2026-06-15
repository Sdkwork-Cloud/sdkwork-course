const app = getApp()

Page({
  data: {
    email: '',
    password: '',
    loading: false,
    error: ''
  },

  onEmailChange(e) {
    this.setData({ email: e.detail.value })
  },

  onPasswordChange(e) {
    this.setData({ password: e.detail.value })
  },

  async login() {
    if (!this.data.email || !this.data.password) {
      this.setData({ error: '请输入邮箱和密码' })
      return
    }

    this.setData({ loading: true, error: '' })

    try {
      const result = await app.request('/auth/login', {
        method: 'POST',
        data: {
          email: this.data.email,
          password: this.data.password
        }
      })

      if (result.code === '2000' && result.data) {
        wx.setStorageSync('token', result.data.token)
        app.globalData.userInfo = result.data.user
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        this.setData({ error: result.msg || '登录失败' })
      }
    } catch (error) {
      console.error('Login failed:', error)
      this.setData({ error: '登录失败，请稍后再试' })
    } finally {
      this.setData({ loading: false })
    }
  },

  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/index'
    })
  }
})
