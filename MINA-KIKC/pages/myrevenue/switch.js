var app = getApp();
Page({
  data: {
    'base_conf': app.DF,
    page_path: 'pages/myrevenue/switch',
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '转会员卡余额' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
    // var _this=this;
    // wx.setNavigationBarTitle({ title: '转会员卡余额' });
    // wx.showLoading({ title: '正在提交' });
    // app.http.post('Myrevenue/switchreq', {}, function (json) {
    //   wx.hideLoading();
    //   _this.setData({
    //     'withable': json.withable,
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
    //wx.setNavigationBarTitle({ title: '转会员卡余额' });
    wx.showLoading({ title: '正在加载' });
    app.http.post('Myrevenue/switchreq', {}, function (json) {
      wx.hideLoading();
      app.checkShareRight(json);
      _this.setData({
        'withable': json.withable,
      });
    });
  },
  formSubmit: function (e) {
    var _this = this;
    var amount = e.detail.value.amount;
    if (amount<=0){
      app.alertMsg('提现金额必须大于等于0');
      return false;
    }
    wx.showLoading({ title: '正在提交' });
    app.http.post('Myrevenue/switchVal', { 'amount': amount}, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        app.alertMsg(json.msg, {
          cb: function () {
            wx.navigateBack()
          }
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },

})