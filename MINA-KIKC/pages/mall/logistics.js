var app = getApp()
Page({
  data: {
    page_path: 'pages/mall/logistics'
  },
  initPage: function () {
    var _this = this;
    var option = this._option;
    wx.showLoading();
    app.http.post('Mall/getLogisticsInfo', { expressno: option.expressno, stdlogis: option.stdlogis }, function (json) {
      wx.hideLoading();
      if (json.message == 'ok') {
        _this.setData({
          'list': json.data,
          'nu': json.nu,
          'billno': option.billno,
          'stdlogis_name': option.stdlogis_name,
        });
      } else {
        // app.alertMsg('查询不到该订单物流', {
        //   cb: function () {
        //     wx.navigateBack()
        //   }
        // });
        _this.setData({ 
          'list':[{"context":"请在第三方网站输入快递单号查询具体物流轨迹","time":""}],
          'nu': option.expressno,
          'billno': option.billno,
          'stdlogis_name': option.stdlogis_name,
        });
      }
    });
  }, 
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    app.updateIconStyle(this);
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '订单跟踪' });
  }
})
