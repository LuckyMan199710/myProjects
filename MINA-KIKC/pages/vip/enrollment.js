var app = getApp()
Page({
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/vip/enrollment'
	},
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Crumbs/onlinereglist', {}, function (json) {
      console.log(json)
      wx.hideLoading();
      _this.setData({
        'olrList': json.data,
      })
    })
  },
  // onShow: function () {
  //   app.checkUserStatus(() => {
  //     this.initPage();
  //   });
  // }, 
  onLoad: function (option) {
    this.initPage();
    app.updateIconStyle(this);
    // this._option = option;
    // this.windowHeight = app.globalData.sys_info.windowHeight;
    // app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '活动列表' });
  }
})
