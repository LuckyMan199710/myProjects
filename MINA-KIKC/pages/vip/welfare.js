//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
    'base_conf': app.DF,
    page_path: 'pages/vip/welfare'
  },
  onShow: function () {
    app.checkUserStatus(() => {
      // this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '福利会' });
  }
})
