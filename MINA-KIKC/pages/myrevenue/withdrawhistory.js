var app = getApp();
Page({
  data: {
    'base_conf': app.DF,
    page_path: 'pages/myrevenue/withdrawhistory',
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '提现申请' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
    // var _this=this;
    // wx.setNavigationBarTitle({ title: '提现申请' });
    // app.http.post('Myrevenue/getwidthdrawhistory', {}, function (json) {
    //   _this.setData({
    //     'whistory': json.data,
    //   });
    // });
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
    //wx.setNavigationBarTitle({ title: '提现申请' });
    app.http.post('Myrevenue/getwidthdrawhistory', {}, function (json) {
    	app.checkShareRight(json);
      _this.setData({
        'whistory': json.data,
      });
    });
  },
  
})