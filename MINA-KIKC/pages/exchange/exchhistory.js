//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/exchange/exchhistory'
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '兑换记录' });
  },
  initPage:function(){
    var _this = this;
    wx.showLoading();
    app.http.post('Order/getExchs', {}, function (json) {
      wx.hideLoading();
      _this.setData({
        'exchs': json.data || [],
        'load_end': true,
      })
    });

  }
})
