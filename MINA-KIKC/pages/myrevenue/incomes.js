var app = getApp();
Page({
  data: {
    'base_conf': app.DF,
    'imgbase': app.STATIC_URL + 'uploads/',
    page_path: 'pages/myrevenue/incomes',
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '收益流水明细' });
  },
  onLoad: function (option) {
    // wx.setNavigationBarTitle({ title: '收益流水明细' });
    // var _this = this;
    // app.userLoginPromise
    //   .then(json => {
    //     _this._onloadcalled = true;
    //     _this.initPage();

    //   })
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onShow: function () {
    // if (this._onloadcalled) {
    //   this.initPage();
    // }
    app.checkUserStatus(() => {
      //会员才执行;非会员则需等待激活会员卡后执行
      this.initPage();
    });
  },
  initPage: function () {
    var _this = this;
    // var vip_info = wx.getStorageSync('vip_info');
    // if (!vip_info) {
    //   var ret = app.getCardWidget();
    //   return false;
    // }
    wx.showLoading();
    app.http.post('Myrevenue/get_share_incomes', {}, function (json) {
      wx.hideLoading();
      app.checkShareRight(json);
      _this.setData({
        incomes: json.data,
      })
    });
  }

})