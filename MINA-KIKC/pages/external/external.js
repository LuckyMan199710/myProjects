// pages/external/external.js
Page({
  data: {
    myurl: ''
  },
  onLoad: function (options) {
    this.setData({
      myurl: options.url
    })
  }
})