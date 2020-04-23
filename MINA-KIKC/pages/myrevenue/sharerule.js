var app = getApp()
Page({
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
  },
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Myrevenue/sharerule', {}, function (json) {
      wx.hideLoading();
      _this.setData({
        'img': json.img,
      });
    });
  },
  onLoad: function () {
    var _this = this;
    this.setData({
      'bannarH': app.globalData.sys_info.windowWidth * 120 / 320,
      'windowHeight': app.globalData.sys_info.windowHeight
    });
    wx.setNavigationBarTitle({ title: '分销规则说明' });
    app.userLoginPromise
      .then(json => {
        _this.initPage();
      });
    app.updateIconStyle(this);
  }
})
