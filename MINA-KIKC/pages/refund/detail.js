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
    app.http.post('Order/cancelRefund', { 'orderbill': this.data.orderbill, 'refund_id': this.data.refund_id }, function (json) {
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
    var refund_id = this._option.refund_id;
    app.http.post('Order/refunddetail', { 'orderbill': orderbill, 'refund_id': refund_id }, function (json) {
      console.log(json)
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'billno': orderbill,
          'refund_id': refund_id,
          'refunddtl': json.refunddtl,
          'orderstatus': json.orderstatus
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
    if (!option.orderbill || !option.refund_id) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
      return false;
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '退款申请' });
  },
  formSubmit: function (e) {
    var post_data = e.detail.value;
    var _this = this;
    wx.showLoading();
    app.http.post('Order/updatelogis', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        if (_this.data.refunddtl.refund_id == post_data.refundid) {
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

