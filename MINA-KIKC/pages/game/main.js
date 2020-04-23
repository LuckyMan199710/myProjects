var app = getApp()
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/game/main'
	},
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Game/getGameList', {}, function (json) {
      wx.hideLoading();
      console.log('getgamelist  json');
      console.log(json);
      if (json.success == 1) {
        _this.setData({
          'games': json.data,
          'height': _this.windowHeight - 200
        })
      }
    })
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
  }, 
  onLoad: function (option) {
    this._option = option;
    this.windowHeight = app.globalData.sys_info.windowHeight;
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '有奖游戏' });
  }
})
