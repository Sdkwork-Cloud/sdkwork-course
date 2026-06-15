const app = getApp()

Page({
  data: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    error: ''
  },

  onNameChange(e) {
    this.setData({ name: e.detail.value })
  },

  onEmailChange(e) {
    this.setData({ email: e.detail.value })
  },

  onPasswordChange(e) {
    this.setData({ password: e.detail.value })
  },

  onConfirmPasswordChange(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  async register() {
    if (!this.data.name || !this.data.email || !this.data.password) {
      this.setData({ error: '请填写所有必填字段' })
      return
    }

    if (this.data.password !== this.data.confirmPassword) {
      this.setData({ error: '两次输入的密码不一致' })
      return
    }

    this.setData({ loading: true, error: '' })

    try {
      const result = await app.request('/auth/register', {
        method: 'POST',
        data: {
          name: this.data.name,
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
        this.setData({ error: result.msg || '注册失败' })
      }
    } catch (error) {
      console.error('Register failed:', error)
      this.setData({ error: '注册失败，请稍后再试' })
    } finally {
      this.setData({ loading: false })
    }
  },

  goToLogin() {
    wx.navigateBack()
  }
})
