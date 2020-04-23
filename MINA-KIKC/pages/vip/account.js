var app = getApp()
Page({
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/vip/account'
  },
  onShow: function () {
    app.checkUserStatus((vipinfo) => {
      var vip_info = wx.getStorageSync('vip_info');
      this.setData({
        'amount':vip_info['amount']
      });
      this.initPage();
    });
  },
  initPage: function () {
    var self = this;
    wx.showLoading();
    app.http.post('Member/getAcountDetail', {}, (json) => {
      wx.hideLoading();
      this.setData({
        'account_detail': json.data || []
      })
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '账务明细' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  }
})
