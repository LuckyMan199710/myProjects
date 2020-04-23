var app = getApp();
Page({
  data: {
    'base_conf': app.DF,
    page_path: 'pages/myrevenue/withdrawreq',
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
    // app.http.post('Myrevenue/withdrawreq', {}, function (json) {
    //   console.log(json)
    //   _this.setData({
    //     'withable': json.withable,
    //     'drp_minamt_cash': json.drp_minamt_cash,
    //     'max_cash_amt': json.max_cash_amt,
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
    app.http.post('Myrevenue/withdrawreq', {}, function (json) {
      console.log(json);
      app.checkShareRight(json);
      _this.setData({
        'withable': json.withable,
        'drp_minamt_cash': json.drp_minamt_cash,
        'max_cash_amt': json.max_cash_amt,
      });
    });
  },
  formSubmit: function (e) {
    var _this = this;
    var amount = e.detail.value.amount;
    if (amount <= 0) {
      app.alertMsg('提现金额必须大于等于0');
      return false;
    }
    console.log(_this.data.max_cash_amt)
    if (amount > _this.data.max_cash_amt) {
      app.alertMsg('提现金额超过' + _this.data.max_cash_amt);
      return false;
    }
    wx.showLoading({ title: '正在提交' });
    app.http.post('Myrevenue/widthdrawajax', { 'amount': amount}, function (json) {
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