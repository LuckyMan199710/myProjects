// pages/test/feedback.js
var app = getApp()
Page({
  data: {
    title: '',
    content: ''
  },
  onLoad: function (options) {

  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '问题反馈' });
  },
  onShow: function () {

  },
  handleSubmit() {
    const that = this
    console.log(1, this.data.title)
    if (this.data.title.length == 0) {
      app.alertMsg('标题不允许为空')
      return
    }
    if (this.data.content.length == 0) {
      app.alertMsg('反馈内容不允许为空')
      return
    }
    app.http.post('Feedback/postFeedback', {
      title: this.data.title,
      content: this.data.content
    }, function (json) {
      app.alertMsg(json.msg)
      that.setData({
        title: '',
        content: ''
      })
    })
  },
  changeTitle(e) {
    console.log(e)
    this.setData({
      title: e.detail.value
    })
  },
  changeContent(e) {
    console.log(e)
    this.setData({
      content: e.detail.value
    })
  },

})