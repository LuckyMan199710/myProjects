//main.js
//一级主页
var app = getApp()
var AddlogisIns = require('../../utils/wig_logis.js');
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
var pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/refund/detail',
    'base_conf': app.DF,
    navhidden: true,
    hidden: true
  },
  bindSubmit: function (e) {
    wx.showLoading();
    app.http.post('Order/cancelExchange', { 'orderbill': this.data.orderbill, 'exchange_bill_no': this.data.exchange_bill_no }, function (json) {
      wx.hideLoading();
      if(json.success==1){
        app.alertMsg(json.msg,{
          cb: app.goBack
        });
      }else{
        app.alertMsg(json.msg)
      }
      return false;
    });
  },
  initPage:function(){
    var _this = this;
    wx.showLoading();
    var orderbill = this._option.orderbill;
    var exchange_bill_no = this._option.exchange_bill_no;
    app.http.post('Order/exchangedetail', { 'orderbill': orderbill, 'exchange_bill_no': exchange_bill_no }, function (json) {
      console.log(json)
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'orderstatus': json.exchangedtl.exchange_status,
          'billno':json.exchangedtl.tid,
          'refunddtl': json.exchangedtl
        });
        _this.inputData = {};
      } else {
        app.alertMsg(json.msg);
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
    if (!option.orderbill || !option.exchange_bill_no) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
      return false;
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '换货详情' });
  },
  formSubmit: function (e) {
    var post_data = e.detail.value;
    var _this = this;
    wx.showLoading();
    app.http.post('Order/updatelogis', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        if (_this.data.refunddtl.exchange_bill_no == post_data.refundid) {
          _this.data.refunddtl.logis_company = post_data.logis_company;
          _this.data.refunddtl.retinvoiceno = post_data.retinvoiceno;
        }
        app.alertMsg(json.msg);
        _this.setData({
          'hidden': true,
          'refunddtl': _this.data.refunddtl
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
}
Object.assign(pageObj, AddlogisIns);
Page(pageObj);

